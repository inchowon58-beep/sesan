/** 달빛쉘터 — 전국 강아지 파양입소 · 무료분양 보호소 사이트 공통 설정 */

export const SITE = {
  name: "달빛쉘터",
  nameEn: "Dalbit Shelter",
  brand: "달빛쉘터",
  brandEn: "Dalbit Shelter",
  tagline: "전국 어디서나, 이별 뒤에도 좋은 인연은 이어집니다",
  taglineEn: "Nationwide Dog Surrender & Free Adoption Shelter",
  description:
    "달빛쉘터는 전국 강아지 파양입소와 무료분양을 전문으로 안내하는 보호소입니다. 이민·이사·건강 문제 등 피치 못한 사정의 파양 상담부터 새 가족 매칭까지 책임집니다. 문의 010-9906-4068.",
  keywords: [
    "강아지파양",
    "달빛쉘터",
    "강아지파양입소",
    "무료분양",
    "강아지무료분양",
    "유기견보호소",
    "강아지보호소",
    "전국파양입소",
    "강아지입양",
    "반려견파양",
    "강아지입소",
    "새가족매칭",
    "강아지분양",
    "유기견입양",
  ],
  phone: "010-9906-4068",
  phoneTel: "tel:01099064068",
  email: "",
  logo: "/logo.png",
  imageBase: "https://image.cattery.co.kr/dogboho",
  imageCount: 79,
  /** 전국파양입소 및 무료분양 — 특정 주소 없음 */
  areaServed: "대한민국 전국",
  /** 배포 도메인 — 실제 도메인 연결 시 수정 */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://sesan.agapet.co.kr",
} as const;

export const CTA_LABEL = "파양·입양 상담";
export const CTA_LABEL_CALL = "전화문의";
