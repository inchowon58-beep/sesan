import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

function IconMap() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.9 6.5 12.5 6.5 12.5S18.5 13.9 18.5 9c0-3.6-2.9-6.5-6.5-6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9" r="2.4" fill="currentColor" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20.2s-7.8-4.7-7.8-10.3c0-2.9 2.3-5 5-5 1.6 0 3 .8 3.8 2 .8-1.2 2.2-2 3.8-2 2.7 0 5 2.1 5 5 0 5.6-7.8 10.3-7.8 10.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9.5 10.5h2l1-1.8 1.4 3.2 1-1.4h1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 10.5 7 7l3.2 2.4a1.6 1.6 0 0 1 0 2.6l-.4.3a1.5 1.5 0 0 1-2 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 10.5 17 7l-3.2 2.4a1.6 1.6 0 0 0 0 2.6l3 2.3a1.5 1.5 0 0 0 2-.1l2.8-2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12.8l1.8 1.5a1.5 1.5 0 0 0 2-.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.4 14.5 9.2l6.1.5-4.7 4 1.4 6-5.3-3.3-5.3 3.3 1.4-6-4.7-4 6.1-.5L12 3.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PROMISES: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "전국 어디서나",
    desc: "지역 제한 없이 전화 한 통이면 파양·분양 상담을 시작합니다.",
    icon: <IconMap />,
  },
  {
    title: "건강 체크",
    desc: "입소 즉시 건강 상태를 확인하고 필요한 케어를 진행합니다.",
    icon: <IconHeart />,
  },
  {
    title: "성향 맞춤 매칭",
    desc: "아이의 성향과 생활 환경을 고려해 새 가족을 연결합니다.",
    icon: <IconHandshake />,
  },
  {
    title: "입양 후 케어",
    desc: "매칭 이후에도 근황을 나누며 책임감 있게 지원합니다.",
    icon: <IconStar />,
  },
];

export default function About() {
  return (
    <section id="about" className="dalbit-section dalbit-section-alt">
      <div className="dalbit-container">
        <div className="dalbit-sec-header">
          <span className="dalbit-badge">About Us</span>
          <h2 className="dalbit-sec-title">
            전국 어디서나, <em>{SITE.brand}</em>가
            <br />
            함께합니다
          </h2>
          <p className="dalbit-sec-desc">
            {SITE.brand}는 전국 강아지 파양 입소와 무료분양을 전문으로 안내합니다. 이별을
            결정하신 보호자님의 마음을 헤아리며, 아이가 안전하게 새 가족을 만날 수 있도록
            상담부터 매칭까지 책임집니다.
          </p>
        </div>

        <div className="dalbit-promise-list">
          {PROMISES.map((item) => (
            <div key={item.title} className="dalbit-promise-item">
              <div className="dalbit-promise-icon">{item.icon}</div>
              <p className="dalbit-promise-title">{item.title}</p>
              <p className="dalbit-promise-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
