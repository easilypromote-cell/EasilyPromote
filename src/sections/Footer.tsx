'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trackEvent } from '@/lib/analytics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
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
    <footer
      ref={sectionRef}
      onClick={() => trackEvent('footer_cta_clicked')}
      className="bg-primary py-8 px-4 tablet:px-6 desktop:px-8 text-center cursor-pointer"
    >
      <h2 ref={headingRef} className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
        Launch a creator campaign
      </h2>
      <p ref={subtextRef} className="text-[17px] leading-[180%] text-[#171717] mt-2 max-w-[400px] mx-auto">
        Set a target, fund your campaign, and start receiving creator submissions.
      </p>
    </footer>
  );
}
