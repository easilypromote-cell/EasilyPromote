# Design System

## Brand
- Primary: `#FEB604` (brand yellow)
- Font: Rethink Sans

## Colors

### Neutral Palette (Stone)

| Token | Hex | Usage |
|-------|-----|-------|
| stone-50 | `#FAFAF9` | Background |
| stone-100 | `#F5F5F4` | Right panel bg, disabled button bg, wizard details container, wizard info box bg, wizard left sidebar bg (as `#FBFBFA`) |
| stone-200 | `#E7E5E4` | Input borders, upload image container bg |
| stone-300 | `#D6D3D1` | Unchecked checkbox border, placeholder text |
| stone-400 | `#A8A29E` | Subtitles, helper text, icons, inactive step labels |
| stone-500 | `#78716C` | Labels, descriptions |
| stone-600 | `#57534E` | Pill unselected text, category tag text, upload button text |
| stone-700 | `#44403C` | (reserved) |
| stone-800 | `#292524` | Select element text, detail row values |
| stone-900 | `#1C1917` | Headings, body text, links, active elements, selected pills |
| stone-950 | `#0C0A09` | Checked checkbox bg |

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| brand yellow | `#FEB604` | Submit buttons, left panel bg, selected card border |

### Semantic Colors

| Token | Usage |
|-------|-------|
| `bg-stone-100` | Right content panel background, details container, info box |
| `bg-[#FBFBFA]` | OTP input background, wizard left sidebar |
| `bg-[#EBF3FF]` | Warning info box background |
| `bg-green-600` | Completed step indicator |
| `disabled:bg-stone-100` | Disabled submit button background |
| `disabled:text-stone-300` | Disabled submit button text |

## Typography

### Base

- Base size: 13px (1rem) — set via `html { font-size: 13px }`
- Font family: Rethink Sans (weights: 500, 600, 700)
- Default body font: `font-rethink` (set on `<body>` tag)

### Type Scale (REM-based, 13px base)

| Token | rem | px | Usage |
|-------|-----|-----|-------|
| xs | 0.846rem | 11px | Labels, helper text, subtitles |
| sm | 0.923rem | 12px | Inputs, buttons, body links |
| base | 1rem | 13px | Body text |
| md | 1.077rem | 14px | Emphasized body |
| lg | 1.231rem | 16px | Role card titles, OTP digits |
| xl | 1.462rem | 19px | Section headers, "What happens next" heading |
| 2xl | 1.846rem | 24px | Page titles (h1) |
| 3xl | 2.154rem | 28px | Hero text |
| 4xl | 2.462rem | 32px | Left panel heading |
| `[23px]` | — | 23px | Campaign budget display |

### Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| Medium (500) | `font-medium` | All body text, labels, headings, inputs, subtitles, role card descriptions, campaign budget |
| Semibold (600) | `font-semibold` | All button text, tab active states |

> **Rule**: `font-medium` for all non-button text. `font-semibold` only for buttons.
> **Font family**: `font-rethink` for all text (no `font-inter` in body content).

### Letter Spacing

| Pattern | Tailwind | Usage |
|---------|----------|-------|
| -5% | `tracking-tighter` | H2 headings |
| -2% | `tracking-tight` | Subtitles, role card text, wizard text |
| Title case | (none) | Labels (NO uppercase) |

## Buttons

### Primary (Submit)

| Property | Value |
|----------|-------|
| Width | `w-full` (300px on role-select) |
| Padding | `py-4` (16px vertical) |
| Background | `bg-[#FEB604]` |
| Text | `text-stone-900`, `text-sm`, `font-semibold` |
| Border radius | `rounded-full` |
| Border | `border border-stone-100` |
| Font | `font-rethink` |
| Hover | NONE |

### Primary Disabled

| Property | Value |
|----------|-------|
| Background | `disabled:bg-stone-100` |
| Text | `disabled:text-stone-300` |
| Cursor | `disabled:cursor-not-allowed` |

### Secondary (Back — Step 2)

| Property | Value |
|----------|-------|
| Width | `flex-1` |
| Padding | `py-4` |
| Background | `bg-white` |
| Border | `border border-stone-200` |
| Text | `text-stone-900`, `text-sm`, `font-semibold` |
| Border radius | `rounded-full` |

### Secondary (Back — Step 3)

| Property | Value |
|----------|-------|
| Width | `flex-1` |
| Padding | `py-4` |
| Background | `bg-white` |
| Border | `border border-stone-100` |
| Text | `text-stone-900`, `text-sm`, `font-semibold` |
| Border radius | `rounded-full` |

### Text Link

| Property | Value |
|----------|-------|
| Size | `text-sm` |
| Weight | `font-semibold` |
| Color | `text-stone-900` |
| Font | `font-rethink` |

### Upload Image Button

| Property | Value |
|----------|-------|
| Padding | `px-4 py-1.5` |
| Background | `bg-white` |
| Border | NONE |
| Text | `text-xs font-medium text-stone-600` |
| Border radius | `rounded-full` |

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

### Textarea

