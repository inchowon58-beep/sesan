import { SITE } from "./site";
import { pickImages } from "./images";
import type { SeoPage } from "./seo-pages";
import { slugifyKeyword } from "./seo-pages";

/**
 * 지역 키워드형 SEO 랜딩 페이지 생성기.
 *
 * ilsan(https://shelter.cattery.co.kr/ilsan) 구조 - 키워드 H1, 미션, 6개 서비스 스토리,
 * 보호시설, 3가지 약속, 4단계 절차, 7개 FAQ, 연락 CTA - 를 기준으로 삼되,
 * 더 촘촘한 섹션 구성과 관련 검색의도 섹션을 추가해 상회하는 것을 목표로 한다.
 *
 * 같은 키워드라도 pageIndex가 다르면 결과가 달라지도록, 문자열 해시 기반 시드로
 * 문구 배열에서 값을 고르고 중간 섹션 순서를 셔플한다 (로컬 대량 발행 시 중복 방지).
 */

/** 문자열 → 32bit 해시 */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** 시드 기반 의사난수 생성기 (서버/클라이언트 동일 결과) */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

/** 시드 고정 셔플 (Fisher-Yates) - 매 keyword/pageIndex 조합마다 다른 순서 */
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 한글 음절의 받침(종성) 유무 판별 - 조사(은/는, 을/를, 과/와) 선택용 */
function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function eunNeun(word: string): string {
  return hasBatchim(word) ? "은" : "는";
}
function eulReul(word: string): string {
  return hasBatchim(word) ? "을" : "를";
}
function gwaWa(word: string): string {
  return hasBatchim(word) ? "과" : "와";
}
/** 로/으로 - 받침 있으면 '으로', 없거나 'ㄹ' 받침이면 '로' */
function roEuro(word: string): string {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8) return "로"; // ㄹ받침
  return hasBatchim(word) ? "으로" : "로";
}

/**
 * {kw} 뒤에 붙는 조사를 키워드의 받침 유무에 맞게 자동 교정한다.
 * 문구 풀은 "{kw}는", "{kw}를", "{kw}와"처럼 자연스럽게 작성해 두면
 * 실제 치환 시점에 키워드에 맞는 조사(은/는, 을/를, 과/와)로 보정된다.
 */
function fill(template: string, kw: string, brand: string, phone: string): string {
  return template
    .replace(/\{kw\}(는|은)/g, `${kw}${eunNeun(kw)}`)
    .replace(/\{kw\}(를|을)/g, `${kw}${eulReul(kw)}`)
    .replace(/\{kw\}(와|과)/g, `${kw}${gwaWa(kw)}`)
    .replace(/\{kw\}(로|으로)/g, `${kw}${roEuro(kw)}`)
    .replace(/\{kw\}/g, kw)
    .replace(/\{brand\}/g, brand)
    .replace(/\{phone\}/g, phone);
}

/* ------------------------------------------------------------------ */
/* 문구 풀 - 시드에 따라 조합이 달라져 페이지마다 다른 본문을 만든다     */
/* ------------------------------------------------------------------ */

const TONE_WORDS = ["차분하게", "꼼꼼하게", "따뜻하게", "세심하게", "신중하게"] as const;
const VERB_WORDS = ["안내", "상담", "조율"] as const;

const HERO_SUBTITLES = [
  "Nationwide Surrender Care · Free Adoption Matching",
  "전국 어디서나, 이별 뒤에도 좋은 인연은 이어집니다",
  "Safe Intake, Warm Match - {brand}",
  "책임감 있는 파양 상담과 무료분양 매칭",
  "Every Goodbye Finds a New Beginning",
  "전국파양입소 · 무료분양 전문 상담",
  "A Safe Next Home for Every Dog",
] as const;

const HERO_LINE2_POOL = [
  "새 가족을 만나요",
  "이별 뒤에도 좋은 인연은 이어집니다",
  "전국 어디서나 함께 걷습니다",
  "따뜻한 다음 걸음을 함께합니다",
  "혼자 고민하지 마세요",
] as const;

