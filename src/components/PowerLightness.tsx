"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import SunRaysEffect from "@/components/effects/SunRaysEffect";

export default function PowerLightness() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="section-pad relative overflow-hidden bg-bg">
      <SunRaysEffect
        className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 opacity-30"
        size={620}
        rayCount={20}
        opacity={0.18}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Reveal className="mx-auto mb-8 flex flex-col items-center gap-3">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/40 shadow-[0_0_30px_rgba(217,162,86,0.25)] sm:h-32 sm:w-32">
              <Image
                src="/about/meirav.jpeg"
                alt="מירב, מייסדת באורות"
                fill
                sizes="128px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="font-heading font-semibold text-ink">מירב</p>
              <p className="text-sm text-ink-dim">מייסדת באורות</p>
            </div>
          </Reveal>

          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            מי אנחנו
          </span>
          <h2 className="font-heading mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-4xl md:text-5xl">
            <RevealText text="עוצמה פוגשת קלילות" as="span" />
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-2 md:gap-0">
          <Reveal direction="right" className="md:pl-12">
            <div className="rounded-3xl border border-line bg-bg-soft/60 p-8 backdrop-blur-sm sm:p-10">
              <h3 className="font-heading text-2xl font-bold text-gold-light sm:text-3xl">
                עוצמה
              </h3>
              <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
                היכולת להגיע לייעוד, לפתוח שווקים, להביא מאסות של מועמדים איכותיים
                ולייצר נוכחות חזקה עבור המעסיק.
              </p>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-8 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-line-soft to-transparent md:block"
          >
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.4 }
                  : { duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }
              }
              className="h-full w-full origin-top bg-gradient-to-b from-gold-light via-gold to-transparent"
              style={{ boxShadow: "0 0 18px rgba(217,162,86,0.6)" }}
            />
          </div>

          <Reveal direction="left" delay={0.15} className="md:pr-12">
            <div className="rounded-3xl border border-line bg-bg-soft/60 p-8 backdrop-blur-sm sm:p-10">
              <h3 className="font-heading text-2xl font-bold text-gold-light sm:text-3xl">
                קלילות ודיוק אנושי
              </h3>
              <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
                אנחנו לא מסתפקות בסינון אלגוריתמי. כל מועמד עובר דרכנו במענה
                אנושי, בחינת היכולות, הדרייב וה&quot;טיפ&quot; הייחודי שלו. הגיוס
                נעשה בחיבור קל, מהיר ובאמינות שקופה.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