| Property | Value |
|----------|-------|
| Width | `w-full` |
| Padding | `px-4 py-3` |
| Border | `border border-stone-200` |
| Radius | `rounded-xl` (not rounded-full) |
| Text | `text-sm`, `font-medium` |
| Placeholder | `placeholder-stone-300` |
| Focus | `focus:outline-none focus:border-stone-400 focus:ring-0` |
| Font | `font-rethink` |

### OTP Input

| Property | Value |
|----------|-------|
| Width | `w-12` (48px) |
| Height | `h-14` (56px) |
| Border | `border border-stone-200` |
| Radius | `rounded-xl` |
| Text | `text-lg`, `font-medium`, `text-center` |
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
| `space-y-8` | 32px | Login/Forgot/OTP/Reset/Role root, wizard step 1 fields, wizard info box items |
| `space-y-6` | 24px | All forms, wizard step 2 fields, wizard step 3 root, wizard details container |
| `space-y-4` | 16px | Button groups, left panel text |
| `space-y-3` | 12px | Pill selection groups |
| `space-y-2` | 8px | Header groups, field label-to-input |
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

### Campaign Wizard Shell

| Property | Value |
|----------|-------|
| Root | `flex w-full h-full overflow-hidden` |
| Left sidebar | `w-80`, `bg-[#FBFBFA]`, `border-r border-stone-100`, `p-8`, `flex flex-col justify-between h-full` |
| Right content | `flex-1`, `p-12`, `flex flex-col justify-between overflow-y-auto h-full` |
| Header | `text-center mb-8 relative`, `font-semibold tracking-tight text-xl` |
| Close button | `absolute right-0 top-1/2 -translate-y-1/2`, `text-stone-400` |
| Form content | `w-[350px] mx-auto` |

### Campaign Details Shell

| Property | Value |
|----------|-------|
| Root | `flex w-full h-full overflow-hidden bg-stone-50` |
| Left sidebar | `w-80`, `bg-stone-50`, `border-r border-stone-100`, `p-8`, `flex flex-col justify-between h-full` |
| Right content | `flex-1`, `bg-stone-50`, `p-12`, `overflow-y-auto h-full`, `data-lenis-prevent` |
| Overview content width | `w-[350px]` |
| Payouts content width | `w-[500px]` |
| Submission content width | `w-[400px]` |
| Tab buttons | `rounded-[40px]` (hug content) |
| Tab active | `bg-white border border-stone-200/80 text-stone-900 font-semibold` |
| Tab inactive | `text-stone-500 font-semibold` |
| Tab icon active | `text-stone-900` |
| Tab icon inactive | `text-stone-400` |

### Campaign Details Badges

| Property | Value |
|----------|-------|
| Padding | `px-2 py-0.5` |
| Radius | `rounded-full` |
| Background | `bg-stone-100` |
| Text | `text-stone-600 font-medium tracking-tight text-[10px]` |
| Font | `font-rethink` |

### Campaign Card Status Badges

All status badges: `px-2 py-0.5 rounded-full font-medium tracking-tight text-[10px] font-rethink flex items-center gap-1`. Dot: `w-1 h-1 rounded-full`.

| Status | Background | Text | Dot | Label |
|--------|------------|------|-----|-------|
| Under Review | `bg-[#FBDFB1]` | `text-[#693D11]` | `bg-[#693D11]` | Under Review |
| Live Campaigns | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` | Live Campaigns |
| Completed | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` | Completed |
| Draft | `bg-stone-200` | `text-stone-600` | `bg-stone-500` | Draft |

### Campaign Card Category Pills

