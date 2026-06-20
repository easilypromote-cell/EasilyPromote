import Hero from '@/sections/Hero';
import ResultsSection from '@/sections/ResultsSection';
import HowItWorks from '@/sections/HowItWorks';
import Benefits from '@/sections/Benefits';
import CarouselSection from '@/sections/CarouselSection';
import ComparisonTable from '@/sections/ComparisonTable';
import FAQ from '@/sections/FAQ';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ResultsSection />
      <HowItWorks />
      <Benefits />
      <CarouselSection />
      <ComparisonTable />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
