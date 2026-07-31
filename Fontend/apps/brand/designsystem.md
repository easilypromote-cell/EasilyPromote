# Design System

## Brand
- Primary: `#FEB604` (brand yellow)
- Font: Rethink Sans (also Motterdam for onboarding headings)

## Colors

### Neutral Palette (Stone)
| Token | Hex | Usage |
|-------|-----|-------|
| stone-50 | `#FAFAF9` | Background (auth, details drawer) |
| stone-100 | `#F5F5F4` | Right panel bg, card bg, wizard info box bg, disabled button bg |
| stone-200 | `#E7E5E4` | Input borders, drag handle, skeleton bg |
| stone-300 | `#D6D3D1` | Unchecked checkbox border, placeholder text, separator dots |
| stone-400 | `#A8A29E` | Subtitles, helper text, icons, inactive/non-focused UI text |
| stone-500 | `#78716C` | Labels, descriptions, inactive tab text |
| stone-600 | `#57534E` | Pill unselected text, category tag text, upload button text |
| stone-700 | `#44403C` | (reserved) |
| stone-800 | `#292524` | Detail row values, select element text |
| stone-900 | `#1C1917` | Headings, body text, links, active elements, selected pills |
| stone-950 | `#0C0A09` | Checked checkbox bg, dark filled buttons |

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| brand yellow | `#FEB604` | Primary buttons, left panel bg, selected card border |

### Semantic Colors
| Token / Class | Usage |
|---|---|
| `bg-stone-100` | Right content panel background, details container, info box |
| `bg-[#FBFBFA]` | OTP input background, wizard left sidebar |
| `bg-[#EBF3FF]` | Warning info box, slot limit banner background |
| `border-[#BFDBFE] border-dashed` | Warning info box border, slot limit banner border |
| `bg-green-600` | Completed step indicator |
| Purple: `bg-purple-100 border-purple-200` | Campaign thumbnail placeholder, icon container |
| Purple text: `text-purple-600` | Thumbnail placeholder icon |
| Progress fill: `bg-blue-600` | Progress bars (cards and details) |
| Destructive: `bg-red-50 text-red-600 border-red-200` | Delete/destructive buttons and banners |
| Success banner: `bg-green-50 text-green-800 border-green-200` | Success floating toasts |
| Error banner: `bg-red-50 text-red-800 border-red-200` | Error floating toasts |

### Status Colors (Creator Badges)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-[#CBF5E5]` / `text-[#176448]` | needs_content, approved_post, live_tracking, delivered |
| `bg-[#FBDFB1]` / `text-[#693D11]` | under_review, pending_payment |
| `bg-[#F8C9D2]` / `text-[#710E21]` | changes_requested |

## Typography

### Base
- Base size: **13px (1rem)** — `html { font-size: 13px }` desktop, **14px** mobile
- Font family: Rethink Sans (weights: 500, 600, 700)
- Motterdam: used for onboarding/welcome headings
- `font-rethink` class required on ALL text elements (Tailwind JIT may purge if only on `<body>`)

### Type Scale (REM-based, 13px base)
| Token | rem | px | Usage |
|-------|-----|-----|-------|
| `text-[10px]` | — | 10px | Badge text, stat labels, info footnotes |
| xs | 0.846rem | 11px | Labels, helper text, subtitles, category tags |
| sm | 0.923rem | 12px | Inputs, buttons, body links |
| base | 1rem | 13px | Body text |
| md | 1.077rem | 14px | Emphasized body |
| lg | 1.231rem | 16px | Role card titles, OTP digits, campaign card titles |
| xl | 1.462rem | 19px | Section headers, "What happens next" heading |
| `text-[22px]` | — | 22px | Empty state "Nothing right now" |
| `text-[23px]` | — | 23px | Campaign budget display, "Welcome" heading |
| 2xl | 1.846rem | 24px | Page titles (h1) |
| 3xl | 2.154rem | 28px | Hero text, wallet balance |
| 4xl | 2.462rem | 32px | Left panel heading |
| `text-[33px]` | — | 33px | Onboarding welcome header (Motterdam font) |

