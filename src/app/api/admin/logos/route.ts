import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { addLogos, getClientLogos, removeLogo } from "@/lib/logos";

const unauthorized = () =>
  NextResponse.json({ error: "פג תוקף ההתחברות. התחברי מחדש." }, { status: 401 });
const serverError = () =>
  NextResponse.json(
    { error: "שגיאת שרת בעת עבודה עם האחסון. נסי שוב בעוד רגע; אם זה חוזר, פני למפתח האתר." },
    { status: 500 },
  );

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json({ logos: await getClientLogos() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const form = await request.formData().catch(() => null);
    const files = (form?.getAll("files") ?? []).filter((v): v is File => v instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: "לא נבחר קובץ." }, { status: 400 });
    }
    if (files.length > 20) {
      return NextResponse.json({ error: "אפשר להעלות עד 20 קבצים בבת אחת." }, { status: 400 });
    }
    const { added, rejected } = await addLogos(files);
    return NextResponse.json({ added, rejected, logos: await getClientLogos() });
  } catch {
    return serverError();
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const id = new URL(request.url).searchParams.get("id") ?? "";
    if (!(await removeLogo(id))) {
      return NextResponse.json(
        { error: "הלוגו כבר לא קיים (אולי הוסר ממכשיר אחר). רעננו את העמוד." },
        { status: 404 },
      );
    }
    return NextResponse.json({ logos: await getClientLogos() });
  } catch {
    return serverError();
  }
}
