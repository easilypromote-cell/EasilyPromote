import Hero from '@/sections/Hero';
import ResultsSection from '@/sections/ResultsSection';
import About from '@/sections/About';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ResultsSection />
      <About />
    </main>
  );
}
