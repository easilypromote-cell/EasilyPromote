'use client';

import { useEffect, useRef } from 'react';
import { createMouseTrail } from '@/lib/mouseTrail';

export default function MouseTrailLayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const container = containerRef.current;
    if (!container) return;

    const eventTarget = container.parentElement;
    if (!eventTarget) return;

    const isTablet = window.matchMedia('(max-width: 1023px)').matches;
    const cardPoolSize = 1;
    const cardWidth = isTablet ? 80 : 100;
    const cardHeight = isTablet ? 140 : 180;

    const engine = createMouseTrail(container, eventTarget, {
      videoSrc: '/videos/5.mp4',
      cardPoolSize,
      cardWidth,
      cardHeight,
      safeZoneSelector: '[data-hero-content]',
    });

    return () => engine.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
    />
  );
}
