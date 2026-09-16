"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function LightExpand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 overflow-hidden sm:h-56"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, var(--bg) 0%, var(--white-section) 100%)",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
        style={{
          width: 60,
          height: 60,
          background:
            "radial-gradient(circle, rgba(255,250,240,0.95) 0%, rgba(242,201,138,0.5) 40%, transparent 72%)",
        }}
        initial={{ scale: prefersReducedMotion ? 30 : 0, opacity: 0 }}
        whileInView={{ scale: 30, opacity: [0, 1, 0] }}
        viewport={{ once: true, amount: 0.6 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.01 }
            : { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
        }
      />
    </div>
  );
}
