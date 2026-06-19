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

**No test framework is configured.** To add tests, use Vitest + React Testing Library.
**No Prettier is installed.** Formatting follows manual conventions (see below).

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Animation:** GSAP 3.12 + ScrollTrigger (primary), Motion (via `motion` package for motion-primitives components)
- **Smooth Scroll:** Lenis 1.3 (synced with GSAP ticker + ScrollTrigger)
- **Text Effects:** motion-primitives (`TextEffect`, `TextScramble`, `TextRoll`)
- **Font:** Roboto via `next/font/google` (variable: `--font-roboto`)
- **Lint:** ESLint 9 with `eslint-config-next`
- **Config files:** `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`

## Tailwind Custom Config

### Screens
`tablet` (768px), `desktop` (1024px), `wide` (1440px). Default `sm` (640px) and `lg` (1024px) still exist. Use `tablet:` / `desktop:` over `sm:` / `lg:` for layout.

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` / `primary-hover` | `#FFBA04` / `#E9AA00` | Brand yellow |
| `surface` / `darkSurface` | `#F8F8F8` / `#111111` | Section backgrounds |
| `text-primary` / `text-secondary` | `#1A1A1A` / `#666666` | Body / muted text |
| `border` | `#EAEAEA` | Borders & dividers |

### Font Sizes
`display-xl`, `display-lg`, `h1`-`h4`, `body-lg`, `body`, `caption`, `micro`. For arbitrary sizes use `text-[NNpx]`.

### Max-Widths
`max-w-container` (1440px), `max-w-content` (1280px), `max-w-reading` (720px)

### Layout Margins
All sections respect **32px left/right margins**. Clip containers and absolute-positioned elements must account for this offset (`left: 32px`, `width: calc(100vw - 64px)`).

### Spacing System
Sections use responsive vertical padding:
```tsx
<section className="py-16 tablet:py-20 desktop:py-24">
```
Hero section uses `min-h-screen`.

## Project Architecture

```
src/
  app/                    # Next.js App Router (layout, page, sitemap, robots)
  components/
    ui/                   # Reusable UI (Button, Container, Card, Accordion, etc.)
    motion-primitives/    # TextEffect, TextScramble, TextRoll (from motion-primitives CLI)
    SmoothScroll.tsx      # Lenis wrapper (synced with GSAP ticker)
    MouseTrailLayer.tsx   # Video cursor trail effect
  sections/               # Page-level sections (Hero, ResultsSection, About, etc.)
  content/                # Static copy text (decoupled from UI)
  lib/
    analytics.ts          # Google Analytics gtag wrapper
    mouseTrail.ts         # GSAP quickTo cursor trail engine
    utils.ts              # cn() className merge utility
```

Sections are composed in `src/app/page.tsx`. Each section is a self-contained component with a default export.
`src/components/ui/index.ts` provides barrel exports for all UI components.
`SmoothScroll` wraps all children in `layout.tsx` — Lenis drives scroll, GSAP ticker drives Lenis RAF.

## Code Style

### Formatting
- 2-space indent, semicolons always, single quotes for JS/TS, double quotes for JSX
- Trailing commas on arrays, objects, function params
- No line-length limit; long className strings stay on one line

### Imports
Order: React/Next → Third-party → Internal `@/` → CSS
```tsx
import { useState } from 'react';
import { gsap } from 'gsap';
import { Container } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';
import './globals.css';
```
Path alias: `@/*` → `./src/*`

### Naming
| Type | Convention | Example |
|------|-----------|---------|
| Component/section files | PascalCase | `Button.tsx`, `Hero.tsx` |
| Lib/content files | camelCase | `analytics.ts`, `hero.ts` |
| Functions/variables | camelCase | `handleClick`, `isScrolled` |
| Constants | camelCase | `navLinks`, `faqContent` |
| Analytics events | snake_case | `'hero_cta_clicked'` |

### TypeScript
- Strict mode — no `any`, use `unknown` with type guards
- Props interfaces: `*Props` suffix, defined above component
- Always include `className?: string` on props
- Default values in destructuring: `variant = 'primary'`, `className = ''`
- No explicit return types (inference preferred)
- Use `import type` for type-only imports

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
Lenis is initialized in `SmoothScroll.tsx` and synced via `gsap.ticker`. Do not create separate Lenis instances. ScrollTrigger updates are handled via `lenis.on('scroll', ScrollTrigger.update)`.

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

### Clip/Morph Animations
```tsx
// Container clips inner content; animate width/height to reveal
gsap.to(clipRef.current, { width: targetW, height: targetH, borderRadius: 12, duration: 800, ease: 'power3.out' });
// Inner content uses object-fit: cover — unclips without stretching
```
- Use `overflow: hidden` on clip container, `object-fit: cover` on images
- Animate `width`/`height` (not `scaleX`/`scaleY`) for unclip without distortion
- Maintain consistent `borderRadius: 12` throughout expansion

### CSS Transitions (component-level interactions)
```tsx
<button className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
```
- Use `transition-[background-color,transform]` (not `transition-all`) when GSAP controls opacity

## Content Pattern

All copy lives in `src/content/` as exported objects/arrays:
```ts
export const heroContent = { headline: 'Line one.\nLine two.', subtitle: '...' };
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
Uses Google Analytics gtag. All events are snake_case.

## Video Assets
Videos in `public/videos/` must be **H.264 codec** (MP4 with `avc1`). HEVC/H.265 (`hvc1`/`hev1`) videos will not render in Chrome/Firefox. The mouse trail uses `display:block` on `<video>` elements to ensure proper dimension calculation.
