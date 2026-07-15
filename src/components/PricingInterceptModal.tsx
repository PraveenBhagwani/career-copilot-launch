import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMidnightCountdown } from "@/hooks/use-midnight-countdown";

type Tier = {
  key: "Starter" | "Pro" | "Max";
  price: number;
  originalPrice: number;
  cadence: string;
  tagline: string;
  bullets: string[];
  icon: typeof Zap;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    key: "Starter",
    price: 29,
    originalPrice: 299,
    cadence: "one-time",
    tagline: "Unlock this one resume.",
    icon: Zap,
    bullets: [
      "1 full AI resume rewrite",
      "ATS score + missing keywords",
      "PDF & DOCX export",
    ],
  },
  {
    key: "Pro",
    price: 299,
    originalPrice: 999,
    cadence: "/ 30 days",
    tagline: "Unlimited rewrites + job matches.",
    icon: Sparkles,
    bullets: [
      "✓ Everything in Starter, PLUS:",
      "50 AI credits included",
      "Credit store access (20 / 50 / 100)",
      "Curated job matches with 1-click apply",
    ],
  },
  {
    key: "Max",
    price: 499,
    originalPrice: 1499,
    cadence: "/ 30 days",
    tagline: "Serious job seekers only.",
    icon: Crown,
    popular: true,
    bullets: [
      "✓ Everything in Pro, PLUS:",
      "100 Credits",
      "Alternate-day Job Radar",
      "Live Interview Practice",
      "Salary Negotiation scripts",
    ],
  },
];

export function PricingInterceptModal({
  open,
  onClose,
  onSelectTier,
  onContinueOneTime,
}: {
  open: boolean;
  onClose: () => void;
  onSelectTier: (tier: "Starter" | "Pro" | "Max") => void;
  onContinueOneTime: () => void;
}) {
  const countdown = useMidnightCountdown();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-card/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-border/60 bg-gradient-to-b from-secondary/60 to-transparent px-6 py-8 text-center sm:px-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Before you pay ₹29
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Wait — do you want the ultimate advantage?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                One-time fixes this resume. A plan fixes every resume you'll ever send.
              </p>
              <p className="mt-4 font-mono text-sm text-muted-foreground">
                Special Pricing ends in {countdown.formatted}
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
              {TIERS.map((t) => {
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
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isMax
                            ? "bg-white/10 text-white"
                            : "bg-primary/10 text-primary"
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
                        className={`text-xs ${
                          isMax ? "text-white/60" : "text-muted-foreground"
                        }`}
                      >
                        {t.cadence}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-xs ${
                        isMax ? "text-white/60" : "text-muted-foreground"
                      }`}
                    >
                      {t.tagline}
                    </p>
                    <ul
                      className={`mt-4 space-y-2 border-t pt-4 text-sm ${
                        isMax ? "border-white/10" : "border-border/60"
                      }`}
                    >
                      {t.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          {b.startsWith("✓") ? (
                            <span
                              className={`text-xs font-semibold ${
                                isMax ? "text-white/80" : "text-foreground"
                              }`}
                            >
                              {b}
                            </span>
                          ) : (
                            <>
                              <Check
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  isMax ? "text-emerald-400" : "text-success-foreground"
                                }`}
                              />
                              <span>{b}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => onSelectTier(t.key)}
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

            <div className="border-t border-border/60 bg-secondary/30 px-6 py-4 text-center sm:px-8">
              <button
                onClick={onContinueOneTime}
                className="text-sm font-medium text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
              >
                No thanks, continue with One-Time (₹29)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
