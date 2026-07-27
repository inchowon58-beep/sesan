import Image from "next/image";
import type { SeoPage } from "@/lib/seo-pages";
import { galleryAlt } from "@/lib/images";
import { SITE } from "@/lib/site";

type Props = {
  page: SeoPage;
  imageSrc: string;
};

/** 안내글 상단 히어로 썸네일 — 랜덤 배경 + 중앙 텍스트 */
export default function GuideHeroThumb({ page, imageSrc }: Props) {
  const badge = page.heroBadge || `전국파양입소 · ${SITE.brand}`;
  const line1 = page.heroTitleLine1 || page.keyword;
  const line2 = page.heroTitleLine2 || "새 가족을 만나요";
  const bar = page.heroBar || page.heroSubtitle || "전국 어디서나 상담 가능한 파양·분양 안내";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[720px] overflow-hidden rounded-2xl shadow-[var(--shadow)] ring-1 ring-white/80">
      <Image
        src={imageSrc}
        alt={galleryAlt(page.keyword, 1)}
        fill
        priority
        className="object-cover"
        sizes="(max-width:768px) 100vw, 720px"
      />
      {/* 가독성용 은은한 비네트 — 사진 톤은 살림 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.5)_100%)]" />
      {/* 안쪽 화이트 프레임 */}
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/90 md:inset-4" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full bg-[linear-gradient(135deg,#ff8a3d,#ff6a00)] px-4 py-1.5 text-[0.7rem] font-semibold tracking-wide text-white shadow-md md:text-xs">
          {badge}
        </span>

        <h1 className="mt-5 max-w-[16ch] home-e-display text-[clamp(1.85rem,6.5vw,3.15rem)] font-extrabold leading-[1.2] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]">
          <span className="block">{line1}</span>
          <span className="mt-1 block text-[#ffd166] drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
            {line2}
          </span>
        </h1>

        <p className="mt-6 max-w-md rounded-full bg-[rgba(15,23,42,0.6)] px-5 py-2.5 text-[0.8rem] font-medium leading-snug text-white md:text-[0.95rem]">
          {bar}
        </p>
      </div>
    </div>
  );
}
