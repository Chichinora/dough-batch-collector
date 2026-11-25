import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { isEditor } from "../../../lib/editor-auth";

export const runtime = "edge";

export async function GET() {
  const result = await env.DB!.prepare("SELECT mixer_no, collected_date, initial_data FROM default_initial_parameters WHERE id=1").first<Record<string, unknown>>();
  return NextResponse.json({ mixerNo: String(result?.mixer_no || ""), collectedDate: String(result?.collected_date || ""), initialData: JSON.parse(String(result?.initial_data || "{}")) });
}

export async function PUT(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const body = await request.json() as { mixerNo?: string; collectedDate?: string; initialData?: Record<string, string> };
  await env.DB!.prepare("INSERT INTO default_initial_parameters (id, mixer_no, collected_date, initial_data, updated_at) VALUES (1, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET mixer_no=excluded.mixer_no, collected_date=excluded.collected_date, initial_data=excluded.initial_data, updated_at=excluded.updated_at")
    .bind(body.mixerNo || null, body.collectedDate || null, JSON.stringify(body.initialData || {}), new Date().toISOString()).run();
  return NextResponse.json({ ok: true });
}