Extra sizes in code: `text-[16px]` (card titles), `text-[11px]` (compact labels), `text-[20px]` (mobile budget)

### Font Weights
| Weight | Tailwind | Usage |
|--------|----------|-------|
| Medium (500) | `font-medium` | All body text, labels, descriptions, inputs, non-active UI elements, campaign budget |
| Semibold (600) | `font-semibold` | Buttons, active tab states, active filter items, section headings (h3+), detail row values in review step |
| Normal (400) | `font-normal` | Onboarding welcome header (Motterdam) |

> **Rule**: `font-medium` for body/labels/inputs. `font-semibold` for buttons, active navigation, and section headings. `font-bold` is **never** used.

### Letter Spacing
| Size Range | Tailwind | Effect |
|------------|----------|--------|
| ≥ 16px | `tracking-tighter` | -5% (headings, titles) |
| ≤ 14px (body) | `tracking-[-0.01em]` | -1% (body, labels) |
| Labels | (none) | Title case — NO uppercase, NO `tracking-wider` |

## Buttons

All buttons: `rounded-full`, `font-rethink`, **no hover effects**.

### Primary (Yellow)
| Property | Value |
|----------|-------|
| Padding | `py-3` (12px vertical) |
| Background | `bg-[#FEB604]` |
| Text | `text-stone-900 text-sm font-semibold` |
| Border | `border border-stone-100` |
| Disabled | `bg-stone-200 text-stone-400 cursor-not-allowed` |

### Dark Filled
`bg-stone-950 text-white rounded-full font-semibold text-xs font-rethink` — modal primary actions

### Destructive
`bg-red-50 text-red-600 font-semibold text-sm rounded-full border border-red-200 font-rethink`

### Stone-900 Filled
`bg-stone-900 text-white text-sm font-medium font-rethink rounded-full` — retry buttons

### White Outline
`bg-white border border-stone-200 text-stone-900 rounded-full font-semibold text-xs font-rethink`

### Text Link
`text-sm font-semibold text-stone-900 font-rethink` (no bg, no border)

### Cancel Dismiss Link
`w-full py-2 text-xs font-medium text-stone-500 font-rethink`

### Modal Cancel
`bg-stone-50 border border-stone-200 text-stone-600 rounded-full font-medium text-xs font-rethink`

### Upload Image
`px-4 py-1.5 bg-white text-xs font-medium text-stone-600 rounded-full font-rethink` — no border

### Resume (Draft Card)
`w-full h-12 bg-white border border-stone-100 text-stone-900 rounded-full font-semibold tracking-tight text-sm font-rethink`

### Add Pill Button
`px-4 py-2.5 bg-[#FEB604] disabled:bg-stone-200 disabled:text-stone-300 disabled:cursor-not-allowed text-[#1C1917] text-xs font-semibold font-rethink rounded-full`

### Mobile Back (Icon)
`flex items-center justify-center w-8 h-8 rounded-full bg-stone-200`

### Mobile Filter Trigger (Icon Only)
`flex md:hidden items-center justify-center bg-white border border-stone-200 rounded-full p-3`

> **Note**: The shared `@ep/ui/components/button` uses `rounded-md` (not `rounded-full`). This component should be updated to use `rounded-full` for consistency.

## Inputs

### Standard Text Input
| Property | Value |
|----------|-------|
| Padding | `px-4 py-3` |
| Border | `border border-stone-200` |
| Radius | `rounded-full` |
| Text | `text-sm font-medium` |
| Placeholder | `placeholder-stone-300` |
| Focus | `focus:outline-none focus:border-stone-400 focus:ring-0` |
| Transition | `transition-colors` |
| Font | `font-rethink` |

### Textarea
Same as input except `rounded-xl` (not `rounded-full`).

### OTP Input
`w-12 h-14 rounded-xl bg-[#FBFBFA] text-lg font-medium text-center`

