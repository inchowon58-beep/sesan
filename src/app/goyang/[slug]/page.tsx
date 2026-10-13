import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { findBreedEntry, listBreedEntries, breedPath } from "@/lib/breed-catalog";
import { generateBreedPage } from "@/lib/breed-seo";
import BreedArticle from "@/app/bunyang/BreedArticle";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return listBreedEntries("cat")
    .filter((e) => !e.region)
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const entry = findBreedEntry(raw);
  if (!entry || entry.category !== "cat") return { title: "페이지 없음" };
  const page = generateBreedPage(entry);
  const base = SITE.siteUrl.replace(/\/$/, "");
  const url = `${base}${breedPath(entry)}`;
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

export default async function GoyangSlugPage({ params }: Props) {
  const { slug: raw } = await params;
  const entry = findBreedEntry(raw);
  if (!entry || entry.category !== "cat") notFound();
  const page = generateBreedPage(entry);
  const pageUrl = `${SITE.siteUrl.replace(/\/$/, "")}${breedPath(entry)}`;
  return (
    <BreedArticle
      page={page}
      pageUrl={pageUrl}
      listHref="/goyang"
      listLabel="고양이분양"
    />
  );
}
