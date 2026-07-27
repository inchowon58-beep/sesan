"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.2 3.8h7.6c.9 0 1.6.7 1.6 1.6v13.2c0 .9-.7 1.6-1.6 1.6H8.2c-.9 0-1.6-.7-1.6-1.6V5.4c0-.9.7-1.6 1.6-1.6Z"
        fill="currentColor"
      />
      <path d="M9.6 10.2h4.8v1.4H9.6v-1.4Zm0 3.2h4.8v1.4H9.6v-1.4Z" fill="#fff" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="8.2" cy="8.1" rx="1.7" ry="2.1" fill="currentColor" />
      <ellipse cx="15.8" cy="8.1" rx="1.7" ry="2.1" fill="currentColor" />
      <ellipse cx="5.9" cy="12.2" rx="1.55" ry="1.9" fill="currentColor" />
      <ellipse cx="18.1" cy="12.2" rx="1.55" ry="1.9" fill="currentColor" />
      <path
        d="M12 11.2c2.8 0 4.8 2.1 4.8 4.4 0 1.7-1.3 2.8-2.6 2.8-.8 0-1.4-.3-2.2-.9-.8.6-1.4.9-2.2.9-1.3 0-2.6-1.1-2.6-2.8 0-2.3 2-4.4 4.8-4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 10.8 12 4.5l7.5 6.3V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.2h-3.6V20.5H6A1.5 1.5 0 0 1 4.5 19v-8.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function FixedCallButton() {
  return (
    <>
      <div className="dalbit-floating">
        <a href={SITE.phoneTel} className="dalbit-floating-btn" aria-label="전화상담">
          <PhoneIcon />
        </a>
        <button
          type="button"
          className="dalbit-floating-btn dalbit-floating-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="위로 가기"
        >
          <ArrowUpIcon />
        </button>
      </div>

      <div className="dalbit-floating-mobile">
        <a href={SITE.phoneTel} className="dalbit-floating-mobile-btn">
          <PhoneIcon />
          <span>전화문의</span>
        </a>
        <Link href="/#surrender" className="dalbit-floating-mobile-btn">
          <ClipboardIcon />
          <span>입소상담</span>
        </Link>
        <Link href="/#gallery" className="dalbit-floating-mobile-btn">
          <PawIcon />
          <span>입양상담</span>
        </Link>
        <Link href="/" className="dalbit-floating-mobile-btn">
          <HomeIcon />
          <span>홈</span>
        </Link>
      </div>
    </>
  );
}