const HERO_BADGE_POOL = [
  "전국파양입소 · {brand}",
  "전국 무료분양 · {brand}",
  "24시간 전화상담 · {brand}",
  "안락사 없는 보호 · {brand}",
] as const;

const LEAD_INS = [
  "{kw}를 고민 중이시라면, 혼자 결정하지 마시고 먼저 전화로 상황을 나눠보세요.",
  "{kw} 검색으로 이 페이지를 찾으셨다면, 지금이 가장 정확한 정보를 확인할 때입니다.",
  "{kw}는 아이와 보호자님 모두에게 신중함이 필요한 과정입니다. {brand}가 함께합니다.",
  "{kw}를 알아보고 계신 보호자님께, 전국 어디서든 가능한 상담 방법을 안내드립니다.",
  "{kw}, 급하게 결정하지 않으셔도 됩니다. 전화 한 통으로 절차부터 천천히 확인하세요.",
] as const;

const MISSION_H2 = [
  "{kw}, 외로운 결정이 되지 않도록 함께합니다",
  "{kw}, 왜 {brand} 상담이 필요할까요",
  "{kw}, 신중하게 그러나 망설이지 않도록",
  "{kw}를 고민하는 보호자님께 드리는 안내",
  "믿을 수 있는 {kw} 상담, {brand}가 함께합니다",
  "{kw} 전, 꼭 확인해야 할 것들",
] as const;

const FACILITY_H2 = [
  "{kw} 보호·시설 안내",
  "안전하게 지내는 {brand} 보호 환경",
  "{kw} 이후, 아이가 머무는 보호 공간",
  "청결하고 안전한 {brand}의 보호 시설",
] as const;

const RELATED_H2 = [
  "{kw}와 함께 찾는 검색어",
  "{kw} 보호자님이 함께 확인하는 정보",
  "{kw} 관련 검색 의도 모아보기",
  "{kw}만큼 자주 찾는 키워드",
] as const;

const SERVICES_H2 = [
  "{brand}의 핵심 서비스 6가지",
  "{kw} 상담부터 매칭까지, {brand} 서비스 안내",
  "{kw} 이후 이어지는 {brand}의 케어 단계",
] as const;

const PROMISE_TITLE_SETS = [
  ["따뜻하게", "오래", "솔직하게"],
  ["세심하게", "끝까지", "투명하게"],
  ["신중하게", "꾸준히", "정직하게"],
  ["차분하게", "책임감 있게", "명확하게"],
] as const;

const PROMISE_H2 = [
  "{brand}의 세 가지 약속",
  "{kw} 상담에서 지키는 세 가지 약속",
  "한 번도 깨진 적 없는 세 가지 약속",
] as const;

const PROCESS_H2 = [
  "{kw} 진행 4단계",
  "처음이라 어려우신가요? 4단계로 안내합니다",
  "{brand}와 함께하는 4단계 절차",
] as const;

const CTA_TEMPLATES = [
  "{kw} 상담은 전화 한 통이면 충분합니다 - {phone} · {brand}",
  "파양·입양 상담 {phone} - {brand}",
  "{kw}, 지금 바로 {phone}로 문의하세요 - {brand}",
  "혼자 고민하지 마세요. {phone} · {brand}가 함께합니다",
] as const;

const TITLE_TEMPLATES = [
  "{kw} | {brand} 전국 파양입소·무료분양 상담",
  "{kw} 안내 | {brand} - 전국 어디서나 파양·분양",
  "{brand} {kw} - 전국파양입소 · 무료분양 매칭",
] as const;

const RELATED_SUFFIXES = [
  "보호소",
  "무료분양",
  "입양",
  "보호센터",
  "임시보호",
  "분양문의",
  "유기견센터",
] as const;

const GENERIC_RELATED = [
  "강아지무료분양",
  "유기견입양",
  "전국파양입소",
  "강아지보호소",
  "반려견파양상담",
] as const;