### Select
Same as standard input + `appearance-none bg-white cursor-pointer`

## Labels
`text-xs font-medium text-stone-500 font-rethink` — title case, NOT uppercase.

## Spacing

### Component Spacing
| Pattern | Value | Usage |
|---------|-------|-------|
| `space-y-10` | 40px | Register-step root |
| `space-y-8` | 32px | Form roots, wizard step 1, wizard info box items |
| `space-y-6` | 24px | Forms, wizard step 2, wizard step 3 root |
| `space-y-4` | 16px | Button groups, card content |
| `space-y-3` | 12px | Pill groups, slot detail sections |
| `space-y-2` | 8px | Header groups, field label-to-input |
| `space-y-1.5` | 6px | Field groups, header to subtitle |

## Layout

### Auth Page Shell
`min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white`
- Left panel: `md:col-span-5 bg-[#FEB604] p-10 h-screen`
- Right panel: `md:col-span-7 flex items-center justify-center p-10 h-screen overflow-y-auto bg-stone-100`

### Campaign Wizard Shell
`flex w-full h-full overflow-hidden`
- Left sidebar: `w-80 bg-[#FBFBFA] border-r border-stone-100 p-8 flex flex-col justify-between h-full`
- Right content: `flex-1 p-12 flex flex-col justify-between overflow-y-auto h-full`
- Form content: `w-[350px] mx-auto`

### Campaign Details Shell
`flex w-full h-full overflow-hidden bg-stone-50`
- Left sidebar (desktop tabs): `w-56 flex flex-col pt-28 gap-8 flex-shrink-0 bg-stone-100`
- Tab buttons: `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium font-rethink text-left`
  - Active: `bg-stone-100 text-stone-900`
  - Inactive: `text-stone-400`
- Right content: `flex-1 bg-stone-50 p-12 overflow-y-auto h-full data-lenis-prevent`

### Mobile Horizontal Tabs (Campaign Details)
`flex gap-3 px-5 py-3 bg-stone-100 border-b border-stone-200 flex-shrink-0 overflow-x-auto`
- Tab: `px-4 py-2 rounded-full text-sm font-medium font-rethink whitespace-nowrap flex-shrink-0`
  - Active: `bg-stone-900 text-white`
  - Inactive: `text-stone-500`

### Creator Header Tab Pill Group
`hidden md:flex bg-stone-50 p-1 rounded-full gap-1 items-center`
- Active: `flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-white text-stone-950 border border-stone-200`
- Inactive: `flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-stone-500`
- Disabled tab: `disabled:opacity-40`

### Content Widths
| Component | Width |
|-----------|-------|
| Right-section steps (wizard) | `w-[350px]` |
| Campaign details overview | `w-[350px]` |
| Campaign details payouts | `w-[500px]` |
| Campaign details submission | `w-[400px]` |
| Role select continue button | `w-[300px] max-w-full` |
| Left panel text (auth) | `w-[430px]` |
| Marketplace drawer (desktop) | `w-[350px] mx-auto` |

### Responsive
- Mobile: single column, left panel hidden (`hidden md:flex`)
- Tablet+: 12-col grid (5 left + 7 right)
- All typography uses rem for automatic scaling
- **Never use hardcoded px for font sizes** (except `text-[Npx]` for specific non-scale sizes)

## Cards

