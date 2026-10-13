/**
 * 분양 전용 견종·묘종 정의.
 * 기존 public/seo-data·/guide와 완전 분리.
 */

export type BreedCategory = "dog" | "cat";

export type BreedDef = {
  /** copy JSON 파일명 (src/data/breed-copy/{id}.json) */
  id: string;
  category: BreedCategory;
  /** 표시용 짧은 이름 */
  label: string;
  /** 페이지 키워드(intent) — 지역+intent / 전국 intent */
  intents: readonly string[];
  imageBase: string;
  imageCount: number;
};

const counts = {
  Newwhiteterrier: 11,
  bishone: 20,
  bosten: 5,
  bunyz: 12,
  chauchau: 6,
  chihuahua: 20,
  coca: 10,
  coldenret: 10,
  coton: 30,
  daks: 23,
  dalma: 21,
  doberman: 6,
  doodle: 40,
  engbuldog: 6,
  frenchi: 27,
  italian: 10,
  malamute: 5,
  maltese: 25,
  maltipoo: 26,
  minipin: 11,
  oldbig: 12,
  pekinee: 27,
  pome: 66,
  pomsky: 50,
  rabriter: 8,
  samoyed: 16,
  selti: 80,
  shichu: 24,
  shuna: 10,
  siba: 19,
  toypoodle: 33,
  welshi: 16,
  yoki: 12,
  abisinan: 20,
  american: 18,
  bnagal: 20,
  british: 80,
  maincoon: 59,
  mcnchikin: 66,
  neva: 57,
  norwe: 25,
  perisian: 13,
  ragdoll: 57,
  rusian: 17,
  scottish: 19,
  singa: 19,
  spinkix: 20,
} as const;

function cdn(folder: keyof typeof counts): Pick<BreedDef, "imageBase" | "imageCount"> {
  return {
    imageBase: `https://image.cattery.co.kr/${folder}`,
    imageCount: counts[folder],
  };
}

