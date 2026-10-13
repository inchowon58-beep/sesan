import { KOREA_REGIONS } from "@/data/korea-regions";

/**
 * 강아지분양 전용 카탈로그.
 * 기존 public/seo-data·/guide·관리자 발행 목록과 완전 분리.
 * 페이지는 JSON 발행이 아니라 템플릿+지역 치환으로 생성한다.
 */

export const BREED_PHONE = "0505-464-1004";

/** 우선 화이트테리어만. 이후 견종·묘종 intent를 같은 방식으로 추가 */
export const BREED_INTENTS = ["화이트테리어분양", "화이트테리어입양"] as const;
export type BreedIntent = (typeof BREED_INTENTS)[number];

export type BreedEntry = {
  slug: string;
  keyword: string;
  region: string | null;
  intent: BreedIntent;
};

export function breedPath(slug: string): string {
  return `/bunyang/${encodeURIComponent(slug)}`;
}

export function listBreedEntries(): BreedEntry[] {
  const out: BreedEntry[] = [];
  for (const intent of BREED_INTENTS) {
    out.push({
      slug: intent,
      keyword: intent,
      region: null,
      intent,
    });
    for (const region of KOREA_REGIONS) {
      out.push({
        slug: `${region}-${intent}`,
        keyword: `${region} ${intent}`,
        region,
        intent,
      });
    }
  }
  return out;
}

export function findBreedEntry(slug: string): BreedEntry | null {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  for (const intent of BREED_INTENTS) {
    if (decoded === intent) {
      return { slug: intent, keyword: intent, region: null, intent };
    }
    const prefix = `-${intent}`;
    if (decoded.endsWith(prefix)) {
      const region = decoded.slice(0, -prefix.length);
      if (region && (KOREA_REGIONS as readonly string[]).includes(region)) {
        return {
          slug: decoded,
          keyword: `${region} ${intent}`,
          region,
          intent,
        };
      }
    }
  }
  return null;
}
