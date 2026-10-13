import Image from "next/image";
import Link from "next/link";
import type { SeoPage } from "@/lib/seo-pages";
import { faqJsonLd } from "@/lib/faq-data";
import { SITE } from "@/lib/site";
import { BREED_PHONE, BREED_PHONE_TEL } from "@/lib/breed-seo";
import { breedGalleryAlt } from "@/lib/breed-images";
import GuideHeroThumb from "@/app/components/GuideHeroThumb";

type Props = {
  page: SeoPage;
  pageUrl: string;
  listHref: "/bunyang" | "/goyang";
  listLabel: string;
};

/** 분양 전용 상세 — 가이드 톤 유지, 연락처만 분양번호 사용 */
export default function BreedArticle({ page, pageUrl, listHref, listLabel }: Props) {
  const images = page.images || [];
  const [missionSection, facilitySection, relatedSection] = page.sections || [];
  const otherSections = page.sections?.slice(3) || [];
  const listUrl = `${SITE.siteUrl.replace(/\/$/, "")}${listHref}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: listLabel,
        item: listUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.h1,
        item: pageUrl,
      },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    author: { "@type": "Organization", name: SITE.brand },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      logo: { "@type": "ImageObject", url: `${SITE.siteUrl}${SITE.logo}` },
    },
    image: page.images,
    mainEntityOfPage: pageUrl,
  };

  return (
    <article className="pb-8 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(page.faqs)) }}
      />

      <div className="bg-[linear-gradient(180deg,#12213f_0%,#1a2f55_42%,#ffffff_42%)] px-4 pb-10 pt-8">
        <div className="dalbit-container">
          <GuideHeroThumb page={page} imageSrc={images[0] || SITE.logo} />
        </div>
      </div>

      <div className="dalbit-container max-w-3xl pt-10">
        <nav className="mb-6 text-sm text-[var(--muted-06,#64748b)]">
          <Link href="/" className="hover:text-[var(--color,#1a2f55)]">
            홈
          </Link>
          <span className="mx-2">/</span>
          <Link href={listHref} className="hover:text-[var(--color,#1a2f55)]">
            {listLabel}
          </Link>
          <span className="mx-2">/</span>
          <span>{page.keyword}</span>
        </nav>

        <p className="mb-2 font-display text-2xl leading-snug text-[var(--ink)] md:text-3xl">
          {page.h1}
        </p>
        {page.heroSubtitle && (
          <p className="mb-10 text-sm font-medium text-[var(--muted,#64748b)]">
            {page.heroSubtitle}
          </p>
        )}
      </div>

      {missionSection && (
        <section className="dalbit-container max-w-3xl">
          <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
            {missionSection.h2}
          </h2>
          <div className="ornament" />
          {missionSection.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--ink-soft)]">
              {p}
            </p>
          ))}
          {images[1] && (
            <figure className="my-6 overflow-hidden rounded-2xl">
              <Image
                src={images[1]}
                alt={breedGalleryAlt(page.keyword, 2, page.keyword)}
                width={1000}
                height={700}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
          )}
        </section>
      )}

      {page.services && page.services.length > 0 && (
        <section className="dalbit-section dalbit-section-alt mt-12 md:mt-16">
          <div className="dalbit-container">
            <details className="guide-services-fold group">
              <summary className="guide-services-summary">
                <div className="dalbit-sec-header">
                  <span className="dalbit-badge">Service</span>
                  <h2 className="dalbit-sec-title">
                    {page.servicesTitle || `${SITE.brand}의 분양 안내`}
                  </h2>
                  {page.servicesIntro && (
                    <p className="dalbit-sec-desc">{page.servicesIntro}</p>
                  )}
                  <p className="guide-services-hint">
                    클릭하여 자세히 보기
                    <span className="guide-services-chevron" aria-hidden>
                      ▾
                    </span>
                  </p>
                </div>
              </summary>
              <div className="guide-services-body">
                <div
                  className="dalbit-card-list"
                  style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                >
                  {page.services.map((svc, i) => (
                    <article key={svc.title + i} className="dalbit-card">
                      <div className="dalbit-card-thumb">
                        <Image
                          src={images[i % Math.max(images.length, 1)] || SITE.logo}
                          alt={svc.title}
                          fill
                          className="object-cover"
                        />
                        <span className="dalbit-card-badge">
                          STEP {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="dalbit-card-info">
                        <h3>{svc.title}</h3>
                        <p>{svc.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>
      )}

      {facilitySection && (
        <section className="guide-prose-section dalbit-container max-w-3xl">
          <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
            {facilitySection.h2}
          </h2>
          <div className="ornament" />
          {facilitySection.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--ink-soft)]">
              {p}
            </p>
          ))}
          {images[2] && (
            <figure className="my-6 overflow-hidden rounded-2xl">
              <Image
                src={images[2]}
                alt={breedGalleryAlt(page.keyword, 3, page.keyword)}
                width={1000}
                height={700}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
          )}
        </section>
      )}

      {page.promises && page.promises.length > 0 && (
        <section className="dalbit-section">
          <div className="dalbit-container">
            <div className="dalbit-sec-header">
              <span className="dalbit-badge">Promise</span>
              <h2 className="dalbit-sec-title">
                {page.promisesTitle || `${SITE.brand}의 세 가지 약속`}
              </h2>
            </div>
            <div className="dalbit-promise-list">
              {page.promises.map((pr, i) => (
                <div key={pr.title + i} className="dalbit-promise-item">
                  <div className="dalbit-promise-icon">
                    <span style={{ fontWeight: 800, fontSize: "1.3rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="dalbit-promise-title">{pr.title}</p>
                  <p className="dalbit-promise-desc">{pr.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.processSteps && page.processSteps.length > 0 && (
        <section className="dalbit-section dalbit-section-alt">
          <div className="dalbit-container">
            <div className="dalbit-sec-header">
              <span className="dalbit-badge">Process</span>
              <h2 className="dalbit-sec-title">
                {page.processTitle || `${page.keyword} 진행 4단계`}
              </h2>
            </div>
            <ol className="dalbit-step-list">
              {page.processSteps.map((step) => (
                <li key={step.step} className="dalbit-step-item">
                  <span className="dalbit-step-num">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(relatedSection || (page.relatedIntents && page.relatedIntents.length > 0)) && (
        <section className="guide-prose-section dalbit-container max-w-3xl">
          {relatedSection && (
            <>
              <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">
                {relatedSection.h2}
              </h2>
              <div className="ornament" />
              {relatedSection.paragraphs.map((p, pi) => (
                <p key={pi} className="mb-4 leading-relaxed text-[var(--ink-soft)]">
                  {p}
                </p>
              ))}
            </>
          )}
          {page.relatedIntents && page.relatedIntents.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {page.relatedIntents.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-[var(--line)] bg-[var(--section-alt,#f1f3f7)] px-4 py-1.5 text-sm font-medium text-[var(--ink-soft)]"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {otherSections.map((sec, si) => (
        <section key={sec.h2 + si} className="guide-prose-section dalbit-container max-w-3xl">
          <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">{sec.h2}</h2>
          <div className="ornament" />
          {sec.paragraphs.map((p, pi) => (
            <p key={pi} className="mb-4 leading-relaxed text-[var(--ink-soft)]">
              {p}
            </p>
          ))}
        </section>
      ))}

      {page.faqs?.length > 0 && (
        <section className="guide-prose-section dalbit-container max-w-3xl">
          <h2 className="font-display text-2xl text-[var(--ink)] md:text-3xl">자주 묻는 질문</h2>
          <div className="ornament" />
          <div className="dalbit-faq-list">
            {page.faqs.map((f, i) => (
              <details key={f.q + i} className="dalbit-faq-item group">
                <summary
                  className="dalbit-faq-q [&::-webkit-details-marker]:hidden"
                  style={{ listStyle: "none" }}
                >
                  <span>{f.q}</span>
                  <span className="dalbit-faq-icon shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="dalbit-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <div className="dalbit-container max-w-3xl guide-cta-wrap">
        <aside className="dalbit-contact-cta guide-contact-box flex flex-col items-center gap-5 text-center">
          <p className="dalbit-contact-eyebrow">Contact — {listLabel} 상담</p>
          <p className="font-display text-xl md:text-2xl">{page.ctaText}</p>
          <a href={BREED_PHONE_TEL} className="dalbit-contact-btn">
            분양 상담 {BREED_PHONE}
          </a>
        </aside>
      </div>
    </article>
  );
}
