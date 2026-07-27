# -*- coding: utf-8 -*-
"""달빛쉘터 SEO — 로컬 FastAPI (브라우저 UI, 유아독존 방식)."""

from __future__ import annotations

import os
import sys
import threading
from datetime import datetime
from pathlib import Path
from typing import Any, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from blob_sync import sync_pages_dir_to_blob
from content import DEFAULT_SITE_URL, generate_batch
from indexnow import DEFAULT_CHUNK, normalize_chunk_size, submit_indexnow
from project_paths import project_root, webdoc_dir


def _static_dir() -> Path:
    """소스 실행 / PyInstaller(exe) 모두에서 static UI를 찾는다."""
    if getattr(sys, "frozen", False):
        meipass = getattr(sys, "_MEIPASS", None)
        candidates = []
        if meipass:
            candidates.append(Path(meipass) / "static")
        candidates.append(Path(sys.executable).resolve().parent / "static")
        for p in candidates:
            if p.is_dir():
                return p
        return candidates[0]
    p = Path(__file__).resolve().parent / "static"
    p.mkdir(exist_ok=True)
    return p


STATIC = _static_dir()
STATIC.mkdir(exist_ok=True)

app = FastAPI(title="달빛쉘터 SEO")
app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")

_job_lock = threading.RLock()
_job: dict[str, Any] = {
    "running": False,
    "logs": [],
    "result": None,
    "error": None,
}


def _append_log(msg: str) -> None:
    with _job_lock:
        _job["logs"].append(msg)
        if len(_job["logs"]) > 2000:
            _job["logs"] = _job["logs"][-1500:]


def _load_default_site_url() -> str:
    env = os.environ.get("NEXT_PUBLIC_SITE_URL", "").strip()
    if env:
        return env
    root = project_root()
    for name in (".env.local", ".env"):
        path = os.path.join(root, name)
        if not os.path.isfile(path):
            continue
        try:
            for line in open(path, encoding="utf-8-sig"):
                if line.startswith("NEXT_PUBLIC_SITE_URL="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'") or DEFAULT_SITE_URL
        except OSError:
            continue
    return DEFAULT_SITE_URL


class RunBody(BaseModel):
    keywords: str = ""
    site_url: str = ""
    out_dir: str = ""
    do_indexnow: bool = True
    count: Optional[int] = None
    chunk_size: Optional[int] = None
    image_url: str = ""
    image_base: str = ""
    image_count: Optional[int] = None


class SettingsBody(BaseModel):
    site_url: str = ""
    out_dir: str = ""
    last_keywords: str = ""
    image_url: str = ""
    image_base: str = ""
    image_count: Optional[int] = None
    chunk_size: Optional[int] = None


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC / "index.html")


@app.get("/api/meta")
def meta() -> dict[str, Any]:
    default_out = os.path.join(webdoc_dir(), "output")
    return {
        "settings": {
            "site_url": _load_default_site_url(),
            "out_dir": default_out,
            "last_keywords": "강아지파양\n무료분양\n강아지보호소\n파양입소\n강아지입양",
            "image_url": "https://image.cattery.co.kr/dogboho",
            "image_base": "https://image.cattery.co.kr/dogboho",
            "image_count": 79,
            "chunk_size": DEFAULT_CHUNK,
        }
    }


@app.post("/api/settings")
def save_settings(body: SettingsBody) -> dict[str, str]:
    # 브라우저 로컬스토리지가 주 저장소 — 서버는 확인만
    return {"ok": "true"}


@app.get("/api/job")
def job_status() -> dict[str, Any]:
    with _job_lock:
        return {
            "running": _job["running"],
            "logs": list(_job["logs"]),
            "result": _job["result"],
            "error": _job["error"],
        }


