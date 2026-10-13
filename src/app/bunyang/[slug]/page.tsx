import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { findBreedEntry, BREED_INTENTS } from "@/lib/breed-catalog";
import { generateWhiteTerrierPage } from "@/lib/breed-seo";
import BreedArticle from "../BreedArticle";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

/** 전국 키워드만 프리빌드 — 지역 페이지는 요청 시 템플릿 생성 (기존 seo-data 미사용) */
export function generateStaticParams() {
  return BREED_INTENTS.map((intent) => ({ slug: intent }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const entry = findBreedEntry(raw);
  if (!entry) return { title: "페이지 없음" };
  const page = generateWhiteTerrierPage(entry);
  const base = SITE.siteUrl.replace(/\/$/, "");
  const url = `${base}/bunyang/${encodeURIComponent(page.slug)}`;
  const rawImage = page.images?.[0] || SITE.logo;
  const ogImage = rawImage.startsWith("http")
    ? rawImage
    : `${base}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.metaKeywords.split(",").map((s) => s.trim()),
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: SITE.name,
      locale: "ko_KR",
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.keyword }],
    },
  };
}

export default async function BunyangSlugPage({ params }: Props) {
  const { slug: raw } = await params;
  const entry = findBreedEntry(raw);
  if (!entry) notFound();
  const page = generateWhiteTerrierPage(entry);
  const pageUrl = `${SITE.siteUrl.replace(/\/$/, "")}/bunyang/${encodeURIComponent(page.slug)}`;
  return <BreedArticle page={page} pageUrl={pageUrl} />;
}
