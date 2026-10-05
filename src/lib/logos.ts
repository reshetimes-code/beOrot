import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { readJson, writeJson, UPLOADS_DIR } from "@/lib/store";

const SEED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export const UPLOAD_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type ClientLogo = {
  id: string;
  src: string;
  alt: string;
  upload: boolean;
};

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

export async function addLogos(files: File[]): Promise<number> {
  const logos = await readLogos();
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const added: ClientLogo[] = [];

  for (const file of files) {
    const ext = UPLOAD_TYPES[file.type];
    if (!ext || file.size === 0 || file.size > MAX_UPLOAD_BYTES) continue;
    const name = `${randomBytes(8).toString("hex")}${ext}`;
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
    added.push({ id: `upload-${name}`, src: `/uploads/${name}`, alt: "", upload: true });
  }

  if (added.length > 0) await writeJson(FILE, [...added, ...logos]);
  return added.length;
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
