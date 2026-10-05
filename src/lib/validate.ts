// ולידציה משותפת: רצה גם בדפדפן (משוב מיידי) וגם בשרת (הגנה אמיתית).
// כל הודעה אומרת מה השתבש ומה לעשות.

export type FieldDef = { key: string; label: string; multiline?: boolean };
export type FieldErrors = Record<string, string>;

const MAX_SINGLE = 150;
const MAX_MULTI = 1500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateTexts(
  texts: Record<string, unknown>,
  fields: readonly FieldDef[],
): FieldErrors {
  const errors: FieldErrors = {};

  for (const { key, label, multiline } of fields) {
    const raw = texts[key];
    if (typeof raw !== "string") {
      errors[key] = `השדה "${label}" חסר. רענני את העמוד ונסי שוב.`;
      continue;
    }
    const v = raw.trim();
    const max = multiline ? MAX_MULTI : MAX_SINGLE;

    if (v.length > max) {
      errors[key] = `"${label}" ארוך מדי (${v.length} תווים, מקסימום ${max}). קצרי את הטקסט.`;
      continue;
    }

    if (/^stats\.\d\.value$/.test(key)) {
      if (!/^\d{1,7}$/.test(v)) {
        errors[key] = `"${label}" חייב להיות מספר שלם בלבד, בלי רווחים, פסיקים או אותיות (למשל 5000).`;
      }
    } else if (/^stats\.\d\.suffix$/.test(key)) {
      if (v.length > 5) errors[key] = `"${label}" יכול להכיל עד 5 תווים (למשל +). אפשר להשאיר ריק.`;
    } else if (key === "contact.whatsapp") {
      if (!/^\d{9,15}$/.test(v)) {
        errors[key] = `"${label}" חייב להכיל ספרות בלבד, כולל קידומת מדינה, בלי + ובלי מקפים (למשל 972502005509).`;
      }
    } else if (key === "contact.email") {
      if (!EMAIL.test(v)) errors[key] = `"${label}" אינו כתובת אימייל תקינה (למשל name@domain.com).`;
    } else if (key === "contact.phone") {
      if (!/^[+\d\s()-]{7,20}$/.test(v)) {
        errors[key] = `"${label}" אמור להכיל ספרות בלבד (אפשר גם + רווחים ומקפים), למשל +972 50-200-5509.`;
      }
    } else if (v.length === 0) {
      errors[key] = `"${label}" ריק. כתבי טקסט, אחרת יופיע חלל ריק באתר.`;
    }
  }

  return errors;
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const IMAGE_EXTENSIONS: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

/** סוג התמונה: לפי הדפדפן, ואם חסר (קורה בטלפונים) לפי סיומת הקובץ. */
export function detectImageType(name: string, browserType: string): string | null {
  if (Object.values(IMAGE_EXTENSIONS).includes(browserType)) return browserType;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS[ext] ?? null;
}

/** בדיקה לפני שליחה, לפי שם/סוג/גודל. מחזיר הודעת שגיאה או null אם תקין. */
export function validateImageMeta(name: string, type: string, size: number): string | null {
  if (/\.(heic|heif)$/i.test(name)) {
    return "תמונות HEIC (פורמט ברירת המחדל של אייפון) לא נתמכות. שמרי את התמונה כ-JPG או PNG ונסי שוב.";
  }
  if (!detectImageType(name, type)) {
    return "סוג קובץ לא נתמך. אפשר להעלות רק PNG, JPG, WEBP או SVG.";
  }
  if (size === 0) return "הקובץ ריק. בחרי קובץ אחר.";
  if (size > MAX_UPLOAD_BYTES) {
    const mb = (size / 1024 / 1024).toFixed(1);
    return `הקובץ גדול מדי (${mb}MB, מקסימום 5MB). כווצי את התמונה או שמרי אותה בגודל קטן יותר.`;
  }
  return null;
}
