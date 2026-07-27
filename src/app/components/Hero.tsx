import Link from "next/link";
import { SITE } from "@/lib/site";
import { imageUrl } from "@/lib/images";

const HERO_VIDEO_SRC = "/videos/hero.mp4";

export default function Hero() {
  const poster = imageUrl(5);

  return (
    <section className="dalbit-hero">
      <video
        className="dalbit-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="dalbit-hero-scrim" aria-hidden />

      <div className="dalbit-hero-content">
        <div className="dalbit-hero-inner">
          <span className="dalbit-hero-badge">DALBIT SHELTER</span>
          <h1 className="dalbit-hero-title">
            {SITE.brand}
            <em>강아지 파양 · 무료분양</em>
          </h1>
          <p className="dalbit-hero-desc">
            <span>이별 뒤에도 좋은 인연은 이어집니다.</span>
            <span>전국 파양입소·무료분양, {SITE.brand}가 함께합니다.</span>
          </p>
          <Link href="/#surrender" className="dalbit-hero-cta">
            입소 상담하기
          </Link>
        </div>
      </div>
    </section>
  );
}
