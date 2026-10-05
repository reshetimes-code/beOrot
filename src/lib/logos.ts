import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { readJson, writeJson, UPLOADS_DIR } from "@/lib/store";
import { detectImageType, validateImageMeta } from "@/lib/validate";

const SEED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

// כל לוגו מנורמל לקנבס שקוף ביחס 3:2 (כמו כרטיס הלוגו באתר), עם שוליים אחידים.
const CANVAS = { width: 480, height: 288 };
const CONTENT = { width: 400, height: 220 };
export const MAX_LOGOS = 200;

export type ClientLogo = {
  id: string;
  src: string;
  alt: string;
  upload: boolean;
};

export type Rejected = { name: string; reason: string };

const FILE = "logos.json";

async function seedFromPublic(): Promise<ClientLogo[]> {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "logosToShow");
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  return files
    .filter((file) => SEED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((file) => ({
      id: `static-${file}`,
      src: `/logosToShow/${encodeURIComponent(file)}`,
      alt: "",
      upload: false,
    }));
}

async function readLogos(): Promise<ClientLogo[]> {
  const saved = await readJson<ClientLogo[]>(FILE);
  return saved ?? (await seedFromPublic());
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  const logos = await readLogos();
  return logos.map((logo, i) => ({ ...logo, alt: `לוגו חברה שעבדנו איתה ${i + 1}` }));
}

/**
 * מכין את הלוגו לתצוגה: מיישר לפי EXIF, חותך שוליים ריקים (רקע לבן/שקוף),
 * מתאים לגודל אחיד ומרכז על קנבס שקוף. תמיד מחזיר PNG.
 * אם sharp לא מצליח לפענח, הקובץ לא תמונה אמיתית.
 */
async function normalizeLogo(input: Buffer): Promise<Buffer> {
  const base = await sharp(input, { density: 300, limitInputPixels: 50_000_000 })
    .rotate()
    .png()
    .toBuffer();

  let cropped = base;
  try {
    cropped = await sharp(base).trim({ threshold: 12 }).toBuffer();
  } catch {
    // תמונה אחידה לגמרי: משאירים כמו שהיא
  }

  const fitted = await sharp(cropped)
    .resize(CONTENT.width, CONTENT.height, { fit: "inside", kernel: "lanczos3" })
    .toBuffer();

  return sharp({
    create: { ...CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const BAD_CONTENT =
  "הקובץ פגום או שאינו תמונה אמיתית מהסוג שנבחר. נסי לייצא אותו מחדש ולהעלות שוב.";

/** מוודא שתוכן הקובץ באמת תואם לסוג שלו (לא רק השם), ושב-SVG אין קוד להרצה. */
function contentProblem(buf: Buffer, type: string): string | null {
  if (type === "image/png") {
    return buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) ? null : BAD_CONTENT;
  }
  if (type === "image/jpeg") {
    return buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ? null : BAD_CONTENT;
  }
  if (type === "image/webp") {
    const ok = buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
    return ok ? null : BAD_CONTENT;
  }
  const text = buf.toString("utf8");
  if (!/<svg[\s>]/i.test(text)) return BAD_CONTENT;
  if (/<script|\son\w+\s*=|javascript:|<foreignObject/i.test(text)) {
    return "קובץ ה-SVG מכיל קוד שאינו מותר מטעמי אבטחה. ייצאי אותו מחדש כ-PNG או השתמשי בגרסת SVG נקייה.";
  }
  return null;
}

export async function addLogos(files: File[]): Promise<{ added: number; rejected: Rejected[] }> {
  const logos = await readLogos();
  const rejected: Rejected[] = [];
  const added: ClientLogo[] = [];
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  for (const file of files) {
    if (logos.length + added.length >= MAX_LOGOS) {
      rejected.push({
        name: file.name,
        reason: `הגעת למקסימום של ${MAX_LOGOS} לוגואים. הסירי לוגואים ישנים לפני שמוסיפים חדשים.`,
      });
      continue;
    }
    const metaProblem = validateImageMeta(file.name, file.type, file.size);
    if (metaProblem) {
      rejected.push({ name: file.name, reason: metaProblem });
      continue;
    }
    const type = detectImageType(file.name, file.type) as string;
    const buf = Buffer.from(await file.arrayBuffer());
    const problem = contentProblem(buf, type);
    if (problem) {
      rejected.push({ name: file.name, reason: problem });
      continue;
    }
    let normalized: Buffer;
    try {
      normalized = await normalizeLogo(buf);
    } catch {
      rejected.push({ name: file.name, reason: BAD_CONTENT });
      continue;
    }
    const name = `${randomBytes(8).toString("hex")}.png`;
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOADS_DIR, name), normalized);
    added.push({ id: `upload-${name}`, src: `/uploads/${name}`, alt: "", upload: true });
  }

  if (added.length > 0) await writeJson(FILE, [...added, ...logos]);
  return { added: added.length, rejected };
}

export async function removeLogo(id: string): Promise<boolean> {
  const logos = await readLogos();
  const target = logos.find((logo) => logo.id === id);
  if (!target) return false;
  await writeJson(
    FILE,
    logos.filter((logo) => logo.id !== id),
  );
  if (target.upload) {
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOADS_DIR, path.basename(target.src)), { force: true });
  }
  return true;
}
