"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { Texts } from "@/lib/content";

function buildSteps(t: Texts) {
  return [1, 2, 3].map((n) => ({
    number: `0${n}`,
    title: t[`method.${n}.title` as keyof Texts],
    subtitle: t[`method.${n}.subtitle` as keyof Texts],
    text: t[`method.${n}.text` as keyof Texts],
  }));
}

export default function Method({ t }: { t: Texts }) {
  const STEPS = buildSteps(t);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 40%"],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const scaleY = useTransform(lineProgress, [0, 1], [0, 1]);

  return (
    <section id="method" className="section-pad relative overflow-hidden bg-bg-soft">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            {t["method.title"]}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-muted sm:text-lg">
            {t["method.text"]}
          </p>
        </div>

        <div ref={containerRef} className="relative mt-20">
          <div className="absolute right-6 top-2 bottom-2 w-px bg-line-soft sm:right-8" />
          <motion.div
            style={{ scaleY }}
            className="absolute right-6 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-gold-light via-gold to-gold-dim sm:right-8"
          >
            <div className="absolute -right-[3px] top-0 h-2 w-2 rounded-full bg-gold-light shadow-[0_0_12px_rgba(242,201,138,0.9)]" />
          </motion.div>

          <ol className="flex flex-col gap-14">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} direction="right" delay={i * 0.05} amount={0.5}>
                <li className="relative flex items-start gap-6 pr-16 sm:gap-8 sm:pr-20">
                  <span className="absolute right-2.5 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gold bg-bg sm:right-4.5" />
                  <span className="font-heading text-3xl font-bold text-gold/50 sm:text-4xl">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gold-light sm:text-base">
                      {step.subtitle}
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
