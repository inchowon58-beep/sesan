/** 분양 페이지 전용 이미지 — 기존 dogboho 파양 이미지와 분리 */

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function breedImageUrl(imageBase: string, index: number): string {
  const n = Math.max(1, index);
  return `${imageBase.replace(/\/$/, "")}/${String(n).padStart(2, "0")}.webp`;
}

export function pickBreedImages(
  imageBase: string,
  imageCount: number,
  count: number,
  seed = 42
): string[] {
  const total = Math.max(1, imageCount);
  const pool = Array.from({ length: total }, (_, i) => breedImageUrl(imageBase, i + 1));
  const rng = mulberry32(seed);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function breedGalleryAlt(keyword: string, index: number, label: string): string {
  const suffixes = [
    `${label} 분양 안내`,
    `${label} 프로필`,
    `${label} 케어 모습`,
    `${label} 상담 안내`,
  ];
  return `${keyword} ${suffixes[(index - 1) % suffixes.length]} ${index}`;
}
