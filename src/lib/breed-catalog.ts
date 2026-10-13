import { KOREA_REGIONS } from "@/data/korea-regions";
import {
  BREED_DEFS,
  allBreedIntents,
  findBreedDefByIntent,
  type BreedCategory,
  type BreedDef,
} from "@/data/breed-defs";

/**
 * 분양 전용 카탈로그.
 * 기존 public/seo-data·/guide·관리자 발행 목록과 완전 분리.
 */

export const BREED_PHONE = "0505-464-1004";

export type BreedIntent = string;

export type BreedEntry = {
  slug: string;
  keyword: string;
  region: string | null;
  intent: string;
  def: BreedDef;
  category: BreedCategory;
};

export function breedBasePath(category: BreedCategory): string {
  return category === "cat" ? "/goyang" : "/bunyang";
}

export function breedPath(entry: Pick<BreedEntry, "slug" | "category">): string {
  return `${breedBasePath(entry.category)}/${encodeURIComponent(entry.slug)}`;
}

export function listBreedEntries(category?: BreedCategory): BreedEntry[] {
  const out: BreedEntry[] = [];
  const defs = category
    ? BREED_DEFS.filter((d) => d.category === category)
    : BREED_DEFS;

  for (const def of defs) {
    for (const intent of def.intents) {
      out.push({
        slug: intent,
        keyword: intent,
        region: null,
        intent,
        def,
        category: def.category,
      });
      for (const region of KOREA_REGIONS) {
        out.push({
          slug: `${region}-${intent}`,
          keyword: `${region} ${intent}`,
          region,
          intent,
          def,
          category: def.category,
        });
      }
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

  const intents = allBreedIntents().sort((a, b) => b.length - a.length);

  for (const intent of intents) {
    if (decoded === intent) {
      const def = findBreedDefByIntent(intent);
      if (!def) return null;
      return {
        slug: intent,
        keyword: intent,
        region: null,
        intent,
        def,
        category: def.category,
      };
    }
    const prefix = `-${intent}`;
    if (decoded.endsWith(prefix)) {
      const region = decoded.slice(0, -prefix.length);
      if (region && (KOREA_REGIONS as readonly string[]).includes(region)) {
        const def = findBreedDefByIntent(intent);
        if (!def) return null;
        return {
          slug: decoded,
          keyword: `${region} ${intent}`,
          region,
          intent,
          def,
          category: def.category,
        };
      }
    }
  }
  return null;
}

/** 하위 호환 — 예전 BREED_INTENTS 참조 제거용 */
export const BREED_INTENTS = allBreedIntents();
