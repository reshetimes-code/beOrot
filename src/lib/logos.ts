import fs from "node:fs";
import path from "node:path";

const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export type ClientLogo = {
  src: string;
  alt: string;
};

export function getClientLogos(): ClientLogo[] {
  const dir = path.join(process.cwd(), "public", "logosToShow");

  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }

  return files
    .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((file, index) => ({
      src: `/logosToShow/${encodeURIComponent(file)}`,
      alt: `לוגו חברה שעבדנו איתה ${index + 1}`,
    }));
}
