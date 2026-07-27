import { SITE } from "@/lib/site";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 3.6l3 1.4-1 3.4a12 12 0 0 0 6.9 6.9l3.4-1 1.4 3a2 2 0 0 1-1.4 2.6 15.5 15.5 0 0 1-16.9-16.9 2 2 0 0 1 2.6-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="dalbit-section dalbit-contact-cta">
      <div className="dalbit-container dalbit-contact-inner">
        <div>
          <p className="dalbit-contact-eyebrow">지금 바로 상담하세요</p>
          <h2 className="dalbit-contact-title">
            전국 어디서나, 전화 한 통이면 충분합니다
          </h2>
          <p className="dalbit-contact-desc">
            상담 신청서 없이 전화로만 문의를 받습니다. 이별 뒤에도 좋은 인연은 이어집니다.
          </p>
        </div>
        <a href={SITE.phoneTel} className="dalbit-contact-btn">
          <PhoneIcon />
          {SITE.phone}
        </a>
      </div>
    </section>
  );
}
