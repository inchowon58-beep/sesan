# -*- coding: utf-8 -*-
"""로컬 발행 → Vercel Blob 업로드 (즉시 웹 반영)."""

from __future__ import annotations

import os
import subprocess
from typing import Tuple

from project_paths import blob_upload_script, load_blob_token, project_root


def sync_pages_dir_to_blob(pages_dir: str) -> Tuple[bool, str]:
    """pages/*.json 을 private Blob에 올려 운영 사이트에 즉시 반영."""
    root = project_root()
    script = blob_upload_script()
    token = load_blob_token()

    if not token:
        return (
            False,
            f"BLOB_READ_WRITE_TOKEN 없음 (찾은 프로젝트: {root}). .env.local 확인 필요.",
        )
    if not os.path.isfile(script):
        return False, f"blob-upload.mjs 없음: {script}"
    if not os.path.isdir(pages_dir):
        return False, f"pages 폴더 없음: {pages_dir}"

    env = os.environ.copy()
    env["BLOB_READ_WRITE_TOKEN"] = token
    env["DALBIT_PROJECT_ROOT"] = root
    env["WHITEPARK_PROJECT_ROOT"] = root  # blob-upload.mjs 호환

    try:
        proc = subprocess.run(
            ["node", script, pages_dir],
            cwd=root,
            env=env,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=180,
        )
    except FileNotFoundError:
        return False, "Node.js 가 필요합니다 (blob 업로드용)."
    except Exception as e:
        return False, str(e)

    out = (proc.stdout or "").strip()
    err = (proc.stderr or "").strip()
    if proc.returncode == 0:
        return True, out or "Blob 업로드 완료"
    if proc.returncode == 2:
        return False, err or out or "BLOB_READ_WRITE_TOKEN 없음"
    return False, err or out or f"Blob 업로드 실패 (code {proc.returncode})"
