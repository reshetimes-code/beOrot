"use client";

import { Radar, Search, Filter, Target, Zap, ShieldCheck, Eye, HeartHandshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";
import GlowOrb from "@/components/effects/GlowOrb";
import type { Texts } from "@/lib/content";

const POINT_ICONS = [Radar, Search, Filter, Target, Zap, ShieldCheck, Eye, HeartHandshake];

export default function Employers({ t }: { t: Texts }) {
  const POINTS = POINT_ICONS.map((icon, i) => ({
    icon,
    label: t[`employers.point.${i + 1}` as keyof Texts],
  }));
  return (
    <section id="employers" className="section-pad relative overflow-hidden bg-bg">
      <GlowOrb className="right-[-10%] top-1/3 hidden lg:block" size={480} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          <RevealText text={t["employers.title1"]} as="span" />
          <br />
          <RevealText text={t["employers.title2"]} as="span" delay={0.15} className="text-gradient-gold" />
        </h2>

        <Reveal delay={0.1} className="mx-auto mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
            {t["employers.text"]}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {POINTS.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.06} amount={0.4}>
              <div className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-bg-soft/50 px-4 py-6 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_25px_rgba(217,162,86,0.15)]">
                <Icon className="h-6 w-6 text-gold transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium text-ink-muted transition-colors group-hover:text-ink">
                  {label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14">
          <MagneticButton
            href="#contact"
            className="bg-gold text-[#150f06] shadow-[0_0_30px_rgba(217,162,86,0.3)] hover:shadow-[0_0_45px_rgba(217,162,86,0.5)]"
          >
            {t["employers.cta"]}
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
