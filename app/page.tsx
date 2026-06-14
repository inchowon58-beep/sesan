import Image from "next/image";
import FloatingBar from "@/components/FloatingBar";
import Header from "@/components/Header";
import SectionLabel from "@/components/SectionLabel";
import { getShelterImages } from "@/lib/images";

const processSteps = [
  {
    step: "1",
    title: "전화 상담",
    description:
      "인천강아지파양·인천강아지보호소 상담 전화(0505-707-0401)로 먼저 연락 주세요. 반려견의 나이, 성격, 파양 사유를 비밀 보장 하에 편안하게 상담해 드립니다.",
  },
  {
    step: "2",
    title: "상담 및 맞춤 안내",
    description:
      "인천유기견보호소·인천유기견보호센터 연계 절차를 보호자님 상황에 맞게 안내합니다. 파양 전 충분한 대화를 통해 반려견에게 가장 좋은 방법을 함께 찾습니다.",
  },
  {
    step: "3",
    title: "보호소 입소",
    description:
      "인천유기견센터 연계 보호소에 입소하면 일상 케어와 정서 안정 프로그램이 시작됩니다. 유기동물보호소 기준에 맞는 안전한 공간에서 반려견을 돌봅니다.",
  },
  {
    step: "4",
    title: "입양·무료분양 연계",
    description:
      "안정된 후 책임 있는 가정에 강아지무료분양을 연계합니다. 인천강아지파양 이후에도 입양 가정과의 사후 관리를 이어갑니다.",
  },
];

const serviceItems = [
  {
    title: "인천강아지파양 상담",
    text: "갑작스러운 상황 변화로 반려견을 맡기셔야 할 때, 인천강아지파양 전문 상담으로 차분하고 안전한 절차를 안내해 드립니다.",
  },
  {
    title: "인천강아지보호소·인천유기견보호소 연계",
    text: "인천강아지보호소 및 인천유기견보호소와 협력하여 반려견이 낯선 환경에서도 불안하지 않도록 세심한 보호 환경을 마련합니다.",
  },
  {
    title: "인천유기견센터·인천유기견보호센터 안내",
    text: "인천유기견센터 등록부터 인천유기견보호센터 입소, 필요한 건강 관리까지 한곳에서 꼼꼼하게 안내합니다.",
  },
  {
    title: "강아지무료분양·유기동물보호소 입양",
    text: "유기동물보호소에서 보호 중인 반려견을 새 가족에게 연결합니다. 입양 전 상담과 이후 안부 확인까지 함께합니다.",
  },
];

const promises = [
  {
    num: "01",
    title: "먼저 귀 기울입니다",
    text: "인천강아지파양·인천강아지보호소 상담은 보호자님의 이야기부터 듣습니다. 반려견과 사람 모두에게 맞는 방법을 함께 고민합니다.",
  },
  {
    num: "02",
    title: "끝까지 함께합니다",
    text: "인천유기견보호센터 입소 이후에도 일상 케어, 강아지무료분양 입양 연계, 사후 관리까지 책임 있는 지원을 이어갑니다.",
  },
  {
    num: "03",
    title: "정직하게 안내합니다",
    text: "인천유기견보호소 보호 과정과 비용을 숨기지 않습니다. 유기동물보호소 기준에 맞는 투명한 운영이 신뢰의 시작입니다.",
  },
];

const faqItems = [
  {
    question: "인천강아지파양은 어떤 경우에 이용하나요?",
    answer:
      "이사, 알레르기, 경제적 사정, 가족 변화 등 부득이한 사유로 직접 돌보기 어려울 때 이용하실 수 있습니다. 인천강아지보호소·인천유기견보호소 상담을 통해 임시 보호, 가족 위탁 등 다른 방법도 함께 안내해 드립니다.",
  },
  {
    question: "인천유기견센터와 인천유기견보호센터는 어떻게 다른가요?",
    answer:
      "인천유기견센터는 유기견 행정·관리 기관이며, 인천유기견보호센터는 실제 보호와 케어가 이루어지는 시설입니다. 본 상담센터는 두 기관과 연계해 파양·보호·입양 절차를 안내합니다.",
  },
  {
    question: "강아지무료분양은 어떻게 신청하나요?",
    answer:
      "유기동물보호소에서 보호 중인 반려견을 대상으로 책임 있는 입양 가정에 강아지무료분양을 연계합니다. 전화 상담(0505-707-0401) 후 입양 전 가정 상담과 서약서 작성을 진행합니다.",
  },
  {
    question: "인천 지역 외에서도 파양이 가능한가요?",
    answer:
      "주로 인천 및 수도권 인근 지역을 대상으로 운영하고 있으나, 상황에 따라 방문 상담이 가능합니다. 인천유기견보호소 입소 전 먼저 전화 상담을 통해 거주 지역과 반려견 정보를 알려 주세요.",
  },
  {
    question: "유기동물보호소 이용 시 비용이 발생하나요?",
    answer:
      "보호소 운영비, 건강 관리비, 사료·의료비 등 실비가 발생할 수 있습니다. 인천강아지파양·인천강아지보호소 상담 시 투명하게 안내해 드리며, 어려우신 경우에도 최대한 도움을 드리고 있습니다.",
  },
  {
    question: "입양 후에도 연락이 가능한가요?",
    answer:
      "네, 입양 가정과의 사후 관리를 위해 정기적인 안부 확인을 진행합니다. 인천강아지파양·강아지무료분양을 통해 보호된 반려견이 새 가정에서 잘 지낼 수 있도록 지속적으로 지원합니다.",
  },
];

