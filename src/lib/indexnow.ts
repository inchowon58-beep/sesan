import { SITE } from "./site";

/** IndexNow 공개 키 — public/{key}.txt 와 동일해야 함 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "f4e8fb3912a5d6f628c4255cc466f799";

const ENDPOINT = "https://api.indexnow.org/indexnow";

function siteHost(): string {
  try {
    return new URL(SITE.siteUrl).host;
  } catch {
    return "sesan.agapet.co.kr";
  }
}

export function indexNowKeyLocation(): string {
  return `${SITE.siteUrl.replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`;
}

export type IndexNowResult = {
  ok: boolean;
  message: string;
  submitted: number;
};

/** 글 URL만 제출 (사이트맵 등 부가 URL은 건수에 섞지 않음). 기본 40건씩 전송. */
export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  const unique = [
    ...new Set(urls.map((u) => u.trim()).filter(Boolean)),
  ];
  if (!unique.length) {
    return { ok: false, message: "제출할 URL이 없습니다.", submitted: 0 };
  }

  const host = siteHost();
  const keyLocation = indexNowKeyLocation();
  const chunkSize = 40;
  let submitted = 0;
  let lastError = "";

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList: chunk,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200 || res.status === 202) {
        submitted += chunk.length;
      } else {
        const text = await res.text().catch(() => "");
        lastError = `HTTP ${res.status}: ${text.slice(0, 200)}`;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  if (submitted === unique.length) {
    const batches = Math.ceil(unique.length / chunkSize);
    return {
      ok: true,
      message: `IndexNow 성공 · 글 ${unique.length}건 · ${batches}회(${chunkSize}건씩)`,
      submitted,
    };
  }
  if (submitted > 0) {
    return {
      ok: false,
      message: `IndexNow 부분성공 ${submitted}/${unique.length}건${lastError ? ` · ${lastError}` : ""}`,
      submitted,
    };
  }
  return {
    ok: false,
    message: `IndexNow 실패${lastError ? `: ${lastError}` : ""}`,
    submitted: 0,
  };
}

export function absoluteGuideUrl(slug: string): string {
  return `${SITE.siteUrl.replace(/\/$/, "")}/guide/${encodeURIComponent(slug)}`;
}
