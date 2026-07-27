# -*- coding: utf-8 -*-
"""달빛쉘터 - SEO 템플릿 콘텐츠 생성 (Gemini 없음).

src/lib/regional-seo.ts 의 지역 랜딩 페이지 생성기와 개념적으로 동일한 구조
(키워드 H1, 소개/미션, 핵심 서비스 6개, 보호·시설 안내, 세 가지 약속, 4단계 절차,
관련 검색 의도, FAQ 6~7개, 전화 CTA)를 파이썬으로 재현한다. 결과 dict의 키는
Next.js SeoPage 타입과 1:1로 맞춰 public/seo-data/pages/*.json 으로 그대로 소비된다.
"""

from __future__ import annotations

import hashlib
import random
import re
import string
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional
from urllib.parse import quote

from cdn_images import pick_images as cdn_pick_images

BRAND = "달빛쉘터"
DEFAULT_SITE_URL = "https://sesan.agapet.co.kr"
BRAND_EN = "Dalbit Shelter"
SITE_NAME = "달빛쉘터"
PHONE = "010-9906-4068"
PHONE_TEL = "01099064068"
IMAGE_BASE = "https://image.cattery.co.kr/dogboho"
IMAGE_COUNT = 79
AREA = "전국파양입소 및 무료분양"
LOGO = "/logo.png"

# ------------------------------------------------------------------
# 시드 유틸 - 키워드+인덱스 조합마다 안정적으로 다른 결과를 만든다
# ------------------------------------------------------------------


def _seed_int(keyword: str, idx: int, salt: str = "dalbit") -> int:
    return int(hashlib.md5(f"{keyword}|{idx}|{salt}".encode("utf-8")).hexdigest()[:8], 16)


def _rng(keyword: str, idx: int, salt: str = "dalbit") -> random.Random:
    return random.Random(_seed_int(keyword, idx, salt))


def _pick(rng: random.Random, items: List[Any]) -> Any:
    return items[rng.randrange(len(items))]


def _shuffled(rng: random.Random, items: List[Any]) -> List[Any]:
    out = list(items)
    rng.shuffle(out)
    return out


