import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { assembleSeoPage, generateWithGemini } from "@/lib/gemini";
import { generateTemplateContent } from "@/lib/template-content";
import { savePage, pagePath } from "@/lib/seo-pages";
import { absoluteGuideUrl, submitIndexNow } from "@/lib/indexnow";
import {
  checkAdminPublishQuota,
  incrementAdminPublishCount,
  loadAdminSettings,
} from "@/lib/admin-settings";

/**
 * 관리자 1건 발행 → 저장 후 IndexNow 즉시 요청
 * mode=gemini (기본) | template
 * ※ 로컬 tools/webdoc 대량등록은 이 API를 쓰지 않으므로 한도 예외
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const quota = await checkAdminPublishQuota();
    if (!quota.ok) {
      return NextResponse.json({ error: quota.error }, { status: 429 });
    }

    const body = await req.json();
    const keyword = String(body.keyword || "").trim();
    if (!keyword) {
      return NextResponse.json({ error: "키워드를 입력하세요." }, { status: 400 });
    }
    const mode = String(body.mode || "gemini").toLowerCase();
    let page;
    if (mode === "template") {
      page = generateTemplateContent(keyword, Date.now() % 1000);
    } else {
      const saved = await loadAdminSettings();
      const apiKey =
        String(body.apiKey || "").trim() || saved.geminiApiKey || undefined;
      const partial = await generateWithGemini(keyword, apiKey);
      page = assembleSeoPage(partial);
    }
    await savePage(page);
    const after = await incrementAdminPublishCount();

    const pageUrl = absoluteGuideUrl(page.slug);
    const indexNow = await submitIndexNow([pageUrl]);

    return NextResponse.json({
      ok: true,
      slug: page.slug,
      path: pagePath(page.slug),
      title: page.title,
      url: pageUrl,
      indexNow,
      quota: {
        publishedToday: after.publishedToday,
        publishedTotal: after.publishedTotal,
        dailyLimit: after.dailyLimit,
        totalLimit: after.totalLimit,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "발행 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
