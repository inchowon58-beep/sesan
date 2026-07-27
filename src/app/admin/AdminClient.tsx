"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const PAGE_SIZE = 25;
const GEMINI_LS_KEY = "dalbit-admin-gemini-key";

type PageItem = {
  slug: string;
  keyword: string;
  title: string;
  path: string;
  createdAt: string;
};

type QuotaView = {
  dailyLimit: number;
  totalLimit: number;
  publishedToday: number;
  publishedTotal: number;
  remainingDaily: number | null;
  remainingTotal: number | null;
};

export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState<"gemini" | "template">("gemini");
  const [apiKey, setApiKey] = useState("");
  const [keySavedHint, setKeySavedHint] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<PageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedSlug, setCopiedSlug] = useState("");
  const [quota, setQuota] = useState<QuotaView | null>(null);

  const [masterOpen, setMasterOpen] = useState(false);
  const [masterUnlockPw, setMasterUnlockPw] = useState("");
  const [masterUnlockError, setMasterUnlockError] = useState("");
  const [masterUnlocking, setMasterUnlocking] = useState(false);
  const [masterPw, setMasterPw] = useState("");
  const [dailyLimit, setDailyLimit] = useState("0");
  const [totalLimit, setTotalLimit] = useState("0");
  const [masterMsg, setMasterMsg] = useState("");
  const [masterSaving, setMasterSaving] = useState(false);

  const geminiSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function absolutePageUrl(path: string) {
    const base = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://sesan.agapet.co.kr"
    ).replace(/\/$/, "");
    if (!path) return `${base}/guide`;
    if (path.startsWith("http")) return path;
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }

  async function copyPageUrl(path: string, slug: string) {
    const url = absolutePageUrl(path);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(""), 1800);
    } catch {
      window.prompt("주소를 복사하세요", url);
    }
  }

  const loadSettings = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) return;
    const data = await res.json();
    if (data.settings) setQuota(data.settings);
    const localKey =
      typeof window !== "undefined"
        ? localStorage.getItem(GEMINI_LS_KEY) || ""
        : "";
    const serverKey = String(data.geminiApiKey || "");
    setApiKey(localKey || serverKey);
  }, []);

  const loadPages = useCallback(async (p = 1) => {
    const res = await fetch(`/api/admin/pages?page=${p}`);
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total || 0);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
    setAuthed(true);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/pages?page=1");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.total || 0);
          setPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
          setAuthed(true);
          await loadSettings();
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [loadSettings]);

  function persistGeminiKey(value: string) {
    try {
      localStorage.setItem(GEMINI_LS_KEY, value);
    } catch {
      /* ignore */
    }
    if (geminiSaveTimer.current) clearTimeout(geminiSaveTimer.current);
    geminiSaveTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save-gemini", geminiApiKey: value }),
        });
        setKeySavedHint("자동 저장됨");
        setTimeout(() => setKeySavedHint(""), 1600);
      } catch {
        setKeySavedHint("로컬만 저장됨");
        setTimeout(() => setKeySavedHint(""), 1600);
      }
    }, 500);
  }

  function onApiKeyChange(value: string) {
    setApiKey(value);
    persistGeminiKey(value);
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "로그인 실패");
      return;
    }
    setAuthed(true);
    await loadPages(1);
    await loadSettings();
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
    setMasterOpen(false);
  }

  async function openMaster() {
    setMasterOpen(true);
    setMasterUnlockPw("");
    setMasterUnlockError("");
    setMasterMsg("");
    setMasterPw("");
  }

  async function verifyAndOpenMaster() {
    setMasterUnlocking(true);
    setMasterUnlockError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-master",
          masterPassword: masterUnlockPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "마스터 비밀번호 확인 실패");
      if (data.settings) {
        setQuota(data.settings);
        setDailyLimit(String(data.settings.dailyLimit ?? 0));
        setTotalLimit(String(data.settings.totalLimit ?? 0));
      }
      setMasterPw(masterUnlockPw);
      setMasterUnlockPw("");
    } catch (err) {
      setMasterUnlockError(
        err instanceof Error ? err.message : "마스터 비밀번호 확인 실패"
      );
    } finally {
      setMasterUnlocking(false);
    }
  }

  async function saveMaster(e: FormEvent) {
    e.preventDefault();
    setMasterSaving(true);
    setMasterMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-limits",
          masterPassword: masterPw,
          dailyLimit: Number(dailyLimit) || 0,
          totalLimit: Number(totalLimit) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "저장 실패");
      setQuota(data.settings);
      setMasterMsg("마스터 설정이 저장되었습니다.");
      setMasterPw("");
    } catch (err) {
      setMasterMsg(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setMasterSaving(false);
    }
  }

  async function onPublish(e: FormEvent) {
    e.preventDefault();
    setPublishing(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          mode,
          apiKey: apiKey || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "발행 실패");
      setMessage(
        `발행 완료: ${data.path}` +
          (data.indexNow ? `\nIndexNow: ${data.indexNow.message}` : "") +
          (data.quota
            ? `\n오늘 ${data.quota.publishedToday}/${data.quota.dailyLimit || "∞"} · 전체 ${data.quota.publishedTotal}/${data.quota.totalLimit || "∞"}`
            : "")
      );
      setKeyword("");
      await loadPages(1);
      await loadSettings();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "발행 실패");
    } finally {
      setPublishing(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <p className="text-[var(--muted)]">확인 중…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <form
          onSubmit={onLogin}
          className="w-full max-w-md border border-[var(--line)] bg-[var(--ivory)] rounded-2xl p-8 shadow-[var(--shadow)]"
        >
          <p className="eyebrow">Admin</p>
          <h1 className="font-display mt-2 text-3xl">관리자 로그인</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">달빛쉘터 SEO 발행 관리</p>
          <label className="mt-6 block text-sm">
            아이디
            <input
              className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-sm">
            비밀번호
            <input
              type="password"
              className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-red-700">{loginError}</p>}
          <button type="submit" className="btn-gold mt-6 w-full">
            로그인
          </button>
          <Link href="/" className="mt-4 block text-center text-sm text-[var(--muted)]">
            ← 사이트로 돌아가기
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="container min-h-screen py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="font-display text-4xl">발행 관리</h1>
          <p className="mt-2 text-[var(--muted)]">
            현재 발행 페이지 <strong className="text-[var(--ink)]">{total}</strong>건 · 페이지당{" "}
            {PAGE_SIZE}개
          </p>
          {quota && (
            <p className="mt-1 text-sm text-[var(--muted)]">
              오늘 관리자 발행 {quota.publishedToday}
              {quota.dailyLimit > 0 ? ` / ${quota.dailyLimit}` : " (한도 없음)"}
              {" · "}
              전체 {quota.publishedTotal}
              {quota.totalLimit > 0 ? ` / ${quota.totalLimit}` : " (한도 없음)"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openMaster} className="btn-ghost">
            마스터설정
          </button>
          <button type="button" onClick={onLogout} className="btn-ghost">
            로그아웃
          </button>
        </div>
      </div>

      {masterOpen && (
        <form
          onSubmit={saveMaster}
          className="mt-6 border border-[var(--line)] bg-[var(--ivory)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">마스터설정</h2>
            <button
              type="button"
              className="text-sm text-[var(--muted)]"
              onClick={() => setMasterOpen(false)}
            >
              닫기
            </button>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            관리자 페이지 1건 발행에만 적용됩니다. 로컬 대량등록(tools/webdoc)은 예외입니다. 0 =
            무제한.
          </p>
          {!masterPw ? (
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-4">
              <label className="block text-sm">
                마스터 비밀번호
                <input
                  type="password"
                  className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
                  value={masterUnlockPw}
                  onChange={(e) => setMasterUnlockPw(e.target.value)}
                  required
                />
              </label>
              {masterUnlockError && (
                <p className="mt-3 text-sm text-red-700">{masterUnlockError}</p>
              )}
              <button
                type="button"
                className="btn-gold mt-4"
                disabled={masterUnlocking}
                onClick={verifyAndOpenMaster}
              >
                {masterUnlocking ? "확인 중…" : "비밀번호 확인"}
              </button>
            </div>
          ) : (
            <>
              <label className="mt-4 block text-sm">
                마스터 비밀번호
                <input
                  type="password"
                  className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
                  value={masterPw}
                  onChange={(e) => setMasterPw(e.target.value)}
                  required
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  하루 발행수량
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  전체발행수량
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
                    value={totalLimit}
                    onChange={(e) => setTotalLimit(e.target.value)}
                  />
                </label>
              </div>
              {masterMsg && <p className="mt-3 text-sm text-[var(--ink-soft)]">{masterMsg}</p>}
              <button type="submit" className="btn-gold mt-5" disabled={masterSaving}>
                {masterSaving ? "저장 중…" : "설정 저장"}
              </button>
            </>
          )}
        </form>
      )}

      <form
        onSubmit={onPublish}
        className="mt-10 border border-[var(--line)] bg-[var(--ivory)] rounded-2xl p-6"
      >
        <h2 className="font-display text-2xl">1건 발행</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          관리자: Gemini 1건씩 · 로컬 대량 발행은 tools/webdoc 웹UI를 이용해 주세요 (한도 예외)
        </p>
        <label className="mt-4 block text-sm">
          키워드
          <input
            className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 강아지파양후기"
            required
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "gemini"}
              onChange={() => setMode("gemini")}
            />
            Gemini
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "template"}
              onChange={() => setMode("template")}
            />
            기본 양식 (API 없음)
          </label>
        </div>
        {mode === "gemini" && (
          <label className="mt-4 block text-sm">
            Gemini API Key
            <span className="ml-2 text-xs text-[var(--muted)]">
              {keySavedHint || "입력 시 자동 저장"}
            </span>
            <input
              className="mt-1 w-full border border-[var(--line)] bg-white rounded-xl px-3 py-2"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="키 입력 시 자동 저장됩니다"
              autoComplete="off"
            />
          </label>
        )}
        <button type="submit" className="btn-gold mt-5" disabled={publishing}>
          {publishing ? "발행 중…" : "발행하기"}
        </button>
        {message && (
          <p className="mt-3 whitespace-pre-line text-sm text-[var(--ink-soft)]">{message}</p>
        )}
      </form>

      <div className="mt-10">
        <h2 className="font-display text-2xl">발행된 페이지</h2>
        <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)] bg-[var(--ivory)] rounded-2xl">
          {items.length === 0 && (
            <li className="px-4 py-6 text-sm text-[var(--muted)]">아직 발행된 글이 없습니다.</li>
          )}
          {items.map((item, i) => {
            const no = (page - 1) * PAGE_SIZE + i + 1;
            return (
              <li
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <span className="w-8 shrink-0 font-display text-lg text-[var(--gold-deep)]">
                    {String(no).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--gold-deep)]">{item.keyword}</div>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--ink)] transition hover:text-[var(--gold-deep)] hover:underline"
                    >
                      {no}. {item.title}
                    </a>
                    <div className="truncate text-xs text-[var(--muted)]">
                      {absolutePageUrl(item.path)}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{item.createdAt}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyPageUrl(item.path, item.slug)}
                  className="shrink-0 rounded-full border border-[var(--gold-deep)] px-3 py-1.5 text-xs font-semibold text-[var(--gold-deep)] transition hover:bg-[var(--gold-deep)] hover:text-white"
                >
                  {copiedSlug === item.slug ? "복사됨" : "주소복사하기"}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => loadPages(n)}
              className={`min-w-9 rounded-full px-2 py-1 text-sm ${
                n === page
                  ? "bg-[var(--bronze)] text-white"
                  : "border border-[var(--line)] bg-white rounded-xl"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
