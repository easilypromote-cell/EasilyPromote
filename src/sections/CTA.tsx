'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.from([subtextRef.current, headingRef.current], {
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
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      <img
        src="/images/6.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover" loading="lazy"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <p ref={subtextRef} className="text-[17px] leading-[180%] opacity-60">
          Stop paying for influencer posts.
        </p>
        <h2 ref={headingRef} className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold mt-2">
          Start paying for<br />performance.
        </h2>
      </div>
    </section>
  );
}
