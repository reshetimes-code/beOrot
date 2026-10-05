"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ClientLogo } from "@/lib/logos";

type FieldDef = {
  key: string;
  label: string;
  group: string;
  value: string;
  multiline?: boolean;
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-ink outline-none transition focus:border-gold";
const buttonClass =
  "rounded-full bg-gold px-6 py-3 font-semibold text-[#150f06] transition hover:opacity-90 disabled:opacity-50";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => null))?.error ?? "שגיאה");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 flex max-w-sm flex-col gap-4">
      <h1 className="font-heading text-center text-2xl font-bold">כניסה לניהול האתר</h1>
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="סיסמה"
        className={inputClass}
      />
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "נכנס..." : "כניסה"}
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
  const [logos, setLogos] = useState(initialLogos);
  const [saveMsg, setSaveMsg] = useState("");
  const [logoMsg, setLogoMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const groups = [...new Set(fields.map((f) => f.group))];

  async function saveTexts() {
    setBusy(true);
    setSaveMsg("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(texts),
    });
    setBusy(false);
    setSaveMsg(res.ok ? "נשמר בהצלחה ✓" : "השמירה נכשלה");
  }

  async function uploadLogos() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    setLogoMsg("");
    const form = new FormData();
    for (const file of files) form.append("files", file);
    const res = await fetch("/api/admin/logos", { method: "POST", body: form });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (res.ok) {
      setLogos(data.logos);
      setLogoMsg(
        `נוספו ${data.added} לוגואים` + (data.skipped ? ` (${data.skipped} נדחו)` : ""),
      );
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setLogoMsg(data?.error ?? "ההעלאה נכשלה");
    }
  }

  async function deleteLogo(id: string) {
    if (!confirm("להסיר את הלוגו מהאתר?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/logos?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) setLogos((await res.json()).logos);
    else setLogoMsg("המחיקה נכשלה");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">ניהול האתר</h1>
        <div className="flex gap-4 text-sm">
          <a href="/" target="_blank" className="text-gold-light hover:underline">
            צפייה באתר
          </a>
          <button onClick={logout} className="text-ink-muted hover:text-ink">
            יציאה
          </button>
        </div>
      </header>

      <section>
        <h2 className="font-heading text-xl font-bold text-gold-light">לוגואים של לקוחות</h2>
        <p className="mt-1 text-sm text-ink-muted">
          לוגו חדש מופיע בתחילת הרשימה. נתמכים PNG, JPG, WEBP, SVG עד 5MB. רצוי רקע שקוף או לבן.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="text-sm text-ink-muted"
          />
          <button onClick={uploadLogos} disabled={busy} className={buttonClass}>
            העלאה
          </button>
          {logoMsg && <span className="text-sm text-ink-muted">{logoMsg}</span>}
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {logos.map((logo) => (
            <li
              key={logo.id}
              className="relative flex h-24 items-center justify-center rounded-xl bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
              <button
                onClick={() => deleteLogo(logo.id)}
                disabled={busy}
                aria-label="הסרת לוגו"
                className="absolute left-1 top-1 h-7 w-7 rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {logos.length === 0 && <p className="mt-4 text-sm text-ink-muted">אין לוגואים.</p>}
      </section>

      <section>
        <h2 className="font-heading text-xl font-bold text-gold-light">טקסטים באתר</h2>
        <div className="mt-4 flex flex-col gap-8">
          {groups.map((group) => (
            <fieldset key={group} className="flex flex-col gap-4 rounded-2xl border border-line p-5">
              <legend className="px-2 font-semibold">{group}</legend>
              {fields
                .filter((f) => f.group === group)
                .map((f) => (
                  <label key={f.key} className="flex flex-col gap-1.5 text-sm text-ink-muted">
                    {f.label}
                    {f.multiline ? (
                      <textarea
                        rows={4}
                        value={texts[f.key] ?? ""}
                        onChange={(e) => setTexts({ ...texts, [f.key]: e.target.value })}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        value={texts[f.key] ?? ""}
                        onChange={(e) => setTexts({ ...texts, [f.key]: e.target.value })}
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}
            </fieldset>
          ))}
        </div>

        <div className="sticky bottom-0 mt-6 flex items-center gap-4 bg-bg py-4">
          <button onClick={saveTexts} disabled={busy} className={buttonClass}>
            שמירת טקסטים
          </button>
          {saveMsg && <span className="text-sm text-ink-muted">{saveMsg}</span>}
        </div>
      </section>
    </div>
  );
}
