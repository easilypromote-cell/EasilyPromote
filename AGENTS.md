# AGENTS.md — EasilyPromote Codebase Guide

## Project Overview

EasilyPromote is a two-sided marketplace connecting brands (businesses) with content creators for
view-based social media campaigns. Brands fund campaigns, creators produce content, and views are
tracked to trigger payouts via Paystack escrow.

## Repository Structure

```
Easily-promote/
  Backend/              Express.js API server (CommonJS, NOT in turborepo)
  Fontend/              Turborepo monorepo (note: intentional typo)
    apps/
      brand/            @ep/brand  — Next.js 15, port 3002 (most developed)
      creator/          @ep/creator — Next.js 15, port 3001
      admin/            @ep/admin  — Next.js 15, port 3003
    packages/
      ui/               @ep/ui — Shared components, hooks, assets, utils
  designsystem.md       Root design tokens
  EasilyPromote-Product-Architecture-PRD.md  Full product PRD
```

## Build / Dev / Lint Commands

### Frontend (run from `Fontend/`)

```bash
# Dev (all apps via turborepo)
npm run dev

# Dev (single app — use --filter)
npm run dev --filter=@ep/brand
npm run dev --filter=@ep/creator
npm run dev --filter=@ep/admin

# Build (all)
npm run build

# Lint (all)
npm run lint

# Lint (single app)
npx turbo run lint --filter=@ep/brand
```

### Backend (run from `Backend/`)

```bash
npm run dev       # nodemon src/server.js (port 5000)
npm run start     # node src/server.js
```

### No test framework is configured. No `typecheck` script exists.

## Key Ports

| Service | Port |
|---------|------|
| Brand app | 3002 |
| Creator app | 3001 |
| Admin app | 3003 |
| Backend API | 5000 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS 3.4, CSS variables (oklch for brand, HSL for others) |
| UI primitives | shadcn/ui v4 (base-nova), Radix UI, Base UI, Vaul (drawer) |
| Animation | GSAP 3.15 (`useReveal` hook), Lenis smooth scroll |
| Icons | HugeIcons (`@hugeicons/core-free-icons` + `@hugeicons/react`), Lucide (backup) |
| Forms | Manual useState + onChange (no form library) |
| State | React useState/useEffect only (no Redux, Zustand, etc.) |
| Real-time | Socket.IO client 4.8 |
| Backend | Express 4.21 (CommonJS), Mongoose 8.9, MongoDB Atlas |
| Auth | Custom JWT (access + refresh tokens), localStorage on frontend |
| Payments | Paystack (Nigerian payment processor) |
| File upload | Multer (memory) -> Cloudinary |
| Validation | Zod (backend only) |

## Code Style Guidelines

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `CampaignWizard.tsx`, `ActiveDashboard.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-reveal.ts`, `use-is-mobile.ts` |
| Lib utilities | camelCase | `api.ts`, `auth.ts`, `socket.ts` |
| Backend routes | camelCase | `campaigns.js`, `errorHandler.js` |
| Constants | UPPER_SNAKE_CASE | `FILTER_OPTIONS`, `PRESET_VIEWS` |

### Component Patterns

- **Named exports** for components: `export function CampaignWizard(...) {}`
- **Default exports** only for Next.js page files: `export default function Page() {}`
- **`"use client"` directive** required on any component using hooks, event handlers, or browser APIs
- **`React.forwardRef`** for shared UI components (button, input) with `displayName` set
- Props interfaces defined with `interface`, not `type`
- Component props pattern: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`

### TypeScript

- **`strict: true`** in all tsconfig.json files
- **`interface`** for data shapes and props (`interface CampaignData`, `interface CampaignWizardProps`)
- **`type`** for unions and aliases (`type TabType = "Overview" | "Submission" | "Payouts"`)
- **`Record<string, T>`** for dictionaries
- **`as const`** for readonly tuples
- **`unknown`** preferred over `any` in catch blocks: `catch (err: unknown) { err instanceof Error ? err.message : "..." }`
- **Path aliases**: `@/*` -> `./src/*`, `@ep/ui/*` -> `../../packages/ui/src/*`

### Import Ordering

1. React / Next.js: `import * as React from "react"`, `import { useRouter } from "next/navigation"`
2. Third-party: `import { HugeiconsIcon } from "@hugeicons/react"`
3. Shared UI: `import { cn } from "@ep/ui/lib/utils"`, `import { CampaignCard } from "@ep/ui/components/campaign-card"`
4. Local components: `import { Skeleton } from "./ui/skeleton"`
5. Hooks/lib: `import { useReveal } from "../hooks/use-reveal"`, `import { apiRequest } from "../lib/api"`
6. Assets: `import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg"`

### Styling Rules

- **`cn()` utility** (clsx + tailwind-merge) for all conditional classes — never raw template literals
- **No `font-bold`** anywhere — `font-semibold` for buttons only, `font-medium` for all other text
- **No hover effects** on buttons (design rule)
- **No shadows** anywhere (design rule)
- **`font-rethink`** class on all text (Rethink Sans is the primary font)
- **REM-based typography**: `html { font-size: 13px }` desktop, `14px` mobile
- **`tracking-tight`** only for headings > 16px
- **Labels** are title case (not uppercase, no `tracking-wider`)
- **Mobile-first responsive**: `md:` breakpoint prefix
- **`data-reveal`** / **`data-reveal-left`** attributes for GSAP page animations
- **`data-lenis-prevent`** on scrollable containers to disable smooth scroll

### Backend Patterns

- **CommonJS** (`require`/`module.exports`) — NOT ES modules
- **Route handler pattern**: `router.get("/", protect, authorizeRoles("business"), async (req, res, next) => { try { ... res.json({}); } catch (error) { next(error); } })`
- **Auth middleware**: `protect` (JWT Bearer) + `authorizeRoles(...roles)` (RBAC)
- **Validation**: Zod schemas in route handlers: `const data = schema.parse(req.body)`
- **Error handling**: `try/catch/next(error)` in routes, global `errorHandler` middleware
- **Roles**: `business`, `creator`, `admin`, `finance_admin`, `support`, `super_admin`

### Auth Pattern (Frontend)

- JWT tokens stored in **localStorage** only (no cookies, no httpOnly)
- Helpers in `apps/brand/src/lib/auth.ts`: `saveAuth()`, `clearAuth()`, `getToken()`, `getUser()`, `isAuthenticated()`
- API requests use `apiRequest()` from `lib/api.ts` which attaches `Authorization: Bearer <token>`

### Campaign Status Flow

```
draft -> pending_payment -> under_review -> live -> completed
                                    |       -> paused -> live
                                    -> cancelled (with refund)
```

## Design System

The full design system is in `Fontend/apps/brand/designsystem.md` (496 lines). Key rules:
- All sizes/rem based at 13px root (14px mobile)
- Brand color: `#FEB604` (yellow)
- Primary font: Rethink Sans (`font-rethink`)
- No shadows, no button hover effects
- Button text: `font-semibold`; everything else: `font-medium`
- Labels: title case; no uppercase text anywhere
