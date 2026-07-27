import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { listPages } from "@/lib/seo-pages";

/** 발행 페이지가 Blob/로컬에 추가되면 자동 반영 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.siteUrl.replace(/\/$/, "");
  const pages = await listPages();
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
  ];

  const guides = pages.map((p) => ({
    url: `${base}/guide/${encodeURIComponent(p.slug)}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...guides];
}
