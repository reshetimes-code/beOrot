import { getTexts } from "@/lib/content";
import Hero from "@/components/Hero";
import PowerLightness from "@/components/PowerLightness";
import Stats from "@/components/Stats";
import Method from "@/components/Method";
import Employers from "@/components/Employers";
import ClientsLogos from "@/components/ClientsLogos";
import BrandStatement from "@/components/BrandStatement";
import Illuminate from "@/components/Illuminate";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

export default async function Home() {
  const t = await getTexts();

  return (
    <>
      <Hero t={t} />
      <BrandStatement t={t} />
      <Illuminate t={t} />
      <PowerLightness t={t} />
      <Stats t={t} />
      <Method t={t} />
      <Employers t={t} />
      <ClientsLogos t={t} />
      <Contact t={t} />
    </>
  );
}
