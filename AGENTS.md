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

**No test framework is configured.** To add: Vitest + React Testing Library.
**No Prettier is installed.** Formatting follows manual conventions below.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Animation:** GSAP 3.12 + ScrollTrigger + Draggable (primary), Motion via `motion` package (motion-primitives)
- **Smooth Scroll:** Lenis 1.3 (synced with GSAP ticker + ScrollTrigger)
- **Font:** Roboto via `next/font/google` (variable: `--font-roboto`)
- **Lint:** ESLint 9 with `eslint-config-next`

## Tailwind Config

### Screens
`tablet` (768px), `desktop` (1024px), `wide` (1440px). Prefer `tablet:`/`desktop:` over `sm:`/`lg:` for layout.

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` / `primary-hover` | `#FFBA04` / `#E9AA00` | Brand yellow |
| `surface` / `darkSurface` | `#F8F8F8` / `#111111` | Section backgrounds |
| `text-primary` / `text-secondary` | `#1A1A1A` / `#666666` | Body / muted text |
| `border` | `#EAEAEA` | Borders & dividers |

### Max-Widths
`max-w-container` (1440px), `max-w-content` (1280px), `max-w-reading` (720px).

### Layout
All sections respect **32px left/right margins**. Sections use `py-16 tablet:py-20 desktop:py-24`. Hero uses `min-h-screen`.

## Page Structure

```
Hero             GSAP entrance, nav, mouse trail, text effects
ResultsSection   Heading + morph image + stats + TextScramble
About            Heading + button + tabs with animated indicator
Benefits         Dark section, heading + CTA
CarouselSection  Infinite carousel, GSAP Draggable, continuous scaling
ComparisonTable  Static 3-column feature table
FAQ              Accordion, white bg, left heading + right items
CTA              Full-screen image background, centered text
Footer           Yellow bg, clickable CTA with tracking
```

## Project Architecture

```
src/
  app/                 # App Router (layout wraps children in SmoothScroll)
  components/
    ui/                # Reusable UI (Button, Container, Card, Accordion, etc.)
    motion-primitives/ # TextEffect, TextScramble, TextRoll (CLI-installed components)
    SmoothScroll.tsx   # Lenis wrapper
    MouseTrailLayer.tsx# Cursor trail video effect
  sections/            # One component per page section
  content/             # Static copy (hero.ts, faq.ts, testimonials.ts)
  lib/
    analytics.ts       # Google Analytics gtag wrapper
    mouseTrail.ts      # GSAP quickTo cursor trail engine
    utils.ts           # cn() className merge utility
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
| Components/sections | PascalCase | `Button.tsx`, `Hero.tsx` |
| Lib/content | camelCase | `analytics.ts`, `hero.ts` |
| Functions/vars | camelCase | `handleClick`, `isScrolled` |
| Constants | camelCase | `navLinks`, `faqContent` |
| Analytics events | snake_case | `'hero_cta_clicked'` |

### TypeScript
- Strict mode — no `any`, prefer `unknown` with type guards
- Props interfaces: `*Props` suffix, defined above component
- Always include `className?: string` on props
- Default values in destructuring: `variant = 'primary'`, `className = ''`
- No explicit return types (inference preferred)
- `import type` for type-only imports

### Component Structure
```tsx
'use client';  // Only when using hooks or browser APIs

import { useState } from 'react';
import { Container } from '@/components/ui';

interface MyComponentProps {
  title: string;
  variant?: 'default' | 'alt';
  className?: string;
}

export default function MyComponent({ title, variant = 'default', className = '' }: MyComponentProps) {
  return <section className={`py-16 tablet:py-20 desktop:py-24 ${className}`}>...</section>;
}
```
- Default exports only (no named exports)
- Sections use `<section>` with `id` for anchor nav
- Internal sub-components defined in same file as regular functions

## Animation Patterns

### GSAP + ScrollTrigger (page-level/scroll animations)
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=800', pin: true, scrub: 1 } });
  }, ref);
  return () => ctx.revert();
}, []);
```
- Always use `gsap.context()` scoped to a ref for automatic cleanup
- Always return `() => ctx.revert()` from the effect
- Register ScrollTrigger at module level: `gsap.registerPlugin(ScrollTrigger)` with `if (typeof window !== 'undefined')` guard
- Prefer `gsap.set()` + `.to()` over `.from()` for elements React re-renders
- Use `invalidateOnRefresh: true` on ScrollTriggers with function-based values for responsive recalc
- Use `immediateRender: false` on `gsap.fromTo()` tweens inside scrubbed timelines to prevent initial-state bleed

