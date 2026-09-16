"use client";

import { AnimatePresence, motion } from "framer-motion";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
};

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-bg/97 backdrop-blur-lg lg:hidden"
        >
          <nav className="flex h-full flex-col items-center justify-center gap-2 px-8">
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="gold-focus rounded py-3 text-2xl font-heading font-semibold text-ink transition-colors hover:text-gold"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={onClose}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + links.length * 0.06, duration: 0.5 }}
              className="gold-focus mt-6 rounded-full border border-gold/50 px-8 py-3 text-lg font-semibold text-gold-light"
            >
              דברו איתנו
            </motion.a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
