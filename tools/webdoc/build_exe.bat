@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/3] 의존성 설치...
python -m pip install -q -r requirements.txt pyinstaller
if errorlevel 1 (
  echo pip 설치 실패
  exit /b 1
)

echo [2/3] 이전 빌드 정리...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

echo [3/3] 실행파일 빌드 중 (브라우저 UI)...
python -m PyInstaller --noconfirm --clean --windowed --name "달빛쉘터웹문서생성기" ^
  --add-data "static;static" ^
  --add-data "cdn_images.py;." ^
  --add-data "content.py;." ^
  --add-data "web_app.py;." ^
  --add-data "indexnow.py;." ^
  --add-data "blob_sync.py;." ^
  --add-data "project_paths.py;." ^
  --add-data "blob-upload.mjs;." ^
  --hidden-import "blob_sync" ^
  --hidden-import "project_paths" ^
  --hidden-import "indexnow" ^
  --hidden-import "content" ^
  --hidden-import "cdn_images" ^
  --hidden-import "web_app" ^
  --hidden-import "uvicorn.logging" ^
  --hidden-import "uvicorn.loops" ^
  --hidden-import "uvicorn.loops.auto" ^
  --hidden-import "uvicorn.protocols" ^
  --hidden-import "uvicorn.protocols.http" ^
  --hidden-import "uvicorn.protocols.http.auto" ^
  --hidden-import "uvicorn.protocols.websockets" ^
  --hidden-import "uvicorn.protocols.websockets.auto" ^
  --hidden-import "uvicorn.lifespan" ^
  --hidden-import "uvicorn.lifespan.on" ^
  --collect-all "uvicorn" ^
  --collect-all "fastapi" ^
  --collect-all "starlette" ^
  --collect-all "pydantic" ^
  --collect-all "pydantic_core" ^
  app.py

if errorlevel 1 (
  echo 빌드 실패
  exit /b 1
)

echo.
echo 완료: dist\달빛쉘터웹문서생성기\달빛쉘터웹문서생성기.exe
echo 사용법: 달빛쉘터 프로젝트 폴더가 있는 PC에서 exe 실행
echo         (exe 상위에서 package.json 을 자동 탐색합니다)
exit /b 0
