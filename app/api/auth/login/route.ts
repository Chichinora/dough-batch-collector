import { NextResponse } from "next/server";
import { credentialsValid, sessionCookie } from "../../../../lib/editor-auth";
export const runtime = "edge";
export async function POST(request: Request) { const body = await request.json() as { username?: string; password?: string }; if (!await credentialsValid(body.username || "", body.password || "")) return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 }); const response = NextResponse.json({ ok: true }); response.headers.set("Set-Cookie", await sessionCookie()); return response; }
