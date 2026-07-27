import { SITE } from "./site";

export type FaqItem = { q: string; a: string };

/** 메인·AEO용 자주 묻는 질문 */
export const HOME_FAQS: FaqItem[] = [
  {
    q: "강아지 파양은 어떻게 진행되나요?",
    a: "전화 상담으로 파양 사유와 아이의 나이·건강 상태를 먼저 확인합니다. 이후 일정을 조율해 입소 방법(방문 또는 담당자 방문 픽업)과 절차·비용을 투명하게 안내드립니다. 상담 신청서 없이 전화 한 통이면 충분합니다.",
  },
  {
    q: "전국 어디서나 파양 입소 상담이 가능한가요?",
    a: "네, 달빛쉘터는 특정 지역 매장 없이 전국파양입소 및 무료분양 서비스를 운영합니다. 거주 지역과 관계없이 전화(010-9906-4068)로 상담하시면 가까운 방문 픽업 또는 이동 방법을 함께 안내해 드립니다.",
  },
  {
    q: "무료분양은 정말 비용이 없나요?",
    a: "보호중인 아이를 새 가족에게 연결하는 무료분양은 별도 분양 비용을 받지 않습니다. 다만 책임감 있는 입양을 위해 보호자님의 생활 환경과 반려 의지를 확인하는 사전 상담 절차는 반드시 진행합니다.",
  },
  {
    q: "파양을 결정하기 전에 꼭 확인해야 할 것이 있나요?",
    a: "이민·이사·건강·주거 문제 등 정말 불가피한 상황인지 먼저 점검해 주세요. 그래도 어려운 경우라면 혼자 고민하지 마시고 전화 상담을 통해 아이에게 가장 안전한 다음 걸음을 함께 찾아드립니다.",
  },
  {
    q: "보호중인 아이는 어떻게 확인할 수 있나요?",
    a: "홈페이지의 '보호중인 아이들' 섹션에서 현재 새 가족을 기다리는 아이들을 확인할 수 있습니다. 마음에 드는 아이가 있다면 전화 상담 후 매칭 절차를 안내해 드립니다.",
  },
  {
    q: "입소 후 아이는 어떻게 관리되나요?",
    a: "입소 후에는 산책·목욕·식사·기본 건강 상태 확인 등 아이 중심의 일상 케어를 진행합니다. 새 가족과 매칭될 때까지 안전하게 보호하며, 필요한 경우 근황도 안내해 드립니다.",
  },
];

export function faqJsonLd(faqs: FaqItem[] = HOME_FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** 특정 주소 없는 전국 서비스 — Organization + ContactPoint (LocalBusiness/PostalAddress 미사용) */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.nameEn,
    description: SITE.description,
    url: SITE.siteUrl,
    telephone: SITE.phone,
    image: `${SITE.siteUrl}${SITE.logo}`,
    areaServed: "KR",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: "KR",
        availableLanguage: ["Korean"],
      },
    ],
  };
}
