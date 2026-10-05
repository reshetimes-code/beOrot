import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    // Slow down brute-force attempts.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return NextResponse.json({ ok: true });
}
