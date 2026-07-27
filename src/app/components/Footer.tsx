import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

const RELATED_LINKS = [
  { href: "https://www.yourdogzone.co.kr/", label: "유아독존" },
  { href: "https://www.eanimal.kr/", label: "반려문화위원회" },
] as const;

export default function Footer() {
  return (
    <footer className="dalbit-footer">
      <div className="dalbit-container">
        <div className="dalbit-footer-top">
          <Link href="/" className="dalbit-footer-logo">
            <Image src={SITE.logo} alt={`${SITE.brand} 로고`} width={52} height={52} />
            <span>{SITE.brand}</span>
          </Link>

          <div className="dalbit-footer-contact">
            <span>전화 문의</span>
            <a href={SITE.phoneTel} className="dalbit-footer-call">
              {SITE.phone}
            </a>
            <p className="dalbit-footer-note">전국 어디서나 상담 가능 · 특정 지점 없이 운영</p>
          </div>
        </div>

        <div id="partners" className="dalbit-footer-partners scroll-mt-28">
          <p className="dalbit-footer-partners-label">관련업체링크</p>
          <div className="dalbit-footer-partners-list">
            {RELATED_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="dalbit-footer-partner-link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="dalbit-footer-info">
          <div className="dalbit-footer-info-list">
            <span>{SITE.brand}</span>
            <span>사업영역 · 강아지 파양·무료분양·입소케어·새 가족 매칭</span>
            <span>서비스 지역 · {SITE.areaServed}</span>
          </div>
          <p className="dalbit-footer-copyright">
            © {new Date().getFullYear()} {SITE.brand}. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="dalbit-footer-util">
          <a href="#partners">관련업체링크</a>
          <Link href="/admin">관리자 로그인</Link>
        </div>
      </div>
    </footer>
  );
}