### Lenis + GSAP Sync
Lenis is initialized in `SmoothScroll.tsx` and synced via `gsap.ticker`. Do not create separate Lenis instances. ScrollTrigger updates are handled via `lenis.on('scroll', ScrollTrigger.update)`. CSS: `html.lenis { scroll-behavior: auto; }`.

### Continuous Scaling Carousel (infinite loop)
```tsx
// Position tracked via useRef, NOT useState (avoids React batching delays)
gsap.ticker.add(() => {
  const x = gsap.getProperty(trackRef.current, 'x') as number;
  cards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth/2 + x;
    const dist = Math.abs(cardCenter - containerCenter);
    const norm = Math.min(dist / (STEP * 2), 1);
    const scale = 1 - 0.25 * norm;
    const opacity = 1 - 0.5 * norm;
    card.style.transform = `scale(${scale})`;
    card.style.opacity = String(opacity);
  });
});
```
- **Infinite loop**: 5x clones (30 cards from 6 images). Start at middle copy. When reaching end boundary, `gsap.set()` snap + `gsap.to()` animate in one atomic operation. Boundary is at `TOTAL * (CLONES - 1)`
- **Draggable**: GSAP Draggable with `inertia: true`, `bounds: { minX, maxX }` calculated from track width minus container width
- **Auto-scroll**: `setInterval` every 4s, paused on drag/arrow click, resumes 6s after interaction

### Clip/Morph Animations
```tsx
// Container clips inner content; animate width/height to reveal without stretching
gsap.to(clipRef.current, { width: 380, height: 550, borderRadius: 12, duration: 800, ease: 'power3.out' });
```
- Use `overflow: hidden` on clip container, `object-fit: cover` on images
- Animate `width`/`height` (not `scaleX`/`scaleY`) for distortion-free unclip
- Maintain consistent `borderRadius: 12` throughout expansion

### Tab Sliding Indicator
- White pill indicator absolutely positioned in the tab bar
- On click: `gsap.to(indicatorRef, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.3, ease: 'power3.out' })`
- Initial position set via `gsap.set()` in a `useEffect`

### Motion-Primitives (text effects)
```tsx
import { TextEffect } from '@/components/motion-primitives/text-effect';
<TextEffect per="word" as="span" preset="blur" delay={0.2} trigger={isInView}>Text</TextEffect>

import { TextScramble } from '@/components/motion-primitives/text-scramble';
<TextScramble trigger={isInView} as="h3" duration={1.5} speed={0.05}>Text</TextScramble>
```
- `TextEffect` — word/char blur reveal (use `trigger` prop for scroll-activated reveal)
- `TextScramble` — character randomization that settles into final text
- `TextRoll` — per-letter roll animation (requires remount via key change for re-trigger)

### CSS Transitions (component-level interactions)
```tsx
<button className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
```
- Use `transition-[background-color,transform]` (not `transition-all`) when GSAP controls opacity
- Prefer Tailwind `transition-*` classes for hover/active states

## Content Pattern

All copy lives in `src/content/` as exported objects/arrays:
```ts
export const faqContent = [
  { id: 'what-is', question: 'What is EasilyPromote?', answer: '...' },
];
```

## Error Handling

- No try/catch blocks in this codebase
- Guard browser APIs: `if (typeof window !== 'undefined')`
- Optional chaining: `ref.current?.children || []`, `onClick?.(e)`
- GSAP cleanup: `return () => ctx.revert()`

## Accessibility

- `aria-label` on icon buttons, `aria-expanded` on accordion triggers
- `prefers-reduced-motion` respected globally in CSS
- Mouse/pointer systems must check `prefers-reduced-motion` and disable
- Touch detection: `'ontouchstart' in window` — disable cursor-following systems
- `focus-visible` styles with primary color
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`

## Analytics

```ts
import { trackEvent } from '@/lib/analytics';
trackEvent('event_name');                           // Simple
trackEvent('event_name', { key: 'value' });         // With params
```
Uses Google Analytics gtag. All events are snake_case. `initGA(measurementId)` initializes the gtag script.

## Mouse Trail
- Located in `src/lib/mouseTrail.ts` + `src/components/MouseTrailLayer.tsx`
- Video cursor trail effect using GSAP `quickTo` for zero-GC tracking
- Pool of cards (8 desktop, 6 tablet) that spawn on mouse velocity
- Cards are `<div>` containers with `<video>` inside, using `object-fit: cover`
- Videos must have `display:block` CSS for proper dimension calculation
- Disabled on touch devices via `'ontouchstart' in window` check

## Video Assets
Videos in `public/videos/` must be **H.264 codec** (MP4 with `avc1`). HEVC/H.265 (`hvc1`/`hev1`) will not render in Chrome/Firefox. The mouse trail `<video>` elements need `display:block` for proper dimension calculation.
