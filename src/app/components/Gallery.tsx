import Image from "next/image";
import { SITE } from "@/lib/site";
import { ADOPTION_GALLERY } from "@/lib/adoption-gallery";

export default function Gallery() {
  return (
    <section id="gallery" className="dalbit-section">
      <div className="dalbit-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="dalbit-sec-header align-left">
            <span className="dalbit-badge">Protected Pets</span>
            <h2 className="dalbit-sec-title">
              새 가족을 <em>기다리는 아이들</em>
            </h2>
            <p className="dalbit-sec-desc max-w-xl">
              파양으로 입소한 아이들이 새 가족을 기다리고 있습니다. {SITE.brand}에서
              먼저 확인하고 전화 상담으로 무료분양 매칭을 진행해 주세요.
            </p>
          </div>
          <a href={SITE.phoneTel} className="dalbit-btn-main shrink-0">
            매칭 상담하기
          </a>
        </div>

        <div className="dalbit-gallery-grid">
          {ADOPTION_GALLERY.map((pet) => (
            <article key={pet.name} className="dalbit-gallery-card">
              <div className="dalbit-gallery-thumb">
                <Image
                  src={pet.src}
                  alt={`${pet.name} — 새 가족을 기다리는 강아지`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="dalbit-gallery-info">
                <p className="text-sm font-semibold">강아지 · 새 가족을 기다려요</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