### Campaign Card (Brand + Creator)
```
bg-stone-50 rounded-3xl border-[0.2px] border-stone-200 md:border md:border-stone-100 p-4 flex flex-col justify-between relative overflow-hidden
```
- Thumbnail: `w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-2xl object-cover border border-stone-200`
- Thumbnail fallback: Same size, `bg-purple-100 rounded-2xl flex items-center justify-center border border-purple-200` with icon `text-purple-600`
- Title: `font-rethink font-medium tracking-tighter text-[16px] text-stone-900 line-clamp-2`
- Description: `font-rethink text-xs text-stone-500 truncate mt-1 mb-5`
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full`
- Bottom row: `border-t border-stone-100 pt-4 flex justify-between items-center text-xs font-medium`

### Marketplace Campaign Card
Same as campaign card, plus:
- Category pill: `px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-[-0.01em] text-[10px] font-rethink`

### Browse Campaign Card (Dashed)
```
bg-stone-100 border border-stone-200 border-dashed rounded-3xl p-4 flex flex-col justify-between text-center cursor-pointer
```
Inner button: `w-full py-2.5 bg-white border border-stone-200 text-stone-900 rounded-full font-semibold text-xs font-rethink`

### Role Select Card
`p-4 rounded-3xl` — Selected: `border-[#FEB604] bg-white`, Unselected: `border-transparent bg-white`

### Multi-Select Pill
`px-4 py-2 border rounded-full text-xs font-medium`
- Selected: `bg-stone-900 border-stone-900 text-white`
- Unselected: `bg-white border-stone-200 text-stone-600`
- Toggle behavior (can select multiple)

## Campaign Status Badges

All badges: `px-2 py-0.5 rounded-full font-medium tracking-tight text-[10px] font-rethink flex items-center gap-1`
Dot: `w-1 h-1 rounded-full`

### Brand Statuses
| Status | Background | Text | Dot |
|--------|------------|------|-----|
| Under Review | `bg-[#FBDFB1]` | `text-[#693D11]` | `bg-[#693D11]` |
| Live | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` |
| Completed | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` |
| Draft | `bg-stone-200` | `text-stone-600` | `bg-stone-500` |
| Pending Payment | `bg-[#FBDFB1]` | `text-[#693D11]` | `bg-[#693D11]` |

### Creator Statuses
| Status | Background | Text | Dot |
|--------|------------|------|-----|
| Needs Content | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` |
| Changes Requested | `bg-[#F8C9D2]` | `text-[#710E21]` | `bg-[#710E21]` |
| Under Review | `bg-[#FBDFB1]` | `text-[#693D11]` | `bg-[#693D11]` |
| Approved — Ready to Post | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` |
| Live — Tracking Views | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` (`animate-pulse`) |
| Delivered | `bg-[#CBF5E5]` | `text-[#176448]` | `bg-[#176448]` |

### Category & Platform Pills
`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink`

## Progress Bars

### Card Compact
```
w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden
```
Fill: `h-full rounded-full transition-all bg-blue-600`
Text: `text-xs text-stone-500 font-medium tracking-tight font-rethink`

### Details Large
```
flex-1 h-2 bg-stone-100 border border-stone-200/50 rounded-full overflow-hidden
```
Fill (live): `h-full rounded-full transition-all duration-500 bg-blue-600`
Fill (delivered): `h-full rounded-full transition-all duration-500 bg-teal-500`
Percentage: `text-xs font-medium font-rethink`

### Upload Progress
```
w-full h-1.5 bg-stone-200 rounded-full overflow-hidden
```
Fill: `h-full bg-stone-900 rounded-full transition-all duration-150`
Percent text: `text-[10px] font-medium text-stone-500 font-rethink`

## Drawers

### Vaul Right-Slide Drawer (Desktop)
Shared from `@ep/ui/components/drawer`:
- Direction: `"right"`, max width `[1221px]`
- Content: `rounded-l-[24px]` with slide-in animation
- Overlay: `bg-stone-900/40 backdrop-blur-[2px]`
- Inner content: `pt-16 pb-12 px-10`, width `w-[350px] mx-auto`
- Close button: `hidden md:block absolute top-6 right-6 z-10` with `w-8 h-8 rounded-full bg-stone-200`

### MobileDrawer (Bottom Sheet)
Shared from `@ep/ui/components/mobile-drawer`:
- Returns `null` on non-mobile (`< 768px` via `useIsMobile()`)
- Overlay: `fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm`
- Content: `fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-white px-4 py-6 outline-none max-h-[70vh] overflow-y-auto`
- Drag handle: `w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4 flex-shrink-0`
- Keyboard-aware: tracks `window.visualViewport` height changes
- Children: `flex flex-col gap-2`
- For bottom-sheet drawer (marketplace): use `max-h-[90vh]`, inner padding `p-5 pb-[env(safe-area-inset-bottom)]`, width `w-full`

### Campaign Details Drawer (Creator)
Desktop: fixed inset-0 z-50 flex, left 1/5 overlay `bg-stone-900/10 backdrop-blur-md`, right 4/5 panel `bg-[#FAFAF9] rounded-l-[32px] border-l border-stone-250 overflow-y-auto p-10 animate-in slide-in-from-right duration-300`
Mobile: uses Vaul `DrawerPrimitive` directly (not MobileDrawer)

## Empty States

### Marketplace Empty
```
flex flex-col items-center justify-center text-center py-20 px-6
```
Image: `<Image src={emptyCampaignImg} unoptimized className="mb-6" />`
Heading: `font-rethink font-medium text-[22px] text-stone-900 mb-2` — "Nothing right now"
Subtext: `font-rethink text-xs text-stone-500 font-medium max-w-xs leading-relaxed`

### Inline Empty (Feed / Submissions / Payouts)
`col-span-full text-center py-12` or `text-center py-12 space-y-4 flex flex-col items-center`
Text: `text-stone-500 text-sm font-medium`

### EmptyState Page Component
`h-full flex flex-col justify-between items-center w-full px-6 md:px-[100px]`
Uses Motterdam font heading at `text-[33px]`

## Floating Banners

### Success Banner
```
fixed top-4 left-4 right-4 z-[60] bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3
```
Icon circle: `w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0`
Title: `font-rethink font-medium text-sm text-green-800`
Description: `font-rethink text-xs text-green-600 font-medium`
Auto-dismiss: 5000ms

### Error Banner
Same pattern, substitute green → red: `bg-red-50`, `border-red-200`, `text-red-800/600`

### Slot Limit Banner
```
fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-50
```
Container: `bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-[20px] p-2 flex items-center gap-3 text-left relative overflow-hidden`

### Draft Alert Banner
```
fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-50
```
Container: `flex items-center justify-between bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-2`

## Filter Dropdowns

### Desktop Dropdown
Trigger: `hidden md:flex items-center justify-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2.5 cursor-pointer`
Dropdown: `absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl py-1 z-50`
Items: `flex items-center w-full px-4 py-2.5 text-sm text-left`
- Active: `font-semibold text-stone-900`
- Inactive: `font-medium text-stone-700`
Click-outside: uses `useRef<HTMLDivElement>` + `mousedown` event listener

### Mobile Filter (Bottom Sheet)
Uses `<MobileDrawer>`
Items: `flex items-center w-full px-4 py-3 text-sm text-left rounded-lg`
- Active: `bg-stone-100 font-semibold text-stone-900`
- Inactive: `font-medium text-stone-700`

## Modals
Backdrop: `fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm`
Card: `bg-white border border-stone-200 rounded-3xl p-8 max-w-sm w-full space-y-6 mx-4 animate-in fade-in zoom-in duration-150`
Header: `font-rethink font-medium text-lg text-stone-900` + subtitle `text-xs text-stone-500 font-medium`
Button pair: `flex gap-2 pt-2`
- Cancel: `flex-1 py-2.5 bg-stone-50 border border-stone-200 text-stone-600 rounded-full font-medium text-xs font-rethink`
- Primary: `flex-1 py-2.5 bg-stone-950 text-white rounded-full font-semibold text-xs font-rethink`

## Wallet View
Container: `w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-8 text-center`
Balance card: `bg-[#FAFAF9] border border-stone-200 rounded-2xl p-6 mb-6`
Stat grid: `grid grid-cols-2 gap-4 mb-6`
Stat card: `bg-stone-50 border border-stone-200/50 rounded-2xl p-4 text-left`
Withdraw button: Primary (yellow), `w-full`

## Activity Timeline
Item rows separated by `border-b border-stone-100 pb-5`
Status badges: same pill pattern as status badges (see above), but with `border` for status-specific colors
- Delivered: `bg-teal-50 text-teal-700 border border-teal-100`
- Live: `bg-blue-50 text-blue-700 border border-blue-100`
- Changes requested: `bg-red-50 text-red-700 border border-red-100`
Comment bubbles: `bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-3 flex gap-2.5`

## Detail Rows (Key-Value Lists)
Pattern: `flex justify-between items-center font-rethink text-sm font-medium`
- Label: `text-stone-500`
- Value: `text-stone-800`

Also used in review step (wizard step 3): `bg-stone-100 rounded-[18px] p-4 space-y-6`, rows at `text-xs`

## Avatars
| Location | Classes | Size |
|----------|---------|-------|
| Header profile pill (creator) | `rounded-full object-cover` | 32×32 |
| Mobile drawer profile | `rounded-full object-cover flex-shrink-0` | 48×48 |
| Marketplace drawer brand | `w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-medium text-stone-600` | 28×28 |
| Profile modal upload | `relative w-20 h-20 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden` | 80×80 |
| Creator avatar (brand view) | `w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 to-[#FEB604] border border-white flex items-center justify-center text-[10px] font-medium font-rethink text-stone-950` | 28×28 |

Add `unoptimized` on all `<Image>` avatars.

## Icons
**Library**: `@hugeicons/core-free-icons` + `@hugeicons/react`
**Usage**: `<HugeiconsIcon icon={IconName} size={N} className="..." />`
**Color**: Always via `className`, never hardcoded fill.
**Sizes**: 12–14 inline/badge, 16 standard, 20 mobile touch targets.

| Icon | Size | Color | Usage |
|------|------|-------|-------|
| `EyeIcon` / `EyeOffIcon` | 16px | `text-stone-400` | Password visibility toggle |
| `ChevronDownIcon` | 16/14px | `text-stone-400` | Dropdown chevrons |
| `CheckIcon` | 12–14px | inherits | Completed steps, selects |
| `Cancel01Icon` | 12–16px | inherits | Close/dismiss |
| `FilterIcon` | 20/16px | `text-stone-500` | Filter trigger |
| `Add01Icon` | 20px | inherits | Add actions |
| `ArrowRight01Icon` | 14px | inherits | Navigation |
| `FolderOpenIcon` | 16–20px | inherits | Submissions tab |
| `MoreHorizontalIcon` | 20px | `text-stone-700` | More menu |
| `CloudUploadIcon` | 16px | inherits | Upload |
| `File01Icon` | 20px | `text-stone-500` | Document/file |
| `Delete01Icon` | 16px | inherits | Delete/trash |
| `MusicNote01Icon` | 12px | `text-stone-500` | Music category |
| `Clock01Icon` | 12px | inherits | Delivery time |
| `File02Icon` | 16px | inherits | Overview tab |
| `MoneyReceiveFlow02Icon` | 16px | inherits | Payouts tab |
| `CircleDashedIcon` | 20px | `text-stone-900/500` | Mobile wizard stepper |

**Mobile responsive icons**: Use two elements with `md:hidden` / `hidden md:block` (single element won't work because `size` uses inline styles).

## Components

### ViewsSlider
Outer track: `h-[30px] bg-stone-200 rounded-[30px] border border-stone-200`
Inner fill: `bg-stone-900 rounded-[30px]`
Thumb: `w-5 h-5 bg-white rounded-full border border-stone-200`
Value bubble: `bg-stone-900 text-white text-sm font-medium font-rethink px-3 py-1 rounded-full`
Milestone dots: `w-1.5 h-1.5 rounded-full` — active: `bg-white/70`, inactive: `bg-stone-300`
Step labels: `text-[10px] font-medium font-rethink` (clickable buttons)
Drawer compat: `data-vaul-no-drag`
Keyboard: Arrow keys to navigate

### Category Filter Chips
`flex gap-2.5 overflow-x-auto pb-1 scrollbar-none`
- Active: `px-4 py-2 rounded-full text-xs font-medium font-rethink bg-stone-900 text-white`
- Inactive: `px-4 py-2 rounded-full text-xs font-medium font-rethink bg-stone-100 text-stone-500`

### View Selection Preset Pills
`px-4 py-2 rounded-full text-xs font-medium font-rethink`
- Selected: `bg-stone-900 text-white`
- Disabled: `bg-stone-50 text-stone-300 cursor-not-allowed`
- Default: `bg-stone-100 text-stone-600`

### Content Style Chips
`px-3 py-1 rounded-full text-xs font-medium font-rethink`
- Selected: `bg-stone-900 text-white`
- Unselected: `bg-stone-100 text-stone-600`

### Platform Selection Chips
`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-medium font-rethink`
Remove button: `Cancel01Icon` size 12

### Skeleton
Base: `animate-pulse rounded-md bg-stone-200` — always with `className` for dimensions.

### Category Filter Chips (Marketplace)
Same as view selection pills, active `bg-stone-900 text-white`, inactive `bg-stone-100 text-stone-500`.

## Fonts Available (from tailwind.config)
| Family | Class | Usage |
|--------|-------|-------|
| Rethink Sans | `font-rethink` | Primary — ALL text |
| Motterdam | `font-motterdam` | Onboarding welcome headings only |
| Inter | `font-inter` | Loaded but unused in app |
| Raleway | `font-raleway` | Loaded but unused in app |

## Wizard

### Step Indicators
- Active: `border-stone-900 bg-stone-900 text-white`
- Completed: `border-green-600 bg-green-600 text-white` + CheckIcon
- Inactive: `border-stone-300 text-stone-400`
All clickable `<button>` elements.

### Mobile Wizard Stepper
`flex items-start justify-center gap-0 px-5 pt-3 pb-5 bg-stone-100`
Step circles: `w-8 h-8 rounded-full`, connector lines: `h-[1px] mt-4 w-12 flex-shrink-0`
- Completed: `bg-green-600 text-white` + connector `bg-green-600`
- Active: `CircleDashedIcon` size 20, `text-stone-900`
- Inactive: `CircleDashedIcon` size 20, `text-stone-500` + connector `bg-stone-200`
Step labels: `text-[10px] font-medium font-rethink`

### Campaign Cover (Step 1)
`flex items-center gap-4`, image `w-16 h-16 bg-stone-200 rounded-xl`, title `text-xs font-medium text-stone-900`

### Campaign Budget Display (Step 1)
`text-[23px] font-medium text-stone-900`, separator `pt-4 border-t border-stone-100`

### Review & Launch (Step 3)
- Image: `w-[70px] h-[70px] bg-purple-100 rounded-2xl border border-purple-200`
- Name: `font-semibold text-base text-stone-900`
- Category tag: `bg-stone-100 text-stone-600 rounded-full px-3 py-1 text-[11px] font-medium`
- Details container: `bg-stone-100 rounded-[18px] p-4 space-y-6`

### Confirmation Screen (Step 4)
Illustration `illustration3.svg` at 160×160, heading `font-semibold tracking-tight text-2xl`
Info box: `bg-stone-100 rounded-[24px] p-4 space-y-8`

### Warning Info Box
`bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-4 flex items-center gap-4`

## Hard Rules
- **No shadows**: All `shadow-*` classes are banned
- **No hover effects** on buttons or interactive elements
- **No `font-bold`** — `font-semibold` max (buttons + active states + headings), `font-medium` for everything else
- **`font-rethink`** on all text elements (required due to Tailwind JIT purging)
- **`rounded-full` for buttons** (pill shape), `rounded-full` for text inputs, `rounded-xl` for textareas
- **No uppercase labels** — always title case
- **No `tracking-wider`** on labels
- **Labels never uppercase**
- **`unoptimized`** on `<Image>` for SVGs and small PNGs
- **Mobile-first**: `md:` breakpoint prefix for desktop-up styles
