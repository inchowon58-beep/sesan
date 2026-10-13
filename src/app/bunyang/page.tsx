import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { listBreedEntries, breedPath, BREED_PHONE } from "@/lib/breed-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "강아지분양 | 화이트테리어분양·입양",
  description: `${SITE.brand} 강아지분양 — 화이트테리어분양·화이트테리어입양 지역별 안내. 상담 ${BREED_PHONE}`,
  alternates: { canonical: `${SITE.siteUrl}/bunyang` },
};

const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BunyangIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = listBreedEntries();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const current = Math.min(pageNum, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);

  return (
    <div className="container min-h-screen py-28">
      <p className="eyebrow">Adoption</p>
      <h1 className="section-title">강아지분양</h1>
      <p className="section-lead">
        총 {total}건 · 페이지당 {PAGE_SIZE}개 · 화이트테리어분양·입양 안내 · 상담{" "}
        {BREED_PHONE}
      </p>

      <ul className="mt-10 divide-y divide-[var(--line)] border border-[var(--line)] bg-[var(--ivory)] rounded-2xl">
        {slice.map((p, i) => {
          const no = start + i + 1;
          return (
            <li key={p.slug}>
              <Link
                href={breedPath(p.slug)}
                className="flex gap-4 px-5 py-4 transition hover:bg-white"
              >
                <span className="w-10 shrink-0 font-display text-xl text-[var(--gold-deep)]">
                  {String(no).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-xs text-[var(--gold-deep)]">{p.intent}</div>
                  <div className="font-display text-xl text-[var(--ink)]">{p.keyword}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                    {p.region
                      ? `${p.region} 지역 화이트테리어 ${p.intent.includes("입양") ? "입양" : "분양"} 상담`
                      : `전국 화이트테리어 ${p.intent.includes("입양") ? "입양" : "분양"} 상담`}{" "}
                    · {BREED_PHONE}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-10 mb-8 flex flex-wrap items-center justify-center gap-2 pb-8"
          aria-label="페이지"
        >
          {current > 1 && (
            <Link
              href={current - 1 === 1 ? "/bunyang" : `/bunyang?page=${current - 1}`}
              className="min-w-10 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-center text-sm font-semibold text-[var(--ink)]"
            >
              이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => {
              if (totalPages <= 12) return true;
              if (n === 1 || n === totalPages) return true;
              return Math.abs(n - current) <= 3;
            })
            .map((n, idx, arr) => {
              const prev = arr[idx - 1];
              const gap = prev && n - prev > 1;
              return (
                <span key={n} className="contents">
                  {gap && (
                    <span className="px-1 text-[var(--muted)]" aria-hidden>
                      …
                    </span>
                  )}
                  <Link
                    href={n === 1 ? "/bunyang" : `/bunyang?page=${n}`}
                    className={`min-w-10 rounded-full px-3 py-2 text-center text-sm font-semibold ${
                      n === current
                        ? "bg-[var(--color,#1a2f55)] text-white"
                        : "border border-[var(--line)] bg-white text-[var(--ink)]"
                    }`}
                  >
                    {n}
                  </Link>
                </span>
              );
            })}
          {current < totalPages && (
            <Link
              href={`/bunyang?page=${current + 1}`}
              className="min-w-10 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-center text-sm font-semibold text-[var(--ink)]"
            >
              다음
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
