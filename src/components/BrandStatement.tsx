"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import GlowOrb from "@/components/effects/GlowOrb";

const LINES = [
  { text: "אנשים הם לא נתונים.", range: [0, 0.08, 0.28, 0.36] },
  { text: "גיוס טוב מתחיל בחיבור.", range: [0.3, 0.38, 0.6, 0.68] },
  { text: "BE-OROT", range: [0.62, 0.74, 1, 1], isLogo: true },
] as const;

function Line({
  text,
  range,
  progress,
  isLogo,
}: {
  text: string;
  range: readonly number[];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isLogo?: boolean;
}) {
  const opacity = useTransform(progress, range as number[], [0, 1, 1, isLogo ? 1 : 0]);
  const scale = useTransform(progress, range as number[], [0.92, 1, 1, isLogo ? 1 : 0.96]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <p
        className={
          isLogo
            ? "font-heading text-gradient-gold text-5xl font-black tracking-wide sm:text-7xl md:text-8xl"
            : "font-heading max-w-3xl text-center text-3xl font-bold text-ink sm:text-5xl md:text-6xl"
        }
      >
        {text}
      </p>
    </motion.div>
  );
}

function ScrollCue({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, [0.02, 0.22], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-ink-dim"
      >
        <span className="text-xs tracking-widest">גללו להמשך</span>
        <ArrowDown size={18} />
      </motion.div>
    </motion.div>
  );
}

export default function BrandStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (prefersReducedMotion) {
    return (
      <section className="section-pad relative overflow-hidden bg-bg text-center">
        <GlowOrb className="left-1/2 top-0 -translate-x-1/2" size={500} />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-8 px-6">
          {LINES.map((line) => (
            <p
              key={line.text}
              className={
                "isLogo" in line && line.isLogo
                  ? "font-heading text-gradient-gold text-5xl font-black"
                  : "font-heading text-3xl font-bold text-ink sm:text-4xl"
              }
            >
              {line.text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-bg">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <GlowOrb className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={620} />
        {LINES.map((line) => (
          <Line
            key={line.text}
            text={line.text}
            range={line.range}
            progress={scrollYProgress}
            isLogo={"isLogo" in line ? line.isLogo : false}
          />
        ))}
        <ScrollCue progress={scrollYProgress} />
      </div>
    </section>
  );
}
