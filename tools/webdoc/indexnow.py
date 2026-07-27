# -*- coding: utf-8 -*-
"""IndexNow 제출 — 달빛쉘터 로컬/서버 공통 키.

유아독존/기본 SEO와 같이 기본 40건 단위로 나눠 전송한다.
"""

from __future__ import annotations

import json
import os
from typing import Iterable, List, Optional, Tuple
from urllib.parse import urlparse

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None  # type: ignore

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
DEFAULT_KEY = "f4e8fb3912a5d6f628c4255cc466f799"
DEFAULT_HOST = "sesan.agapet.co.kr"
# 유아독존 SEO와 동일 — 한 번 요청당 URL 수
DEFAULT_CHUNK = 40
MAX_CHUNK = 100


def get_indexnow_key() -> str:
    env = os.environ.get("INDEXNOW_KEY", "").strip()
    if env:
        return env
    here = os.path.dirname(os.path.abspath(__file__))
    pub = os.path.abspath(os.path.join(here, "..", "..", "public", f"{DEFAULT_KEY}.txt"))
    if os.path.isfile(pub):
        return open(pub, encoding="utf-8").read().strip() or DEFAULT_KEY
    return DEFAULT_KEY


def host_from_url(url: str) -> str:
    p = urlparse(url)
    return p.netloc or DEFAULT_HOST


def normalize_chunk_size(value: Optional[int]) -> int:
    try:
        n = int(value or 0)
    except (TypeError, ValueError):
        n = 0
    if n < 1:
        n = DEFAULT_CHUNK
    return min(MAX_CHUNK, max(1, n))


def submit_indexnow(
    site_url: str,
    urls: Iterable[str],
    key: Optional[str] = None,
    timeout: int = 30,
    chunk_size: Optional[int] = None,
) -> Tuple[bool, str]:
    """글 URL만 제출. 기본 40건씩 나눠 IndexNow 전송."""
    if requests is None:
        return False, "requests 패키지가 필요합니다. pip install requests"

    key = (key or get_indexnow_key()).strip()
    base = site_url.rstrip("/")
    host = host_from_url(base)
    url_list: List[str] = []
    seen = set()
    for u in urls:
        u = (u or "").strip()
        if u and u not in seen:
            seen.add(u)
            url_list.append(u)
    if not url_list:
        return False, "제출할 URL이 없습니다."

    size = normalize_chunk_size(chunk_size)
    ok_chunks = 0
    fail_msgs: List[str] = []
    total_chunks = (len(url_list) + size - 1) // size

    for i in range(0, len(url_list), size):
        chunk = url_list[i : i + size]
        payload = {
            "host": host,
            "key": key,
            "keyLocation": f"{base}/{key}.txt",
            "urlList": chunk,
        }
        try:
            resp = requests.post(
                INDEXNOW_ENDPOINT,
                headers={"Content-Type": "application/json; charset=utf-8"},
                data=json.dumps(payload),
                timeout=timeout,
            )
            if resp.status_code in (200, 202):
                ok_chunks += 1
            else:
                fail_msgs.append(
                    f"chunk{i // size + 1} HTTP {resp.status_code}: {resp.text[:120]}"
                )
        except Exception as exc:
            fail_msgs.append(f"chunk{i // size + 1} 오류: {exc}")

    if ok_chunks == total_chunks:
        return True, f"IndexNow 성공 · 글 {len(url_list)}건 · {total_chunks}회({size}건씩)"
    if ok_chunks > 0:
        return (
            False,
            f"IndexNow 부분성공 {ok_chunks}/{total_chunks}회 · 글 {len(url_list)}건 · "
            + "; ".join(fail_msgs[:2]),
        )
    return False, f"IndexNow 실패 · " + ("; ".join(fail_msgs[:3]) or "알 수 없는 오류")
