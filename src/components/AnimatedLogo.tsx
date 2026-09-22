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
          width={500}
          height={500}
          priority
          className="h-[17rem] w-[17rem] object-contain sm:h-[22rem] sm:w-[22rem] md:h-[27rem] md:w-[27rem] lg:h-[32rem] lg:w-[32rem]"
        />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="absolute h-[36rem] w-[36rem] rounded-full sm:h-[42rem] sm:w-[42rem]"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(4,3,2,0.95) 0%, rgba(4,3,2,0.85) 35%, rgba(4,3,2,0.4) 65%, rgba(4,3,2,0) 100%)",
          filter: "blur(48px)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute h-[22rem] w-[22rem] rounded-full animate-glow-pulse sm:h-[28rem] sm:w-[28rem] md:h-[34rem] md:w-[34rem]"
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
        <SunRaysEffect size={650} rayCount={16} opacity={0.75} spin />
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
          width={500}
          height={500}
          priority
          className="relative h-[17rem] w-[17rem] object-contain [animation:twinkle_2.8s_ease-in-out_1.3s_infinite] sm:h-[22rem] sm:w-[22rem] md:h-[27rem] md:w-[27rem] lg:h-[32rem] lg:w-[32rem]"
        />
      </motion.div>
    </div>
  );
}
