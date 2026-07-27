import Image from "next/image";
import { SITE } from "@/lib/site";
import { imageUrl } from "@/lib/images";

const SURRENDER_CARDS = [
  {
    title: "강아지 파양 입소",
    tag: "입소 안내",
    image: 1,
    description:
      "이민·이사·건강 문제 등 피치 못한 사정의 가정견 파양 입소를 상담합니다. 절차와 비용을 사전에 투명하게 안내합니다.",
  },
  {
    title: "입소 후 케어",
    tag: "생활·건강",
    image: 3,
    description:
      "입소 후 목욕·산책·건강 상태 확인 등 아이 중심의 케어를 진행합니다. 필요한 경우 생활 근황도 공유합니다.",
  },
  {
    title: "긴급·전화 상담",
    tag: "빠른 안내",
    image: 6,
    description:
      "출국·이사 등 급한 상황도 신속히 상담합니다. 방문이 어려운 경우 담당자 방문 픽업도 안내합니다.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "전화 상담",
    desc: "전화로 파양 입소 또는 무료분양 상담을 신청합니다. 상황과 일정에 맞춰 빠르게 안내합니다.",
  },
  {
    step: "02",
    title: "일정·방문 조율",
    desc: "전국 어디서나 방문 또는 담당자 방문 픽업 일정을 조율합니다. 상황에 맞는 방법을 함께 정합니다.",
  },
  {
    step: "03",
    title: "입소·절차 안내",
    desc: "입소 절차와 비용을 투명하게 확인한 뒤 진행합니다. 항목별 안내를 사전에 드립니다.",
  },
  {
    step: "04",
    title: "새 가족 매칭",
    desc: "보호중인 아이가 새 가족을 만날 때까지 무료분양 매칭과 사후 상담을 책임지고 지원합니다.",
  },
] as const;

export default function Services() {
  return (
    <section id="surrender" className="dalbit-section">
      <div className="dalbit-container">
        <div className="dalbit-sec-header">
          <span className="dalbit-badge">Dog Surrender</span>
          <h2 className="dalbit-sec-title">
            피치 못한 사정, <em>안전한 입소</em>로
            <br />
            이어드립니다
          </h2>
          <p className="dalbit-sec-desc">
            더 이상 함께하기 어려울 때, 전국 파양 입소부터 새 가족 매칭까지 한눈에 확인하세요.
          </p>
        </div>

        <div className="dalbit-card-list">
          {SURRENDER_CARDS.map((card) => (
            <article key={card.title} className="dalbit-card">
              <div className="dalbit-card-thumb">
                <Image src={imageUrl(card.image)} alt={card.title} fill className="object-cover" />
                <span className="dalbit-card-badge">{card.tag}</span>
              </div>
              <div className="dalbit-card-info">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="dalbit-cta-row">
          <div>
            <p className="dalbit-cta-row-title">파양 상담이 필요하신가요?</p>
            <p className="dalbit-cta-row-desc">
              상담 신청서 없이 {SITE.phone} 전화만으로 안내드립니다.
            </p>
          </div>
          <a href={SITE.phoneTel} className="dalbit-btn-main">
            CALL {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

export function GuideSection() {
  return (
    <section id="guide" className="dalbit-section dalbit-section-alt">
      <div className="dalbit-container">
        <div className="dalbit-sec-header">
          <span className="dalbit-badge">Guide</span>
          <h2 className="dalbit-sec-title">
            입소·분양 <em>4단계 안내</em>
          </h2>
          <p className="dalbit-sec-desc">
            전국 파양 입소부터 새 가족 매칭까지, 4단계로 안내합니다.
          </p>
        </div>

        <ol className="dalbit-step-list">
          {STEPS.map((step) => (
            <li key={step.step} className="dalbit-step-item">
              <span className="dalbit-step-num">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
