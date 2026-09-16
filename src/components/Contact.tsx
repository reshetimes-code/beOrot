import { Mail, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";
import ContactForm from "@/components/ContactForm";
import GlowOrb from "@/components/effects/GlowOrb";

export default function Contact() {
  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-bg">
      <GlowOrb className="right-1/2 top-0 translate-x-1/2 hidden md:block" size={560} />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            צור קשר
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <RevealText text="בואו נדליק את החיבור הבא." as="span" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              בין אם אתם מחפשים את האדם הבא לארגון שלכם, או את ההזדמנות הבאה
              בקריירה שלכם - אנחנו כאן.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <MagneticButton
              href="https://wa.me/972502005509"
              className="bg-gold text-[#150f06] shadow-[0_0_30px_rgba(217,162,86,0.3)] hover:shadow-[0_0_45px_rgba(217,162,86,0.5)]"
            >
              <MessageCircle size={18} />
              דברו איתנו ב-WhatsApp
            </MagneticButton>
            <MagneticButton
              href="mailto:meirav@be-orot.com"
              className="border border-line text-ink hover:border-gold/60 hover:text-gold-light"
            >
              <Mail size={18} />
              meirav@be-orot.com
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal direction="left" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
