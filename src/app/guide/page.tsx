import type { Metadata } from "next";
import Link from "next/link";
import { listPages, pagePath } from "@/lib/seo-pages";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "강아지 파양·분양 안내글",
  description: `${SITE.brand} 강아지 파양입소·무료분양 안내글 모음 — 전국 파양 상담 가이드`,
  alternates: { canonical: `${SITE.siteUrl}/guide` },
};

const PAGE_SIZE = 25;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function GuideIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNum = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const all = await listPages();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const current = Math.min(pageNum, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);

  return (
    <div className="container min-h-screen py-28">
      <p className="eyebrow">Archive</p>
      <h1 className="section-title">강아지 파양·분양 안내글</h1>
      <p className="section-lead">
        총 {total}건 · {SITE.brand} 전국 파양입소·무료분양 가이드
      </p>

      <ul className="mt-10 divide-y divide-[var(--line)] border border-[var(--line)] bg-[var(--ivory)] rounded-2xl">
        {slice.length === 0 && (
          <li className="px-5 py-8 text-[var(--muted)]">등록된 안내글이 없습니다.</li>
        )}
        {slice.map((p, i) => {
          const no = start + i + 1;
          return (
            <li key={p.slug}>
              <Link
                href={pagePath(p.slug)}
                className="flex gap-4 px-5 py-4 transition hover:bg-white"
              >
                <span className="w-10 shrink-0 font-display text-xl text-[var(--gold-deep)]">
                  {String(no).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-xs text-[var(--gold-deep)]">{p.keyword}</div>
                  <div className="font-display text-xl text-[var(--ink)]">{p.h1}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                    {p.metaDescription}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {totalPages >= 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="페이지">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? "/guide" : `/guide?page=${n}`}
              className={`min-w-9 rounded-full px-2 py-1 text-center text-sm ${
                n === current
                  ? "bg-[var(--bronze)] text-white"
                  : "border border-[var(--line)] bg-white rounded-xl text-[var(--ink)]"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
