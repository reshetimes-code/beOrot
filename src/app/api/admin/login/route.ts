import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  adminEnabled,
  checkPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

// הגבלת ניסיונות כושלים לפי כתובת IP (בזיכרון של המופע; מספיק כדי לעצור ניחושים).
const MAX_FAILS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const fails = new Map<string, { count: number; first: number }>();

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "הניהול כבוי כי לא הוגדרה סיסמה בשרת. פני למפתח האתר." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = fails.get(ip);
  if (entry && now - entry.first > WINDOW_MS) fails.delete(ip);

  const current = fails.get(ip);
  if (current && current.count >= MAX_FAILS) {
    return NextResponse.json(
      { error: "יותר מדי ניסיונות שגויים. נסי שוב בעוד 10 דקות." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "יש להזין סיסמה." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    fails.set(ip, { count: (current?.count ?? 0) + 1, first: current?.first ?? now });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(
      { error: "הסיסמה שגויה. בדקי שהמקלדת בעברית/אנגלית הנכונה ושאין רווח בסוף." },
      { status: 401 },
    );
  }

  fails.delete(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return NextResponse.json({ ok: true });
}
