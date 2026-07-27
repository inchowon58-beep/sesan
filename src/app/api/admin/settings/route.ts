import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  loadAdminSettings,
  publicSettingsView,
  saveAdminSettings,
  verifyMasterPassword,
} from "@/lib/admin-settings";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await loadAdminSettings();
  return NextResponse.json({
    ok: true,
    settings: publicSettingsView(settings),
    geminiApiKey: settings.geminiApiKey || "",
  });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const action = String(body.action || "save-limits");

    if (action === "save-gemini") {
      const geminiApiKey = String(body.geminiApiKey || "").trim();
      const settings = await saveAdminSettings({ geminiApiKey });
      return NextResponse.json({
        ok: true,
        settings: publicSettingsView(settings),
      });
    }

    if (action === "save-limits") {
      if (!verifyMasterPassword(String(body.masterPassword || ""))) {
        return NextResponse.json(
          { error: "마스터 비밀번호가 올바르지 않습니다." },
          { status: 403 }
        );
      }
      const dailyLimit = Math.max(0, Math.floor(Number(body.dailyLimit) || 0));
      const totalLimit = Math.max(0, Math.floor(Number(body.totalLimit) || 0));
      const settings = await saveAdminSettings({ dailyLimit, totalLimit });
      return NextResponse.json({
        ok: true,
        settings: publicSettingsView(settings),
      });
    }

    return NextResponse.json({ error: "알 수 없는 요청" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "설정 저장 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
