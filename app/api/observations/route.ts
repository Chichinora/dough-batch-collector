import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { isEditor } from "../../../lib/editor-auth";
export const runtime = "edge";
const now = () => new Date().toISOString();
const shape = (item: Record<string, unknown>) => ({ ...item, data: JSON.parse(String(item.data || "{}")) });
export async function GET(request: Request) {
  const batchId = new URL(request.url).searchParams.get("batchId");
  const result = batchId
    ? await env.DB!.prepare("SELECT * FROM observations WHERE batch_id=? ORDER BY batch_id, CAST(elapsed_seconds AS REAL), timestamp").bind(batchId).all()
    : await env.DB!.prepare("SELECT * FROM observations ORDER BY batch_id, CAST(elapsed_seconds AS REAL), timestamp").all();
  return NextResponse.json((result.results || []).map((x) => shape(x as Record<string, unknown>)));
}
export async function POST(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const b = await request.json() as any; const time = now();
  const result = await env.DB!.prepare("INSERT INTO observations (batch_id,timestamp,elapsed_seconds,data,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?)")
    .bind(b.batchId, b.timestamp, b.elapsedSeconds || null, JSON.stringify(b.data || {}), b.notes || null, time, time).run();
  return NextResponse.json({ id: result.meta.last_row_id }, { status: 201 });
}
export async function PUT(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const b = await request.json() as any;
  await env.DB!.prepare("UPDATE observations SET timestamp=?,elapsed_seconds=?,data=?,notes=?,updated_at=? WHERE id=?")
    .bind(b.timestamp,b.elapsedSeconds || null,JSON.stringify(b.data || {}),b.notes || null,now(),b.id).run();
  return NextResponse.json({ ok: true });
}
export async function DELETE(request: Request) {
  if (!await isEditor(request)) return NextResponse.json({ error: "請先登入才可編輯" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  await env.DB!.prepare("DELETE FROM observations WHERE id=?").bind(id).run();
  return NextResponse.json({ ok: true });
}
