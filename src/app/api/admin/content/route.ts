import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveTexts } from "@/lib/content";

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "פג תוקף ההתחברות. התחברי מחדש." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "הבקשה לא תקינה. רעננו את העמוד ונסי שוב." }, { status: 400 });
  }

  try {
    const errors = await saveTexts(body as Record<string, unknown>);
    if (errors) {
      return NextResponse.json(
        { error: "יש שדות שצריך לתקן. לא נשמר כלום.", fields: errors },
        { status: 422 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "השמירה נכשלה בגלל בעיית אחסון בשרת. נסי שוב בעוד רגע; אם זה חוזר, פני למפתח האתר." },
      { status: 500 },
    );
  }
}