/** 강아지·고양이 분양 전체 정의 (제미나이 copy 1개 / def) */
export const BREED_DEFS: readonly BreedDef[] = [
  {
    id: "gangaji",
    category: "dog",
    label: "강아지",
    intents: ["강아지분양"],
    ...cdn("pome"),
  },
  {
    id: "white-terrier",
    category: "dog",
    label: "화이트테리어",
    intents: ["화이트테리어분양"],
    ...cdn("Newwhiteterrier"),
  },
  {
    id: "mini-bichon",
    category: "dog",
    label: "미니비숑",
    intents: ["미니비숑분양"],
    ...cdn("bishone"),
  },
  {
    id: "bichon-frise",
    category: "dog",
    label: "비숑프리제",
    intents: ["비숑프리제분양"],
    ...cdn("bishone"),
  },
  {
    id: "boston-terrier",
    category: "dog",
    label: "보스턴테리어",
    intents: ["보스턴테리어분양"],
    ...cdn("bosten"),
  },
  {
    id: "bernese",
    category: "dog",
    label: "버니즈마운틴독",
    intents: ["버니즈마운틴독분양"],
    ...cdn("bunyz"),
  },
  {
    id: "chow-chow",
    category: "dog",
    label: "차우차우",
    intents: ["차우차우분양"],
    ...cdn("chauchau"),
  },
  {
    id: "chihuahua",
    category: "dog",
    label: "치와와",
    intents: ["치와와분양"],
    ...cdn("chihuahua"),
  },
  {
    id: "cocker",
    category: "dog",
    label: "코카스파니엘",
    intents: ["코카스파니엘분양"],
    ...cdn("coca"),
  },
  {
    id: "golden-retriever",
    category: "dog",
    label: "골든리트리버",
    intents: ["골든리트리버분양"],
    ...cdn("coldenret"),
  },
  {
    id: "coton",
    category: "dog",
    label: "꼬똥드툴레아",
    intents: ["꼬똥드툴레아분양"],
    ...cdn("coton"),
  },
  {
    id: "longhair-dachshund",
    category: "dog",
    label: "장모닥스훈트",
    intents: ["장모닥스훈트분양"],
    ...cdn("daks"),
  },
  {
    id: "dalmatian",
    category: "dog",
    label: "달마시안",
    intents: ["달마시안분양"],
    ...cdn("dalma"),
  },
  {
    id: "doberman",
    category: "dog",
    label: "도베르만",
    intents: ["도베르만분양"],
    ...cdn("doberman"),
  },
  {
    id: "goldendoodle",
    category: "dog",
    label: "골든두들",
    intents: ["골든두들분양"],
    ...cdn("doodle"),
  },
  {
    id: "bernedoodle",
    category: "dog",
    label: "버니두들",
    intents: ["버니두들분양"],
    ...cdn("doodle"),
  },
  {
    id: "mini-goldendoodle",
    category: "dog",
    label: "미니골든두들",
    intents: ["미니골든두들분양"],
    ...cdn("doodle"),
  },
  {
    id: "english-bulldog",
    category: "dog",
    label: "잉글리쉬불독",
    intents: ["잉글리쉬불독분양"],
    ...cdn("engbuldog"),
  },
  {
    id: "french-bulldog",
    category: "dog",
    label: "프렌치불독",
    intents: ["프렌치불독분양"],
    ...cdn("frenchi"),
  },
  {
    id: "italian-greyhound",
    category: "dog",
    label: "이탈리안그레이하운드",
    intents: ["이탈리안그레이하운드분양"],
    ...cdn("italian"),
  },
  {
    id: "malamute",
    category: "dog",
    label: "알래스칸말라뮤트",
    intents: ["알래스칸말라뮤트분양"],
    ...cdn("malamute"),
  },
  {
    id: "maltese",
    category: "dog",
    label: "말티즈",
    intents: ["말티즈분양"],
    ...cdn("maltese"),
  },
  {
    id: "maltipoo",
    category: "dog",
    label: "말티푸",
    intents: ["말티푸분양"],
    ...cdn("maltipoo"),
  },
  {
    id: "minipin",
    category: "dog",
    label: "미니핀",
    intents: ["미니핀분양"],
    ...cdn("minipin"),
  },
  {
    id: "old-english-sheepdog",
    category: "dog",
    label: "올드잉글리쉬쉽독",
    intents: ["올드잉글리쉬쉽독분양"],
    ...cdn("oldbig"),
  },
  {
    id: "pekingese",
    category: "dog",
    label: "페키니즈",
    intents: ["페키니즈분양"],
    ...cdn("pekinee"),
  },
  {
    id: "pomeranian",
    category: "dog",
    label: "포메라니안",
    intents: ["포메라니안분양"],
    ...cdn("pome"),
  },
  {
    id: "pomsky",
    category: "dog",
    label: "폼스키",
    intents: ["폼스키분양"],
    ...cdn("pomsky"),
  },
  {
    id: "labrador",
    category: "dog",
    label: "래브라도리트리버",
    intents: ["래브라도리트리버분양"],
    ...cdn("rabriter"),
  },
  {
    id: "samoyed",
    category: "dog",
    label: "사모예드",
    intents: ["사모예드분양"],
    ...cdn("samoyed"),
  },
  {
    id: "sheltie",
    category: "dog",
    label: "셔틀랜드쉽독",
    intents: ["셔틀랜드쉽독분양", "셀티분양"],
    ...cdn("selti"),
  },
  {
    id: "shih-tzu",
    category: "dog",
    label: "시츄",
    intents: ["시츄분양"],
    ...cdn("shichu"),
  },
  {
    id: "schnauzer",
    category: "dog",
    label: "슈나우저",
    intents: ["슈나우저분양"],
    ...cdn("shuna"),
  },
  {
    id: "shiba",
    category: "dog",
    label: "시바이누",
    intents: ["시바이누분양", "시바견분양"],
    ...cdn("siba"),
  },
  {
    id: "toy-poodle",
    category: "dog",
    label: "토이푸들",
    intents: ["토이푸들분양"],
    ...cdn("toypoodle"),
  },
  {
    id: "welsh-corgi",
    category: "dog",
    label: "웰시코기",
    intents: ["웰시코기분양"],
    ...cdn("welshi"),
  },
  {
    id: "yorkie",
    category: "dog",
    label: "요크셔테리어",
    intents: ["요크셔테리어분양"],
    ...cdn("yoki"),
  },
  {
    id: "goyang",
    category: "cat",
    label: "고양이",
    intents: ["고양이분양"],
    ...cdn("british"),
  },
  {
    id: "abyssinian",
    category: "cat",
    label: "아비시니안",
    intents: ["아비시니안분양"],
    ...cdn("abisinan"),
  },
  {
    id: "american-shorthair",
    category: "cat",
    label: "아메리칸숏헤어",
    intents: ["아메리칸숏헤어분양"],
    ...cdn("american"),
  },
  {
    id: "bengal",
    category: "cat",
    label: "뱅갈고양이",
    intents: ["뱅갈고양이분양"],
    ...cdn("bnagal"),
  },
  {
    id: "british-shorthair",
    category: "cat",
    label: "브리티쉬숏헤어",
    intents: ["브리티쉬숏헤어분양"],
    ...cdn("british"),
  },
  {
    id: "maine-coon",
    category: "cat",
    label: "메인쿤",
    intents: ["메인쿤분양"],
    ...cdn("maincoon"),
  },
  {
    id: "munchkin",
    category: "cat",
    label: "먼치킨",
    intents: ["먼치킨분양"],
    ...cdn("mcnchikin"),
  },
  {
    id: "neva",
    category: "cat",
    label: "네바마스커레이드",
    intents: ["네바마스커레이드분양"],
    ...cdn("neva"),
  },
  {
    id: "norwegian-forest",
    category: "cat",
    label: "노르웨이숲고양이",
    intents: ["노르웨이숲고양이분양"],
    ...cdn("norwe"),
  },
  {
    id: "persian",
    category: "cat",
    label: "페르시안고양이",
    intents: ["페르시안고양이분양"],
    ...cdn("perisian"),
  },
  {
    id: "ragdoll",
    category: "cat",
    label: "랙돌",
    intents: ["랙돌고양이분양", "렉돌분양"],
    ...cdn("ragdoll"),
  },
  {
    id: "russian-blue",
    category: "cat",
    label: "러시안블루",
    intents: ["러시안블루분양"],
    ...cdn("rusian"),
  },
  {
    id: "scottish-fold",
    category: "cat",
    label: "스코티쉬폴드",
    intents: ["스코티쉬폴드분양"],
    ...cdn("scottish"),
  },
  {
    id: "singapura",
    category: "cat",
    label: "싱가푸라",
    intents: ["싱가푸라분양"],
    ...cdn("singa"),
  },
  {
    id: "sphynx",
    category: "cat",
    label: "스핑크스고양이",
    intents: ["스핑크스고양이분양"],
    ...cdn("spinkix"),
  },
] as const;

export function findBreedDefByIntent(intent: string): BreedDef | undefined {
  return BREED_DEFS.find((d) => d.intents.includes(intent));
}

export function allBreedIntents(): string[] {
  return BREED_DEFS.flatMap((d) => [...d.intents]);
}
