import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMidnightCountdown } from "@/hooks/use-midnight-countdown";
import { useDashboard, type Plan } from "@/lib/dashboard-store";

type TierKey = "Starter" | "Pro" | "Max";

type Tier = {
  key: TierKey;
  price: number;
  originalPrice: number;
  cadence: string;
  subtitle: string;
  icon: typeof Zap;
  planOnPurchase: Plan;
  bonusCredits: number;
  topBadge?: { label: string; tone: "green" | "yellow" };
  features: Array<{ text: string; highlight?: boolean }>;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    key: "Starter",
    price: 29,
    originalPrice: 299,
    cadence: "one-time",
    subtitle: "Perfect for your immediate application.",
    icon: Zap,
    planOnPurchase: "Starter",
    bonusCredits: 3,
    topBadge: { label: "VALID TODAY — 90% OFF", tone: "green" },
    features: [
      { text: "✓ 3 AI Credits" },
      { text: "✓ 1 full AI resume rewrite" },
      { text: "✓ ATS score & missing keywords" },
      { text: "✓ PDF & DOCX export" },
      { text: "🎁 BONUS: 3 Custom Job Matches", highlight: true },
    ],
  },
  {
    key: "Pro",
    price: 299,
    originalPrice: 999,
    cadence: "/ 30 days",
    subtitle: "For active seekers scaling their applications.",
    icon: Sparkles,
    planOnPurchase: "Pro",
    bonusCredits: 50,
    features: [
      { text: "✓ 50 Credits (Up to 50 Resume Rewrites)" },
      { text: "✓ Weekly Job Recommendations" },
      { text: "✓ AI Cover Letter Generator" },
      { text: "✓ Credit store access" },
    ],
  },
  {
    key: "Max",
    price: 499,
    originalPrice: 1499,
    cadence: "/ 30 days",
    subtitle: "For top candidates securing high-paying offers.",
    icon: Crown,
    planOnPurchase: "Max",
    bonusCredits: 100,
    popular: true,
    features: [
      { text: "✓ 100 Credits (Up to 100 Rewrites OR up to 10 AI-powered Mock Interviews)" },
      { text: "✓ Alternate-day Job Recommendations" },
      { text: "✓ Live Interview Practice" },
      { text: "✓ Salary Negotiation Tactics & Scripts" },
    ],
  },
];

export function UpgradeModal() {
  const { upgradeOpen, closeUpgrade, plan, setPlan, addCredits } = useDashboard();
  const countdown = useMidnightCountdown();

  const visibleTiers = TIERS.filter((t) => {
    if (plan === "Free") return true;
    if (plan === "Starter") return t.key !== "Starter";
    if (plan === "Pro") return t.key === "Max";
    return false;
  });

  const purchase = (t: Tier) => {
    setPlan(t.planOnPurchase);
    if (t.bonusCredits) addCredits(t.bonusCredits);
    toast.success(`${t.key} activated`, {
      description: `${t.bonusCredits} credits added · Instant AI delivery.`,
    });
    closeUpgrade();
  };

  const gridCols =
    visibleTiers.length === 3
      ? "lg:grid-cols-3"
      : visibleTiers.length === 2
      ? "lg:grid-cols-2 lg:max-w-3xl lg:mx-auto"
      : "lg:grid-cols-1 lg:max-w-md lg:mx-auto";

  return (
    <AnimatePresence>
      {upgradeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xl"
          onClick={closeUpgrade}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-card/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={closeUpgrade}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-border/60 bg-gradient-to-b from-secondary/60 to-transparent px-6 py-8 text-center sm:px-10">
              <p className="font-mono text-sm font-bold tracking-wide text-red-500">
                Special Pricing ends in {countdown.formatted}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {plan === "Max" ? "You're on top." : "Upgrade your plan"}
              </h2>
              {plan !== "Max" && (
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                  One-time fixes this resume. A plan fixes every resume you'll ever send.
                </p>
              )}
            </div>

            {plan === "Max" ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Crown className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  You are on the highest tier. Enjoy Hivemind AI.
                </h3>
              </div>
            ) : (
              <div className={`grid gap-4 p-6 sm:p-8 ${gridCols}`}>
                {visibleTiers.map((t) => {
                  const isMax = t.popular;
                  return (
                    <div
                      key={t.key}
                      className={`relative flex flex-col rounded-2xl border p-6 ${
                        isMax
                          ? "border-white/10 bg-[oklch(0.18_0.02_260)] text-white lg:scale-[1.03] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                          : "border-border/70 bg-background"
                      }`}
                    >
                      {isMax && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
                          ★ Most Popular
                        </span>
                      )}
                      {t.topBadge && (
                        <span
                          className={`absolute -top-3 right-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                            t.topBadge.tone === "green"
                              ? "bg-emerald-500 text-white"
                              : "bg-yellow-400 text-black"
                          }`}
                        >
                          {t.topBadge.label}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isMax ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <t.icon className="h-4 w-4" />
                        </div>
                        <div className="font-display text-lg font-semibold">{t.key}</div>
                      </div>
                      <div
                        className={`mt-4 font-display text-sm line-through ${
                          isMax ? "text-white/40" : "text-muted-foreground"
                        }`}
                      >
                        ₹{t.originalPrice}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-bold tracking-tight">
                          ₹{t.price}
                        </span>
                        <span
                          className={`text-xs ${isMax ? "text-white/60" : "text-muted-foreground"}`}
                        >
                          {t.cadence}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          isMax ? "text-white/60" : "text-muted-foreground"
                        }`}
                      >
                        {t.subtitle}
                      </p>
                      <ul
                        className={`mt-4 space-y-2 border-t pt-4 text-sm ${
                          isMax ? "border-white/10" : "border-border/60"
                        }`}
                      >
                        {t.features.map((f) => (
                          <li key={f.text} className="flex items-start gap-2">
                            {f.text.startsWith("🎁") ? (
                              <span
                                className={`font-semibold ${
                                  isMax ? "text-emerald-300" : "text-emerald-600"
                                }`}
                              >
                                {f.text}
                              </span>
                            ) : (
                              <>
                                <Check
                                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                                    isMax ? "text-emerald-400" : "text-success-foreground"
                                  }`}
                                />
                                <span className={f.highlight ? "font-semibold" : ""}>
                                  {f.text.replace(/^✓\s*/, "")}
                                </span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => purchase(t)}
                        size="lg"
                        className={`mt-5 h-11 w-full rounded-xl text-sm font-semibold ${
                          isMax
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-foreground text-background hover:bg-foreground/90"
                        }`}
                      >
                        Choose {t.key} — ₹{t.price}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
