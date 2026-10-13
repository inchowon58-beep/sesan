import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { listBreedEntries, BREED_PHONE } from "@/lib/breed-catalog";
import BreedList from "@/app/bunyang/BreedList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "고양이분양 | 묘종별 분양 안내",
  description: `${SITE.brand} 고양이분양 — 묘종·지역별 분양 상담 안내. 문의 ${BREED_PHONE}`,
  alternates: { canonical: `${SITE.siteUrl}/goyang` },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function GoyangIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = listBreedEntries("cat");
  return (
    <BreedList
      title="고양이분양"
      lead="묘종·지역별 고양이 분양 안내"
      basePath="/goyang"
      all={all}
      pageNum={pageNum}
    />
  );
}
