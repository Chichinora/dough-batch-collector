import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { isEditor } from "../../../lib/editor-auth";

export const runtime = "edge";

const now = () => new Date().toISOString();
const row = (item: Record<string, unknown>) => ({ ...item, initialData: JSON.parse(String(item.initial_data || "{}")) });

export async function GET() {
  const result = await env.DB!.prepare("SELECT * FROM batches ORDER BY updated_at DESC").all();
  return NextResponse.json((result.results || []).map((x) => row(x as Record<string, unknown>)));
}

export async function POST(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const body = await request.json() as any;
  const batchId = String(body.batchId || "").trim();
  if (!batchId) return NextResponse.json({ error: "請輸入生產批次編號" }, { status: 400 });
  const time = now();
  try {
    await env.DB!.prepare("INSERT INTO batches (batch_id, mixer_no, collected_date, initial_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(batchId, body.mixerNo || null, body.collectedDate || null, JSON.stringify(body.initialData || {}), time, time).run();
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "此 Batch ID 已存在" }, { status: 409 }); }
}

export async function PUT(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const body = await request.json() as any;
  await env.DB!.prepare("UPDATE batches SET mixer_no=?, collected_date=?, initial_data=?, updated_at=? WHERE batch_id=?")
    .bind(body.mixerNo || null, body.collectedDate || null, JSON.stringify(body.initialData || {}), now(), body.batchId).run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const batchId = new URL(request.url).searchParams.get("batchId");
  if (!batchId) return NextResponse.json({ error: "batchId is required" }, { status: 400 });
  await env.DB!.batch([env.DB!.prepare("DELETE FROM observations WHERE batch_id=?").bind(batchId), env.DB!.prepare("DELETE FROM batches WHERE batch_id=?").bind(batchId)]);
  return NextResponse.json({ ok: true });
}
