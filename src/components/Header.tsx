"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";

const NAV_LINKS = [
  { href: "#about", label: "עוצמה וקלילות" },
  { href: "#method", label: "איך אנחנו עובדות" },
  { href: "#employers", label: "מעסיקים" },
  { href: "#candidates", label: "מועמדים" },
  { href: "#clients", label: "לקוחות" },
  { href: "#contact", label: "צור קשר" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-md border-b border-line py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-2 gold-focus rounded-full bg-[#faf6ee] p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-transform hover:scale-105"
          >
            <Image
              src="/logo/be-orot-logo.png"
              alt="באורות | BE-OROT"
              width={52}
              height={52}
              className="h-9 w-9 object-contain brightness-0 contrast-125 sm:h-10 sm:w-10"
              priority
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="animated-underline gold-focus rounded text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a
              href="#contact"
              className="gold-focus rounded-full border border-gold/40 px-5 py-2 text-sm font-semibold text-gold-light transition-all hover:border-gold hover:bg-gold/10"
            >
              דברו איתנו
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
            onClick={() => setMenuOpen((v) => !v)}
            className="gold-focus flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}
