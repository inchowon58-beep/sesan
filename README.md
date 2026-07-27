# 달빛쉘터 (Dalbit Shelter)

전국 강아지 파양입소 · 무료분양 보호소 사이트 (Next.js 15)

## 로컬 실행

```bash
npm install
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin (infocs / infocs070207)

## 로컬 대량 발행 (웹 UI)

Tkinter EXE 대신 브라우저 폼으로 실행됩니다.

```bat
tools\webdoc\run.bat
```

브라우저가 열리면 키워드를 넣고 **대량 발행 시작**을 누르면
`public/seo-data` 동기화 → (토큰 있으면) Blob 업로드 → IndexNow 전송까지 진행됩니다.

## 환경변수

`.env.local` / `.env.example` 참고

- `NEXT_PUBLIC_SITE_URL`
- `INDEXNOW_KEY` (+ `public/{키}.txt`)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob — 운영 즉시 반영)
- `GEMINI_API_KEY` (관리자 1건 AI 발행용, 선택)
- `ADMIN_JWT_SECRET`
