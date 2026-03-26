import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { ProblemSection } from "@/sections/ProblemSection";
import { SolutionSection } from "@/sections/SolutionSection";
import { WhyNowSection } from "@/sections/WhyNowSection";
import { WhoNeedsSection } from "@/sections/WhoNeedsSection";
import { HowItWorks } from "@/sections/HowItWorks";
import { CharityStats } from "@/sections/CharityStats";
import { CharityShowcase } from "@/sections/CharityShowcase";
import { Testimonials } from "@/sections/Testimonials";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <LogoTicker />
      <ProblemSection />
      <SolutionSection />
      <WhyNowSection />
      <WhoNeedsSection />
      <HowItWorks />
      <CharityStats />
      <CharityShowcase />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