def image_urls(
    count: int,
    seed: int,
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> List[str]:
    return cdn_pick_images(
        count=count,
        seed=seed,
        image_url=image_url,
        image_base=image_base or IMAGE_BASE,
        image_count=image_count,
        default_base=IMAGE_BASE,
        default_count=IMAGE_COUNT,
    )


def slugify(keyword: str, idx: int) -> str:
    base = "".join(
        c if c.isalnum() or c in "-_" else "-"
        for c in keyword.lower().replace(" ", "-")
    )
    base = base.strip("-")[:36] or "gangaji-payang"
    tail = f"{idx:02d}{''.join(random.choices(string.ascii_lowercase + string.digits, k=4))}"
    return f"{base}-{tail}"


# ------------------------------------------------------------------
# 문구 풀
# ------------------------------------------------------------------

TONE_WORDS = ["차분하게", "꼼꼼하게", "따뜻하게", "세심하게", "신중하게"]
VERB_WORDS = ["안내", "상담", "조율"]

HERO_SUBTITLES = [
    "Nationwide Surrender Care · Free Adoption Matching",
    "전국 어디서나, 이별 뒤에도 좋은 인연은 이어집니다",
    "Safe Intake, Warm Match - {brand}",
    "책임감 있는 파양 상담과 무료분양 매칭",
    "Every Goodbye Finds a New Beginning",
    "전국파양입소 · 무료분양 전문 상담",
    "A Safe Next Home for Every Dog",
]

HERO_LINE2_POOL = [
    "새 가족을 만나요",
    "이별 뒤에도 좋은 인연은 이어집니다",
    "전국 어디서나 함께 걷습니다",
    "따뜻한 다음 걸음을 함께합니다",
    "혼자 고민하지 마세요",
]

HERO_BADGE_POOL = [
    "전국파양입소 · {brand}",
    "전국 무료분양 · {brand}",
    "24시간 전화상담 · {brand}",
    "안락사 없는 보호 · {brand}",
]

LEAD_INS = [
    "{kw}를 고민 중이시라면, 혼자 결정하지 마시고 먼저 전화로 상황을 나눠보세요.",
    "{kw} 검색으로 이 페이지를 찾으셨다면, 지금이 가장 정확한 정보를 확인할 때입니다.",
    "{kw}는 아이와 보호자님 모두에게 신중함이 필요한 과정입니다. {brand}가 함께합니다.",
    "{kw}를 알아보고 계신 보호자님께, 전국 어디서든 가능한 상담 방법을 안내드립니다.",
    "{kw}, 급하게 결정하지 않으셔도 됩니다. 전화 한 통으로 절차부터 천천히 확인하세요.",
]

MISSION_H2 = [
    "{kw}, 외로운 결정이 되지 않도록 함께합니다",
    "{kw}, 왜 {brand} 상담이 필요할까요",
    "{kw}, 신중하게 그러나 망설이지 않도록",
    "{kw}를 고민하는 보호자님께 드리는 안내",
    "믿을 수 있는 {kw} 상담, {brand}가 함께합니다",
    "{kw} 전, 꼭 확인해야 할 것들",
]

FACILITY_H2 = [
    "{kw} 보호·시설 안내",
    "안전하게 지내는 {brand} 보호 환경",
    "{kw} 이후, 아이가 머무는 보호 공간",
    "청결하고 안전한 {brand}의 보호 시설",
]

RELATED_H2 = [
    "{kw}와 함께 찾는 검색어",
    "{kw} 보호자님이 함께 확인하는 정보",
    "{kw} 관련 검색 의도 모아보기",
    "{kw}만큼 자주 찾는 키워드",
]

SERVICES_H2 = [
    "{brand}의 핵심 서비스 6가지",
    "{kw} 상담부터 매칭까지, {brand} 서비스 안내",
    "{kw} 이후 이어지는 {brand}의 케어 단계",
]

PROMISE_TITLE_SETS = [
    ["따뜻하게", "오래", "솔직하게"],
    ["세심하게", "끝까지", "투명하게"],
    ["신중하게", "꾸준히", "정직하게"],
    ["차분하게", "책임감 있게", "명확하게"],
]

PROMISE_H2 = [
    "{brand}의 세 가지 약속",
    "{kw} 상담에서 지키는 세 가지 약속",
    "한 번도 깨진 적 없는 세 가지 약속",
]

PROCESS_H2 = [
    "{kw} 진행 4단계",
    "처음이라 어려우신가요? 4단계로 안내합니다",
    "{brand}와 함께하는 4단계 절차",
]

CTA_TEMPLATES = [
    "{kw} 상담은 전화 한 통이면 충분합니다 - {phone} · {brand}",
    "파양·입양 상담 {phone} - {brand}",
    "{kw}, 지금 바로 {phone}로 문의하세요 - {brand}",
    "혼자 고민하지 마세요. {phone} · {brand}가 함께합니다",
]

TITLE_TEMPLATES = [
    "{kw} | {brand} 전국 파양입소·무료분양 상담",
    "{kw} 안내 | {brand} - 전국 어디서나 파양·분양",
    "{brand} {kw} - 전국파양입소 · 무료분양 매칭",
]

RELATED_SUFFIXES = ["보호소", "무료분양", "입양", "보호센터", "임시보호", "분양문의", "유기견센터"]

GENERIC_RELATED = ["강아지무료분양", "유기견입양", "전국파양입소", "강아지보호소", "반려견파양상담"]

# 6가지 핵심 서비스: (key, 제목 후보, 설명 생성 함수)
ServiceDesc = Callable[[str, str, str, str], str]

SERVICE_DEFS: List[Dict[str, Any]] = [
    {
        "key": "counsel",
        "titles": ["{kw} 파양 상담", "{kw} 전화 상담", "{kw} 1:1 사전 상담"],
        "desc": lambda kw, brand, phone, tone: (
            f"갑작스러운 상황으로 {kw}{_eul_reul(kw)} 고민하신다면, {brand}가 사정을 {tone} 듣고 "
            f"절차와 준비물을 안내합니다. 상담 신청서 없이 전화({phone}) 한 통이면 충분합니다."
        ),
    },
    {
        "key": "shelterLink",
        "titles": ["보호소 연계 안내", "전국 보호소 네트워크 연계", "협력 보호소 매칭"],
        "desc": lambda kw, brand, phone, tone: (
            f"{kw} 이후에는 전국 협력 보호소와 연계해 아이가 안심할 수 있는 환경에서 "
            f"지낼 수 있도록 돕습니다. 특정 지역에 국한되지 않고 전국 어디서나 연계가 가능합니다."
        ),
    },
    {
        "key": "intakeCare",
        "titles": ["입소 케어", "입소 후 건강·일상 케어", "입소 케어 프로그램"],
        "desc": lambda kw, brand, phone, tone: (
            f"입소 후에는 건강 상태 확인, 목욕, 산책 등 일상 케어를 {tone} 이어가며, "
            f"{kw} 이후 아이가 겪을 수 있는 스트레스를 최소화합니다."
        ),
    },
    {
        "key": "freeAdoptionMatch",
        "titles": ["무료분양 매칭", "책임 입양 매칭", "새 가족 매칭 프로그램"],
        "desc": lambda kw, brand, phone, tone: (
            f"보호 중인 아이는 생활 환경과 반려 의지를 확인하는 사전 상담을 거쳐, "
            f"책임감 있는 가정과 무료분양으로 연결됩니다. {kw} 문의도 같은 절차로 진행됩니다."
        ),
    },
    {
        "key": "pickup",
        "titles": ["방문 픽업 조율", "전국 방문 픽업 안내", "일정 맞춤 픽업"],
        "desc": lambda kw, brand, phone, tone: (
            f"거동이 어렵거나 이동이 힘든 경우 일정을 맞춰 방문 픽업을 조율합니다. "
            f"{kw} 절차 중 이동 문제로 고민하지 않으셔도 됩니다."
        ),
    },
    {
        "key": "afterCare",
        "titles": ["사후 안내 및 안부 확인", "입양 후 사후 관리", "꾸준한 안부 확인"],
        "desc": lambda kw, brand, phone, tone: (
            f"입양 이후에도 새 가정과 정기적으로 안부를 확인하며, {kw}{_ro_euro(kw)} 시작된 인연이 "
            f"끝까지 책임감 있게 이어지도록 {brand}가 돕습니다."
        ),
    },
]

# FAQ 후보 7종: (질문 변형 목록, 답변 생성 함수)
FAQ_DEFS: List[Dict[str, Any]] = [
    {
        "questions": [
            "{kw} 상담은 어떻게 하나요?",
            "{kw} 문의는 어떤 방법으로 하나요?",
            "{kw} 상담 신청은 어떻게 진행되나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"상담 폼 없이 {phone} 전화로만 접수합니다. 견종·나이·{kw} 사유를 알려주시면 "
            f"{brand}가 절차와 준비 사항을 안내합니다."
        ),
    },
    {
        "questions": [
            "{kw}는 전국 어디서나 가능한가요?",
            "{kw} 상담을 받으려면 방문해야 하나요?",
            "지방에서도 {kw} 상담이 가능한가요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"가능합니다. {brand}는 전국파양입소 및 무료분양을 원칙으로 하며, 거주 지역과 "
            f"관계없이 전화 상담과 방문 픽업 조율을 지원합니다."
        ),
    },
    {
        "questions": [
            "무료분양은 어떤 절차로 진행되나요?",
            "{kw} 이후 무료분양 절차가 궁금해요",
            "새 가족 매칭은 어떻게 이뤄지나요?",
        ],
        "answer": lambda kw, brand, phone: (
            "보호중인 아이 확인 후 전화 상담을 통해 생활 환경과 반려 의지를 확인하고, "
            "책임감 있는 입양을 위한 매칭을 진행합니다."
        ),
    },
    {
        "questions": [
            "{kw} 전 준비물이 있나요?",
            "입소 전 미리 챙겨야 할 것이 있나요?",
            "{kw} 입소 시 필요한 서류가 있나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"별도 서류는 필요 없습니다. 다만 접종·건강 기록이 있다면 상담 시 함께 안내해 "
            f"주시면 {kw} 이후 케어 계획을 세우는 데 도움이 됩니다."
        ),
    },
    {
        "questions": [
            "견종이나 나이 제한이 있나요?",
            "{kw} 상담에 견종 제한이 있나요?",
            "노령견도 {kw} 상담이 가능한가요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"견종과 나이에 관계없이 문의하실 수 있습니다. {brand}는 소형견부터 대형견, "
            f"노령견까지 상황에 맞춰 상담해 드립니다."
        ),
    },
    {
        "questions": [
            "입양 후에도 연락이 가능한가요?",
            "매칭 이후 사후관리도 해주시나요?",
            "{kw} 이후에도 안부를 확인할 수 있나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"네, 새 가정과의 사후 관리를 위해 정기적으로 안부를 확인합니다. {kw}{_ro_euro(kw)} 이어진 "
            f"인연이 새 가정에서도 잘 지낼 수 있도록 지속적으로 지원합니다."
        ),
    },
    {
        "questions": [
            "방문 픽업도 가능한가요?",
            "이동이 어려운 경우 어떻게 하나요?",
            "{kw} 진행 중 방문 픽업 요청이 가능한가요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"거동이 어렵거나 이동 수단이 없는 경우 일정을 조율해 방문 픽업을 도와드립니다. "
            f"{phone}으로 상황을 말씀해 주세요."
        ),
    },
]


def _has_batchim(word: str) -> bool:
    """한글 음절의 받침(종성) 유무 판별 - 조사(은/는, 을/를, 과/와) 선택용."""
    trimmed = word.strip()
    if not trimmed:
        return False
    last = trimmed[-1]
    code = ord(last)
    if code < 0xAC00 or code > 0xD7A3:
        return False
    return (code - 0xAC00) % 28 != 0


def _eun_neun(word: str) -> str:
    return "은" if _has_batchim(word) else "는"


def _eul_reul(word: str) -> str:
    return "을" if _has_batchim(word) else "를"


def _gwa_wa(word: str) -> str:
    return "과" if _has_batchim(word) else "와"


def _ro_euro(word: str) -> str:
    """로/으로 - 받침 있으면 '으로', 없거나 'ㄹ' 받침이면 '로'."""
    trimmed = word.strip()
    if trimmed:
        code = ord(trimmed[-1])
        if 0xAC00 <= code <= 0xD7A3 and (code - 0xAC00) % 28 == 8:
            return "로"  # ㄹ받침
    return "으로" if _has_batchim(word) else "로"


_KW_EUN_NEUN_RE = re.compile(r"\{kw\}(는|은)")
_KW_EUL_REUL_RE = re.compile(r"\{kw\}(를|을)")
_KW_GWA_WA_RE = re.compile(r"\{kw\}(과|와)")
_KW_RO_EURO_RE = re.compile(r"\{kw\}(으로|로)")


def _fill(template: str, kw: str, brand: str, phone: str) -> str:
    """{kw} 뒤에 붙는 조사를 키워드 받침에 맞게 자동 교정한 뒤 치환한다."""
    out = _KW_EUN_NEUN_RE.sub(kw + _eun_neun(kw), template)
    out = _KW_EUL_REUL_RE.sub(kw + _eul_reul(kw), out)
    out = _KW_GWA_WA_RE.sub(kw + _gwa_wa(kw), out)
    out = _KW_RO_EURO_RE.sub(kw + _ro_euro(kw), out)
    return out.format(kw=kw, brand=brand, phone=phone)


def build_content(
    keyword: str,
    idx: int,
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> Dict[str, Any]:
    kw = keyword.strip() or "강아지파양"
    brand = BRAND
    phone = PHONE

    rng = _rng(kw, idx, "main")
    rng2 = _rng(kw, idx, "v2")
    rng3 = _rng(kw, idx, "v3")

    tone = _pick(rng, TONE_WORDS)
    tone2 = _pick(rng2, TONE_WORDS)
    verb = _pick(rng, VERB_WORDS)

    def t(template: str) -> str:
        return _fill(template, kw, brand, phone)

    # ---------- 메타 / 히어로 ----------
    title = t(_pick(rng, TITLE_TEMPLATES))
    related_pool = _shuffled(rng3, [f"{kw} {s}" for s in RELATED_SUFFIXES] + list(GENERIC_RELATED))
    related_intents = related_pool[:8]
    meta_desc = (
        f"{kw} 안내 - {brand}는 전국 어디서나 강아지 파양 {verb}부터 무료분양 매칭까지 "
        f"책임집니다. 이민·이사·건강 문제 등 피치 못한 사정도 {tone} 들어드립니다. "
        f"문의 {phone}. 전국파양입소·무료분양 가능."
    )
    meta_keywords_list: List[str] = []
    for kw_item in [kw, brand] + related_intents[:6] + ["전국파양입소", "강아지입양"]:
        if kw_item not in meta_keywords_list:
            meta_keywords_list.append(kw_item)
    meta_keywords = ", ".join(meta_keywords_list[:12])

    h1 = f"{kw} - {brand} 전국 파양입소·무료분양 상담"
    hero_title_line1 = kw
    hero_title_line2 = _pick(rng2, HERO_LINE2_POOL)
    hero_badge = t(_pick(rng3, HERO_BADGE_POOL))
    hero_subtitle = t(_pick(rng, HERO_SUBTITLES))
    hero_bar = f"{kw} 상담, 전국 어디서나 {phone}"

    # ---------- 소개 / 미션 ----------
    lead_in = t(_pick(rng2, LEAD_INS))
    mission_section = {
        "h2": t(_pick(rng, MISSION_H2)),
        "paragraphs": [
            lead_in,
            f"{kw}{_eun_neun(kw)} 단순한 이별이 아니라 아이의 다음 삶을 책임지는 중요한 결정입니다. "
            f"{brand}는 보호자님의 힘든 선택을 {tone} 존중하며, 아이가 안전하게 새 가족을 "
            f"만날 수 있도록 상담부터 매칭까지 함께합니다.",
            f"이민·이사·건강 문제·주거 변경 등 피치 못한 사정으로 {kw}{_eul_reul(kw)} 고민하신다면, "
            f"절차와 준비물을 먼저 전화로 {verb}받으실 수 있습니다. 상담 신청서 없이 전화 "
            f"한 통으로 충분합니다.",
            f"무리한 파양은 아이에게도 큰 스트레스가 됩니다. {brand}는 입소 전 건강 상태와 "
            f"성향을 확인하고, 위생적인 환경에서 아이 중심의 케어를 이어갑니다. {kw} 문의는 "
            f"{phone}로 안내드립니다.",
        ],
    }

    # ---------- 핵심 서비스 6개 (처음/끝 고정, 중간 4개 셔플) ----------
    middle = _shuffled(rng, SERVICE_DEFS[1:5])
    ordered_services = [SERVICE_DEFS[0], *middle, SERVICE_DEFS[5]]
    services = []
    for i, svc in enumerate(ordered_services):
        svc_rng = _rng(kw, idx, f"svc{i}")
        services.append(
            {
                "title": t(_pick(svc_rng, svc["titles"])),
                "description": svc["desc"](kw, brand, phone, tone if i % 2 == 0 else tone2),
            }
        )
    services_title = t(_pick(rng, SERVICES_H2))
    services_intro = (
        f"{kw} 문의 시 {brand}가 제공하는 핵심 서비스 6가지를 순서대로 확인해 보세요. "
        f"상담부터 사후 관리까지 하나의 흐름으로 이어집니다."
    )

    # ---------- 보호·시설 안내 ----------
    facility_section = {
        "h2": t(_pick(rng2, FACILITY_H2)),
        "paragraphs": [
            f"{brand}는 특정 지역 매장 주소 없이 전국파양입소 및 무료분양 기준으로 운영합니다. "
            f"{kw} 상담 후 입소가 확정되면, 전국 협력 보호소 네트워크를 통해 깨끗하고 안전한 "
            f"보호 공간에서 아이를 케어합니다.",
            f"입소 후에는 산책·목욕·건강 상태 확인 등 일상 케어를 {tone} 이어가며, 성향과 "
            f"생활 환경을 고려한 새 가족 매칭을 진행합니다. 무료분양은 책임감 있는 입양을 "
            f"위해 사전 상담을 거칩니다.",
            f"보호자님이 가장 궁금해하시는 절차·비용·일정은 전화로 투명하게 {verb}합니다. "
            f"{kw}{_eul_reul(kw)} 계기로 만난 인연이 아이와 사람 모두에게 안전한 다음 걸음이 되도록 "
            f"최선을 다합니다.",
        ],
    }

    # ---------- 세 가지 약속 ----------
    promise_titles = list(_pick(rng, PROMISE_TITLE_SETS))
    promise_descs = [
        f"{kw} 상담은 보호자님의 마음을 먼저 헤아립니다. 아이와 사람 모두를 위한 방법을 함께 찾습니다.",
        "입소 이후에도 일상 케어, 무료분양 매칭 연계, 사후 안부 확인까지 꾸준히 지원합니다.",
        f"보호 과정과 절차를 명확히 알려 드립니다. {kw} 상담부터 매칭까지 투명한 운영이 신뢰의 시작입니다.",
    ]
    promises = [
        {"title": title, "description": promise_descs[i]} for i, title in enumerate(promise_titles)
    ]
    promises_title = t(_pick(rng2, PROMISE_H2))

    # ---------- 4단계 절차 ----------
    process_title = t(_pick(rng3, PROCESS_H2))
    process_steps = [
        {
            "step": "01",
            "title": "전화 상담",
            "description": f"{kw} 상담 전화({phone})로 연락 주세요. 아이의 나이, 성격, 파양 사유를 "
            f"비밀 보장 하에 편안하게 상담해 드립니다.",
        },
        {
            "step": "02",
            "title": "맞춤 절차 안내",
            "description": f"보호자님 상황에 맞는 입소·보호 방법을 {tone} 설명합니다. 급하지 않게 "
            f"아이에게 가장 나은 길을 함께 고릅니다.",
        },
        {
            "step": "03",
            "title": "입소",
            "description": f"전국 협력 보호소 연계 공간에 입소하면 정서 안정과 일상 케어가 시작됩니다. "
            f"{kw} 이후 건강 확인도 함께 진행됩니다.",
        },
        {
            "step": "04",
            "title": "입양 매칭",
            "description": f"준비가 되면 책임 있는 가정에 무료분양을 연계합니다. {kw} 이후에도 입양 "
            f"가정과의 안부 확인을 이어갑니다.",
        },
    ]

    # ---------- 관련 검색 의도 ----------
    related_section = {
        "h2": t(_pick(rng3, RELATED_H2)),
        "paragraphs": [
            f"{kw}{_eul_reul(kw)} 찾아보신 분들은 {', '.join(related_intents[:3])} 등도 함께 확인합니다. "
            f"{brand}는 이런 궁금증에도 전화 한 통으로 답해 드립니다.",
            f"아래 키워드는 {kw}{_gwa_wa(kw)} 함께 자주 검색되는 관련 검색어입니다. 궁금한 항목이 있다면 "
            f"상담 시 함께 문의해 주세요.",
        ],
    }

    # ---------- FAQ 6~7개 ----------
    faq_count = 6 + (rng2.randrange(2))
    faq_order = _shuffled(rng2, list(range(len(FAQ_DEFS))))[:faq_count]
    faqs = []
    for def_index in faq_order:
        faq_def = FAQ_DEFS[def_index]
        q_rng = _rng(kw, idx, f"faq{def_index}")
        faqs.append(
            {
                "q": t(_pick(q_rng, faq_def["questions"])),
                "a": faq_def["answer"](kw, brand, phone),
            }
        )

    cta_text = t(_pick(rng, CTA_TEMPLATES))

    now = datetime.utcnow().isoformat() + "Z"
    return {
        "slug": slugify(kw, idx),
        "keyword": kw,
        "title": title,
        "metaDescription": meta_desc,
        "metaKeywords": meta_keywords,
        "h1": h1,
        "heroSubtitle": hero_subtitle,
        "heroBadge": hero_badge,
        "heroTitleLine1": hero_title_line1,
        "heroTitleLine2": hero_title_line2,
        "heroBar": hero_bar,
        "sections": [mission_section, facility_section, related_section],
        "servicesTitle": services_title,
        "servicesIntro": services_intro,
        "services": services,
        "promisesTitle": promises_title,
        "promises": promises,
        "processTitle": process_title,
        "processSteps": process_steps,
        "relatedIntents": related_intents,
        "faqs": faqs,
        "images": image_urls(
            6,
            _seed_int(kw, idx, "img"),
            image_url=image_url,
            image_base=image_base,
            image_count=image_count,
        ),
        "ctaText": cta_text,
        "createdAt": now,
        "updatedAt": now,
    }


def write_html(page: Dict[str, Any], site_url: str) -> str:
    imgs = "".join(
        f'<figure><img src="{u}" alt="{page["keyword"]} 보호·입양 사례 {i+1}" loading="lazy"/></figure>'
        for i, u in enumerate(page["images"])
    )
    sections = ""
    for sec in page["sections"]:
        ps = "".join(f"<p>{p}</p>" for p in sec["paragraphs"])
        sections += f"<section><h2>{sec['h2']}</h2>{ps}</section>"

    services_html = ""
    if page.get("services"):
        cards = "".join(
            f"<article><h3>{s['title']}</h3><p>{s['description']}</p></article>"
            for s in page["services"]
        )
        services_html = (
            f"<section><h2>{page.get('servicesTitle', '핵심 서비스')}</h2>"
            f"<p>{page.get('servicesIntro', '')}</p>{cards}</section>"
        )

    promises_html = ""
    if page.get("promises"):
        items = "".join(
            f"<li><strong>{p['title']}</strong><p>{p['description']}</p></li>"
            for p in page["promises"]
        )
        promises_html = f"<section><h2>{page.get('promisesTitle', '세 가지 약속')}</h2><ol>{items}</ol></section>"

    process_html = ""
    if page.get("processSteps"):
        items = "".join(
            f"<li><span>{s['step']}</span><strong>{s['title']}</strong><p>{s['description']}</p></li>"
            for s in page["processSteps"]
        )
        process_html = f"<section><h2>{page.get('processTitle', '진행 절차')}</h2><ol>{items}</ol></section>"

    related_html = ""
    if page.get("relatedIntents"):
        chips = "".join(f"<span>#{kw}</span>" for kw in page["relatedIntents"])
        related_html = f"<section><h2>관련 검색어</h2><div>{chips}</div></section>"

    faqs = "".join(
        f"<details><summary>{f['q']}</summary><p>{f['a']}</p></details>"
        for f in page["faqs"]
    )
    url = f"{site_url.rstrip('/')}/guide/{page['slug']}"
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>{page['title']}</title>
<meta name="description" content="{page['metaDescription']}"/>
<meta name="keywords" content="{page['metaKeywords']}"/>
<link rel="canonical" href="{url}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="{page['title']}"/>
<meta property="og:description" content="{page['metaDescription']}"/>
<meta property="og:url" content="{url}"/>
<meta property="og:image" content="{page['images'][0] if page['images'] else ''}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{page['title']}"/>
<meta name="twitter:description" content="{page['metaDescription']}"/>
</head>
<body>
<header><a href="{site_url}">{SITE_NAME}</a></header>
<article>
<h1>{page['h1']}</h1>
<p>{page['heroSubtitle']}</p>
{sections}
{services_html}
{promises_html}
{process_html}
{related_html}
{imgs}
<section><h2>FAQ</h2>{faqs}</section>
<p><a href="tel:{PHONE_TEL}">{page['ctaText']}</a></p>
</article>
</body>
</html>"""


def generate_batch(
    keywords: List[str],
    out_dir: str,
    site_url: str,
    sync_public: str = "",
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> List[str]:
    import json
    import os

    os.makedirs(out_dir, exist_ok=True)
    pages_dir = os.path.join(out_dir, "pages")
    os.makedirs(pages_dir, exist_ok=True)
    slugs: List[str] = []
    urls: List[str] = []
    for i, kw in enumerate(keywords, 1):
        page = build_content(
            kw,
            i,
            image_url=image_url,
            image_base=image_base,
            image_count=image_count,
        )
        slugs.append(page["slug"])
        with open(os.path.join(pages_dir, f"{page['slug']}.json"), "w", encoding="utf-8") as f:
            json.dump(page, f, ensure_ascii=False, indent=2)
        html = write_html(page, site_url)
        with open(os.path.join(out_dir, f"{page['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(html)
        urls.append(f"{site_url.rstrip('/')}/guide/{quote(page['slug'])}")
    index = {"slugs": slugs, "updatedAt": datetime.utcnow().isoformat() + "Z"}
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "urls.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(urls))
    if sync_public:
        pub_pages = os.path.join(sync_public, "pages")
        os.makedirs(pub_pages, exist_ok=True)
        existing = {"slugs": [], "updatedAt": ""}
        idx_path = os.path.join(sync_public, "index.json")
        if os.path.isfile(idx_path):
            with open(idx_path, encoding="utf-8") as f:
                existing = json.load(f)
        for slug in slugs:
            src = os.path.join(pages_dir, f"{slug}.json")
            dst = os.path.join(pub_pages, f"{slug}.json")
            with open(src, encoding="utf-8") as f:
                data = f.read()
            with open(dst, "w", encoding="utf-8") as f:
                f.write(data)
            if slug not in existing["slugs"]:
                existing["slugs"].insert(0, slug)
        existing["updatedAt"] = datetime.utcnow().isoformat() + "Z"
        with open(idx_path, "w", encoding="utf-8") as f:
            json.dump(existing, f, ensure_ascii=False, indent=2)
    return urls
