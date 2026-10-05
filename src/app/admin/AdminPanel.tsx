"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ClientLogo } from "@/lib/logos";
import { validateImageMeta, validateTexts } from "@/lib/validate";
import {
  alertError,
  alertList,
  alertSuccess,
  alertWarning,
  closeAlert,
  confirmBox,
  showLoading,
} from "./alerts";

type FieldDef = {
  key: string;
  label: string;
  group: string;
  value: string;
  multiline?: boolean;
};

type ApiResult = { ok: boolean; status: number; data: Record<string, unknown> | null };

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3.5 text-base text-ink outline-none transition focus:border-gold";
const buttonClass =
  "min-h-12 rounded-full bg-gold px-6 py-3 text-base font-semibold text-[#150f06] transition active:scale-[0.98] disabled:opacity-50";

/** קריאת API אחת עם טיפול אחיד בשגיאות רשת. */
async function api(url: string, init?: RequestInit): Promise<ApiResult> {
  try {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

function apiMessage(r: ApiResult): string {
  if (r.status === 0) return "אין חיבור לאינטרנט או שהשרת לא זמין. בדקי את החיבור ונסי שוב.";
  return (r.data?.error as string) ?? `שגיאה לא צפויה (קוד ${r.status}). נסי שוב.`;
}

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (!password.trim()) {
      alertWarning("חסרה סיסמה", "הקלידי את הסיסמה ולחצי על כניסה.");
      return;
    }
    setBusy(true);
    const r = await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (r.ok) router.refresh();
    else alertError("לא ניתן להתחבר", apiMessage(r));
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 flex max-w-sm flex-col gap-4 sm:mt-24">
      <h1 className="font-heading text-center text-2xl font-bold">כניסה לניהול האתר</h1>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        placeholder="סיסמה"
        className={inputClass}
      />
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "נכנסת..." : "כניסה"}
      </button>
    </form>
  );
}

