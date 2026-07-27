import { GoogleGenerativeAI } from "@google/generative-ai";
import { SITE } from "./site";
import { pickImages } from "./images";
import type { SeoPage } from "./seo-pages";
import { slugifyKeyword } from "./seo-pages";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * ilsan(https://shelter.cattery.co.kr/ilsan) 스타일의 지역 랜딩 페이지 —
 * 키워드 H1, 미션, 6개 서비스, 보호시설, 3가지 약속, 4단계 절차, 7개 FAQ —
 * 를 기준으로, 그보다 더 촘촘한 구조(관련 검색의도 섹션 추가)를 Gemini에게 요구한다.
 * JSON 스키마는 src/lib/regional-seo.ts 의 로컬 생성기와 동일한 SeoPage 필드에 매핑된다.
 */
function buildPrompt(keyword: string): string {
  return `당신은 '${SITE.brand}'(${SITE.nameEn})의 SEO·AEO 웹문서 작성 전문가입니다.
업체명은 반드시 '${SITE.brand}'만 사용하세요. 카카오톡·인스타그램·특정 주소·지점명은 절대 언급하지 마세요.

메인 키워드: ${keyword}
전화: ${SITE.phone}
서비스 지역: 전국(주소 없음, 전국파양입소 및 무료분양)
주제: 강아지 파양입소, 무료분양, 유기견 보호소, 새 가족 매칭, 입소 후 케어. 견종 구분 없이 전 견종 상담 가능.

아래처럼 "지역 랜딩 페이지"급 구조로, 아래 JSON만 출력하세요. 설명·마크다운 금지, 순수 JSON만.

{
  "title": "60자 내. '${keyword}' + ${SITE.brand} 포함. 검색용 타이틀",
  "metaDescription": "140~160자. '${keyword}', 강아지파양, 무료분양, 전화 유도, 전국파양입소",
  "metaKeywords": "${keyword} 포함 8~12개, 지역/의도 관련어 포함, 쉼표 구분",
  "h1": "키워드 '${keyword}' 포함, 감성적인 한 문장 H1",
  "heroTitleLine1": "히어로 1줄: 보통 '${keyword}' 그대로 또는 축약",
  "heroTitleLine2": "히어로 2줄: 감성적인 짧은 문구 (예: 새 가족을 만나요)",
  "heroBadge": "짧은 배지 문구 (예: 전국파양입소 · ${SITE.brand})",
  "heroSubtitle": "영문 짧은 부제 또는 한영 혼합 한 문장",
  "heroBar": "히어로 하단 짧은 강조 문장 (전화번호 없이)",
  "sections": [
    {"h2": "소개/미션 — '${keyword}, 왜 상담이 필요한가' 톤, 키워드 포함", "paragraphs": ["180자+", "160자+", "160자+"]},
    {"h2": "보호·시설 안내 — 전국 보호 환경, 주소 없이", "paragraphs": ["160자+", "160자+", "140자+"]},
    {"h2": "관련 검색 의도 — '${keyword}'와 함께 찾는 키워드 소개", "paragraphs": ["140자+", "120자+"]}
  ],
  "servicesTitle": "핵심 서비스 섹션 소제목 (예: ${SITE.brand}의 핵심 서비스 6가지)",
  "servicesIntro": "핵심 서비스 6가지를 소개하는 1문장 리드",
  "services": [
    {"title": "'${keyword}' 파양 상담류 제목", "description": "80자+, 키워드 자연 포함"},
    {"title": "보호소 연계 안내류 제목", "description": "80자+"},
    {"title": "입소 케어류 제목", "description": "80자+"},
    {"title": "무료분양 매칭류 제목", "description": "80자+"},
    {"title": "방문 픽업 조율류 제목", "description": "80자+"},
    {"title": "사후 안내·안부 확인류 제목", "description": "80자+"}
  ],
  "promisesTitle": "약속 섹션 소제목 (예: ${SITE.brand}의 세 가지 약속)",
  "promises": [
    {"title": "약속 키워드 1 (예: 따뜻하게/차분하게/세심하게 중 택1)", "description": "60자+, 키워드 포함 가능"},
    {"title": "약속 키워드 2 (예: 오래/끝까지/꾸준히 중 택1)", "description": "60자+"},
    {"title": "약속 키워드 3 (예: 솔직하게/투명하게/정직하게 중 택1)", "description": "60자+"}
  ],
  "processTitle": "절차 섹션 소제목 (예: '${keyword}' 진행 4단계)",
  "processSteps": [
    {"step": "01", "title": "전화 상담", "description": "80자+, 전화번호 ${SITE.phone} 포함"},
    {"step": "02", "title": "맞춤 절차 안내", "description": "80자+"},
    {"step": "03", "title": "입소", "description": "80자+"},
    {"step": "04", "title": "입양 매칭", "description": "80자+"}
  ],
  "relatedIntents": ["'${keyword}'와 함께 검색되는 관련어 6~8개, 배열"],
  "faqs": [
    {"q": "질문1 — '${keyword}' 포함", "a": "답변 80자+"},
    {"q": "질문2", "a": "답변 80자+"},
    {"q": "질문3 — '${keyword}' 포함", "a": "답변 80자+"},
    {"q": "질문4", "a": "답변 80자+"},
    {"q": "질문5", "a": "답변 80자+"},
    {"q": "질문6 — '${keyword}' 포함", "a": "답변 80자+"},
    {"q": "질문7(선택)", "a": "답변 80자+"}
  ],
  "ctaText": "파양·입양 상담 전화(${SITE.phone}) 유도 문장"
}

요구사항:
- 과장·허위 금지. 주소·지점 언급 금지(전국 서비스, 전국파양입소·무료분양 강조).
- FAQ는 최소 6개, 가능하면 7개. AEO(질문형) 형태를 지키세요.
- 본문 전체에 '${keyword}'를 자연스럽게 반복하되 스팸처럼 남발하지 마세요(문단당 1~2회 수준).
- 문장은 신뢰감 있고 따뜻한 톤으로, 실제 지역 보호소 랜딩 페이지 수준의 밀도로 작성하세요.`;
}

type GeminiSeoPartial = Omit<
  SeoPage,
  "slug" | "images" | "createdAt" | "updatedAt"
> & { keyword: string };

export async function generateWithGemini(
  keyword: string,
  apiKey?: string
): Promise<GeminiSeoPartial> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY가 없습니다.");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(buildPrompt(keyword));
  const text = result.response.text();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = (fence ? fence[1] : text).trim();
  const data = JSON.parse(jsonStr);

  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((v) => String(v)) : [];

  const asSections = (value: unknown): SeoPage["sections"] =>
    Array.isArray(value)
      ? value.map((s) => ({
          h2: String(s?.h2 || ""),
          paragraphs: asStringArray(s?.paragraphs),
        }))
      : [];

  const asServices = (value: unknown): NonNullable<SeoPage["services"]> =>
    Array.isArray(value)
      ? value.map((s) => ({
          title: String(s?.title || ""),
          description: String(s?.description || ""),
        }))
      : [];

  const asPromises = (value: unknown): NonNullable<SeoPage["promises"]> =>
    Array.isArray(value)
      ? value.map((s) => ({
          title: String(s?.title || ""),
          description: String(s?.description || ""),
        }))
      : [];

  const asProcessSteps = (value: unknown): NonNullable<SeoPage["processSteps"]> =>
    Array.isArray(value)
      ? value.map((s, i) => ({
          step: String(s?.step || String(i + 1).padStart(2, "0")),
          title: String(s?.title || ""),
          description: String(s?.description || ""),
        }))
      : [];

  const asFaqs = (value: unknown): SeoPage["faqs"] =>
    Array.isArray(value)
      ? value.map((f) => ({ q: String(f?.q || ""), a: String(f?.a || "") }))
      : [];

  return {
    keyword,
    title: String(data.title || `${keyword} | ${SITE.name}`),
    metaDescription: String(data.metaDescription || SITE.description),
    metaKeywords: String(data.metaKeywords || keyword),
    h1: String(data.h1 || keyword),
    heroSubtitle: String(data.heroSubtitle || SITE.taglineEn),
    heroTitleLine1: data.heroTitleLine1 ? String(data.heroTitleLine1) : keyword,
    heroTitleLine2: data.heroTitleLine2 ? String(data.heroTitleLine2) : "새 가족을 만나요",
    heroBadge: data.heroBadge ? String(data.heroBadge) : `전국파양입소 · ${SITE.brand}`,
    heroBar: data.heroBar ? String(data.heroBar) : `${keyword} 상담, 전국 어디서나 ${SITE.phone}`,
    sections: asSections(data.sections),
    servicesTitle: data.servicesTitle ? String(data.servicesTitle) : undefined,
    servicesIntro: data.servicesIntro ? String(data.servicesIntro) : undefined,
    services: asServices(data.services),
    promisesTitle: data.promisesTitle ? String(data.promisesTitle) : undefined,
    promises: asPromises(data.promises),
    processTitle: data.processTitle ? String(data.processTitle) : undefined,
    processSteps: asProcessSteps(data.processSteps),
    relatedIntents: asStringArray(data.relatedIntents),
    faqs: asFaqs(data.faqs),
    ctaText: String(data.ctaText || `${SITE.phone}로 파양·입양 상담`),
  };
}

export function assembleSeoPage(
  partial: Awaited<ReturnType<typeof generateWithGemini>>,
  slug?: string
): SeoPage {
  const now = new Date().toISOString();
  return {
    slug: slug || slugifyKeyword(partial.keyword),
    keyword: partial.keyword,
    title: partial.title,
    metaDescription: partial.metaDescription,
    metaKeywords: partial.metaKeywords,
    h1: partial.h1,
    heroSubtitle: partial.heroSubtitle,
    heroTitleLine1: partial.heroTitleLine1,
    heroTitleLine2: partial.heroTitleLine2,
    heroBadge: partial.heroBadge,
    heroBar: partial.heroBar,
    sections: partial.sections,
    servicesTitle: partial.servicesTitle,
    servicesIntro: partial.servicesIntro,
    services: partial.services,
    promisesTitle: partial.promisesTitle,
    promises: partial.promises,
    processSteps: partial.processSteps,
    processTitle: partial.processTitle,
    relatedIntents: partial.relatedIntents,
    faqs: partial.faqs,
    images: pickImages(6, Date.now() % 100000),
    ctaText: partial.ctaText,
    createdAt: now,
    updatedAt: now,
  };
}