Category and delivery pills: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px]`.

| Pill | Icon | Icon Color |
|------|------|------------|
| Music (category) | `MusicNote01Icon` size 12 | `text-stone-500` |
| Delivery (e.g. 7 Day Delivery) | `Clock01Icon` size 12 | `text-stone-500` |

### Campaign Details Progress

| Property | Value |
|----------|-------|
| Progress numbers | `text-2xl font-semibold tracking-tight text-stone-900` |
| Percentage | `text-xs font-semibold tracking-tight text-stone-700` |

### Campaign Details Submission Tab

| Property | Value |
|----------|-------|
| Container width | `w-[400px]` |
| Container spacing | `space-y-8 pb-10` |
| No sub-navigation | Sub-tabs removed; Posted content shown directly |
| Card container | `bg-stone-100 rounded-[16px] p-[8px]` |
| Card layout | `flex flex-col gap-3` |
| Card top row | `flex gap-3` (thumbnail + text side by side) |
| Thumbnail | `w-[75px] h-[100px] rounded-xl` |
| Platform pills | `px-3 py-1.5 rounded-full text-[10px] font-medium flex-1 justify-center text-center` |
| Platform active | `bg-white border border-stone-200 text-stone-900` |
| Platform inactive | `text-stone-400` |
| Stats row | `flex items-center justify-between` |
| Stats labels | `text-[10px] font-medium text-stone-500` |
| Stats values | `text-xs font-medium text-stone-800` |

### Content Widths

| Component | Width |
|-----------|-------|
| All right-section steps | `w-[350px]` |
| Campaign details overview | `w-[350px]` |
| Campaign details payouts | `w-[500px]` |
| Campaign details submission | `w-[400px]` |
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

### Multi-Select Pill

| Property | Value |
|----------|-------|
| Padding | `px-4 py-2` |
| Border | `border` |
| Radius | `rounded-full` |
| Text | `text-xs font-medium` |
| Selected | `bg-stone-900 border-stone-900 text-white` |
| Unselected | `bg-white border-stone-200 text-stone-600` |
| Behavior | Toggle on/off (multi-select) |
| "Other" option | Shows text input below when selected |

## Wizard Step Indicators

| State | Circle | Label |
|-------|--------|-------|
| Active | `border-stone-900 bg-stone-900 text-white` | `text-stone-900 font-medium` |
| Completed | `border-green-600 bg-green-600 text-white` + Check icon | `text-stone-400 font-medium` |
| Inactive | `border-stone-300 text-stone-400` | `text-stone-400 font-medium` |

All indicators are clickable `<button>` elements — navigate back to that step. Cursor is `pointer` when reachable, `default` when not.

## Campaign Cover (Step 1)

| Property | Value |
|----------|-------|
| Layout | `flex items-center gap-4` (no bg/border/padding wrapper) |
| Image container | `w-16 h-16 bg-stone-200 rounded-xl` |
| Title | `text-xs font-semibold text-stone-900` |

## Campaign Budget Display (Step 1)

| Property | Value |
|----------|-------|
| Font size | `text-[23px]` (23px) |
| Weight | `font-medium` |
| Color | `text-stone-900` |
| Separator | `pt-4 border-t border-stone-100` |

## Review & Launch (Step 3)

| Property | Value |
|----------|-------|
| Image | `w-[70px] h-[70px] bg-purple-100 rounded-2xl border border-purple-200` |
| Name | `font-semibold text-base text-stone-900` |
| Category tag | `bg-stone-100 text-stone-600 rounded-full px-3 py-1 text-[11px] font-medium` |
| Layout | Left-aligned (no centering) |
| Views/Budget | `flex items-center gap-6`, `text-lg font-semibold` |
| Details container | `bg-stone-100 rounded-[18px] p-4 space-y-6` |
| Detail row | `flex justify-between items-center text-xs` |
| Detail label | `font-medium text-stone-500` |
| Detail value | `font-semibold text-stone-800` |

## Confirmation Screen (Step 4)

| Property | Value |
|----------|-------|
| Illustration | illustration3, 160x160 |
| Heading | `font-semibold tracking-tight text-2xl` |
| Subtitle | `text-sm text-stone-500 leading-relaxed max-w-md mx-auto` |
| Button | `w-full py-4` (fills container), standard primary button |
| Info box bg | `bg-stone-100` |
| Info box radius | `rounded-[24px]` |
| Info box padding | `p-4` |
| Info box spacing | `space-y-8` (heading to items) |
| "What happens next" heading | `text-[19px] font-medium tracking-tight` |
| Info box item title | `text-xs font-medium tracking-tight text-stone-800` |
| Info box item body | `text-xs text-stone-500 mt-1` |

## Warning Info Box

| Property | Value |
|----------|-------|
| Background | `bg-[#EBF3FF]` |
| Border | `border border-dashed border-blue-200` |
| Radius | `rounded-[20px]` |
| Padding | `p-4` |
| Layout | `flex items-center gap-4` |
| Text | `text-xs text-stone-600 leading-normal` |

## Icons

| Icon | Size | Color | Source |
|------|------|-------|--------|
| Eye / EyeOff | `w-4 h-4` (16px) | `text-stone-400` | lucide-react |
| ChevronDown | `w-4 h-4` / `w-3.5 h-3.5` | `text-stone-400` | lucide-react |
| Check | `w-3 h-3` (12px) | `text-white` | lucide-react |
| X (close) | `w-4 h-4` | `text-stone-400` | lucide-react |
| Logo | 40x40 | — | next/image |

## Components

### ViewsSlider

| Property | Value |
|----------|-------|
| Outer track height | `h-[30px]` |
| Outer track bg | `bg-white` |
| Outer track radius | `rounded-[30px]` (pill shape) |
| Outer track border | `border border-stone-200` |
| Inner fill bg | `bg-stone-900` |
| Inner fill radius | `rounded-[30px]` |
| Fill width | Grows from left to current step position |
| Milestone dots | `rounded-full` |
| Current dot | `w-2.5 h-2.5 bg-white` (on fill boundary) |
| Active dot (before current) | `w-1.5 h-1.5 bg-white/80` |
| Inactive dot | `w-1.5 h-1.5 bg-stone-300` |
| Step labels | `text-[10px] font-medium font-rethink` below track |
| Drawer compat | `data-vaul-no-drag` attribute to prevent drawer swipe |
| Keyboard | Arrow keys to navigate steps |
| Interaction | Click/drag on track, click step labels |

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-xl` | Left panel photo card |
| `shadow-inner` | Left panel decorative box |
