import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { listPages } from "@/lib/seo-pages";
import { listBreedEntries, breedPath } from "@/lib/breed-catalog";

/** 발행 페이지가 Blob/로컬에 추가되면 자동 반영 — 네이버·구글 사이트맵 수집용 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.siteUrl.replace(/\/$/, "");
  const pages = await listPages();
  const breeds = listBreedEntries();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/bunyang`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/goyang`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const guides = pages.map((p) => ({
    url: `${base}/guide/${encodeURIComponent(p.slug)}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const breedRoutes = breeds.map((p) => ({
    url: `${base}${breedPath(p)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...guides, ...breedRoutes];
}
