# AGENTS.md — EasilyPromote Codebase Guide

## Project Overview

EasilyPromote is a two-sided marketplace connecting brands with content creators for view-based social media campaigns. Brands fund campaigns, creators produce content, and views are tracked to trigger payouts via Paystack escrow.

## Repository Structure

```
Easily-promote/
  Backend/              Express.js API server (CommonJS, standalone — NOT in turborepo)
  Fontend/              Turborepo monorepo (intentional typo in directory name)
    apps/
      brand/            @ep/brand  — Next.js 15, port 3002 (most developed)
      creator/          @ep/creator — Next.js 15, port 3001
      admin/            @ep/admin  — Next.js 15, port 3003
    packages/
      ui/               @ep/ui — Shared components, hooks, assets, utils
```

## Build / Dev / Lint / TypeScript Commands

### Frontend (run from `Fontend/`)

```bash
# Dev (all apps via turborepo)
npm run dev

# Dev (single app)
npm run dev --filter=@ep/brand
npm run dev --filter=@ep/creator
npm run dev --filter=@ep/admin

# Build (all)
npm run build

# Lint (all)
npm run lint

# Lint (single app)
npx turbo run lint --filter=@ep/brand

# TypeScript check (no --noEmit script exists; run directly)
npx tsc --noEmit             # from Fontend/apps/brand
npx tsc --noEmit             # from Fontend/packages/ui
```

### Backend (run from `Backend/`)

```bash
npm run dev       # nodemon src/server.js (port 5000, auto-restart)
npm run start     # node src/server.js (production)
```

### Testing

No test framework is configured. No `typecheck` script exists in package.json — run `tsc --noEmit` directly (see above).

## Key Ports

| Service       | Port |
|---------------|------|
| Brand app     | 3002 |
| Creator app   | 3001 |
| Admin app     | 3003 |
| Backend API   | 5000 |

## Tech Stack

| Layer              | Technology |
|--------------------|------------|
| Frontend framework | Next.js 15 (App Router), React 19 |
| Styling            | Tailwind CSS 3.4, CSS variables (oklch brand, HSL others) |
| UI primitives      | shadcn/ui v4 (base-nova), Radix UI, Base UI, Vaul (drawer/bottom sheet) |
| Animation          | GSAP 3.15 (`useReveal` hook), Lenis smooth scroll |
| Icons              | HugeIcons (`@hugeicons/core-free-icons` + `@hugeicons/react`), Lucide as backup |
| Forms              | Manual `useState` + `onChange` (no React Hook Form, no Formik) |
| State management   | React `useState`/`useEffect`/`useCallback` only (no Redux, Zustand) |
| Real-time          | Socket.IO client 4.8 (`useSocket` hook) |
| Backend            | Express 4.21 (CommonJS), Mongoose 8.9, MongoDB Atlas |
| Auth               | Custom JWT (access token only), localStorage on frontend |
| Payments           | Paystack (Nigerian processor) |
| File upload        | Multer (memory storage) → Cloudinary |
| Validation         | Zod (backend only — in route handlers) |

## TypeScript & Config

- **`strict: true`** in all `tsconfig.json` files
- **Path aliases**: `@/*` → `./src/*`, `@ep/ui/*` → `../../packages/ui/src/*`
- **`moduleResolution: "bundler"`** everywhere
- **No `typecheck` script** — use `npx tsc --noEmit` directly
- **`next.config.ts`** rewrites `/api/*` → `http://localhost:5000/api/*` (dev proxy)
- **No eslint config file found** (app uses `next lint` default config)
- **No test framework configured**

## Code Style Guidelines

### File Naming

| Type              | Convention          | Example |
|-------------------|---------------------|---------|
| React components  | PascalCase          | `CampaignWizard.tsx`, `ActiveDashboard.tsx` |
| Hooks             | kebab-case `use-`   | `use-reveal.ts`, `use-is-mobile.ts` |
| Lib utilities     | camelCase           | `api.ts`, `auth.ts`, `socket.ts` |
| Backend routes    | camelCase           | `campaigns.js`, `errorHandler.js` |
| Backend models    | PascalCase          | `User.js`, `Campaign.js` |
| Constants         | UPPER_SNAKE_CASE    | `FILTER_OPTIONS`, `PRESET_VIEWS` |

