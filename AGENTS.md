# AGENTS.md - EasilyPromote Development Guide

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (lint + typecheck + compile)
npm run start      # Start production server
npm run lint       # Run ESLint (uses eslint-config-next)
npm run clean      # Delete .next directory
npx tsc --noEmit   # Type-check only (no output files)
```

**No test framework.** To add: Vitest + React Testing Library.
**No Prettier.** Formatting follows manual conventions below.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Animation:** GSAP 3.12 + ScrollTrigger + Draggable (primary), Motion via `motion` package
- **Smooth Scroll:** Lenis 1.3 (synced with GSAP ticker + ScrollTrigger)
- **Font:** Roboto via `next/font/google` (variable: `--font-roboto`)
- **Lint:** ESLint 9 with `eslint-config-next`

## Tailwind Config

**Screens:** `tablet` (768px), `desktop` (1024px), `wide` (1440px). Prefer `tablet:`/`desktop:` over `sm:`/`lg:` for layout.

**Colors:** `primary`/`primary-hover` `#FFBA04`/`#E9AA00` (brand yellow), `surface` `#F8F8F8`, `darkSurface` `#111111`, `text-primary` `#1A1A1A`, `text-secondary` `#666666`, `border` `#EAEAEA`.

**Max-Widths:** `max-w-container` (1440px), `max-w-content` (1280px), `max-w-reading` (720px).

**Layout:** All sections respect **32px left/right margins**. Sections use `py-16 tablet:py-20 desktop:py-24`. Hero uses `min-h-screen`.

## Page Structure

```
Hero             GSAP entrance, nav, mouse trail, text effects
ResultsSection   Heading + clip/morph image + stats + TextScramble
HowItWorks       "From brief creation to creator payouts" + tabs
Benefits         Dark section, heading + CTA + right portrait image
CarouselSection  Infinite carousel, GSAP Draggable, continuous scaling
ComparisonTable  Static 3-column feature table (EP vs Traditional)
FAQ              Accordion, white bg, left heading + right items
CTA              Full-screen image background, centered text
Footer           Yellow bg, clickable CTA with tracking
```

## Project Architecture

```
src/
  app/              # App Router (layout.tsx wraps children in SmoothScroll)
  components/
    ui/             # Button, Container, Accordion (barrel exported from index.ts)
    motion-primitives/ # TextEffect, TextScramble, TextRoll (CLI-installed)
    SmoothScroll.tsx # Lenis wrapper (synced with GSAP ticker)
    MouseTrailLayer.tsx # Cursor trail video effect
  sections/         # 9 page sections, one file per section
  content/          # Static copy (hero.ts, faq.ts)
  lib/
    analytics.ts    # Google Analytics gtag wrapper
    mouseTrail.ts   # GSAP quickTo cursor trail engine
    utils.ts        # cn() className merge utility
```

`src/components/ui/index.ts` provides barrel exports. Path alias: `@/*` → `./src/*`.

## Code Style

### Formatting
- 2-space indent, semicolons always, single quotes for JS/TS, double quotes for JSX
- Trailing commas on arrays/objects/params. No line-length limit.

### Imports
Order: React/Next → Third-party → Internal `@/` → CSS
```tsx
import { useState } from 'react';
import { gsap } from 'gsap';
import { Container } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';
```

### Naming
| Type | Convention | Example |
|------|-----------|---------|
| Components/sections | PascalCase | `Hero.tsx`, `ResultsSection.tsx` |
| Lib/content | camelCase | `analytics.ts`, `faq.ts` |
| Functions/vars | camelCase | `handleClick`, `isScrolled` |
| Constants | camelCase | `navLinks`, `faqContent` |
| Analytics events | snake_case | `'hero_cta_clicked'` |

### TypeScript
- Strict mode — no `any`, use `unknown` with type guards
- Props interfaces: `*Props` suffix, above component
- Always include `className?: string` on props
- Default values: `variant = 'primary'`, `className = ''`
- No explicit return types (inference preferred)

### Component Structure
```tsx
'use client';  // Only when using hooks or browser APIs

import { useState } from 'react';
import { Container } from '@/components/ui';

interface MyProps { title: string; variant?: 'primary' | 'secondary'; className?: string; }

export default function MyComponent({ title, variant = 'primary', className = '' }: MyProps) {
  return <section className={`py-16 tablet:py-20 desktop:py-24 ${className}`}>...</section>;
}
```
- Default exports only. Sections use `<section id="name">`.

## Animation Patterns

### GSAP + ScrollTrigger (scroll animations)
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=800', pin: true, scrub: 1 } });
  }, ref);
  return () => ctx.revert();
}, []);
```
- Always use `gsap.context()` scoped to a ref + `() => ctx.revert()`
- Register plugins at module level: `gsap.registerPlugin(ScrollTrigger)` with `typeof window` guard
- Use `invalidateOnRefresh: true` with function-based values for responsive recalc
- Use `immediateRender: false` on `gsap.fromTo()` in scrubbed timelines

### Lenis + GSAP Sync
Lenis initialized in `SmoothScroll.tsx`, synced via `gsap.ticker`. CSS: `html.lenis { scroll-behavior: auto; }`.

### Continuous Scaling Carousel
```tsx
gsap.ticker.add(() => {
  const x = gsap.getProperty(trackRef.current, 'x') as number;
  cards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth/2 + x;
    const dist = Math.abs(cardCenter - containerCenter);
    const norm = Math.min(dist / (STEP * 2), 1);
    card.style.transform = `scale(${1 - 0.5 * norm})`;
    card.style.opacity = String(1 - 0.8 * norm);
  });
});
```
- Use `useRef` for position tracking (not `useState`) to avoid React batching delays
- 5 clones (30 cards from 6 images), starting at middle copy. Boundary wrapping: `gsap.set()` snap + `gsap.to()` animate in one operation
- Draggable with `inertia: true`, `bounds: { minX, maxX }` calculated from track width minus container width, with centering offset

### Clip/Morph Animations
```tsx
gsap.to(clipRef.current, { width: targetW, height: targetH, borderRadius: 12, duration: 800, ease: 'power3.out' });
```
- `overflow: hidden` + `width`/`height` (not `scaleX`/`scaleY`) for distortion-free unclip
- Inner image uses `object-fit: cover`

### Motion-Primitives
```tsx
import { TextEffect } from '@/components/motion-primitives/text-effect';
<TextEffect per="word" as="span" preset="blur" delay={0.2} trigger={isInView}>Text</TextEffect>

import { TextScramble } from '@/components/motion-primitives/text-scramble';
<TextScramble trigger={isInView} as="h3" duration={1.5} speed={0.05}>Text</TextScramble>
```

### CSS Transitions
- Use `transition-[background-color,transform]` (not `transition-all`) when GSAP controls opacity

## Error Handling & Accessibility

- No try/catch. Guard browser APIs: `if (typeof window === 'undefined')`
- Optional chaining: `ref.current?.children || []`
- GSAP cleanup: always `() => ctx.revert()`
- `aria-label` on icon buttons, `aria-expanded` on accordion triggers
- `prefers-reduced-motion` respected globally in CSS
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`

## Analytics

```ts
import { trackEvent } from '@/lib/analytics';
trackEvent('event_name', { key: 'value' });  // All events snake_case
```
Uses Google Analytics gtag.

## Video Assets
Videos in `public/videos/` must be **H.264 codec** (MP4 with `avc1`). HEVC/H.265 will not render in Chrome/Firefox. The mouse trail `<video>` elements need `display:block` for proper dimension calculation.
