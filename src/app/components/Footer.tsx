import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

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
          <Link href="/admin">관리자 로그인</Link>
        </div>
      </div>
    </footer>
  );
}
