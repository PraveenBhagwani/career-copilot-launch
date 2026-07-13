import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDashboard, type Plan } from "@/lib/dashboard-store";
import { useMidnightCountdown } from "@/hooks/use-midnight-countdown";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Career Copilot AI" },
      {
        name: "description",
        content:
          "Simple pricing. Starter unlock at ₹29, Pro at ₹299/mo, or go Max for ₹499 with unlimited AI rewrites and priority coaching.",
      },
      { property: "og:title", content: "Pricing — Career Copilot AI" },
      {
        property: "og:description",
        content: "Choose Starter, Pro, or Max. Instant AI delivery.",
      },
    ],
  }),
  component: PricingPage,
});

type Tier = {
  key: "Starter" | "Pro" | "Max";
  price: number;
  originalPrice: number;
  badge?: string;
  cadence: string;
  tagline: string;
  planOnPurchase: Plan;
  bonusCredits: number;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: typeof Zap;
};

const TIERS: Tier[] = [
  {
    key: "Starter",
    price: 29,
    originalPrice: 299,
    badge: "Valid Today Only — 90% OFF",
    cadence: "one-time",
    tagline: "Unlock a single 95% resume rewrite.",
    planOnPurchase: "Free",
    bonusCredits: 5,
    icon: Zap,
    cta: "Get Starter — ₹29",
    features: [
      "1 full AI resume rewrite",
      "ATS score + missing keywords",
      "PDF & DOCX export",
      "Instant AI delivery",
    ],
  },
  {
    key: "Pro",
    price: 299,
    cadence: "/ 30 days",
    tagline: "Everything in Starter, plus the credit store & job matches.",
    planOnPurchase: "Pro",
    bonusCredits: 50,
    icon: Sparkles,
    cta: "Upgrade to Pro — ₹299",
    features: [
      "50 AI credits included",
      "Unlock wallet top-ups (20 / 50 / 100)",
      "Curated job matches with 1-click apply",
      "AI mock interview coach (10 credits/session)",
    ],
  },
  {
    key: "Max",
    price: 499,
    cadence: "/ 30 days",
    tagline: "For serious job seekers running weekly applications.",
    planOnPurchase: "Max",
    bonusCredits: 120,
    icon: Crown,
    popular: true,
    cta: "Go Max — ₹499",
    features: [
      "120 AI credits + 25% top-up bonus",
      "Priority AI coach with voice mode",
      "Unlimited resume rewrites",
      "Recruiter shortlist boost",
      "Concierge referral rewards",
    ],
  },
];

function PricingPage() {
  const { plan, setPlan, addCredits } = useDashboard();
  const navigate = useNavigate();

  const purchase = (t: Tier) => {
    setPlan(t.planOnPurchase);
    if (t.bonusCredits) addCredits(t.bonusCredits);
    toast.success(`${t.key} activated`, {
      description: `${t.bonusCredits} credits added · Instant AI delivery.`,
    });
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background">
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

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Simple pricing
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Pick the plan that lands the interview.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Instant AI delivery. Cancel Pro or Max anytime.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {TIERS.map((t) => {
            const isCurrent = plan === t.planOnPurchase && t.planOnPurchase !== "Free";
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: t.key === "Starter" ? 0 : t.key === "Pro" ? 0.08 : 0.16 }}
                className={`relative flex flex-col rounded-3xl border bg-card p-8 shadow-[var(--shadow-card)] transition ${
                  t.popular
                    ? "border-primary/40 lg:scale-[1.04] lg:shadow-[var(--shadow-elevated)]"
                    : "border-border/70"
                }`}
              >
                {t.popular && (
                  <>
                    <div className="pointer-events-none absolute -inset-px -z-10 animate-pulse rounded-3xl bg-gradient-to-br from-primary/40 via-success/30 to-primary/40 blur-xl" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.2_265)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                      ★ Most Popular · Best Value
                    </span>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      t.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-xl font-semibold">{t.key}</div>
                </div>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-bold tracking-tight">₹{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.cadence}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>

                <ul className="mt-6 space-y-3 border-t border-border/60 pt-6 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-foreground" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    size="lg"
                    disabled={isCurrent}
                    onClick={() => purchase(t)}
                    className={`h-12 w-full rounded-xl text-base font-semibold ${
                      t.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {isCurrent ? "Current plan" : t.cta}
                  </Button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Instant AI Delivery
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.main>
    </div>
  );
}
