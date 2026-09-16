"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SunRaysEffect from "@/components/effects/SunRaysEffect";

export default function AnimatedLogo() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="relative flex items-center justify-center">
        <Image
          src="/logo/be-orot-logo.png"
          alt="באורות | BE-OROT"
          width={260}
          height={260}
          priority
          className="h-36 w-36 object-contain sm:h-44 sm:w-44 md:h-52 md:w-52"
        />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="absolute h-72 w-72 rounded-full sm:h-96 sm:w-96"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(6,5,3,0.94) 0%, rgba(6,5,3,0.82) 50%, rgba(6,5,3,0) 76%)",
          filter: "blur(2px)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute h-64 w-64 rounded-full animate-glow-pulse sm:h-80 sm:w-80"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(242,201,138,0.5) 0%, rgba(217,162,86,0.14) 45%, transparent 72%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
        animate={{ opacity: [0, 1, 0.7], scale: [0.6, 1.25, 1], rotate: 0 }}
        transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
      >
        <SunRaysEffect size={380} rayCount={16} opacity={0.75} spin />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.75, filter: "blur(14px)" }}
        animate={{
          opacity: 1,
          scale: [0.75, 1.06, 1],
          filter: "blur(0px)",
        }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <Image
          src="/logo/be-orot-logo.png"
          alt="באורות | BE-OROT"
          width={260}
          height={260}
          priority
          className="relative h-36 w-36 object-contain drop-shadow-[0_0_40px_rgba(217,162,86,0.45)] sm:h-44 sm:w-44 md:h-52 md:w-52"
        />
      </motion.div>
    </div>
  );
}
