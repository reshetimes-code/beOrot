"use client";

import { Radar, Search, Filter, Target, Zap, ShieldCheck, Eye, HeartHandshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";
import GlowOrb from "@/components/effects/GlowOrb";

const POINTS = [
  { icon: Radar, label: "חשיפה רחבה" },
  { icon: Search, label: "איתור מועמדים" },
  { icon: Filter, label: "סינון מקצועי" },
  { icon: Target, label: "דיוק" },
  { icon: Zap, label: "מהירות" },
  { icon: ShieldCheck, label: "אמינות" },
  { icon: Eye, label: "שקיפות" },
  { icon: HeartHandshake, label: "יחס אישי" },
];

export default function Employers() {
  return (
    <section id="employers" className="section-pad relative overflow-hidden bg-bg">
      <GlowOrb className="right-[-10%] top-1/3 hidden lg:block" size={480} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          למעסיקים
        </span>
        <h2 className="font-heading mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          <RevealText text="האנשים הנכונים." as="span" />
          <br />
          <RevealText text="בזמן הנכון." as="span" delay={0.15} className="text-gradient-gold" />
        </h2>

        <Reveal delay={0.1} className="mx-auto mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
            באורות משלבת הגעה רחבה לשוק המועמדים עם סינון מקצועי ואנושי, כדי
            להביא לכם בדיוק את מי שאתם צריכים - במהירות, באמינות ובשקיפות
            מלאה לאורך כל התהליך.
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
            בואו נמצא את האנשים שלכם
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