/* ------------------------------------------------------------------ */
/* 6가지 핵심 서비스 - 파양상담·보호소연계·입소케어·무료분양매칭·방문픽업·사후안내 */
/* ------------------------------------------------------------------ */

type ServiceDef = {
  key: string;
  titles: readonly string[];
  desc: (kw: string, brand: string, phone: string, tone: string) => string;
};

const SERVICE_DEFS: readonly ServiceDef[] = [
  {
    key: "counsel",
    titles: ["{kw} 파양 상담", "{kw} 전화 상담", "{kw} 1:1 사전 상담"],
    desc: (kw, brand, phone, tone) =>
      `갑작스러운 상황으로 ${kw}${eulReul(kw)} 고민하신다면, ${brand}가 사정을 ${tone} 듣고 절차와 준비물을 안내합니다. 상담 신청서 없이 전화(${phone}) 한 통이면 충분합니다.`,
  },
  {
    key: "shelterLink",
    titles: ["보호소 연계 안내", "전국 보호소 네트워크 연계", "협력 보호소 매칭"],
    desc: (kw, brand) =>
      `${kw} 이후에는 전국 협력 보호소와 연계해 아이가 안심할 수 있는 환경에서 지낼 수 있도록 돕습니다. 특정 지역에 국한되지 않고 전국 어디서나 연계가 가능합니다.`,
  },
  {
    key: "intakeCare",
    titles: ["입소 케어", "입소 후 건강·일상 케어", "입소 케어 프로그램"],
    desc: (kw, brand, _phone, tone) =>
      `입소 후에는 건강 상태 확인, 목욕, 산책 등 일상 케어를 ${tone} 이어가며, ${kw} 이후 아이가 겪을 수 있는 스트레스를 최소화합니다.`,
  },
  {
    key: "freeAdoptionMatch",
    titles: ["무료분양 매칭", "책임 입양 매칭", "새 가족 매칭 프로그램"],
    desc: (kw, brand) =>
      `보호 중인 아이는 생활 환경과 반려 의지를 확인하는 사전 상담을 거쳐, 책임감 있는 가정과 무료분양으로 연결됩니다. ${kw} 문의도 같은 절차로 진행됩니다.`,
  },
  {
    key: "pickup",
    titles: ["방문 픽업 조율", "전국 방문 픽업 안내", "일정 맞춤 픽업"],
    desc: (kw, brand) =>
      `거동이 어렵거나 이동이 힘든 경우 일정을 맞춰 방문 픽업을 조율합니다. ${kw} 절차 중 이동 문제로 고민하지 않으셔도 됩니다.`,
  },
  {
    key: "afterCare",
    titles: ["사후 안내 및 안부 확인", "입양 후 사후 관리", "꾸준한 안부 확인"],
    desc: (kw, brand) =>
      `입양 이후에도 새 가정과 정기적으로 안부를 확인하며, ${kw}${roEuro(kw)} 시작된 인연이 끝까지 책임감 있게 이어지도록 ${brand}가 돕습니다.`,
  },
];

/* ------------------------------------------------------------------ */
/* FAQ 풀 - 질문 배리에이션 + 답변                                     */
/* ------------------------------------------------------------------ */

type FaqDef = {
  questions: readonly string[];
  answer: (kw: string, brand: string, phone: string) => string;
};

