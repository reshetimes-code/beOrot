"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const BULLETS = [
  {
    title: "ניסיון של 17 שנה מהשטח",
    text: 'כמנכ"לית החברה, הגעתי מעולם ניהול רשתות האופנה (הוניגמן, קרטרס). הניסיון הזה מאפשר לי לזהות את המועמד הנכון לא רק לפי קורות החיים, אלא לפי הצרכים האמיתיים של רצפת המכירה.',
  },
  {
    title: "סינון ב-3 פעימות",
    text: "כל מועמד עובר סינון בוואטסאפ, ראיון מקצועי אצל המגייסות, וראיון סופי ואישי מולי. אף מועמד לא מגיע אליכם מבלי שעבר תחת העין המקצועית שלי.",
  },
  {
    title: "עוצמה דיגיטלית ואנושית",
    text: "מאגר של מעל 5,000 מועמדים רלוונטיים, קבוצות וואטסאפ אזוריות סגורות (600 חברים בכל אחת) וציידי כישרונות בשטח מאילת ועד צפון הארץ.",
  },
];

export default function FounderPhoto() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="קראו עוד על באורות ועל מירב אלהרר"
        className="group relative h-56 w-56 overflow-hidden rounded-full border-2 border-gold/40 shadow-[0_0_30px_rgba(217,162,86,0.25)] transition-transform duration-300 hover:scale-[1.03] sm:h-64 sm:w-64"
      >
        <Image
          src="/about/meirav.jpeg"
          alt="מירב אלהרר, מנכ״לית ובעלים באורות - לחצו לקריאה נוספת"
          fill
          sizes="256px"
          className="object-cover object-top"
        />
        <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-bg/80 px-3 py-1 text-xs font-semibold text-gold-light">
            קראו עוד
          </span>
        </span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-bg-elevated p-8 text-right sm:p-10"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגירה"
                className="gold-focus absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-gold/50 hover:text-gold-light"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold/40">
                  <Image
                    src="/about/meirav.jpeg"
                    alt="מירב אלהרר"
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-heading font-semibold text-ink">
                    מירב אלהרר
                  </p>
                  <p className="text-sm text-ink-dim">
                    מנכ&quot;לית ובעלים, באורות
                  </p>
                </div>
              </div>

              <h3 className="font-heading mt-6 text-xl font-bold text-gold-light sm:text-2xl">
                באורות - המומחים להשמה בעולם הריטייל
              </h3>

              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                <p>
                  אנחנו חברת השמה שדוגלת במודל של Human-Centric Recruitment.
                  עם נסיון של למעלה מ-17 שנים בתחום הריטייל בהתמחות בלעדית,
                  אנו מלווים כיום 35 מותגים מובילים מרשתות בוטיק ועד לקבוצות
                  הקמעונאות הגדולות בישראל.
                </p>
                <p>
                  החברה שלנו פועלת כמרכז לניהול הוליסטי של ההון האנושי ולא
                  כ&quot;מנוע לחיפוש עובדים&quot;.
                </p>
                <p>
                  אנו מלווים את כל שלבי המפגש – מהרגע שבו הניצוץ הראשוני
                  נדלק, ועד להשתלבות והתקרקעות המלאה בארגון.
                </p>
                <p>
                  בשנת 2025 דורגנו כספק מספר 1 של קבוצת פוקס וגולף, בזכות
                  יעילות הגיוס ואחוזי הטמעה (Retention) יוצאי דופן.
                </p>
              </div>

              <h4 className="font-heading mt-7 text-lg font-bold text-ink">
                מה שהופך אותנו למדויקים יותר
              </h4>

              <ul className="mt-4 space-y-4">
                {BULLETS.map((bullet) => (
                  <li
                    key={bullet.title}
                    className="text-sm leading-relaxed text-ink-muted sm:text-base"
                  >
                    <span className="font-semibold text-gold-light">
                      {bullet.title}:
                    </span>{" "}
                    {bullet.text}
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-sm leading-relaxed text-ink-muted sm:text-base">
                אנחנו כאן כדי לספק לכם תהליכי עבודה מהירים ומדויקים שמתאימים
                לקצב הדינמי של השוק.
              </p>

              <p className="font-heading mt-6 border-t border-line pt-6 text-base font-semibold text-gold-light sm:text-lg">
                יוצרים חיבורים אנושיים שמניעים הצלחה ותוצאות לאורך זמן.
              </p>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
