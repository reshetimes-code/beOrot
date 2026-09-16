"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import LightSweep from "@/components/effects/LightSweep";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-bg-soft/70 px-4 py-3.5 text-ink placeholder:text-ink-dim outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(217,162,86,0.15)]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/meirav@be-orot.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-3xl border border-gold/30 bg-bg-soft/60 p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-gold" />
        <h3 className="font-heading mt-4 text-2xl font-bold text-ink">תודה!</h3>
        <p className="mt-2 text-ink-muted">ההודעה התקבלה בהצלחה.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-line bg-bg-soft/60 p-8 backdrop-blur-sm sm:p-10"
    >
      <input type="hidden" name="_subject" value="פנייה חדשה מאתר באורות" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-muted">
          שם
        </label>
        <input id="name" name="שם" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-muted">
          טלפון
        </label>
        <input id="phone" name="טלפון" type="tel" required className={inputClass} dir="ltr" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-muted">
          הודעה
        </label>
        <textarea
          id="message"
          name="הודעה"
          rows={4}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#150f06] transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70"
      >
        <LightSweep />
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            שולח...
          </>
        ) : (
          "שליחת הודעה"
        )}
      </button>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle size={16} />
            משהו השתבש. אפשר לפנות ישירות בוואטסאפ או במייל.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