export function AdminPanel({
  fields,
  initialTexts,
  initialLogos,
}: {
  fields: FieldDef[];
  initialTexts: Record<string, string>;
  initialLogos: ClientLogo[];
}) {
  const router = useRouter();
  const [texts, setTexts] = useState(initialTexts);
  const [saved, setSaved] = useState(initialTexts);
  const [logos, setLogos] = useState(initialLogos);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const groups = [...new Set(fields.map((f) => f.group))];
  const dirty = fields.some((f) => texts[f.key] !== saved[f.key]);

  // אזהרה לפני יציאה/רענון אם יש שינויים שלא נשמרו.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  /** התחברות פגה: מסבירים ומחזירים למסך כניסה. */
  async function handleExpired() {
    await alertError("ההתחברות פגה", "מטעמי אבטחה יש להתחבר מחדש. שינויים שלא נשמרו באותו רגע לא יישמרו.");
    router.refresh();
  }

  async function saveTexts() {
    const found = validateTexts(texts, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const keys = Object.keys(found);
      setOpenGroups((g) => ({
        ...g,
        ...Object.fromEntries(keys.map((k) => [fields.find((f) => f.key === k)?.group ?? "", true])),
      }));
      await alertList("יש לתקן לפני השמירה", "error", Object.values(found));
      setTimeout(() => document.getElementById(`f-${keys[0]}`)?.focus(), 100);
      return;
    }

    setBusy(true);
    showLoading("שומרת...");
    const r = await api("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(texts),
    });
    setBusy(false);
    closeAlert();

    if (r.ok) {
      setSaved(texts);
      alertSuccess("נשמר!", "השינויים כבר מופיעים באתר.");
    } else if (r.status === 401) {
      await handleExpired();
    } else if (r.status === 422 && r.data?.fields) {
      const serverErrors = r.data.fields as Record<string, string>;
      setErrors(serverErrors);
      alertList("יש לתקן לפני השמירה", "error", Object.values(serverErrors));
    } else {
      alertError("השמירה נכשלה", apiMessage(r));
    }
  }

  async function uploadLogos(files: File[]) {
    if (files.length === 0) return;
    if (files.length > 20) {
      alertWarning("יותר מדי קבצים", "אפשר להעלות עד 20 לוגואים בבת אחת. בחרי פחות קבצים.");
      return;
    }

    const problems: string[] = [];
    const valid: File[] = [];
    for (const file of files) {
      const problem = validateImageMeta(file.name, file.type, file.size);
      if (problem) problems.push(`${file.name}: ${problem}`);
      else valid.push(file);
    }

    let added = 0;
    setBusy(true);
    for (let i = 0; i < valid.length; i++) {
      showLoading(`מעלה לוגו ${i + 1} מתוך ${valid.length}...`);
      // קובץ בכל בקשה: משוב מדויק לכל קובץ ומונע בקשות גדולות מדי.
      const form = new FormData();
      form.append("files", valid[i]);
      const r = await api("/api/admin/logos", { method: "POST", body: form });
      if (r.status === 401) {
        setBusy(false);
        closeAlert();
        await handleExpired();
        return;
      }
      if (!r.ok) {
        problems.push(`${valid[i].name}: ${apiMessage(r)}`);
        continue;
      }
      added += r.data?.added as number;
      for (const rej of (r.data?.rejected as { name: string; reason: string }[]) ?? []) {
        problems.push(`${rej.name}: ${rej.reason}`);
      }
      setLogos(r.data?.logos as ClientLogo[]);
    }
    setBusy(false);
    closeAlert();
    if (fileRef.current) fileRef.current.value = "";

    if (problems.length > 0) {
      await alertList(
        added > 0 ? `נוספו ${added} לוגואים, אבל חלק לא הועלו` : "לא הועלו לוגואים",
        added > 0 ? "warning" : "error",
        problems,
      );
    } else {
      alertSuccess(added === 1 ? "הלוגו נוסף!" : `${added} לוגואים נוספו!`, "הם כבר מופיעים באתר.");
    }
  }

  async function deleteLogo(logo: ClientLogo) {
    const ok = await confirmBox("להסיר את הלוגו?", "הלוגו יוסר מיד מהאתר. אי אפשר לבטל.", "כן, להסיר");
    if (!ok) return;
    setBusy(true);
    showLoading("מסירה...");
    const r = await api(`/api/admin/logos?id=${encodeURIComponent(logo.id)}`, { method: "DELETE" });
    setBusy(false);
    closeAlert();
    if (r.ok) {
      setLogos(r.data?.logos as ClientLogo[]);
      alertSuccess("הלוגו הוסר");
    } else if (r.status === 401) {
      await handleExpired();
    } else {
      if (r.status === 404) router.refresh();
      alertError("ההסרה נכשלה", apiMessage(r));
    }
  }

  async function logout() {
    if (dirty && !(await confirmBox("יש שינויים שלא נשמרו", "אם תצאי עכשיו הם יימחקו.", "יציאה בכל זאת"))) return;
    await api("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-10 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">ניהול האתר</h1>
        <div className="flex items-center gap-2 text-base">
          <a href="/" target="_blank" className="rounded-full border border-line px-4 py-2 text-gold-light">
            צפייה באתר
          </a>
          <button onClick={logout} className="rounded-full border border-line px-4 py-2 text-ink-muted">
            יציאה
          </button>
        </div>
      </header>

      <section>
        <h2 className="font-heading text-xl font-bold text-gold-light">לוגואים של לקוחות</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          הלוגו מופיע באתר מיד אחרי ההעלאה, בתחילת הרשימה. קבצי PNG, JPG, WEBP או SVG עד 5MB. רצוי
          תמונה על רקע שקוף או לבן.
        </p>

        <input
          ref={fileRef}
          id="logo-file"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          disabled={busy}
          onChange={(e) => uploadLogos(Array.from(e.target.files ?? []))}
          className="sr-only"
        />
        <label
          htmlFor="logo-file"
          className={`${buttonClass} mt-4 flex w-full cursor-pointer items-center justify-center sm:inline-flex sm:w-auto ${busy ? "pointer-events-none opacity-50" : ""}`}
        >
          + הוספת לוגואים
        </label>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {logos.map((logo) => (
            <li
              key={logo.id}
              className="relative flex h-28 items-center justify-center rounded-xl bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
              <button
                onClick={() => deleteLogo(logo)}
                disabled={busy}
                aria-label="הסרת לוגו"
                className="absolute left-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-base font-bold text-white active:scale-95"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {logos.length === 0 && <p className="mt-4 text-sm text-ink-muted">אין לוגואים באתר כרגע.</p>}
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-gold-light">טקסטים באתר</h2>
        <p className="mt-1 text-sm text-ink-muted">לחצי על נושא כדי לפתוח ולערוך. בסוף לחצי &quot;שמירה&quot;.</p>

        <div className="mt-4 flex flex-col gap-3">
          {groups.map((group) => {
            const groupFields = fields.filter((f) => f.group === group);
            const hasError = groupFields.some((f) => errors[f.key]);
            return (
              <details
                key={group}
                open={openGroups[group] ?? false}
                onToggle={(e) => {
                  const open = (e.currentTarget as HTMLDetailsElement).open;
                  setOpenGroups((g) => (g[group] === open ? g : { ...g, [group]: open }));
                }}
                className={`rounded-2xl border bg-white/[0.03] ${hasError ? "border-red-500" : "border-line"}`}
              >
                <summary className="flex min-h-14 cursor-pointer items-center justify-between px-5 font-semibold">
                  <span>{group}</span>
                  {hasError && <span className="text-sm font-normal text-red-400">יש לתקן</span>}
                </summary>
                <div className="flex flex-col gap-4 px-5 pb-5">
                  {groupFields.map((f) => (
                    <label key={f.key} className="flex flex-col gap-1.5 text-sm text-ink-muted">
                      {f.label}
                      {f.multiline ? (
                        <textarea
                          id={`f-${f.key}`}
                          rows={5}
                          value={texts[f.key] ?? ""}
                          onChange={(e) => setTexts({ ...texts, [f.key]: e.target.value })}
                          className={`${inputClass} ${errors[f.key] ? "!border-red-500" : ""}`}
                        />
                      ) : (
                        <input
                          id={`f-${f.key}`}
                          value={texts[f.key] ?? ""}
                          onChange={(e) => setTexts({ ...texts, [f.key]: e.target.value })}
                          className={`${inputClass} ${errors[f.key] ? "!border-red-500" : ""}`}
                        />
                      )}
                      {errors[f.key] && <span className="text-sm text-red-400">{errors[f.key]}</span>}
                    </label>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={saveTexts} disabled={busy || !dirty} className={`${buttonClass} flex-1 sm:flex-none`}>
            שמירת טקסטים
          </button>
          <span className="text-sm text-ink-muted">{dirty ? "יש שינויים שלא נשמרו" : "הכול שמור"}</span>
        </div>
      </div>
    </div>
  );
}
