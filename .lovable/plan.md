## Replace Features section with 5-Agent Bento Grid

Swap the current 4-card `Features` section in `src/routes/index.tsx` for an asymmetrical bento grid of 5 agent cards. No routing, state, or other section changes.

### Layout

Section title: **"Meet the 5-Agent Protocol: Your Autonomous Career Engine."** (existing display font, same section container as current Features).

CSS grid, `lg:grid-cols-6`:
- Row 1 (3 cards): each `lg:col-span-2` → Decoder, Architect, Job Radar
- Row 2 (2 cards): Challenger `lg:col-span-3`, Diplomat `lg:col-span-3`
- Mobile: single column stack

All cards use current tokens: `rounded-2xl border border-border bg-card p-6` + subtle hover lift, so it matches the rest of the site.

### Card anatomy

Each card contains:
1. **Animated avatar** (pure CSS, ~96px):
   - Central dark orb: `rounded-full bg-foreground/90` with a colored inner core specific to the agent (blue/blocks/green-sweep/audio-wave/purple).
   - Two concentric dashed rings (`border border-dashed`), positioned absolute, spinning in opposite directions via Tailwind `animate-spin` + a custom `animate-spin-reverse` utility with slower durations (e.g. `[animation-duration:14s]` and `[animation-duration:22s]`).
2. **Agent number + name** (e.g. `Agent 01 · Decoder`) — display font, tracked.
3. **Subtext** (1–2 lines) explaining role.
4. **Footer** small monospace label (`font-mono text-[11px] uppercase tracking-wider text-muted-foreground border-t border-border/60 pt-3 mt-4`).

### Agent-specific cores + copy

| # | Name | Core visual | Subtext | Footer |
|---|------|-------------|---------|--------|
| 01 | Decoder | Blue glowing dot pulsing in orb center | Parses the JD into structured skill, seniority, and keyword signals recruiters actually filter on. | `LIVE CORE: ATS KEYWORD PARSER` |
| 02 | Architect | 2×2 grid of small squares assembling (staggered pulse) | Rewrites your resume bullet-by-bullet to hit the exact phrasing of the target role. | `CREDIT ACTION: 1 CREDIT / REWRITE` |
| 03 | Job Radar | Green radar sweep line (rotating conic-gradient wedge) | Continuously scans openings that match your rewritten resume and pushes the best fits to you. | `DELIVERY: AUTOMATED WHATSAPP PUSH` |
| 04 | Challenger | 4 vertical bars animating heights (audio-wave keyframes) | Runs mock interviews tuned to the JD and grades your answers in real time. | `CREDIT ACTION: 10 CREDITS / SESSION` |
| 05 | Diplomat | Purple orb with slow breathing scale + glow | Coaches your salary negotiation with data-backed counter-offers and scripts. | `CAPABILITY: SALARY NEGOTIATION` |

### Technical notes

- New keyframes added to `src/styles.css`: `spin-reverse`, `audio-wave` (4 bars with staggered `animation-delay`), `radar-sweep` (rotate conic gradient), `breathe` (scale 1 → 1.08). All pure CSS, no framer-motion required.
- Reuse existing color tokens; add `--agent-blue`, `--agent-green`, `--agent-purple` via `oklch()` if not already present, otherwise use `primary` / `success` / a purple oklch inline in the component only if a token is unavailable (prefer adding tokens).
- Monospace footer uses `font-mono` (already available via Tailwind default stack).
- Keep the section `id="features"` so the nav anchor still works.
- No changes to other sections, routes, or state.

### Files touched

- `src/routes/index.tsx` — replace the `Features` component body.
- `src/styles.css` — add keyframes + agent color tokens + `.animate-spin-reverse` utility.
