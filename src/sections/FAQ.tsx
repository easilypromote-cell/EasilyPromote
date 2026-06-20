'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, Button, Accordion } from '@/components/ui';
import { faqContent } from '@/content/faq';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
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
    <section ref={sectionRef} id="faq" className="py-16 tablet:py-20 desktop:py-24 bg-white">
      <Container>
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-12">
          <div className="w-full tablet:w-2/5 text-left">
            <h2 ref={headingRef} className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              Everything you might<br />be wondering.
            </h2>
            <div className="mt-8">
              <Button variant="primary" size="lg" eventName="faq_cta_clicked">
                Get Started
              </Button>
            </div>
          </div>
          <div className="w-full tablet:w-3/5 pt-1">
            <Accordion items={faqContent} />
          </div>
        </div>
      </Container>
    </section>
  );
}
