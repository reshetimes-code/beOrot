import Hero from "@/components/Hero";
import PowerLightness from "@/components/PowerLightness";
import Stats from "@/components/Stats";
import Method from "@/components/Method";
import Employers from "@/components/Employers";
import ClientsLogos from "@/components/ClientsLogos";
import BrandStatement from "@/components/BrandStatement";
import Illuminate from "@/components/Illuminate";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <Illuminate />
      <PowerLightness />
      <Stats />
      <Method />
      <Employers />
      <ClientsLogos />
      <Contact />
    </>
  );
}