### Component Patterns

- **Named exports** for all components: `export function CampaignWizard(...) {}`
- **Default exports** only for Next.js page files: `export default function Page() {}`
- **`"use client"`** directive required on any component using hooks, event handlers, or browser APIs
- **`React.forwardRef`** for shared UI primitives (button, input, badge) with `displayName` set
- **Props interfaces** defined with `interface`, not `type` — prefixed with component name: `interface CampaignWizardProps`
- **Destructure props** in function signature, not inside the body
- **`React` namespace import** (`import * as React from "react"`) preferred over named imports for types
- **Inline `React.useState`**, `React.useEffect`, `React.useCallback`, `React.useRef` — or named imports at the top (both patterns exist; be consistent within a file)

### Import Ordering

1. React / Next.js: `import * as React from "react"`, `import { useRouter } from "next/navigation"`
2. Third-party: `import { HugeiconsIcon } from "@hugeicons/react"`
3. Shared UI: `import { cn } from "@ep/ui/lib/utils"`, `import { CampaignCard } from "@ep/ui/components/campaign-card"`
4. Local components: `import { Skeleton } from "./ui/skeleton"`
5. Hooks/lib: `import { useReveal } from "../hooks/use-reveal"`, `import { apiRequest } from "../lib/api"`
6. Assets: `import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg"`

### TypeScript Patterns

- **`interface`** for data shapes and props: `interface CampaignData { ... }`
- **`type`** for unions, aliases, and tuples: `type TabType = "Overview" | "Submissions"`
- **`as const`** for readonly tuples and enum-like constants: `const FILTER_OPTIONS = [...] as const`
- **`Record<string, T>`** for dictionaries (avoid index signatures with `[key: string]`)
- **`unknown`** in catch blocks — never `any`: `catch (err: unknown) { err instanceof Error ? err.message : "..." }`
- **Generic parameters** on `apiRequest<T>(endpoint, options)` for typed API responses
- **`React.ChangeEvent<HTMLInputElement>`** for event types in handlers

### Styling Rules