export default function HomePage() {
  const shelterImages = getShelterImages();
  const heroImage = shelterImages[0];
  const galleryImages = shelterImages.slice(1);

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          id="about"
          className="relative overflow-hidden bg-cream"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="text-sm text-warm">
                안락사 없는 보호공간 · 인천유기견보호소 · 아가펫
              </p>
              <h1
                id="hero-heading"
                className="heading-display mt-6"
              >
                인천강아지파양,
                <br />
                사랑은 다시
                <br />
                <span className="italic text-aga-brown">이어질 수 있습니다.</span>
              </h1>
              <p className="mt-2 font-serif text-lg text-aga-brown sm:text-xl">
                인천유기견보호소 · 반려견을 위한 따뜻한 안내
              </p>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-warm sm:text-base">
                인천강아지파양·인천강아지보호소·인천유기견보호소 전문
                상담센터입니다. 인천유기견센터·인천유기견보호센터와
                연계하여 반려견 파양, 유기동물보호소 위탁, 강아지무료분양
                입양까지 차분하고 책임 있는 절차로 안내해 드립니다.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="tel:0505-707-0401" className="btn-primary">
                  지금 전화 상담하기
                </a>
                <a href="#shelter" className="btn-outline">
                  ↘ 보호소 둘러보기
                </a>
              </div>
            </div>

            {heroImage && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[3/4]">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* Mission */}
        <section
          className="border-y border-sand bg-cream-dark py-20 sm:py-28"
          aria-labelledby="mission-heading"
        >
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
            <SectionLabel>Our Mission</SectionLabel>
            <h2
              id="mission-heading"
              className="heading-display mx-auto mt-6 max-w-2xl"
            >
              판단하지 않고,
              <br />
              끝까지 함께
              <br />
              있겠습니다.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-warm sm:text-base">
              인천강아지파양은 반려견 입양뿐 아니라 불가피한 파양을
              고민하는 보호자에게도 문을 엽니다. 인천유기견보호소·
              유기동물보호소와 연계하여 반려동물과 사람, 양쪽 모두가 덜
              아픈 길을 함께 찾는 것이 저희의 일입니다.
            </p>
            <p className="mt-6 text-sm text-charcoal">
              지금 바로 상담이 필요하시다면{" "}
              <a
                href="tel:0505-707-0401"
                className="font-semibold underline decoration-aga-gold underline-offset-4"
              >
                0505-707-0401
              </a>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-cream py-16" aria-label="보호소 현황">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-10 px-4 sm:grid-cols-4 sm:px-8">
            {[
              { value: "365일", label: "진실된 사랑으로" },
              { value: "10년+", label: "전문 상담" },
              { value: "0", label: "안락사" },
              { value: "98%", label: "가정 정착률" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-serif text-3xl text-charcoal sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-warm sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Story + Services */}
        <section
          id="services"
          className="border-t border-sand bg-cream-dark py-20 sm:py-28"
          aria-labelledby="services-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <SectionLabel>Our Story</SectionLabel>
                <h2
                  id="services-heading"
                  className="heading-display mt-6"
                >
                  작은 사랑들이 모여
                  <br />
                  한 아이의 평생이
                  <br />
                  됩니다.
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-warm sm:text-base">
                  인천강아지파양부터 인천유기견센터·인천유기견보호센터
                  연계, 강아지무료분양·유기동물보호소 입양까지 인천 지역
                  반려견 보호 전 과정을 안내합니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {serviceItems.map((item) => (
                  <article
                    key={item.title}
                    className="border border-sand bg-cream p-6"
                  >
                    <h3 className="font-serif text-base font-medium text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-warm sm:text-sm">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Shelter gallery */}
        <section
          id="shelter"
          className="bg-cream py-20 sm:py-28"
          aria-labelledby="shelter-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <SectionLabel>Shelter</SectionLabel>
            <h2
              id="shelter-heading"
              className="heading-display mt-6 max-w-xl"
            >
              인천강아지보호소·
              <br />
              인천유기견보호센터 시설
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-warm sm:text-base">
              인천유기견보호소·유기동물보호소 기준에 맞춰 반려견이 안전하고
              편안하게 지낼 수 있도록 깨끗한 보호 공간, 따뜻한 일상 케어,
              꾸준한 건강 관리를 제공합니다.
            </p>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <figure
                  key={image.src}
                  className="group overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading={index < 6 ? "eager" : "lazy"}
                    />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Promises */}
        <section
          className="border-y border-sand bg-cream-dark py-20 sm:py-28"
          aria-labelledby="promises-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="text-center">
              <SectionLabel>Our Promises</SectionLabel>
              <h2
                id="promises-heading"
                className="heading-display mx-auto mt-6"
              >
                아가펫의 세 가지 약속
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-warm">
                이 약속은 한 번도 깨진 적이 없습니다. 앞으로도 그럴
                것입니다.
              </p>
            </div>

            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {promises.map((item) => (
                <article key={item.num} className="text-center">
                  <p className="section-label text-aga-gold">{item.num}</p>
                  <h3 className="mt-4 font-serif text-lg font-medium text-charcoal sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-xs leading-relaxed text-warm sm:text-sm">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section
          id="process"
          className="bg-cream py-20 sm:py-28"
          aria-labelledby="process-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="text-center">
              <SectionLabel>Process</SectionLabel>
              <h2
                id="process-heading"
                className="heading-display mx-auto mt-6"
              >
                처음이라 어려우신가요?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-warm">
                인천강아지파양·인천유기견보호소 이용은 신중하고 투명한
                4단계 절차로 진행됩니다. 단계별로 천천히 함께
                걷겠습니다.
              </p>
            </div>

            <ol className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item) => (
                <li key={item.step} className="text-center">
                  <span className="font-serif text-4xl text-sand">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-medium text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-warm sm:text-sm">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="border-t border-sand bg-cream-dark py-20 sm:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-8">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2
                id="faq-heading"
                className="heading-display mx-auto mt-6"
              >
                자주 묻는 질문
              </h2>
            </div>

            <dl className="mt-12 space-y-0 divide-y divide-sand border-y border-sand">
              {faqItems.map((item) => (
                <div key={item.question} className="py-8">
                  <dt className="font-serif text-base font-medium text-charcoal">
                    {item.question}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-warm">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="bg-aga-dark py-20 text-cream sm:py-28"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
            <SectionLabel>Contact</SectionLabel>
            <p className="mt-6 text-xs uppercase tracking-widest text-warm-light">
              — 안전한 반려동물 쉼터
            </p>
            <h2
              id="contact-heading"
              className="heading-display mt-6 text-cream"
            >
              언제든 편하게
              <br />
              연락주세요.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-warm-light">
              인천강아지파양, 인천유기견센터·인천유기견보호센터 이용,
              강아지무료분양·유기동물보호소 입양에 관한 모든 궁금한 점은
              전화 한 통으로 해결하실 수 있습니다.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div>
                <p className="section-label text-warm-light">Phone</p>
                <a
                  href="tel:0505-707-0401"
                  className="mt-2 block font-serif text-xl text-cream hover:underline"
                >
                  0505-707-0401
                </a>
              </div>
              <div>
                <p className="section-label text-warm-light">Hours</p>
                <p className="mt-2 text-sm text-cream">
                  연중무휴 24시간 상담
                </p>
              </div>
              <div>
                <p className="section-label text-warm-light">Homepage</p>
                <a
                  href="https://www.agapetstory.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-cream hover:underline"
                >
                  agapetstory.co.kr
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-charcoal/10 bg-aga-dark py-12 text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-serif text-lg">인천강아지파양</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-warm-light">
                AGAPET · Incheon Shelter Guide
              </p>
            </div>
            <nav aria-label="푸터 메뉴">
              <ul className="flex flex-wrap justify-center gap-5 text-xs text-warm-light">
                <li>
                  <a href="#about" className="hover:text-cream">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-cream">
                    보호 서비스
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-cream">
                    파양 절차
                  </a>
                </li>
                <li>
                  <a href="#shelter" className="hover:text-cream">
                    보호소 안내
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cream">
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <p className="mt-8 text-center font-serif text-sm italic text-warm-light">
            &ldquo;안락사 없이,{" "}
            <span className="text-cream">끝까지</span> 곁을 지킵니다.&rdquo;
          </p>
          <p className="mt-6 text-center text-[10px] leading-relaxed text-warm-light/70">
            인천강아지파양 · 인천강아지보호소 · 인천유기견보호소 ·
            인천유기견센터 · 인천유기견보호센터 · 강아지무료분양 ·
            유기동물보호소
          </p>
          <p className="mt-3 text-center text-[10px] text-warm-light/50">
            © {new Date().getFullYear()} 아가펫보호소 · 인천강아지파양 안내
          </p>
        </div>
      </footer>

      <FloatingBar />
    </>
  );
}
