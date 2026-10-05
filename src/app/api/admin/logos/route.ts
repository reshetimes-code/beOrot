import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { addLogos, getClientLogos, removeLogo } from "@/lib/logos";

const unauthorized = () => NextResponse.json({ error: "לא מורשה" }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json({ logos: await getClientLogos() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const form = await request.formData().catch(() => null);
  const files = (form?.getAll("files") ?? []).filter((v): v is File => v instanceof File);
  const added = await addLogos(files);
  if (added === 0) {
    return NextResponse.json(
      { error: "לא נוספו קבצים. נתמכים PNG, JPG, WEBP, SVG עד 5MB." },
      { status: 400 },
    );
  }
  return NextResponse.json({ added, skipped: files.length - added, logos: await getClientLogos() });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!(await removeLogo(id))) {
    return NextResponse.json({ error: "הלוגו לא נמצא" }, { status: 404 });
  }
  return NextResponse.json({ logos: await getClientLogos() });
}
