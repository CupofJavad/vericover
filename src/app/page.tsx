import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { ProductsSection } from "@/components/landing/products";
import { LpSection } from "@/components/landing/lp-section";
import { TransparencySection } from "@/components/landing/transparency";
import { FaqSection } from "@/components/landing/faq";
import { FounderSection } from "@/components/landing/founder";
import { CtaSection } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <Header />
      <main>
        <Hero />
        <HowItWorksSection />
        <ProductsSection />
        <LpSection />
        <TransparencySection />
        <FaqSection />
        <FounderSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}