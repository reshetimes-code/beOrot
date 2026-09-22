import Reveal from "@/components/Reveal";
import SunRaysEffect from "@/components/effects/SunRaysEffect";

export default function Illuminate() {
  return (
    <section className="section-pad relative overflow-hidden bg-bg">
      <SunRaysEffect
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"
        size={720}
        rayCount={24}
        opacity={0.15}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="inline-block rounded-full border border-gold/30 px-5 py-2 text-sm font-semibold text-gold-light">
            מאירים את הגיוס.
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="font-heading mx-auto mt-6 max-w-2xl text-2xl font-bold leading-relaxed sm:text-3xl md:text-4xl">
            החברה שלנו מעניקה שירות בפריסה ארצית רחבה, מתוך מחויבות לדיוק
            המרבי.
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-6">
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            אנחנו דואגים לסובב את כל הנורות הנכונות כדי שגם אתם תהיו באורות
            מהגיוס הבא שלכם.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
