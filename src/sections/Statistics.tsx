'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/ui';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Statistics() {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        portraitRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    }, portraitRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 tablet:py-20 desktop:py-24">
      <div className="relative w-full">
        <div className="flex justify-center">
          <div ref={portraitRef} className="statistics-portrait relative w-[499px] h-screen rounded-[30px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 z-10" />
            <img
              src="/images/3.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <img
          src="/images/3.jpg"
          alt=""
          className="absolute right-8 top-0 w-[240px] h-[190px] object-cover opacity-20 rounded-xl"
        />
        <img
          src="/images/3.jpg"
          alt=""
          className="absolute right-[66px] top-[21px] w-[240px] h-[190px] object-cover z-10 rounded-xl"
        />
        <div className="absolute left-0 top-0 max-w-[400px] text-left pl-4 tablet:pl-6 desktop:pl-8">
          <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            Reach more audiences.
          </h3>
          <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2">
            Launch one campaign and let multiple creators produce content simultaneously.
          </p>
        </div>
      </div>

      <Container className="mt-24">
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
        <div className="max-w-[400px] text-left">
          <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            Know what's working.
          </h3>
          <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
            See campaign performance unfold in real time instead of waiting for reports.
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <img
            src="/images/4.png"
            alt=""
            className="h-[420px] w-full object-contain"
          />
        </div>
      </div>
      </Container>

      <Container className="mt-24">
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
        <div className="max-w-[400px] text-left">
          <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            Know what's working.
          </h3>
          <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
            See campaign performance unfold in real time instead of waiting for reports.
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <img
            src="/images/4.png"
            alt=""
            className="h-[420px] w-full object-contain"
          />
        </div>
      </div>
      </Container>

      <Container className="mt-24">
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
        <div className="max-w-[400px] text-left">
          <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            Know what's working.
          </h3>
          <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
            See campaign performance unfold in real time instead of waiting for reports.
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <img
            src="/images/4.png"
            alt=""
            className="h-[420px] w-full object-contain"
          />
        </div>
      </div>
      </Container>
    </section>
  );
}
