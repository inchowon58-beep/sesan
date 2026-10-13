/**
 * 견종·묘종별 Gemini 문구 1회 생성 → src/data/breed-copy/{id}.json
 * 사용: node --env-file=.env.local tools/gen-all-breed-copy.mjs
 * FORCE=1 이면 기존 파일 덮어쓰기
 */
import fs from "fs";
import path from "path";

const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
if (!key) {
  console.error("GEMINI_API_KEY missing");
  process.exit(1);
}

const force = process.env.FORCE === "1";
const outDir = path.join(process.cwd(), "src", "data", "breed-copy");
fs.mkdirSync(outDir, { recursive: true });

/** breed-defs.ts 와 동일 id/label/category (스크립트 독립 실행용) */
const DEFS = [
  { id: "gangaji", category: "dog", label: "강아지" },
  { id: "white-terrier", category: "dog", label: "화이트테리어" },
  { id: "mini-bichon", category: "dog", label: "미니비숑" },
  { id: "bichon-frise", category: "dog", label: "비숑프리제" },
  { id: "boston-terrier", category: "dog", label: "보스턴테리어" },
  { id: "bernese", category: "dog", label: "버니즈마운틴독" },
  { id: "chow-chow", category: "dog", label: "차우차우" },
  { id: "chihuahua", category: "dog", label: "치와와" },
  { id: "cocker", category: "dog", label: "코카스파니엘" },
  { id: "golden-retriever", category: "dog", label: "골든리트리버" },
  { id: "coton", category: "dog", label: "꼬똥드툴레아" },
  { id: "longhair-dachshund", category: "dog", label: "장모닥스훈트" },
  { id: "dalmatian", category: "dog", label: "달마시안" },
  { id: "doberman", category: "dog", label: "도베르만" },
  { id: "goldendoodle", category: "dog", label: "골든두들" },
  { id: "bernedoodle", category: "dog", label: "버니두들" },
  { id: "mini-goldendoodle", category: "dog", label: "미니골든두들" },
  { id: "english-bulldog", category: "dog", label: "잉글리쉬불독" },
  { id: "french-bulldog", category: "dog", label: "프렌치불독" },
  { id: "italian-greyhound", category: "dog", label: "이탈리안그레이하운드" },
  { id: "malamute", category: "dog", label: "알래스칸말라뮤트" },
  { id: "maltese", category: "dog", label: "말티즈" },
  { id: "maltipoo", category: "dog", label: "말티푸" },
  { id: "minipin", category: "dog", label: "미니핀" },
  { id: "old-english-sheepdog", category: "dog", label: "올드잉글리쉬쉽독" },
  { id: "pekingese", category: "dog", label: "페키니즈" },
  { id: "pomeranian", category: "dog", label: "포메라니안" },
  { id: "pomsky", category: "dog", label: "폼스키" },
  { id: "labrador", category: "dog", label: "래브라도리트리버" },
  { id: "samoyed", category: "dog", label: "사모예드" },
  { id: "sheltie", category: "dog", label: "셔틀랜드쉽독" },
  { id: "shih-tzu", category: "dog", label: "시츄" },
  { id: "schnauzer", category: "dog", label: "슈나우저" },
  { id: "shiba", category: "dog", label: "시바이누" },
  { id: "toy-poodle", category: "dog", label: "토이푸들" },
  { id: "welsh-corgi", category: "dog", label: "웰시코기" },
  { id: "yorkie", category: "dog", label: "요크셔테리어" },
  { id: "goyang", category: "cat", label: "고양이" },
  { id: "abyssinian", category: "cat", label: "아비시니안" },
  { id: "american-shorthair", category: "cat", label: "아메리칸숏헤어" },
  { id: "bengal", category: "cat", label: "뱅갈고양이" },
  { id: "british-shorthair", category: "cat", label: "브리티쉬숏헤어" },
  { id: "maine-coon", category: "cat", label: "메인쿤" },
  { id: "munchkin", category: "cat", label: "먼치킨" },
  { id: "neva", category: "cat", label: "네바마스커레이드" },
  { id: "norwegian-forest", category: "cat", label: "노르웨이숲고양이" },
  { id: "persian", category: "cat", label: "페르시안고양이" },
  { id: "ragdoll", category: "cat", label: "랙돌" },
  { id: "russian-blue", category: "cat", label: "러시안블루" },
  { id: "scottish-fold", category: "cat", label: "스코티쉬폴드" },
  { id: "singapura", category: "cat", label: "싱가푸라" },
  { id: "sphynx", category: "cat", label: "스핑크스고양이" },
];

function promptFor(def) {
  const animal = def.category === "cat" ? "고양이" : "강아지";
  return `한국 반려동물 ${animal} 분양 랜딩용 문구 풀을 JSON만 출력.
대상: ${def.label} (${animal} 분양·입양 상담, 파양 보호소 톤 금지).
플레이스홀더: {kw} {brand} {phone} {region} {label}
스키마:
{
  "titles": string[8],
  "heroSubtitles": string[5],
  "heroLine2": string[6],
  "heroBadges": string[5],
  "missionH2": string[5],
  "leadIns": string[6],
  "services": [{"titles":string[3],"descTemplate":string}],
  "facilityH2": string[4],
  "facilityParas": string[3],
  "promiseTitleSets": string[3][3],
  "process": [{"title":string,"descTemplate":string}],
  "faqs": [{"questions":string[3],"answerTemplate":string}],
  "cta": string[5],
  "relatedSuffixes": string[8]
}
services 6개, process 4개, faqs 7개.
문구는 ${def.label} 특성(기질·케어·건강)을 반영하고, {label} 플레이스홀더를 적절히 사용.`;
}

async function generateOne(def) {
  const out = path.join(outDir, `${def.id}.json`);
  if (!force && fs.existsSync(out)) {
    console.log("skip", def.id);
    return { id: def.id, status: "skip" };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptFor(def) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    }),
  });
  const j = await res.json();
  if (j.error) {
    console.error("ERR", def.id, JSON.stringify(j.error).slice(0, 300));
    return { id: def.id, status: "error", error: j.error };
  }
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error("parse fail", def.id);
    return { id: def.id, status: "parse_error" };
  }
  if (!parsed.titles || !parsed.services || parsed.services.length < 6) {
    console.error("schema fail", def.id);
    return { id: def.id, status: "schema_error" };
  }
  fs.writeFileSync(out, JSON.stringify(parsed, null, 2), "utf8");
  console.log("ok", def.id, text.length);
  return { id: def.id, status: "ok" };
}

const concurrency = 3;
for (let i = 0; i < DEFS.length; i += concurrency) {
  const batch = DEFS.slice(i, i + concurrency);
  await Promise.all(batch.map(generateOne));
}
console.log("all done");
