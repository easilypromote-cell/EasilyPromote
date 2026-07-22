# Design System

## Brand
- Primary: `#FEB604` (brand yellow)
- Font: Rethink Sans

## Colors

### Neutral Palette (Stone)

| Token | Hex | Usage |
|-------|-----|-------|
| stone-50 | `#FAFAF9` | Background |
| stone-100 | `#F5F5F4` | Right panel bg, disabled button bg |
| stone-200 | `#E7E5E4` | Input borders |
| stone-300 | `#D6D3D1` | Unchecked checkbox border, placeholder text |
| stone-400 | `#A8A29E` | Subtitles, helper text, icons |
| stone-500 | `#78716C` | Labels, descriptions |
| stone-600 | `#57534E` | (reserved) |
| stone-700 | `#44403C` | (reserved) |
| stone-800 | `#292524` | Select element text |
| stone-900 | `#1C1917` | Headings, body text, links |
| stone-950 | `#0C0A09` | Checked checkbox bg |

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| brand yellow | `#FEB604` | Submit buttons, left panel bg, selected card border |

### Semantic Colors

| Token | Usage |
|-------|-------|
| `bg-stone-100` | Right content panel background |
| `bg-[#FBFBFA]` | OTP input background |
| `disabled:bg-stone-100` | Disabled submit button background |
| `disabled:text-stone-300` | Disabled submit button text |

## Typography

### Base

- Base size: 13px (1rem) — set via `html { font-size: 13px }`
- Font family: Rethink Sans (weights: 500, 600, 700)

### Type Scale (REM-based, 13px base)

| Token | rem | px | Usage |
|-------|-----|-----|-------|
| xs | 0.846rem | 11px | Labels, helper text, subtitles |
| sm | 0.923rem | 12px | Inputs, buttons, body links |
| base | 1rem | 13px | Body text |
| md | 1.077rem | 14px | Emphasized body |
| lg | 1.231rem | 16px | Role card titles, OTP digits |
| xl | 1.462rem | 19px | Section headers |
| 2xl | 1.846rem | 24px | Page titles (h1) |
| 3xl | 2.154rem | 28px | Hero text |
| 4xl | 2.462rem | 32px | Left panel heading |

### Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| Medium (500) | `font-medium` | Labels, inputs, subtitles, body text, role card descriptions |
| Semibold (600) | `font-semibold` | Right-section headings (h2), role card titles |
| Bold (700) | `font-bold` | Submit buttons, links |

### Letter Spacing

| Pattern | Tailwind | Usage |
|---------|----------|-------|
| -5% | `tracking-tighter` | H2 headings |
| -2% | `tracking-tight` | Subtitles, role card text |
| Title case | (none) | Labels (NO uppercase) |

## Buttons

### Primary (Submit)

| Property | Value |
|----------|-------|
| Width | `w-full` (300px on role-select) |
| Padding | `py-4` (16px vertical) |
| Background | `bg-[#FEB604]` |
| Text | `text-stone-900`, `text-sm`, `font-bold` |
| Border radius | `rounded-full` |
| Shadow | `shadow-sm` |
| Font | `font-rethink` |
| Hover | NONE |

### Primary Disabled

| Property | Value |
|----------|-------|
| Background | `disabled:bg-stone-100` |
| Text | `disabled:text-stone-300` |
| Cursor | `disabled:cursor-not-allowed` |

### Text Link

| Property | Value |
|----------|-------|
| Size | `text-sm` |
| Weight | `font-bold` |
| Color | `text-stone-900` |
| Font | `font-rethink` |

## Inputs

### Standard Text Input

| Property | Value |
|----------|-------|
| Width | `w-full` |
| Padding | `px-4 py-3` |
| Border | `border border-stone-200` |
| Radius | `rounded-full` |
| Text | `text-sm`, `font-medium` |
| Placeholder | `placeholder-stone-300` |
| Focus | `focus:outline-none focus:border-stone-400 focus:ring-0` |
| Transition | `transition-colors` |
| Font | `font-rethink` |

### OTP Input

| Property | Value |
|----------|-------|
| Width | `w-12` (48px) |
| Height | `h-14` (56px) |
| Border | `border border-stone-200` |
| Radius | `rounded-xl` |
| Text | `text-lg`, `font-bold`, `text-center` |
| Background | `bg-[#FBFBFA]` |
| Focus | `focus:outline-none focus:border-stone-400 focus:ring-0` |
| Transition | `transition-colors` |
| Font | `font-rethink` |

### Select

Same as standard input + `appearance-none`, `bg-white`, `cursor-pointer`

## Labels

| Property | Value |
|----------|-------|
| Size | `text-xs` (11px) |
| Weight | `font-medium` |
| Color | `text-stone-500` |
| Case | Title case (NOT uppercase) |
| Font | `font-rethink` |

## Spacing

### Component Spacing

| Pattern | Value | Usage |
|---------|-------|-------|
| `space-y-10` | 40px | Register-step root |
| `space-y-8` | 32px | Login/Forgot/OTP/Reset/Role root |
| `space-y-6` | 24px | All forms |
| `space-y-4` | 16px | Button groups, left panel text |
| `space-y-2` | 8px | Header groups |
| `space-y-1.5` | 6px | Field groups, header to subtitle |

### Input Spacing

| Pattern | Value |
|---------|-------|
| `px-4` | 16px horizontal |
| `py-3` | 12px vertical |

### Button Spacing

| Pattern | Value |
|---------|-------|
| `py-4` | 16px vertical |

## Layout

### Auth Page Shell

| Property | Value |
|----------|-------|
| Root | `min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white` |
| Left panel | `md:col-span-5`, `bg-[#FEB604]`, `p-10`, `h-screen` |
| Right panel | `md:col-span-7`, `flex items-center justify-center`, `p-10`, `h-screen overflow-y-auto`, `bg-stone-100` |

### Content Widths

| Component | Width |
|-----------|-------|
| All right-section steps | `w-[350px]` |
| Role select continue button | `w-[300px] max-w-full` |
| Left panel text area | `w-[430px]` |

### Responsive

- Mobile: single column, left panel hidden (`hidden md:flex`)
- Tablet+: 12-col grid (5 left + 7 right)
- All typography uses rem for automatic scaling
- Never use hardcoded px for font sizes

## Cards

### Role Select Card

| Property | Value |
|----------|-------|
| Padding | `p-4` (16px) |
| Border | 1px solid |
| Selected | `border-[#FEB604] bg-white` |
| Unselected | `border-transparent bg-white` |
| Radius | `rounded-3xl` |
| Illustration area | `h-32` (128px) |
| Title | `font-semibold text-lg text-stone-900` |
| Description | `text-base text-stone-500 font-medium` |

## Icons

| Icon | Size | Color | Source |
|------|------|-------|--------|
| Eye / EyeOff | `w-4 h-4` (16px) | `text-stone-400` | lucide-react |
| ChevronDown | `w-4 h-4` / `w-3.5 h-3.5` | `text-stone-400` | lucide-react |
| Check | `w-3 h-3` (12px) | `text-white` | lucide-react |
| Logo | 40x40 | — | next/image |

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Submit buttons |
| `shadow-xl` | Left panel photo card |
| `shadow-inner` | Left panel decorative box |
