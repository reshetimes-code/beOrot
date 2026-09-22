"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import MagneticButton from "@/components/MagneticButton";
import GlowOrb from "@/components/effects/GlowOrb";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/walking.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/70 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/60" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 38%, rgba(217,162,86,0.14), transparent 60%)" }}
      />

      <GlowOrb className="-top-20 right-[8%] hidden md:block" size={420} />
      <GlowOrb className="bottom-0 left-[5%] hidden md:block" size={360} color="warm" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <AnimatedLogo />

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading mt-6 text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl"
          >
            עוצמה שפוגשת <span className="text-gradient-gold">אנשים</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading mt-4 text-lg font-semibold text-gold-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-xl"
          >
            עוצמה פוגשת קלילות
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-xl text-balance text-base leading-relaxed text-ink-muted drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            אנחנו מחברות בין אנשים, הזדמנויות וארגונים בדרך מדויקת, מהירה ואנושית יותר.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-col items-center"
          >
            <MagneticButton
              href="#contact"
              className="bg-gold text-[#150f06] shadow-[0_0_30px_rgba(217,162,86,0.35)] hover:shadow-[0_0_45px_rgba(217,162,86,0.55)]"
            >
              מחפשים עובדים? דברו איתנו
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="relative z-10 flex justify-center pb-6"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-ink-dim"
        >
          <span className="text-xs tracking-widest">גללו</span>
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
