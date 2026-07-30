# Marketplace, Navbar, Card Spacing Fixes

## 1. Marketplace — niches + separator removal

### `campaign-marketplace.tsx`
- **Props**: Add `niches: string[]` to `CampaignMarketplaceProps`
- **Destructure**: Add `niches` to function params
- **Categories**: Replace hardcoded array with `["All", ...niches]`
- **Separator**: Remove `border-b border-stone-200 pb-5` from filter bar wrapper (line 36), keep `mb-8`

## 2. Banner as floating toast

### `campaign-marketplace.tsx`
Move the slot limit banner from inside `filtered.length > 0` branch to render unconditionally (when `isAtLimit && showLimitBanner`), positioned as a fixed toast like brand's DraftAlertBanner:

```tsx
{isAtLimit && showLimitBanner && (
  <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-50">
    <div className="flex items-center justify-between bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-2 relative overflow-hidden w-full md:w-fit">
      <div className="flex gap-4 items-center">
        <Image src={slotLimitImg} alt="" width={44} height={44} className="w-11 h-11 shrink-0" unoptimized />
        <div>
          <h4 className="font-rethink text-xs font-medium text-stone-900 leading-snug">
            You&apos;re at your active slot limit ({meta.activeSlots}/{meta.maxSlots}). Complete or deliver a slot to claim something new.
          </h4>
        </div>
      </div>
      <button onClick={() => setShowLimitBanner(false)} className="text-stone-400 p-1 absolute top-2 right-2">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
```

Place this right before the closing `</div>` of the main wrapper (before line 171).

## 3. Navbar tab container

### `creator-header.tsx` line 53
- `bg-stone-100` → `bg-stone-50`

## 4. Home card title spacing

### `campaign-card.tsx` line 90
- `mb-2` → `mb-4`

## 5. Pass niches from parent

### `page.tsx` line 557-562
- Add `niches={profile.niches}` to `<CampaignMarketplace>`