- **`cn()` utility** (`clsx` + `tailwind-merge`) for ALL conditional classes — never raw template literals
- **No `font-bold`** anywhere — `font-semibold` for buttons only, `font-medium` for all other text
- **No hover effects** on buttons (hard design rule)
- **No shadows** anywhere in the app (hard design rule — no `shadow-*` classes)
- **`font-rethink`** class on all text (Rethink Sans is the single primary font)
- **REM-based typography**: `html { font-size: 13px }` desktop, `14px` mobile
- **`tracking-tight`** only for headings > 16px
- **Labels** are title case — never uppercase, never `tracking-wider`
- **Mobile-first**: `md:` breakpoint prefix for desktop-up styles
- **Responsive icons**: Use two `HugeiconsIcon` elements with `md:hidden` / `hidden md:block` (Huge Icons `size` prop uses inline styles, so responsive classes on one element don't work)
- **Animation**: `data-reveal` / `data-reveal-left` attributes on elements for GSAP entrance animations
- **Smooth scroll**: `data-lenis-prevent` on scrollable containers to disable Lenis
- **Image optimization**: Add `unoptimized` on `<Image>` for avatars and SVGs to avoid Cloudinary/SVG validation issues

### HugeIcons Usage

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Add01Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={FilterIcon} size={16} className="text-stone-500" />
```

- Icon size: 12–14 for inline/badge, 16 for standard, 20 for mobile touch targets
- Color: always via `className` (never hardcoded fill)

### Toast & Error Handling (Frontend)

- **Toast system**: `ToastProvider` + `useToast()` hook (context-based, auto-dismiss after 4s)
- **Pattern**: `const { toast } = useToast(); toast("Message", "error" | "success")`
- **Error state in components**: track with `const [error, setError] = useState("")` and render inline
- **Loading state**: track with `const [loading, setLoading] = useState(true)`
- **Skeleton**: `<Skeleton className="h-8 w-48" />` for loading placeholders

### API Requests (Frontend)

- **`apiRequest<T>(endpoint, options)`** from `lib/api.ts` — wraps `fetch`, sets `Content-Type: application/json`, attaches `Authorization: Bearer <token>` if `options.token` is provided
- **File uploads** use raw `fetch` with `FormData` (no `Content-Type` header — browser auto-sets `multipart/form-data`):
  ```tsx
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload/image`, {
    method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData
  });
  ```
- **Error responses**: `apiRequest` throws on non-ok status with `error.error` or `HTTP ${status}` message
- **Upload endpoint**: `POST /api/upload/image` (field name: `"file"`, returns `{ url, publicId, width, height, format }`)

### Auth Pattern (Frontend)

- JWT token + user JSON stored in **localStorage** (keys: `"token"`, `"user"`)
- Helpers in `apps/brand/src/lib/auth.ts`: `saveAuth()`, `clearAuth()`, `getToken()`, `getUser()`, `isAuthenticated()`
- Auth state derived from localStorage on mount — no refresh token rotation
- Logout: `clearAuth()` + `router.push("/login")`

### Backend Patterns

- **CommonJS** (`require`/`module.exports`) — NOT ES modules
- **Route handler pattern**:
  ```js
  router.get("/", protect, authorizeRoles("business"), async (req, res, next) => {
    try {
      // ... logic
      res.json({ ... });
    } catch (error) {
      next(error);
    }
  });
  ```
- **Auth middleware**: `protect` (verifies JWT Bearer token) + `authorizeRoles(...roles)` (RBAC check)
- **Roles**: `business`, `creator`, `admin`, `finance_admin`, `support`, `super_admin`
- **Validation**: Zod schemas in route handlers: `const data = schema.parse(req.body)`
- **Error handler**: Global `errorHandler` middleware handles `CastError`, `ValidationError`, duplicate key, `JsonWebTokenError`, `TokenExpiredError`
- **Models**: Mongoose with `{ timestamps: true }`, explicit field validations (`required`, `enum`, `minlength`, `maxlength`)
- **`select: false`** on password field; pre-save hook hashes password with bcrypt (salt rounds: 12)
- **File structure**: `routes/` (Express routers), `models/` (Mongoose schemas), `middleware/` (auth, upload, errorHandler), `utils/` (jwt, cloudinary), `config/` (db, socket, pricing), `services/` (paystack)

### Campaign Status Flow

```
draft -> pending_payment -> under_review -> live -> completed
                                    |       -> paused -> live
                                    -> cancelled (with refund)
```

### Real-Time Communication

- **Socket.IO** client in `lib/socket.ts` — singleton socket, connects once with auth token
- **Hook**: `useSocket(callback)` — listens for `"payment-success"` events
- **Events**: `"payment-success"` payload `{ campaignId: string, status: string }`
- Backend uses Socket.IO for real-time campaign status updates after payment

### Shared UI Package (`@ep/ui`)

- Components in `packages/ui/src/components/` — consumed by apps via path exports (`@ep/ui/components/button`)
- Exports defined in `packages/ui/package.json` `"exports"` field
- Must run `turbo run build` (or have it run transitively) when changing UI package — Next.js `transpilePackages: ["@ep/ui"]` in next.config handles runtime compilation
- Assets (images, SVGs) in `packages/ui/src/assets/` — imported as URL strings
- the `MobileDrawer` component returns `null` on non-mobile (`useIsMobile` hook, breakpoint 768px)

### Design System (Hard Rules)

Full design system at `Fontend/apps/brand/designsystem.md`. Key non-negotiables:
- Root font size: 13px desktop, 14px mobile
- Brand color: `#FEB604` (yellow)
- Primary font: Rethink Sans — `font-rethink` on all text
- No shadows, no hover effects on buttons
- Button text: `font-semibold` only; all other text: `font-medium`
- Labels: title case, no uppercase, no `tracking-wider`
- Button radius: `rounded-full` (pill shape)
- Input radius: `rounded-full` for text inputs, `rounded-xl` for textareas
