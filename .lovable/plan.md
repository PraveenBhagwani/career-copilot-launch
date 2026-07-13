# Pricing FOMO + Navigator Chatbot Upgrade

## 1. Price Anchoring & Countdown Timer

**File: `src/routes/pricing.tsx`**
- Extend the `TIERS` config with `originalPrice` and `badge`:
  - Starter: `originalPrice: 299`, `badge: "Valid Today Only — 90% OFF"`
  - Pro: `originalPrice: 999`, no special badge (just strikethrough)
  - Max: `originalPrice: 1499`, `badge: "Save ₹1,000"` (in addition to existing "Most Popular")
- In the price block, render `<span className="line-through text-muted-foreground text-lg">₹{originalPrice}</span>` above the current ₹price.
- Render the discount badge as a small pill near the tier header (distinct from the existing "Most Popular" ribbon so both can coexist on Max).
- Mirror the same anchor prices + badges inside `src/components/PricingInterceptModal.tsx` so the intercept upsell stays consistent.

**New file: `src/hooks/use-midnight-countdown.ts`**
- Custom hook returning `{ hours, minutes, seconds }` counting down to local 23:59:59.
- Uses `setInterval(1s)`; SSR-safe (initialize with zeros, compute inside `useEffect`); cleans up on unmount.

**Usage on pricing page**
- Below the Starter ₹29 CTA button only, render:
  `<p className="font-mono text-xs text-muted-foreground">Offer ends in {hh}h {mm}m {ss}s</p>`

## 2. Chatbot → "Navigator"

**File: `src/components/MentorChatbot.tsx`**
- Rename displayed name from "Mentor"/"Coach" branding to **Navigator** (keep Max-tier "AI Interview Coach" persona label intact inside the chat header if present, but the floating widget brand is Navigator).
- Replace the floating widget's launcher icon with `Sparkles` from `lucide-react`, wrapped with `animate-pulse` for a breathing effect.
- Add a proactive bubble:
  - New state `showProactive: boolean`.
  - `useEffect` on mount: `setTimeout(() => setShowProactive(true), 5000)`; clear on unmount.
  - Bubble hides when: user opens the chat, or clicks a dismiss (×) on the bubble.
  - Only show once per session (guard via `sessionStorage` key `navigator_proactive_shown`).
- Bubble UI: positioned absolutely above the launcher, glassmorphic card, framer-motion fade+slide-in, arrow pointing down to the icon. Copy:
  `"👋 Hi! I'm Navigator. Need help understanding your ATS score or our plans? Ask me anything!"`
- Clicking the bubble opens the chat.

## Technical Notes
- No routing, state store, or backend changes.
- Countdown hook is client-only; guarded to avoid SSR hydration mismatch (initial render shows `00h 00m 00s`, updates on mount).
- Sparkles icon usage is only for the Navigator identity mark (intentional exception — user explicitly requested Lucide Sparkles).
