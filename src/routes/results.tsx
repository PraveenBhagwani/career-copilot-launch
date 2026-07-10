import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  Smartphone,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingInterceptModal } from "@/components/PricingInterceptModal";
import { useDashboard, type Plan } from "@/lib/dashboard-store";


export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your ATS Scan Results — Career Copilot AI" },
      {
        name: "description",
        content:
          "See your ATS match score, Interview Probability, missing keywords, and unlock the AI-rewritten resume.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

const MISSING_KEYWORDS = [
  "SLA Adherence",
  "Webinar Operations",
  "Stakeholder Reporting",
  "Cross-functional Leadership",
  "Escalation Management",
  "OKR Planning",
];

const MATCHED_KEYWORDS = [
  "React",
  "TypeScript",
  "Product Analytics",
  "SaaS",
  "B2B",
  "Roadmapping",
];

function ScoreDial({
  score,
  unlocked,
  label,
  colorHint,
}: {
  score: number;
  unlocked: boolean;
  label: string;
  colorHint: "score" | "probability";
}) {
  const size = 200;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);

  const color = unlocked
    ? "var(--color-success)"
    : score < 50
      ? "var(--color-destructive)"
      : colorHint === "probability"
        ? "oklch(0.65 0.19 45)"
        : "oklch(0.78 0.17 75)";

  // Count-up animation for the number
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1200, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    mv.set(score);
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [score, mv, rounded]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--color-secondary)"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-5xl font-bold tracking-tight" style={{ color }}>
            {display}
            <span className="text-xl text-muted-foreground">/100</span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function ResultsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [paying, setPaying] = useState(false);
  const paywallRef = useRef<HTMLDivElement>(null);
  const ats = unlocked ? 95 : 65;
  const probability = unlocked ? 92 : 47;

  const scrollToPaywall = () => {
    paywallRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePay = (label: string) => {
    if (paying || unlocked) return;
    setPaying(true);
    toast.loading("Opening UPI app…", { id: "pay" });
    setTimeout(() => {
      toast.success(`Payment successful — ${label}`, {
        id: "pay",
        description: "Instant AI delivery. Your premium resume is unlocked.",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      setUnlocked(true);
      setPaying(false);
    }, 1400);
  };

  const statusLabel = unlocked ? "Optimized" : "Needs Work";
  const statusTone = unlocked
    ? "bg-success/20 text-foreground"
    : "bg-[oklch(0.78_0.17_75/0.18)] text-[oklch(0.45_0.15_75)]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background"
    >
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="font-display text-sm font-semibold tracking-tight">Career Copilot AI</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Scan complete
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Your ATS Scan Results
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Here's how your resume stacks up against the job description you provided.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusTone}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Two dials side-by-side */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-[var(--shadow-card)] lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <ScoreDial score={ats} unlocked={unlocked} label="ATS Score" colorHint="score" />
              <ScoreDial
                score={probability}
                unlocked={unlocked}
                label="Interview Probability"
                colorHint="probability"
              />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {unlocked
                ? "Excellent. Your resume now hits the top 5% of applicants for this role."
                : "You're missing critical keywords the ATS scans for. Recruiters may never see this application."}
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8 lg:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  Missing Keywords
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  These terms appear in the job description but not in your resume.
                </p>
              </div>
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                {unlocked ? 0 : MISSING_KEYWORDS.length} gaps
              </span>
            </div>

            <ul className="space-y-2.5">
              {MISSING_KEYWORDS.map((k) => (
                <li
                  key={k}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition ${
                    unlocked
                      ? "border-success/30 bg-success/10 text-foreground"
                      : "border-destructive/20 bg-destructive/5 text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    {unlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    {k}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {unlocked ? "Added" : "Missing"}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-border/60 pt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Matched Keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {MATCHED_KEYWORDS.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    ✓ {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Paywall */}
        <section
          ref={paywallRef}
          className="relative mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-elevated)]"
        >
          <div className="border-b border-border/60 bg-gradient-to-r from-secondary/60 to-transparent px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  Critical Fixes &amp; AI Rewrite
                </h2>
                <p className="text-sm text-muted-foreground">
                  The exact edits to push your score from 65 → 95.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className={`space-y-4 p-6 transition duration-500 sm:p-8 ${
                unlocked ? "" : "pointer-events-none select-none blur-md"
              }`}
              aria-hidden={!unlocked}
            >
              {[
                {
                  h: "Rewrite line 12 — Experience section",
                  b: 'Replace "Managed client escalations" with "Owned SLA Adherence across 40+ enterprise accounts, cutting P1 escalations 34%."',
                },
                {
                  h: "Add a Webinar Operations bullet under 2023 role",
                  b: '"Ran end-to-end Webinar Operations for 12 product launches, driving 3.2k qualified pipeline."',
                },
                {
                  h: "Reframe Summary — first 2 lines",
                  b: "Lead with quantified stakeholder reporting and cross-functional leadership so the ATS parser catches you in the first 200 characters.",
                },
                {
                  h: "3 recruiter-matched roles waiting for you",
                  b: "Senior PM · Sprig · ₹42–58L · 92% match. Product Lead · Rippling · ₹55–70L · 89% match. Group PM · Chargebee · ₹65–85L · 87% match.",
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-success/25 text-[11px] font-bold text-foreground">
                      {i + 1}
                    </div>
                    <div className="font-display text-sm font-semibold tracking-tight">
                      {item.h}
                    </div>
                  </div>
                  <p className="pl-8 text-sm leading-relaxed text-muted-foreground">{item.b}</p>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {!unlocked && (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden p-6"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/85" />

                  {/* Shimmer sweep */}
                  <motion.div
                    aria-hidden
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
                  />

                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.45_0.2_265)] shadow-[var(--shadow-elevated)]"
                  >
                    <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/40 blur-xl" />
                    <Lock className="relative h-8 w-8 text-primary-foreground" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-primary/30 bg-card p-1"
                  >
                    <div className="absolute -inset-1 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-primary/40 via-success/40 to-primary/40 blur-xl" />
                    <div className="rounded-xl bg-card p-5 sm:p-6">
                      <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
                        <Sparkles className="h-3 w-3" /> Limited · One-time offer
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                        Unlock 95/100 Resume &amp; 3 Job Matches
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-primary">₹29</span>
                        <span className="text-sm text-muted-foreground line-through">₹149</span>
                        <span className="text-xs font-semibold text-success-foreground">One-time</span>
                      </div>
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Button
                          size="lg"
                          disabled={paying}
                          onClick={() => handlePay("₹29 unlock")}
                          className="h-12 flex-1 rounded-xl bg-primary text-base font-semibold shadow-[var(--shadow-card)] hover:bg-primary/90"
                        >
                          <Smartphone className="mr-2 h-4 w-4" /> Pay ₹29 with UPI
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          disabled={paying}
                          className="h-12 flex-1 rounded-xl border-border/80 bg-background text-sm font-semibold sm:flex-none sm:px-5"
                        >
                          <Link to="/pricing">Or 30-Day Pro Pass · ₹299</Link>
                        </Button>
                      </div>
                      <p className="mt-3 text-center text-[11px] font-medium text-muted-foreground">
                        Secure UPI · Instant AI Delivery — Non-Refundable
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Export your optimized resume
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {unlocked
                  ? "Ready to download in ATS-friendly formats."
                  : "Available after unlock. Formatted to pass Workday, Greenhouse, and Lever parsers."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={!unlocked}
                onClick={() => toast.success("Resume.pdf downloaded")}
                className="h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button
                variant="outline"
                disabled={!unlocked}
                onClick={() => toast.success("Resume.docx downloaded")}
                className="h-11 rounded-xl border-border/80"
              >
                <FileText className="mr-2 h-4 w-4" /> Download DOCX
              </Button>
            </div>
          </div>
        </section>

        {unlocked && (
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/dashboard">Go to Dashboard →</Link>
            </Button>
          </div>
        )}
      </main>

      {/* Sticky pulsing CTA */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div
            key="sticky-cta"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
          >
            <motion.button
              onClick={scrollToPaywall}
              animate={{
                boxShadow: [
                  "0 0 0 0 oklch(0.55 0.22 265 / 0.55)",
                  "0 0 0 14px oklch(0.55 0.22 265 / 0)",
                ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              Fix My Resume — ₹29
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
