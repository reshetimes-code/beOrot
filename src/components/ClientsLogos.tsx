import { getClientLogos } from "@/lib/logos";
import LogoMarquee from "@/components/LogoMarquee";
import LightExpand from "@/components/effects/LightExpand";

export default function ClientsLogos() {
  const logos = getClientLogos();

  if (logos.length === 0) return null;

  return (
    <div id="clients" className="relative">
      <LightExpand />

      <section className="relative bg-white-section pb-24 pt-16 sm:pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dim">
              לקוחות
            </span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-[#1a1610] sm:text-4xl md:text-5xl">
              חברות שכבר עבדו איתנו
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-[#5a5248]">
              החיבורים שכבר יצרנו בדרך.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <LogoMarquee logos={logos} />
        </div>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg sm:h-32" />
    </div>
  );
}
