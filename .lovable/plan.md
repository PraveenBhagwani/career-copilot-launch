## 1. Hybrid Hero — right column

Replace the current right column (just `<CoreActionCard />`) with a new `HeroVisual` component containing:

- **Static SVG constellation mesh** behind everything (absolute, `-z-10`, `opacity-40`): ~14 nodes connected by thin lines, faint `stroke-primary/20`. Pure SVG, no animation.
- **Video placeholder**: `<video autoPlay loop muted playsInline poster>` sourced from `/hero.webm` (file won't exist yet; poster + a gradient fallback bg so nothing looks broken). Rounded 3xl, aspect-video, subtle border.
- **Two floating document cards** overlaid via `absolute` + `framer-motion`:
  - "Resume" card (top-left of video): white glass card, small mock lines, `animate={{ y: [0, -12, 0] }}` with `duration: 4`, infinite.
  - "JD" card (bottom-right of video): same idea, `duration: 5`, `delay: 0.6` — out of sync.
- **Glassmorphic probability pill** below video: `backdrop-blur-xl bg-white/10 border`, text "Interview Probability: 65% → 95%". Inside, a track with a motion `<motion.div>` whose `width` animates from `0%` to `100%` over 1.5s on mount (`initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeOut" }}`), green gradient fill.

`CoreActionCard` moves — the hero grid becomes a single column on mobile and `lg:grid-cols-[1fr_1fr]` with card on left, visual on right. Since the card is the primary CTA, keep card on the left side of the grid on desktop and put `HeroVisual` on the right. Copy/headline block moves above (stacks) — actually to preserve current layout: keep headline/copy in left column, and swap `CoreActionCard` for `HeroVisual` in right column. `CoreActionCard` then renders below the two-column grid, centered (max-w-2xl), so nothing else breaks.

Alternative kept simple: replace the right-column card with `HeroVisual` and render `CoreActionCard` in a new full-width centered section right below the hero grid (before `LogoRow`).

## 2. Upload Box fix (`src/components/CoreActionCard.tsx`)

- Delete the always-running ATS scanline `motion.div` that renders while `file` is set.
- On file drop/select: keep the current "File Selected" summary block (filename + size). Change subtext from "Scanning…" to "Ready to analyze".
- "Calculate My Score" button: remove the `disabled={!canSubmitInput}` opacity dimming when a file is present but JD is short — keep JD requirement but when both present it's fully opaque and clickable (already the case; just ensure no residual opacity classes). Ensure no `Scanning` label appears before click.
- Add the scanline animation only during the `loading` step (already covered by existing loader UI), so no change needed there.

## 3. Trust badges + logo row

- **Hero badges row** (`src/routes/index.tsx` line ~134): replace the duplicate/second "Results in 10 seconds" — currently the three badges are "No credit card", "Results in 10 seconds", "ATS-safe formatting". Replace the middle one with **"40-Point ATS Audit"** (green `CheckCircle2` already used).
- **LogoRow**: change heading text to `"Engineered to parse flawlessly in the ATS platforms used by:"`. Replace logo array with `["Workday", "Greenhouse", "iCIMS", "Lever", "BambooHR"]`, rendered as styled text tokens (same treatment as now — no external logo assets).

## Technical notes

- All new motion uses existing `framer-motion` (already installed).
- No routing changes, no state store changes. `CoreActionCard` state machine untouched except scanline removal + copy tweak.
- SVG mesh + video placeholder live inside a new component `HeroVisual` colocated in `src/routes/index.tsx` (or `src/components/HeroVisual.tsx` if it grows). Video `src` points to `/hero.webm` in `public/`; if missing, the poster/gradient fallback keeps layout intact — no build break.
