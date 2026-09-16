"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";

const STATS = [
  { value: 17, suffix: "+", label: "שנות ניסיון בריטייל" },
  { value: 35, suffix: "", label: "מותגים מובילים" },
  { value: 5000, suffix: "+", label: "מועמדים במאגר" },
  { value: 3, suffix: "", label: "פעימות סינון לכל מועמד" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, prefersReducedMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("he-IL")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-bg-soft py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} amount={0.4}>
              <div className="text-center">
                <p className="font-heading text-gradient-gold text-4xl font-black sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-ink-muted sm:text-base">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
