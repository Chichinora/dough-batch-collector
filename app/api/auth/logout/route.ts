import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST() { const response = NextResponse.json({ ok: true }); response.headers.set("Set-Cookie", "editor_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"); return response; }
