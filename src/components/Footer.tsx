import Image from "next/image";
import type { Texts } from "@/lib/content";

export default function Footer({ t }: { t: Texts }) {
  return (
    <footer className="relative border-t border-line bg-bg py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-right">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/be-orot-logo.png"
            alt="באורות | BE-OROT"
            width={36}
            height={36}
            className="h-9 w-9 object-contain opacity-90"
          />
          <span className="font-heading text-sm font-semibold text-ink-muted">
            באורות | BE-OROT
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 text-sm text-ink-dim sm:items-end">
          <a
            href={`mailto:${t["contact.email"]}`}
            className="animated-underline text-ink-dim transition-colors hover:text-gold-light"
          >
            {t["contact.email"]}
          </a>
          <a
            href={`https://wa.me/${t["contact.whatsapp"]}`}
            className="animated-underline text-ink-dim transition-colors hover:text-gold-light"
            dir="ltr"
          >
            {t["contact.phone"]}
          </a>
        </div>

        <p className="text-xs text-ink-dim">
          © {new Date().getFullYear()} באורות בע&quot;מ. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
