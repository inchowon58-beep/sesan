# -*- coding: utf-8 -*-
"""CDN 이미지 URL 해석 — 폴더 URL(01.webp~) / 단일 파일 URL."""

from __future__ import annotations

import random
from functools import lru_cache
from typing import List, Optional, Tuple

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None  # type: ignore

DEFAULT_FALLBACK_COUNT = 20
MAX_PROBE = 200
PROBE_TIMEOUT = 8


def _format_name(num: int, ext: str = "webp") -> str:
    return f"{num:02d}.{ext}"


def cdn_image_url(base: str, num: int, ext: str = "webp") -> str:
    return f"{base.rstrip('/')}/{_format_name(num, ext)}"


def _url_exists(url: str) -> bool:
    if requests is None:
        return False
    headers = {"User-Agent": "DalbitShelter-Webdoc/1.0"}
    try:
        res = requests.head(url, headers=headers, timeout=PROBE_TIMEOUT, allow_redirects=True)
        if res.status_code == 405:
            res = requests.get(
                url, headers=headers, timeout=PROBE_TIMEOUT, stream=True, allow_redirects=True
            )
            res.close()
        return res.status_code == 200
    except Exception:
        return False


@lru_cache(maxsize=32)
def probe_cdn_image_count(base_url: str, max_probe: int = MAX_PROBE) -> int:
    base = base_url.rstrip("/")
    if not base.startswith("http"):
        return DEFAULT_FALLBACK_COUNT
    count = 0
    for n in range(1, max_probe + 1):
        if _url_exists(cdn_image_url(base, n)):
            count = n
        elif count > 0:
            break
    return count if count > 0 else DEFAULT_FALLBACK_COUNT


def _looks_like_image_file(url: str) -> bool:
    path = url.split("?", 1)[0].rstrip("/").lower()
    return path.endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".svg")
    )


def resolve_image_source(
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
    default_base: str = "https://image.cattery.co.kr/dogboho",
    default_count: int = 79,
) -> Tuple[str, str, int]:
    """
    Returns: (mode, base_or_file, count)
      mode = "single" | "cdn"
    """
    raw = (image_url or "").strip()
    base = (image_base or "").strip().rstrip("/")

    if raw.startswith("http://") or raw.startswith("https://"):
        if _looks_like_image_file(raw):
            return "single", raw, 1
        # 폴더/CDN URL로 취급
        base = raw.rstrip("/")
        count = image_count if image_count and image_count > 0 else probe_cdn_image_count(base)
        return "cdn", base, count

    if base.startswith("http://") or base.startswith("https://"):
        count = image_count if image_count and image_count > 0 else probe_cdn_image_count(base)
        return "cdn", base, count

    return "cdn", default_base.rstrip("/"), (
        image_count if image_count and image_count > 0 else default_count
    )


def pick_images(
    count: int,
    seed: int,
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
    default_base: str = "https://image.cattery.co.kr/dogboho",
    default_count: int = 79,
) -> List[str]:
    mode, src, pool_count = resolve_image_source(
        image_url, image_base, image_count, default_base, default_count
    )
    if mode == "single":
        return [src] * max(1, count)

    rng = random.Random(seed)
    pool = [cdn_image_url(src, i) for i in range(1, max(1, pool_count) + 1)]
    rng.shuffle(pool)
    if len(pool) >= count:
        return pool[:count]
    # 부족하면 반복
    out = list(pool)
    while len(out) < count:
        out.append(pool[len(out) % len(pool)])
    return out
