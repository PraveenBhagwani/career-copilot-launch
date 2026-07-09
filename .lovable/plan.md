# User Dashboard

New route tree under `/dashboard` using shadcn `Sidebar` + Radix primitives. All state is client-side mock (no backend). Plan mode currently reads `Free`; toggle via a small dev switch in the header for demo.

## Routes

- `src/routes/dashboard.tsx` — layout: `SidebarProvider` + `AppSidebar` + top header + `<Outlet />`.
- `src/routes/dashboard.index.tsx` — Overview (redirects/renders summary).
- `src/routes/dashboard.jobs.tsx` — Job cards.
- `src/routes/dashboard.coach.tsx` — AI Coach chat.
- `src/routes/dashboard.refer.tsx` — Refer & Earn.

## Shared state

`src/lib/dashboard-store.ts` — tiny Zustand-free module using React context:
- `credits: number` (default 3)
- `plan: 'Free' | 'Pro'` (default Free, toggle in header for demo)
- `addCredits(n)`, `spendCredits(n)`, `setPlan(p)`
- `referralCode` — generated once on mount (e.g. `PRAV` + 3 digits from `crypto.getRandomValues`), persisted in `localStorage`.

Wrap `<Outlet />` in `DashboardProvider` inside `dashboard.tsx`.

## Components

`src/components/dashboard/`
- `AppSidebar.tsx` — shadcn `Sidebar` with items: Overview, Jobs, AI Coach, Refer & Earn. Uses `<Link>` + `useRouterState` for active state. Collapsible icon variant; `SidebarTrigger` in header.
- `WalletPill.tsx` — pill showing `Credits: N`. When `credits === 0`, renders "Top-Up" button that opens `TopUpDialog`; when > 0, still shows a smaller "Top-Up" ghost button.
- `TopUpDialog.tsx` — Radix `Dialog`. If `plan === 'Free'`: lock icon + copy `🔒 Top-ups are reserved for Pro/Max members. Upgrade to Pro (₹299)…` + "Upgrade to Pro" button (mock: sets plan to Pro + toast). If `plan === 'Pro'`: three package buttons `₹149 → 20`, `₹299 → 50`, `₹499 → 100`, each adds credits + success toast + closes.
- `DashboardHeader.tsx` — `SidebarTrigger`, page title (derived from route), plan badge + Free/Pro dev toggle, `WalletPill`.

## Page contents

**Overview** — greeting card, quick stats (ATS score 65→95 hook back to `/results`), CTA "Run a new scan" → `/`.

**Jobs** — 3 cards (grid, `Card` primitive). Mock data:
1. Operations Manager — Amazon — Bengaluru — 95% match — apply URL amazon.jobs.
2. Customer Success Lead — Razorpay — Remote — 92%.
3. Program Manager — Flipkart — Gurugram — 88%.
Each: company logo circle (initials), title, meta row, match chip (neon green), "Apply Now" button → `<a target="_blank" rel="noopener">`.

**Refer & Earn** — Headline "Give a 96% Resume, Get 10 AI Credits.", subtext, big code box with referral code + "Copy" button (uses `navigator.clipboard`, toast), LinkedIn-blue button "Share on LinkedIn" that opens `https://www.linkedin.com/sharing/share-offsite/?url=...&text=...` in new tab. Small stats row: "Friends joined: 0 · Credits earned: 0" (static mock).

**AI Coach** — `Chatbot.tsx`:
- Message list (user right, bot left, avatars, Radix `ScrollArea`).
- Initial bot message hard-coded (the JD/interview copy).
- Input + Send button. Input `disabled` until `consented === true`.
- Consent gate: while not consented, only accepts `Yes` (case-insensitive); anything else shows a tooltip / inline hint "Type Yes to continue." Once user sends "Yes":
  - `spendCredits(10)` (toast if insufficient — but proceeds in mock).
  - Bot replies "Great — paste the JD to begin." then a canned back-and-forth of ~4 mock exchanges triggered as user sends messages (round-robin from a scripted array).
- Uses `setTimeout` (600–900ms) for bot typing indicator (three-dot animation).

## Nav entry

Add "Dashboard" link in the landing page's top nav (`src/components/landing/Nav` or wherever it lives — check + patch) and a "Go to Dashboard" button on `/results` after mock payment success.

## Files touched / created

- New: `src/routes/dashboard.tsx`, `dashboard.index.tsx`, `dashboard.jobs.tsx`, `dashboard.coach.tsx`, `dashboard.refer.tsx`
- New: `src/lib/dashboard-store.tsx` (context + provider + hook)
- New: `src/components/dashboard/{AppSidebar,DashboardHeader,WalletPill,TopUpDialog,JobCard,Chatbot}.tsx`
- Patched: landing nav for a "Dashboard" link; `results.tsx` post-payment CTA
- shadcn primitives to add if missing: `sidebar`, `dialog`, `scroll-area`, `avatar`, `tooltip` (via `bunx shadcn@latest add …`)

No backend, no Cloud. All persistence is `localStorage` (referral code + plan).
