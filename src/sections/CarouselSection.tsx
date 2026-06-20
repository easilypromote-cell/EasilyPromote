'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Container } from '@/components/ui';

const slides = [
  '/images/3.jpg',
  '/images/5.png',
  '/images/1.png',
  '/images/3.jpg',
  '/images/5.png',
  '/images/1.png',
];

const CARD_W = 380;
const GAP = 24;
const STEP = CARD_W + GAP;
const TOTAL = slides.length;
const CLONES = 5;
const FULL = TOTAL * CLONES;
const MID = TOTAL * 2;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export default function CarouselSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const posRef = useRef(MID);
  const draggingRef = useRef(false);

  const updateScales = useCallback(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const x = gsap.getProperty(track, 'x') as number;
    const cw = container.clientWidth;
    const center = cw / 2;
    const cards = track.children;
    for (let i = 0; i < cards.length; i++) {
      const cardLeft = i * STEP + x;
      const cardCenter = cardLeft + CARD_W / 2;
      const dist = Math.abs(cardCenter - center);
      const norm = Math.min(dist / (STEP * 2), 1);
      const scale = 1 - 0.35 * norm;
      const opacity = 1 - 0.7 * norm;
      (cards[i] as HTMLElement).style.transform = `scale(${scale})`;
      (cards[i] as HTMLElement).style.opacity = String(opacity);
    }
  }, []);

  // Run scale updates every frame
  useEffect(() => {
    const id = gsap.ticker.add(updateScales);
    return () => gsap.ticker.remove(id);
  }, [updateScales]);

  // Initialize position + drag
  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    gsap.set(track, { x: -(MID * STEP) });
    posRef.current = MID;

    const trackW = FULL * STEP;
    const containerW = container.clientWidth;
    const minX = -(trackW - containerW);
    const maxX = 0;

    const instances = Draggable.create(track, {
      type: 'x',
      bounds: { minX, maxX },
      inertia: true,
      onDragStart: () => {
        draggingRef.current = true;
        if (autoRef.current) clearInterval(autoRef.current);
      },
      onDragEnd: function () {
        draggingRef.current = false;
        const currentX = gsap.getProperty(track, 'x') as number;
        const snapped = Math.round(-currentX / STEP);
        const clamped = Math.max(TOTAL, Math.min(TOTAL * (CLONES - 1) - 1, snapped));
        posRef.current = clamped;
        gsap.to(track, { x: -(clamped * STEP), duration: 0.5, ease: 'power3.out' });
        startAuto();
      },
    });
    const drag = instances[0];
    return () => { void drag?.kill(); };
  }, []);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (draggingRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      let next = posRef.current + 1;
      if (next >= TOTAL * (CLONES - 1)) {
        next -= TOTAL;
        posRef.current = next;
        gsap.set(track, { x: -(next * STEP) });
      }
      posRef.current = next;
      gsap.to(track, { x: -(next * STEP), duration: 0.6, ease: 'power3.out' });
    }, 4000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto]);

  const goNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (autoRef.current) clearInterval(autoRef.current);
    let next = posRef.current + 1;
    if (next >= TOTAL * (CLONES - 1)) {
      next -= TOTAL;
      posRef.current = next;
      gsap.set(track, { x: -(next * STEP) });
    }
    posRef.current = next;
    gsap.to(track, { x: -(next * STEP), duration: 0.6, ease: 'power3.out' });
    setTimeout(startAuto, 6000);
  }, [startAuto]);

  const goPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (autoRef.current) clearInterval(autoRef.current);
    let next = posRef.current - 1;
    if (next < TOTAL) {
      next += TOTAL;
      posRef.current = next;
      gsap.set(track, { x: -(next * STEP) });
    }
    posRef.current = next;
    gsap.to(track, { x: -(next * STEP), duration: 0.6, ease: 'power3.out' });
    setTimeout(startAuto, 6000);
  }, [startAuto]);

  return (
    <section className="py-16 tablet:py-20 desktop:py-24 bg-white">
      <Container>
        <div className="text-center max-w-[680px] mx-auto">
          <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
            One campaign can inspire dozens of<br />unique creator perspectives.
          </h2>
          <p className="text-[17px] leading-[180%] tracking-[-0.01em] text-[#737373] mt-4">
            Creators approach briefs differently — helping campaigns reach<br />audiences through multiple styles, formats, and storytelling approaches.
          </p>
        </div>
      </Container>

      <div ref={containerRef} className="overflow-hidden mt-12 cursor-grab active:cursor-grabbing" style={{ userSelect: 'none' }}>
        <div ref={trackRef} className="flex gap-6">
          {Array.from({ length: FULL }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 rounded-xl overflow-hidden pointer-events-none"
              style={{ width: `${CARD_W}px`, height: '500px' }}
            >
              <img src={slides[i % TOTAL]} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <Container>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            className="w-12 h-12 rounded-full border-2 border-[#171717] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-200"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="w-12 h-12 rounded-full border-2 border-[#171717] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-200"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
}
