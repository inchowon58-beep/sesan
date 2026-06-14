export const siteUrl = "https://ulsanshelter.vercel.app";

export const targetKeywords = [
  "인천강아지파양",
  "인천강아지보호소",
  "인천유기견보호소",
  "인천유기견센터",
  "인천유기견보호센터",
  "강아지무료분양",
  "유기동물보호소",
] as const;

export const siteTitle =
  "인천강아지파양 | 인천유기견보호소·인천강아지보호소 전문 안내";

export const siteDescription =
  "인천강아지파양·인천강아지보호소·인천유기견보호소 전문 상담센터입니다. 인천유기견센터·인천유기견보호센터 연계, 강아지무료분양·유기동물보호소 입양 안내. 전화 0505-707-0401";

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "인천강아지파양 안내",
        description: siteDescription,
        inLanguage: "ko-KR",
      },
      {
        "@type": "AnimalShelter",
        "@id": `${siteUrl}/#organization`,
        name: "인천강아지파양 · 인천유기견보호센터",
        url: siteUrl,
        description:
          "인천강아지보호소 및 인천유기견보호소 전문 상담. 인천유기견센터 연계 파양·강아지무료분양·유기동물보호소 안내.",
        telephone: "0505-707-0401",
        areaServed: {
          "@type": "City",
          name: "인천광역시",
        },
        knowsAbout: [...targetKeywords],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "인천강아지파양은 어떤 경우에 이용하나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "이사, 알레르기, 경제적 사정 등 부득이한 사유로 직접 돌보기 어려울 때 인천유기견보호소·인천강아지보호소 상담을 통해 이용하실 수 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "인천유기견센터와 인천유기견보호센터 차이는 무엇인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "인천유기견센터는 유기견 통합 관리 기관이며, 인천유기견보호센터는 실제 보호·케어 시설입니다. 본 센터는 두 기관과 연계해 파양·입양을 안내합니다.",
            },
          },
          {
            "@type": "Question",
            name: "강아지무료분양은 어떻게 진행되나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "유기동물보호소에서 건강 상태와 성격 평가를 마친 반려견을 책임 있는 가정에 강아지무료분양 형태로 연결합니다. 입양 전 상담과 사후 관리를 제공합니다.",
            },
          },
        ],
      },
    ],
  };
}