const FAQ_DEFS: readonly FaqDef[] = [
  {
    questions: [
      "{kw} 상담은 어떻게 하나요?",
      "{kw} 문의는 어떤 방법으로 하나요?",
      "{kw} 상담 신청은 어떻게 진행되나요?",
    ],
    answer: (kw, brand, phone) =>
      `상담 폼 없이 ${phone} 전화로만 접수합니다. 견종·나이·${kw} 사유를 알려주시면 ${brand}가 절차와 준비 사항을 안내합니다.`,
  },
  {
    questions: [
      "{kw}는 전국 어디서나 가능한가요?",
      "{kw} 상담을 받으려면 방문해야 하나요?",
      "지방에서도 {kw} 상담이 가능한가요?",
    ],
    answer: (kw, brand) =>
      `가능합니다. ${brand}는 전국파양입소 및 무료분양을 원칙으로 하며, 거주 지역과 관계없이 전화 상담과 방문 픽업 조율을 지원합니다.`,
  },
  {
    questions: [
      "무료분양은 어떤 절차로 진행되나요?",
      "{kw} 이후 무료분양 절차가 궁금해요",
      "새 가족 매칭은 어떻게 이뤄지나요?",
    ],
    answer: (kw, brand) =>
      `보호중인 아이 확인 후 전화 상담을 통해 생활 환경과 반려 의지를 확인하고, 책임감 있는 입양을 위한 매칭을 진행합니다.`,
  },
  {
    questions: [
      "{kw} 전 준비물이 있나요?",
      "입소 전 미리 챙겨야 할 것이 있나요?",
      "{kw} 입소 시 필요한 서류가 있나요?",
    ],
    answer: (kw, brand) =>
      `별도 서류는 필요 없습니다. 다만 접종·건강 기록이 있다면 상담 시 함께 안내해 주시면 ${kw} 이후 케어 계획을 세우는 데 도움이 됩니다.`,
  },
  {
    questions: [
      "견종이나 나이 제한이 있나요?",
      "{kw} 상담에 견종 제한이 있나요?",
      "노령견도 {kw} 상담이 가능한가요?",
    ],
    answer: (kw, brand) =>
      `견종과 나이에 관계없이 문의하실 수 있습니다. ${brand}는 소형견부터 대형견, 노령견까지 상황에 맞춰 상담해 드립니다.`,
  },
  {
    questions: [
      "입양 후에도 연락이 가능한가요?",
      "매칭 이후 사후관리도 해주시나요?",
      "{kw} 이후에도 안부를 확인할 수 있나요?",
    ],
    answer: (kw, brand) =>
      `네, 새 가정과의 사후 관리를 위해 정기적으로 안부를 확인합니다. ${kw}${roEuro(kw)} 이어진 인연이 새 가정에서도 잘 지낼 수 있도록 지속적으로 지원합니다.`,
  },
  {
    questions: [
      "방문 픽업도 가능한가요?",
      "이동이 어려운 경우 어떻게 하나요?",
      "{kw} 진행 중 방문 픽업 요청이 가능한가요?",
    ],
    answer: (kw, brand, phone) =>
      `거동이 어렵거나 이동 수단이 없는 경우 일정을 조율해 방문 픽업을 도와드립니다. ${phone}으로 상황을 말씀해 주세요.`,
  },
];

/* ------------------------------------------------------------------ */
/* 메인 생성 함수                                                      */
/* ------------------------------------------------------------------ */

