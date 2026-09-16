"use client";

import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import GlowOrb from "@/components/effects/GlowOrb";

const KEYWORDS = ["יכולות", "ניסיון", "דרייב", "פוטנציאל", "התאמה"];

export default function Candidates() {
  return (
    <section id="candidates" className="section-pad relative overflow-hidden bg-bg-soft">
      <GlowOrb className="left-[-8%] bottom-0 hidden lg:block" size={420} color="warm" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          למועמדים
        </span>
        <h2 className="font-heading mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          <RevealText text="לא עוד קורות חיים במערכת." as="span" />
        </h2>
        <h3 className="font-heading mt-3 text-2xl font-semibold text-gold-light sm:text-3xl">
          <RevealText text="אנחנו רואות את האדם שמאחוריהם." as="span" delay={0.15} />
        </h3>

        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-5 sm:gap-x-5">
          {KEYWORDS.map((word, i) => (
            <Reveal key={word} delay={i * 0.1} direction="up" amount={0.5}>
              <span className="font-heading inline-block rounded-full border border-line px-6 py-3 text-lg font-bold text-ink transition-all duration-300 hover:border-gold hover:text-gold-light hover:shadow-[0_0_25px_rgba(217,162,86,0.2)] sm:text-2xl">
                {word}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
