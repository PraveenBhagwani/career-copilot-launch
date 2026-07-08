# Career Copilot AI — Landing Page Plan

A single-route marketing + conversion page with a stateful hero card that walks through: JD/Resume upload → phone → OTP → skeleton loading → mock score result.

## Design System

Update `src/styles.css` tokens to the requested palette:
- Background: crisp white
- Foreground / text: slate gray (deep + muted variants)
- Primary (trust blue): a confident blue (`oklch` around 0.55 / 0.19 / 255)
- Success / accent (neon green): high-chroma green for metrics + progress
- Keep radii soft, add subtle elevated shadow token for the core card

Load a distinctive type pair via `<link>` in `__root.tsx` head (e.g. Space Grotesk display + Inter body) and register `--font-display` / `--font-sans` in `@theme`. Update root `head()` with real title/description/OG for "Career Copilot AI — Beat the ATS".

## Page Structure (`src/routes/index.tsx`)

1. **Sticky top nav** — wordmark left, anchor links (Product, How it works, Pricing), CTA button right.
2. **Hero** — two-column on desktop:
   - Left: eyebrow badge ("AI Resume Optimizer"), H1 "Stop Getting Ghosted by ATS Systems.", subtext as specified, small trust row (logos / "10,000+ resumes optimized").
   - Right: the **Core Action Card** (stateful, see below).
3. **How it works** — 3 steps (Paste JD → Upload Resume → Get 95% match).
4. **Social proof** — testimonial cards + neon-green success metrics ("3.4x more interviews", "95% ATS match avg").
5. **Feature grid** — ATS keyword matching, AI rewrite, interview probability, one-click apply-ready export.
6. **FAQ** + **Footer**.

## Core Action Card — State Machine

Component: `src/components/CoreActionCard.tsx`. Local state `step: 'input' | 'phone' | 'otp' | 'loading' | 'result'`.

- **input**: Textarea "Paste Job Description" + drag-and-drop dropzone (native `onDragOver/onDrop`, hidden `<input type="file" accept=".pdf,.docx">`, shows filename chip once selected). Primary button "Calculate My Score" (disabled until both filled).
- **phone**: Replaces card contents. Country code prefix + phone input. "Send verification code" button.
- **otp**: 4 separate digit inputs with auto-advance + paste support. Consent microcopy directly below: *"By verifying this OTP, you agree to our Terms of Service & Privacy Policy."* (links styled as underlined muted text). "Verify & Analyze" button.
- **loading**: Skeleton layout of the eventual result (score ring placeholder, keyword bars, resume preview lines) with a cycling status line that rotates every ~1.2s: "Parsing Resume..." → "Checking Keywords..." → "Calculating Interview Probability..." via `setInterval` in `useEffect`. Animated shimmer via Tailwind.
- **result**: Mock output — big neon-green **92% Interview Probability** ring, matched/missing keyword chips, "Rewrite my resume" CTA. (Kept simple; primary deliverable is the flow.)

All transitions use a subtle fade/slide (framer-motion `AnimatePresence`).

## Referral Tracking

In the index route component, a `useEffect` on mount reads `new URLSearchParams(window.location.search).get('ref')` and, if present, writes it to `localStorage` under key `cc_referral` (only if not already set, to preserve first-touch). No UI. Guarded by `typeof window !== 'undefined'` inside the effect (safe post-hydration).

## Technical Notes

- All new UI is presentational — no backend, no Lovable Cloud. Phone/OTP/score are mocked in component state.
- Add `framer-motion` via `bun add framer-motion` for card transitions + subtle hero animation.
- Use existing shadcn `Button`, `Input`, `Textarea`, `Card` primitives; add `InputOTP` if not present.
- Semantic tokens only — no hardcoded hex in components.
- Update `__root.tsx` `head()` with real SEO metadata.
- Replace the placeholder in `src/routes/index.tsx` entirely.

## Files Touched

- `src/styles.css` — palette, fonts, shadow tokens
- `src/routes/__root.tsx` — head metadata, font `<link>`
- `src/routes/index.tsx` — full landing page + referral effect
- `src/components/CoreActionCard.tsx` — stateful card
- `src/components/landing/*` — Nav, Hero, HowItWorks, SocialProof, Features, FAQ, Footer (small focused files)