export function generateRegionalSeoPage(keyword: string, pageIndex = 1): SeoPage {
  const kw = keyword.trim() || "강아지파양";
  const brand = SITE.brand;
  const phone = SITE.phone;
  const seed = hash(`${kw}|${pageIndex}|${brand}`);
  const seed2 = hash(`${kw}|${pageIndex}|v2`);
  const seed3 = hash(`${kw}|${pageIndex}|v3`);

  const tone = pick(TONE_WORDS, seed);
  const tone2 = pick(TONE_WORDS, seed2);
  const verb = pick(VERB_WORDS, seed);

  const t = (template: string) => fill(template, kw, brand, phone);

  /* ---------- 메타 / 히어로 ---------- */
  const title = t(pick(TITLE_TEMPLATES, seed));
  const metaDescription = `${kw} 안내 - ${brand}는 전국 어디서나 강아지 파양 ${verb}부터 무료분양 매칭까지 책임집니다. 이민·이사·건강 문제 등 피치 못한 사정도 ${tone} 들어드립니다. 문의 ${phone}. 전국파양입소·무료분양 가능.`;
  const relatedIntents = seededShuffle(
    [
      ...RELATED_SUFFIXES.map((s) => `${kw} ${s}`),
      ...GENERIC_RELATED,
    ],
    seed3
  ).slice(0, 8);
  const metaKeywords = [kw, brand, ...relatedIntents.slice(0, 6), "전국파양입소", "강아지입양"]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 12)
    .join(", ");

  const h1 = `${kw} - ${brand} 전국 파양입소·무료분양 상담`;
  const heroTitleLine1 = kw;
  const heroTitleLine2 = pick(HERO_LINE2_POOL, seed2);
  const heroBadge = t(pick(HERO_BADGE_POOL, seed3));
  const heroSubtitle = t(pick(HERO_SUBTITLES, seed));
  const heroBar = `${kw} 상담, 전국 어디서나 ${phone}`;

  /* ---------- 섹션 1: 소개 / 미션 ---------- */
  const leadIn = t(pick(LEAD_INS, seed2));
  const missionSection = {
    h2: t(pick(MISSION_H2, seed)),
    paragraphs: [
      leadIn,
      `${kw}${eunNeun(kw)} 단순한 이별이 아니라 아이의 다음 삶을 책임지는 중요한 결정입니다. ${brand}는 보호자님의 힘든 선택을 ${tone} 존중하며, 아이가 안전하게 새 가족을 만날 수 있도록 상담부터 매칭까지 함께합니다.`,
      `이민·이사·건강 문제·주거 변경 등 피치 못한 사정으로 ${kw}${eulReul(kw)} 고민하신다면, 절차와 준비물을 먼저 전화로 ${verb}받으실 수 있습니다. 상담 신청서 없이 전화 한 통으로 충분합니다.`,
      `무리한 파양은 아이에게도 큰 스트레스가 됩니다. ${brand}는 입소 전 건강 상태와 성향을 확인하고, 위생적인 환경에서 아이 중심의 케어를 이어갑니다. ${kw} 문의는 ${phone}로 안내드립니다.`,
    ],
  };

  /* ---------- 핵심 서비스 6개 (순서는 시드 셔플, 처음/끝 고정) ---------- */
  const middleServices = seededShuffle(SERVICE_DEFS.slice(1, 5), seed);
  const orderedServices = [SERVICE_DEFS[0], ...middleServices, SERVICE_DEFS[5]];
  const services = orderedServices.map((svc, i) => ({
    title: t(pick(svc.titles, seed + i * 7)),
    description: svc.desc(kw, brand, phone, i % 2 === 0 ? tone : tone2),
  }));
  const servicesTitle = t(pick(SERVICES_H2, seed));
  const servicesIntro = `${kw} 문의 시 ${brand}가 제공하는 핵심 서비스 6가지를 순서대로 확인해 보세요. 상담부터 사후 관리까지 하나의 흐름으로 이어집니다.`;

  /* ---------- 섹션 2: 보호·시설 안내 ---------- */
  const facilitySection = {
    h2: t(pick(FACILITY_H2, seed2)),
    paragraphs: [
      `${brand}는 특정 지역 매장 주소 없이 전국파양입소 및 무료분양 기준으로 운영합니다. ${kw} 상담 후 입소가 확정되면, 전국 협력 보호소 네트워크를 통해 깨끗하고 안전한 보호 공간에서 아이를 케어합니다.`,
      `입소 후에는 산책·목욕·건강 상태 확인 등 일상 케어를 ${tone} 이어가며, 성향과 생활 환경을 고려한 새 가족 매칭을 진행합니다. 무료분양은 책임감 있는 입양을 위해 사전 상담을 거칩니다.`,
      `보호자님이 가장 궁금해하시는 절차·비용·일정은 전화로 투명하게 ${verb}합니다. ${kw}${eulReul(kw)} 계기로 만난 인연이 아이와 사람 모두에게 안전한 다음 걸음이 되도록 최선을 다합니다.`,
    ],
  };

  /* ---------- 세 가지 약속 ---------- */
  const promiseTitles = pick(PROMISE_TITLE_SETS, seed);
  const promiseDescs = [
    `${kw} 상담은 보호자님의 마음을 먼저 헤아립니다. 아이와 사람 모두를 위한 방법을 함께 찾습니다.`,
    `입소 이후에도 일상 케어, 무료분양 매칭 연계, 사후 안부 확인까지 꾸준히 지원합니다.`,
    `보호 과정과 절차를 명확히 알려 드립니다. ${kw} 상담부터 매칭까지 투명한 운영이 신뢰의 시작입니다.`,
  ];
  const promises = promiseTitles.map((title, i) => ({
    title,
    description: promiseDescs[i],
  }));
  const promisesTitle = t(pick(PROMISE_H2, seed2));

  /* ---------- 4단계 절차 ---------- */
  const processTitle = t(pick(PROCESS_H2, seed3));
  const processSteps = [
    {
      step: "01",
      title: "전화 상담",
      description: `${kw} 상담 전화(${phone})로 연락 주세요. 아이의 나이, 성격, 파양 사유를 비밀 보장 하에 편안하게 상담해 드립니다.`,
    },
    {
      step: "02",
      title: "맞춤 절차 안내",
      description: `보호자님 상황에 맞는 입소·보호 방법을 ${tone} 설명합니다. 급하지 않게 아이에게 가장 나은 길을 함께 고릅니다.`,
    },
    {
      step: "03",
      title: "입소",
      description: `전국 협력 보호소 연계 공간에 입소하면 정서 안정과 일상 케어가 시작됩니다. ${kw} 이후 건강 확인도 함께 진행됩니다.`,
    },
    {
      step: "04",
      title: "입양 매칭",
      description: `준비가 되면 책임 있는 가정에 무료분양을 연계합니다. ${kw} 이후에도 입양 가정과의 안부 확인을 이어갑니다.`,
    },
  ];

  /* ---------- 관련 검색 의도 섹션 ---------- */
  const relatedSection = {
    h2: t(pick(RELATED_H2, seed3)),
    paragraphs: [
      `${kw}${eulReul(kw)} 찾아보신 분들은 ${relatedIntents.slice(0, 3).join(", ")} 등도 함께 확인합니다. ${brand}는 이런 궁금증에도 전화 한 통으로 답해 드립니다.`,
      `아래 키워드는 ${kw}${gwaWa(kw)} 함께 자주 검색되는 관련 검색어입니다. 궁금한 항목이 있다면 상담 시 함께 문의해 주세요.`,
    ],
  };

  /* ---------- FAQ 6~7개 (질문 배리에이션) ---------- */
  const faqCount = 6 + (seed % 2); // 6 또는 7
  const faqOrder = seededShuffle(
    FAQ_DEFS.map((_, i) => i),
    seed2
  ).slice(0, faqCount);
  const faqs = faqOrder.map((defIndex) => {
    const def = FAQ_DEFS[defIndex];
    const q = t(pick(def.questions, seed + defIndex * 5));
    return { q, a: def.answer(kw, brand, phone) };
  });

  const ctaText = t(pick(CTA_TEMPLATES, seed));

  const sections: SeoPage["sections"] = [missionSection, facilitySection, relatedSection];

  const now = new Date().toISOString();
  return {
    slug: slugifyKeyword(kw, `r${pageIndex}${seed.toString(36).slice(0, 4)}`),
    keyword: kw,
    title,
    metaDescription,
    metaKeywords,
    h1,
    heroSubtitle,
    heroBadge,
    heroTitleLine1,
    heroTitleLine2,
    heroBar,
    sections,
    faqs,
    images: pickImages(6, seed),
    ctaText,
    services,
    servicesTitle,
    servicesIntro,
    promises,
    promisesTitle,
    processSteps,
    processTitle,
    relatedIntents,
    createdAt: now,
    updatedAt: now,
  };
}
