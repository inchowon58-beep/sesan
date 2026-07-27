import { SITE } from "./site";

/** dogboho 01.webp ~ 79.webp */
export function imageUrl(index: number): string {
  const n = Math.max(1, Math.min(SITE.imageCount, index));
  return `${SITE.imageBase}/${String(n).padStart(2, "0")}.webp`;
}

export function allImageUrls(): string[] {
  return Array.from({ length: SITE.imageCount }, (_, i) => imageUrl(i + 1));
}

/** 시드 기반 의사랜덤 — 서버/클라이언트 동일 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickImages(count: number, seed = 42): string[] {
  const pool = allImageUrls();
  const rng = mulberry32(seed);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function galleryAlt(keyword: string, index: number): string {
  const suffixes = [
    "강아지 파양입소 현장",
    "보호중인 아이 프로필",
    "무료분양 매칭 사례",
    "달빛쉘터 보호 일상",
  ];
  const suffix = suffixes[(index - 1) % suffixes.length];
  return `${keyword} ${suffix} ${index}`;
}
