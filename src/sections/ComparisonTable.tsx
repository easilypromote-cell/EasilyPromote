'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/ui';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const rows = [
  {
    feature: 'Payment model',
    traditional: 'Flat upfront fee regardless of outcome',
    easilyPromote: 'Performance-based — creators earn when targets are met',
  },
  {
    feature: 'Creator matching',
    traditional: 'You source, vet, and negotiate manually',
    easilyPromote: 'Curated creators matched to your campaign brief',
  },
  {
    feature: 'Campaign creation',
    traditional: 'Briefs created via email and meetings',
    easilyPromote: 'Self-serve campaign builder in minutes',
  },
  {
    feature: 'Performance tracking',
    traditional: 'Manual reporting, delayed data',
    easilyPromote: 'Real-time dashboard, live metrics',
  },
  {
    feature: 'Payouts',
    traditional: 'Manual invoicing and processing',
    easilyPromote: 'Auto-triggered when view targets are hit',
  },
  {
    feature: 'Scalability',
    traditional: 'Each creator relationship managed individually',
    easilyPromote: 'One campaign, unlimited creators',
  },
  {
    feature: 'Risk',
    traditional: 'High — pay for content that may not perform',
    easilyPromote: 'Low — pay only for results',
  },
];

export default function ComparisonTable() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.from([headingRef.current, subtextRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 tablet:py-20 desktop:py-24 bg-white">
      <Container>
        <div className="text-center max-w-[680px] mx-auto">
          <h2 ref={headingRef} className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            The incentives finally align.
          </h2>
          <p ref={subtextRef} className="text-[17px] leading-[180%] tracking-[-0.01em] text-[#737373] mt-4">
            Most creator campaigns pay for content regardless of performance. EasilyPromote connects creator earnings directly to campaign outcomes.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <div className="w-full min-w-[680px]">
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#EAEAEA]">
              <div className="text-[15px] font-semibold text-[#171717]">Feature</div>
              <div className="text-[15px] font-semibold text-[#171717]">Traditional Agency</div>
              <div className="text-[15px] font-semibold text-primary">EasilyPromote</div>
            </div>

            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-4 py-5 border-b border-[#EAEAEA]"
              >
                <div className="text-[15px] font-medium text-[#171717]">{row.feature}</div>
                <div className="text-[15px] leading-[160%] text-[#737373] pr-4">{row.traditional}</div>
                <div className="text-[15px] leading-[160%] text-[#171717]">{row.easilyPromote}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
