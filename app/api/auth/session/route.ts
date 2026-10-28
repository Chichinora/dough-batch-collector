import { NextResponse } from "next/server";
import { isEditor } from "../../../../lib/editor-auth";
export const runtime = "edge";
export async function GET(request: Request) { return NextResponse.json({ editor: await isEditor(request) }); }
