'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/ui';
import { TextScramble } from '@/components/motion-primitives/text-scramble';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const resultsData = [
  { header: '5K \u2192 5M+', subtext: 'Creators earning $100K+' },
  { header: 'Multiple creators', subtext: 'Creator revenue generated' },
  { header: '100%', subtext: 'To understand, monetize, and grow your audience' },
  { header: 'Live tracking', subtext: 'Across active campaigns' },
];

const STAGE = 800;
const T = 300;

export default function ResultsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const imagePinRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const stack2Ref = useRef<HTMLDivElement>(null);
  const stack1Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => setIsInView(true),
        once: true,
      });

      const startTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });
      startTl.from(headerRef.current, { opacity: 0, y: 24, duration: 0.7 });
      startTl.from(subtextRef.current, { opacity: 0, y: 16, duration: 0.6 }, '-=0.35');
      startTl.from(statRef.current?.children || [], { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: imagePinRef.current,
          start: 'top top',
          end: '+=3200',
          pin: imagePinRef.current,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const cx = () => window.innerWidth / 2 - 190;
      const cy = () => window.innerHeight / 2 - 275;

      // Set initial offset so center image's top-left aligns with clip's top-left (clip is at left:32px)
      gsap.set(innerRef.current, { x: () => -(cx() + 32), y: () => -cy() });
      gsap.set(text1Ref.current, { filter: 'blur(12px)' });
      gsap.set(text2Ref.current, { filter: 'blur(12px)' });
      gsap.set(text3Ref.current, { filter: 'blur(12px)' });
      gsap.set(centerRef.current, { filter: 'blur(0px)' });

      // Clip expand (0→800) — grows rightward + downward, consistent 12px radius, respects 32px margins
      tl.to(clipRef.current, {
        width: () => window.innerWidth - 64,
        height: () => window.innerHeight,
        borderRadius: 12,
        duration: STAGE,
        ease: 'power3.out',
      }, 0);

      // Slide inner content to final centered position (0→800)
      tl.to(innerRef.current, {
        x: 0,
        y: 0,
        duration: STAGE,
        ease: 'power3.out',
      }, 0);

      // Staggered content reveal after clip opens (600→800)
      tl.to(text1Ref.current, { opacity: 1, filter: 'blur(0px)', duration: 200, ease: 'power2.out' }, 600);
      tl.to(stack2Ref.current, { opacity: 1, duration: 150, ease: 'power2.out' }, 700);
      tl.to(stack1Ref.current, { opacity: 0.2, duration: 150, ease: 'power2.out' }, 750);

      // Stage 1→2 (800→1600) — depth push
      tl.to(centerRef.current, {
        opacity: 0, scale: 1.08, filter: 'blur(8px)',
        duration: T, ease: 'power3.in',
      }, STAGE);
      tl.fromTo(stack2Ref.current,
        { scale: 0.85, filter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        {
          left: cx, top: cy, width: 380, height: 550,
          scale: 1, filter: 'blur(0px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          duration: T, ease: 'power4.out',
          immediateRender: false,
        }, STAGE);
      tl.to(text1Ref.current, {
        y: -12, opacity: 0, filter: 'blur(8px)',
        duration: T * 0.7, ease: 'power2.in',
      }, STAGE);
      tl.fromTo(text2Ref.current,
        { y: 24, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: T * 0.7, ease: 'power3.out',
          immediateRender: false,
        }, STAGE + T * 0.1);

      // Stage 2→3 (1600→2400) — depth push
      tl.to(stack2Ref.current, {
        opacity: 0, scale: 1.08, filter: 'blur(8px)',
        duration: T, ease: 'power3.in',
      }, STAGE * 2);
      tl.fromTo(stack1Ref.current,
        { scale: 0.85, filter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        {
          left: cx, top: cy, width: 380, height: 550,
          scale: 1, filter: 'blur(0px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          opacity: 1,
          duration: T, ease: 'power4.out',
          immediateRender: false,
        }, STAGE * 2);
      tl.to(text2Ref.current, {
        y: -12, opacity: 0, filter: 'blur(8px)',
        duration: T * 0.7, ease: 'power2.in',
      }, STAGE * 2);
      tl.fromTo(text3Ref.current,
        { y: 24, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: T * 0.7, ease: 'power3.out',
          immediateRender: false,
        }, STAGE * 2 + T * 0.1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 tablet:py-20 desktop:py-24">
      <Container>
        <div className="flex flex-col tablet:flex-row justify-between items-stretch gap-12">
          <div className="w-full tablet:w-1/2 flex flex-col">
            <div className="space-y-4">
              <h2 ref={headerRef} className="text-[36px] leading-[110%] tracking-[-0.04em] text-[#171717] font-semibold">
                The creator marketplace<br />built around results.
              </h2>
              <p ref={subtextRef} className="text-[17px] leading-[180%] text-[#737373] max-w-[500px]">
                Most creator platforms help brands buy content. EasilyPromote helps brands launch performance-driven campaigns where creators earn when outcomes happen.
              </p>
            </div>

            <div ref={imagePinRef} className="relative mt-auto" style={{ height: '120px' }}>
              <div
                ref={clipRef}
                className="absolute overflow-hidden rounded-xl bg-white"
                style={{ width: '230px', height: '120px', left: 0, top: 0 }}
              >
                <div ref={innerRef} className="absolute" style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}>
                  <div ref={centerRef} className="absolute w-[380px] h-[550px] rounded-xl overflow-hidden z-10" style={{ left: 'calc(50% - 190px)', top: 'calc(50% - 275px)', willChange: 'transform, filter, opacity' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 z-10" />
                    <img src="/images/3.jpg" alt="" className="w-full h-full object-cover" />
                  </div>

                  <div ref={text1Ref} className="absolute top-8 left-8 max-w-[340px] text-left opacity-0">
                    <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">Reach more audiences.</h3>
                    <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2">Launch one campaign and let multiple creators produce content simultaneously.</p>
                  </div>

                  <div ref={text2Ref} className="absolute top-8 left-8 max-w-[340px] text-left opacity-0">
                    <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">Placeholder #2</h3>
                    <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2">Placeholder text for stage two.</p>
                  </div>

                  <div ref={text3Ref} className="absolute top-8 left-8 max-w-[340px] text-left opacity-0">
                    <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">Placeholder #3</h3>
                    <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2">Placeholder text for stage three.</p>
                  </div>

                  <div ref={stack2Ref} className="absolute w-[160px] h-[128px] rounded-xl overflow-hidden z-20 opacity-0" style={{ left: 'calc(100% - 231px)', top: '46px' }}>
                    <img src="/images/3.jpg" alt="" className="w-full h-full object-cover" />
                  </div>

                  <div ref={stack1Ref} className="absolute w-[160px] h-[128px] rounded-xl overflow-hidden opacity-0" style={{ left: 'calc(100% - 192px)', top: '32px' }}>
                    <img src="/images/3.jpg" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={statRef} className="flex flex-col gap-16">
            {resultsData.map((item) => (
              <div key={item.header}>
                <TextScramble trigger={isInView} as="h3" className="text-[25px] leading-[130%] tracking-[-0.02em] font-semibold" duration={1.5} speed={0.05}>
                  {item.header}
                </TextScramble>
                <p className="text-[17px] leading-[180%] text-[#737373] max-w-[500px]">{item.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
