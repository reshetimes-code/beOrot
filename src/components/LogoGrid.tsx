"use client";

import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import type { ClientLogo } from "@/lib/logos";

export default function LogoGrid({ logos }: { logos: ClientLogo[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ staggerChildren: 0.025 }}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-6"
    >
      {logos.map((logo) => (
        <LogoCard key={logo.src} logo={logo} />
      ))}
    </motion.div>
  );
}
