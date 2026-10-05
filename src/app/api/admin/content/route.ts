import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveTexts } from "@/lib/content";

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }
  await saveTexts(body as Record<string, unknown>);
  return NextResponse.json({ ok: true });
}