@app.post("/api/run")
def start_run(body: RunBody) -> dict[str, Any]:
    with _job_lock:
        if _job["running"]:
            raise HTTPException(409, "이미 발행 중입니다.")
        _job["running"] = True
        _job["logs"] = []
        _job["result"] = None
        _job["error"] = None

    def worker() -> None:
        try:
            kws: List[str] = [
                line.strip() for line in body.keywords.splitlines() if line.strip()
            ]
            if body.count and body.count > 0:
                kws = kws[: body.count]
            if not kws:
                raise ValueError("키워드를 입력하세요.")

            site = (body.site_url or "").strip() or _load_default_site_url()
            out_base = (body.out_dir or "").strip() or os.path.join(
                webdoc_dir(), "output"
            )
            stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            folder = os.path.join(out_base, f"webdoc_dalbit_{stamp}")
            root = project_root()
            sync = os.path.join(root, "public", "seo-data")
            image_url = (body.image_url or "").strip()
            image_base = (body.image_base or "").strip()
            image_count = body.image_count if body.image_count and body.image_count > 0 else None
            chunk_size = normalize_chunk_size(body.chunk_size)

            _append_log(f"발행 시작 · {len(kws)}건 · 한 번 발행 {chunk_size}건")
            _append_log(f"사이트: {site}")
            _append_log(
                f"이미지: {image_url or image_base or '기본 CDN'} "
                f"(count={image_count or '자동'})"
            )

            all_urls: List[str] = []
            blob_ok = True
            blob_msgs: List[str] = []
            idx_msgs: List[str] = []
            warning_msg = ""
            total_batches = (len(kws) + chunk_size - 1) // chunk_size

            for bi, start in enumerate(range(0, len(kws), chunk_size), 1):
                batch = kws[start : start + chunk_size]
                _append_log(f"배치 {bi}/{total_batches} · {len(batch)}건 생성")
                batch_folder = os.path.join(folder, f"batch_{bi:02d}")
                urls = generate_batch(
                    batch,
                    batch_folder,
                    site,
                    sync,
                    image_url=image_url,
                    image_base=image_base,
                    image_count=image_count,
                )
                all_urls.extend(urls)
                _append_log(f"  로컬 저장: {batch_folder}")

                ok, blob_msg = sync_pages_dir_to_blob(os.path.join(batch_folder, "pages"))
                blob_msgs.append(blob_msg)
                _append_log(f"  웹(Blob): {blob_msg}")
                if not ok:
                    blob_ok = False
                    warning_msg = (
                        "웹 반영 실패: Blob 업로드가 안 되어 운영 사이트에는 아직 보이지 않습니다. "
                        "BLOB_READ_WRITE_TOKEN 또는 프로젝트 경로를 확인하세요."
                    )
                    _append_log(f"  경고: {warning_msg}")
                    if body.do_indexnow:
                        idx_msgs.append("웹 반영 전이라 IndexNow 전송을 건너뜁니다.")
                        _append_log("  IndexNow: 웹 반영 전이라 건너뜀")
                    continue

                if body.do_indexnow:
                    _ok, idx_msg = submit_indexnow(site, urls, chunk_size=chunk_size)
                    idx_msgs.append(idx_msg)
                    _append_log(f"  IndexNow: {idx_msg}")

            idx_msg = " | ".join(idx_msgs) if idx_msgs else ""
            blob_msg = " | ".join(blob_msgs) if blob_msgs else ""

            # 배치 누락 방지: 전체 public/seo-data/pages 를 한 번 더 Blob에 동기화
            final_pages = os.path.join(sync, "pages")
            if os.path.isdir(final_pages):
                final_ok, final_msg = sync_pages_dir_to_blob(final_pages)
                _append_log(f"최종 웹 동기화: {final_msg}")
                blob_ok = blob_ok and final_ok
                if not final_ok and not warning_msg:
                    warning_msg = (
                        "최종 Blob 동기화 실패. BLOB_READ_WRITE_TOKEN 을 확인하세요."
                    )
                blob_msg = f"{blob_msg} | 최종:{final_msg}" if blob_msg else final_msg

            with _job_lock:
                _job["result"] = {
                    "urls": all_urls,
                    "folder": folder,
                    "blob_ok": blob_ok,
                    "blob_msg": blob_msg,
                    "indexnow": idx_msg,
                    "count": len(all_urls),
                    "chunk_size": chunk_size,
                    "batches": total_batches,
                }
                _job["error"] = warning_msg or None
            _append_log(
                f"완료 · {len(all_urls)}건 · {total_batches}배치({chunk_size}건씩)"
            )
        except Exception as exc:
            _append_log(f"오류: {exc}")
            with _job_lock:
                _job["error"] = str(exc)
        finally:
            with _job_lock:
                _job["running"] = False

    threading.Thread(target=worker, daemon=True).start()
    return {"ok": True, "started": True}


@app.post("/api/shutdown")
def shutdown() -> dict[str, str]:
    def _die() -> None:
        import time

        time.sleep(0.4)
        os._exit(0)

    threading.Thread(target=_die, daemon=True).start()
    return {"ok": "true"}
