import { readJson, writeJson } from "@/lib/store";
import { validateTexts, type FieldErrors } from "@/lib/validate";

type Field = {
  key: string;
  label: string;
  group: string;
  value: string;
  multiline?: boolean;
};

const f = (
  group: string,
  key: string,
  label: string,
  value: string,
  multiline = false,
): Field => ({ group, key, label, value, multiline });

export const FIELDS = [
  f("ראש העמוד", "hero.title.pre", "כותרת - תחילת המשפט", "עוצמה שפוגשת"),
  f("ראש העמוד", "hero.title.highlight", "כותרת - מילה מודגשת (זהב)", "אנשים"),
  f("ראש העמוד", "hero.tagline", "שורת משנה", "עוצמה פוגשת קלילות"),
  f("ראש העמוד", "hero.text", "טקסט פתיחה", "אנחנו מחברות בין אנשים, הזדמנויות וארגונים בדרך מדויקת, מהירה ואנושית יותר.", true),
  f("ראש העמוד", "hero.cta", "כפתור", "מחפשים עובדים? דברו איתנו"),

  f("משפט המותג (גלילה)", "brand.line1", "שורה 1", "לפני שאנשים הם נתונים"),
  f("משפט המותג (גלילה)", "brand.line2", "שורה 2", "הם חיבור לשטח, לתפקיד ולארגון"),
  f("משפט המותג (גלילה)", "brand.logo", "שורה 3 (שם המותג)", "BE-OROT"),

  f("מאירים את הגיוס", "illuminate.badge", "תגית", "מאירים את הגיוס."),
  f("מאירים את הגיוס", "illuminate.title", "כותרת", "החברה שלנו מעניקה שירות בפריסה ארצית רחבה, מתוך מחויבות לדיוק המרבי.", true),
  f("מאירים את הגיוס", "illuminate.text", "טקסט", "אנחנו דואגים לסובב את כל הנורות הנכונות כדי שגם אתם תהיו באורות מהגיוס הבא שלכם.", true),

  f("עוצמה וקלילות", "founder.name", "שם המנכ\"לית", "מירב אלהרר"),
  f("עוצמה וקלילות", "founder.role", "תפקיד", "מנכ\"לית ובעלים, באורות"),
  f("עוצמה וקלילות", "founder.quote1", "ציטוט - שורה 1", "הטכנולוגיה היא לא הפתרון, היא רק הכלי."),
  f("עוצמה וקלילות", "founder.quote2", "ציטוט - שורה 2", "הלב של העסק הוא הקשר האנושי."),
  f("עוצמה וקלילות", "power.heading", "כותרת ראשית", "עוצמה פוגשת קלילות"),
  f("עוצמה וקלילות", "power.left.title", "כרטיס ימני - כותרת", "עוצמה"),
  f("עוצמה וקלילות", "power.left.text", "כרטיס ימני - טקסט", "היכולת להגיע לייעוד, לפתוח שווקים, להביא מאסות של מועמדים איכותיים ולייצר נוכחות חזקה עבור המעסיק.", true),
  f("עוצמה וקלילות", "power.right.title", "כרטיס שמאלי - כותרת", "קלילות ודיוק אנושי"),
  f("עוצמה וקלילות", "power.right.text", "כרטיס שמאלי - טקסט", "אנחנו לא מסתפקות בסינון אלגוריתמי. כל מועמד עובר דרכנו מענה אנושי, בחינת היכולות, הדרייב וה\"טיפ\" הייחודי שלו. הגיוס נעשה בחיבור קל, מהיר ובאמינות שקופה.", true),

  f("מספרים", "stats.1.value", "מספר 1 - ערך", "17"),
  f("מספרים", "stats.1.suffix", "מספר 1 - סיומת (למשל +)", "+"),
  f("מספרים", "stats.1.label", "מספר 1 - תיאור", "שנות ניסיון בריטייל"),
  f("מספרים", "stats.2.value", "מספר 2 - ערך", "35"),
  f("מספרים", "stats.2.suffix", "מספר 2 - סיומת (למשל +)", ""),
  f("מספרים", "stats.2.label", "מספר 2 - תיאור", "מותגים מובילים"),
  f("מספרים", "stats.3.value", "מספר 3 - ערך", "5000"),
  f("מספרים", "stats.3.suffix", "מספר 3 - סיומת (למשל +)", "+"),
  f("מספרים", "stats.3.label", "מספר 3 - תיאור", "מועמדים במאגר"),
  f("מספרים", "stats.4.value", "מספר 4 - ערך", "3"),
  f("מספרים", "stats.4.suffix", "מספר 4 - סיומת (למשל +)", ""),
  f("מספרים", "stats.4.label", "מספר 4 - תיאור", "פעימות סינון לכל מועמד"),

  f("השיטה", "method.title", "כותרת", "גיוס. השמה. הטמעה."),
  f("השיטה", "method.text", "טקסט", "מהרגע שבו הניצוץ הראשוני נדלק ועד להשתלבות והתקרקעות המלאה בארגון.", true),
  f("השיטה", "method.1.title", "שלב 1 - כותרת", "גיוס"),
  f("השיטה", "method.1.subtitle", "שלב 1 - כותרת משנה", "למצוא את המועמדים עם הניצוץ"),
  f("השיטה", "method.1.text", "שלב 1 - טקסט", "מדיוק היכולות ועד חיבור ל-DNA שלכם - תהליך המיון וההיכרות עם השטח שלנו מייעלים את הסינון הראשוני ומבטיחים מועמדים שמתאימים בדיוק לסטנדרטים שלכם.", true),
  f("השיטה", "method.2.title", "שלב 2 - כותרת", "השמה"),
  f("השיטה", "method.2.subtitle", "שלב 2 - כותרת משנה", "דיוק"),
  f("השיטה", "method.2.text", "שלב 2 - טקסט", "מהתאמת הצרכים ועד לחיזוק הבחירה - אנו מעניקים מעטפת ביטחון מלאה למעסיק ולמועמד כאחד. הליווי שלנו כולל דיוק של תנאי ההעסקה, העצמת התפקיד וליווי אישי צמוד עד ליום פתיחת ההכשרה.", true),
  f("השיטה", "method.3.title", "שלב 3 - כותרת", "הטמעה"),
  f("השיטה", "method.3.subtitle", "שלב 3 - כותרת משנה", "בהירות"),
  f("השיטה", "method.3.text", "שלב 3 - טקסט", "מבניית אמון ועד להצלחה בשטח - אנו מלווים את תהליך ההטמעה כדי להבטיח תוצאות בשטח. הליווי שלנו כולל מעקב צמוד, מתן כלים ניהוליים ומקצועיים והכוונה עסקית.", true),

  f("מעסיקים", "employers.title1", "כותרת - שורה 1", "האנשים הנכונים."),
  f("מעסיקים", "employers.title2", "כותרת - שורה 2 (זהב)", "בזמן הנכון."),
  f("מעסיקים", "employers.text", "טקסט", "באורות משלבת הגעה רחבה לשוק המועמדים עם סינון מקצועי ואנושי, כדי להביא לכם בדיוק את מי שאתם צריכים - במהירות, באמינות ובשקיפות מלאה לאורך כל התהליך.", true),
  f("מעסיקים", "employers.cta", "כפתור", "בואו נמצא את האנשים שלכם"),
  f("מעסיקים", "employers.point.1", "נקודה 1", "חשיפה רחבה"),
  f("מעסיקים", "employers.point.2", "נקודה 2", "איתור מועמדים"),
  f("מעסיקים", "employers.point.3", "נקודה 3", "סינון מקצועי"),
  f("מעסיקים", "employers.point.4", "נקודה 4", "דיוק"),
  f("מעסיקים", "employers.point.5", "נקודה 5", "מהירות"),
  f("מעסיקים", "employers.point.6", "נקודה 6", "אמינות"),
  f("מעסיקים", "employers.point.7", "נקודה 7", "שקיפות"),
  f("מעסיקים", "employers.point.8", "נקודה 8", "יחס אישי"),

  f("לקוחות", "clients.label", "תגית", "לקוחות"),
  f("לקוחות", "clients.title", "כותרת", "חברות שכבר עבדו איתנו"),
  f("לקוחות", "clients.text", "טקסט", "החיבורים שכבר יצרנו בדרך."),

  f("צור קשר ופוטר", "contact.label", "תגית", "צור קשר"),
  f("צור קשר ופוטר", "contact.title", "כותרת", "בואו נדליק את החיבור הבא."),
  f("צור קשר ופוטר", "contact.text", "טקסט", "בין אם אתם מחפשים את האדם הבא לארגון שלכם, או את ההזדמנות הבאה בקריירה שלכם - אנחנו כאן.", true),
  f("צור קשר ופוטר", "contact.whatsapp.cta", "כפתור וואטסאפ", "דברו איתנו ב-WhatsApp"),
  f("צור קשר ופוטר", "contact.whatsapp", "מספר וואטסאפ (ספרות בלבד, עם קידומת מדינה)", "972502005509"),
  f("צור קשר ופוטר", "contact.phone", "מספר טלפון להצגה בפוטר", "+972 50-200-5509"),
  f("צור קשר ופוטר", "contact.email", "אימייל להצגה וליצירת קשר", "meirav@be-orot.com"),
] as const satisfies readonly Field[];

export type TextKey = (typeof FIELDS)[number]["key"];
export type Texts = Record<TextKey, string>;

export const DEFAULT_TEXTS = Object.fromEntries(
  FIELDS.map((field) => [field.key, field.value]),
) as Texts;

const FILE = "content.json";

export async function getTexts(): Promise<Texts> {
  const saved = (await readJson<Partial<Record<string, string>>>(FILE)) ?? {};
  const texts = { ...DEFAULT_TEXTS };
  for (const key of Object.keys(DEFAULT_TEXTS) as TextKey[]) {
    if (typeof saved[key] === "string") texts[key] = saved[key];
  }
  return texts;
}

/** שומר את הטקסטים אם הם תקינים; אחרת מחזיר שגיאות לפי שדה ולא כותב כלום. */
export async function saveTexts(input: Record<string, unknown>): Promise<FieldErrors | null> {
  const errors = validateTexts(input, FIELDS);
  if (Object.keys(errors).length > 0) return errors;

  const clean: Partial<Texts> = {};
  for (const key of Object.keys(DEFAULT_TEXTS) as TextKey[]) {
    clean[key] = (input[key] as string).trim();
  }
  await writeJson(FILE, clean);
  return null;
}
