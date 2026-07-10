import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tier = {
  key: "Starter" | "Pro" | "Max";
  price: number;
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
    cadence: "one-time",
    tagline: "Unlock this one resume.",
    icon: Zap,
    bullets: ["1 full AI rewrite", "ATS score + gaps", "PDF & DOCX export"],
  },
  {
    key: "Pro",
    price: 299,
    cadence: "/ 30 days",
    tagline: "Unlimited rewrites + job matches.",
    icon: Sparkles,
    bullets: ["50 AI credits", "Credit store access", "Curated job matches"],
  },
  {
    key: "Max",
    price: 499,
    cadence: "/ 30 days",
    tagline: "Serious job seekers only.",
    icon: Crown,
    popular: true,
    bullets: ["120 credits + 25% bonus", "AI Interview Coach + voice", "Recruiter shortlist boost"],
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
            </div>

            <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
              {TIERS.map((t) => (
                <div
                  key={t.key}
                  className={`relative flex flex-col rounded-2xl border bg-background p-6 ${
                    t.popular ? "border-primary/40 lg:scale-[1.03]" : "border-border/70"
                  }`}
                >
                  {t.popular && (
                    <>
                      {/* Slow rotating conic gradient border */}
                      <div className="pointer-events-none absolute -inset-[2px] -z-10 overflow-hidden rounded-2xl">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-1/2"
                          style={{
                            background:
                              "conic-gradient(from 0deg, oklch(0.55 0.22 265), oklch(0.72 0.2 150), oklch(0.78 0.17 45), oklch(0.55 0.22 265))",
                          }}
                        />
                      </div>
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.22_265)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                        ★ Best Value
                      </span>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                      <t.icon className="h-4 w-4" />
                    </div>
                    <div className="font-display text-lg font-semibold">{t.key}</div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-bold tracking-tight">₹{t.price}</span>
                    <span className="text-xs text-muted-foreground">{t.cadence}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.tagline}</p>
                  <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-foreground" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onSelectTier(t.key)}
                    size="lg"
                    className={`mt-5 h-11 w-full rounded-xl text-sm font-semibold ${
                      t.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    Choose {t.key} — ₹{t.price}
                  </Button>
                </div>
              ))}
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
