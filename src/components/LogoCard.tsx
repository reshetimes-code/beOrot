"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { ClientLogo } from "@/lib/logos";

export const logoItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LogoCard({ logo }: { logo: ClientLogo }) {
  return (
    <motion.div
      variants={logoItemVariants}
      className="group flex items-center justify-center rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_2px_10px_rgba(20,14,4,0.04)] transition-all duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.05] hover:border-gold-dim/30 hover:shadow-[0_12px_30px_rgba(180,130,50,0.18)]"
      style={{ aspectRatio: "3 / 2" }}
    >
      <div className="relative h-full w-full">
        <Image
          src={logo.src}
          alt={logo.alt}
          fill
          sizes="(max-width: 767px) 40vw, (max-width: 1023px) 22vw, 15vw"
          className="object-contain p-1 transition-opacity duration-300 group-hover:opacity-100"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}
