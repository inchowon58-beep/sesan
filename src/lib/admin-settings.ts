import fs from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

export type AdminSettings = {
  /** 하루 관리자 발행 한도 (0 = 무제한) */
  dailyLimit: number;
  /** 전체 관리자 발행 한도 (0 = 무제한) */
  totalLimit: number;
  /** 오늘(KST) 관리자 발행 수 */
  publishedToday: number;
  /** 오늘 날짜 YYYY-MM-DD (KST) */
  publishedTodayDate: string;
  /** 누적 관리자 발행 수 */
  publishedTotal: number;
  /** 서버에 저장된 Gemini 키 (선택) */
  geminiApiKey: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "public", "seo-data");
const LOCAL_PATH = path.join(DATA_DIR, "admin-settings.json");
const BLOB_PATH = "seo-data/admin-settings.json";
const MASTER_PASSWORD = "ybijour80";

function kstToday(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function defaults(): AdminSettings {
  return {
    dailyLimit: 0,
    totalLimit: 0,
    publishedToday: 0,
    publishedTodayDate: kstToday(),
    publishedTotal: 0,
    geminiApiKey: "",
    updatedAt: new Date().toISOString(),
  };
}

function resolveBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (value?.trim() && key.includes("BLOB") && key.endsWith("READ_WRITE_TOKEN")) {
      return value.trim();
    }
  }
  return undefined;
}

async function readBlobText(pathname: string): Promise<string | null> {
  const token = resolveBlobToken();
  if (!token) return null;
  try {
    const result = await get(pathname, { access: "private", token });
    if (!result?.stream) return null;
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Uint8Array(total);
    let o = 0;
    for (const c of chunks) {
      merged.set(c, o);
      o += c.length;
    }
    return new TextDecoder("utf-8").decode(merged);
  } catch {
    return null;
  }
}

async function writeBlobText(pathname: string, content: string): Promise<void> {
  const token = resolveBlobToken();
  if (!token) return;
  await put(pathname, content, {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

function normalize(raw: Partial<AdminSettings> | null | undefined): AdminSettings {
  const base = defaults();
  if (!raw || typeof raw !== "object") return base;
  const today = kstToday();
  const date = String(raw.publishedTodayDate || today);
  let publishedToday = Math.max(0, Number(raw.publishedToday) || 0);
  if (date !== today) publishedToday = 0;
  return {
    dailyLimit: Math.max(0, Math.floor(Number(raw.dailyLimit) || 0)),
    totalLimit: Math.max(0, Math.floor(Number(raw.totalLimit) || 0)),
    publishedToday,
    publishedTodayDate: today,
    publishedTotal: Math.max(0, Math.floor(Number(raw.publishedTotal) || 0)),
    geminiApiKey: String(raw.geminiApiKey || ""),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
  };
}

export function verifyMasterPassword(password: string): boolean {
  return String(password || "") === MASTER_PASSWORD;
}

export async function loadAdminSettings(): Promise<AdminSettings> {
  try {
    if (fs.existsSync(LOCAL_PATH)) {
      const raw = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
      return normalize(raw);
    }
  } catch {
    /* continue */
  }
  const blobRaw = await readBlobText(BLOB_PATH);
  if (blobRaw) {
    try {
      return normalize(JSON.parse(blobRaw));
    } catch {
      /* fallthrough */
    }
  }
  return defaults();
}

export async function saveAdminSettings(
  next: Partial<AdminSettings>
): Promise<AdminSettings> {
  const current = await loadAdminSettings();
  const merged = normalize({
    ...current,
    ...next,
    updatedAt: new Date().toISOString(),
  });
  const content = JSON.stringify(merged, null, 2);
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LOCAL_PATH, content, "utf8");
  } catch {
    /* Vercel read-only FS 등 */
  }
  try {
    await writeBlobText(BLOB_PATH, content);
  } catch {
    /* blob optional */
  }
  return merged;
}

export type PublishQuota = {
  ok: boolean;
  error?: string;
  settings: AdminSettings;
  remainingDaily: number | null;
  remainingTotal: number | null;
};

/** 관리자 웹 발행 한도 검사 (로컬 대량등록은 호출하지 않음) */
export async function checkAdminPublishQuota(): Promise<PublishQuota> {
  const settings = await loadAdminSettings();
  const remainingDaily =
    settings.dailyLimit > 0
      ? Math.max(0, settings.dailyLimit - settings.publishedToday)
      : null;
  const remainingTotal =
    settings.totalLimit > 0
      ? Math.max(0, settings.totalLimit - settings.publishedTotal)
      : null;

  if (settings.dailyLimit > 0 && settings.publishedToday >= settings.dailyLimit) {
    return {
      ok: false,
      error: `오늘 발행 한도(${settings.dailyLimit}건)를 모두 사용했습니다.`,
      settings,
      remainingDaily,
      remainingTotal,
    };
  }
  if (settings.totalLimit > 0 && settings.publishedTotal >= settings.totalLimit) {
    return {
      ok: false,
      error: `전체 발행 한도(${settings.totalLimit}건)를 모두 사용했습니다.`,
      settings,
      remainingDaily,
      remainingTotal,
    };
  }
  return { ok: true, settings, remainingDaily, remainingTotal };
}

export async function incrementAdminPublishCount(): Promise<AdminSettings> {
  const settings = await loadAdminSettings();
  return saveAdminSettings({
    publishedToday: settings.publishedToday + 1,
    publishedTodayDate: kstToday(),
    publishedTotal: settings.publishedTotal + 1,
  });
}

export function publicSettingsView(settings: AdminSettings) {
  return {
    dailyLimit: settings.dailyLimit,
    totalLimit: settings.totalLimit,
    publishedToday: settings.publishedToday,
    publishedTodayDate: settings.publishedTodayDate,
    publishedTotal: settings.publishedTotal,
    hasGeminiKey: Boolean(settings.geminiApiKey.trim()),
    remainingDaily:
      settings.dailyLimit > 0
        ? Math.max(0, settings.dailyLimit - settings.publishedToday)
        : null,
    remainingTotal:
      settings.totalLimit > 0
        ? Math.max(0, settings.totalLimit - settings.publishedTotal)
        : null,
  };
}
