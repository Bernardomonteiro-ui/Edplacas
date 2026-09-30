import { Hero } from "@/components/Hero/Hero";
import { PrecisionSection } from "@/components/PrecisionSection/PrecisionSection";
import { PlateAnatomy } from "@/components/PlateAnatomy/PlateAnatomy";
import { ProductsHorizontal } from "@/components/ProductsHorizontal/ProductsHorizontal";
import { BeforeAfter } from "@/components/BeforeAfter/BeforeAfter";
import { ProcessTimeline } from "@/components/ProcessTimeline/ProcessTimeline";
import { SpeedSection } from "@/components/SpeedSection/SpeedSection";
import { Testimonials } from "@/components/Testimonials/Testimonials";
import { Location } from "@/components/Location/Location";
import { FinalCTA } from "@/components/FinalCTA/FinalCTA";
import { Footer } from "@/components/Footer/Footer";
import { StructuredData } from "@/components/StructuredData";

/*
  Narrativa: HERO → CARRO → PLACA → DETALHES → MODELOS → COMPARAÇÃO
  → PROCESSO → EMPRESA → CONFIANÇA → LOCALIZAÇÃO → CONVERSÃO
*/
export default function Home() {
  return (
    <>
      <main id="conteudo">
        <Hero />
        <PrecisionSection />
        <PlateAnatomy />
        <ProductsHorizontal />
        <BeforeAfter />
        <ProcessTimeline />
        <SpeedSection />
        <Testimonials />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
      <StructuredData />
    </>
  );
}
