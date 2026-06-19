import { gsap } from 'gsap';

interface TrailCard {
  el: HTMLDivElement;
  video: HTMLVideoElement;
  xTo: (value: number) => void;
  yTo: (value: number) => void;
  active: boolean;
  spawnTime: number;
}

interface MouseState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  speed: number;
}

interface EngineOptions {
  videoSrc: string;
  cardPoolSize: number;
  cardWidth: number;
  cardHeight: number;
  safeZoneSelector: string;
}

const BASE_LAG = 0.5;
const VELOCITY_THRESHOLD = 0.08;
const IDLE_TIMEOUT = 1500;
const TRAIL_LIFESPAN = 1.2;
const ACTIVE_CARD_COUNT = 2;
const SPAWN_COOLDOWN = 120;
const TRAIL_OFFSET_X = 60;
const TRAIL_OFFSET_Y = 50;

export function createMouseTrail(container: HTMLElement, eventTarget: HTMLElement, options: EngineOptions) {
  const { videoSrc, cardPoolSize, cardWidth, cardHeight, safeZoneSelector } = options;

  const cards: TrailCard[] = [];
  const cursor: MouseState = { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 };
  let isIdle = true;
  let lastMoveTime = 0;
  let lastSpawnTime = 0;
  let tickerCleanup: (() => void) | null = null;
  let floatTimeline: gsap.core.Timeline | null = null;

  function getSafeZoneBounds(): { top: number; bottom: number; left: number; right: number } | null {
    const el = container.querySelector(safeZoneSelector);
    if (!el) return null;
    const heroRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top - heroRect.top - cardHeight,
      bottom: rect.bottom - heroRect.top,
      left: rect.left - heroRect.left - cardWidth,
      right: rect.right - heroRect.left,
    };
  }

  function clampToSafeZone(x: number, y: number): { x: number; y: number } {
    const bounds = getSafeZoneBounds();
    if (!bounds) return { x, y };

    const clampedX = Math.max(0, Math.min(x, container.clientWidth - cardWidth));
    let clampedY = Math.max(0, y);

    if (clampedX > bounds.left - 20 && clampedX < bounds.right + 20 && clampedY > bounds.top) {
      clampedY = 0;
    }

    return { x: clampedX, y: Math.max(0, Math.min(clampedY, container.clientHeight - cardHeight)) };
  }

  function getNextFreeCard(): TrailCard | null {
    const sorted = [...cards].sort((a, b) => a.spawnTime - b.spawnTime);
    for (const card of sorted) {
      if (!card.active) return card;
    }
    return sorted[0];
  }

  function spawnTrailCard() {
    const now = performance.now();
    if (now - lastSpawnTime < SPAWN_COOLDOWN) return;
    lastSpawnTime = now;

    const card = getNextFreeCard();
    if (!card || card.active) return;
    card.spawnTime = now;
    gsap.set(card.el, { x: cursor.x - cardWidth / 2 + TRAIL_OFFSET_X, y: cursor.y - cardHeight / 2 + TRAIL_OFFSET_Y });

    card.video.currentTime = 0;
    card.video.play().catch(() => {});
  }

  function updateActiveCards() {
    const activeCards = cards.filter((c) => c.active);
    const mainCards = activeCards.slice(-ACTIVE_CARD_COUNT);

    if (mainCards.length > 0) {
      const targetX = cursor.x - cardWidth / 2 + TRAIL_OFFSET_X;
      const targetY = cursor.y - cardHeight / 2 + TRAIL_OFFSET_Y;

      for (let i = 0; i < mainCards.length; i++) {
        const ox = (i === 0 ? 8 : -12);
        const oy = (i === 0 ? -4 : 6);
        mainCards[i].xTo(targetX + ox);
        mainCards[i].yTo(targetY + oy);
      }
    }
  }

  function startIdleMode() {
    if (isIdle) return;
    isIdle = true;

    const active = cards.filter((c) => c.active);
    if (active.length === 0) return;

    floatTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    for (const card of active.slice(-ACTIVE_CARD_COUNT)) {
      floatTimeline.to(card.el, { y: '+=6', duration: 2.5, ease: 'sine.inOut' }, 0);
    }
  }

  function stopIdleMode() {
    if (!isIdle) return;
    isIdle = false;
    if (floatTimeline) {
      floatTimeline.kill();
      floatTimeline = null;
    }
  }

  function onMouseMove(e: MouseEvent) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursor.prevX = cursor.x;
    cursor.prevY = cursor.y;
    cursor.x = x;
    cursor.y = y;

    const now = performance.now();
    if (lastMoveTime > 0 && now - lastMoveTime > IDLE_TIMEOUT) {
      cursor.speed = 1;
    }
    lastMoveTime = now;

    if (isIdle) stopIdleMode();
  }

  function onMouseLeave() {
    startIdleMode();
  }

  function init() {
    for (let i = 0; i < cardPoolSize; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;width:${cardWidth}px;height:${cardHeight}px;border-radius:12px;overflow:hidden;pointer-events:none;border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 32px rgba(0,0,0,0.3);will-change:transform,opacity;opacity:1;z-index:2;`;

      const video = document.createElement('video');
      video.src = videoSrc;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;';
      el.appendChild(video);

      container.appendChild(el);

      const card: TrailCard = {
        el,
        video,
        xTo: gsap.quickTo(el, 'x', { duration: BASE_LAG, ease: 'power3.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: BASE_LAG, ease: 'power3.out' }),
        active: true,
        spawnTime: performance.now(),
      };

      card.video.play().catch(() => {});
      gsap.set(card.el, { x: TRAIL_OFFSET_X, y: TRAIL_OFFSET_Y });

      cards.push(card);
    }
  }

  function tick() {
    const now = performance.now();
    const dt = now - lastMoveTime;

    if (dt > 0 && lastMoveTime > 0) {
      const dist = Math.hypot(cursor.x - cursor.prevX, cursor.y - cursor.prevY);
      cursor.speed = dist / Math.max(dt, 1);
    }

    if (cursor.speed > VELOCITY_THRESHOLD && !isIdle) {
      spawnTrailCard();
    }

    updateActiveCards();

    if (!isIdle && now - lastMoveTime > IDLE_TIMEOUT) {
      startIdleMode();
    }
  }

  init();

  gsap.ticker.add(tick);
  tickerCleanup = () => gsap.ticker.remove(tick);

  eventTarget.addEventListener('mousemove', onMouseMove, { passive: true });
  eventTarget.addEventListener('mouseleave', onMouseLeave);

  return {
    destroy() {
      eventTarget.removeEventListener('mousemove', onMouseMove);
      eventTarget.removeEventListener('mouseleave', onMouseLeave);
      if (tickerCleanup) tickerCleanup();
      if (floatTimeline) floatTimeline.kill();
      for (const card of cards) {
        gsap.killTweensOf(card.el);
        card.el.remove();
      }
    },
  };
}
