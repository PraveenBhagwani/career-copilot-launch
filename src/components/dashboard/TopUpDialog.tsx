import { Link } from "@tanstack/react-router";
import { Lock, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "@/lib/dashboard-store";

const PACKS = [
  { price: 149, credits: 20 },
  { price: 299, credits: 50, popular: true },
  { price: 499, credits: 100 },
];

export function TopUpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { plan, addCredits } = useDashboard();

  const buy = (credits: number, price: number) => {
    addCredits(credits);
    toast.success(`Payment received — ${credits} credits added.`, {
      description: `₹${price} · UPI mock payment · Instant AI delivery.`,
    });
    onOpenChange(false);
  };

  const locked = plan === "Free";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {locked ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <DialogTitle className="text-center">Top-ups are Pro/Max only</DialogTitle>
              <DialogDescription className="text-center">
                🔒 Standalone top-ups are reserved for Pro/Max members. Upgrade to Pro (₹299) to
                unlock the credit store.
              </DialogDescription>
            </DialogHeader>
            <Button asChild className="w-full gap-2" size="lg" onClick={() => onOpenChange(false)}>
              <Link to="/pricing">
                <Sparkles className="h-4 w-4" /> See plans — Starter / Pro / Max
              </Link>
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Buy AI Credits</DialogTitle>
              <DialogDescription>
                Pay instantly via UPI. Credits never expire. Instant AI delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {PACKS.map((p) => (
                <button
                  key={p.price}
                  onClick={() => buy(p.credits, p.price)}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{p.credits} Credits</div>
                      <div className="text-xs text-muted-foreground">
                        ₹{(p.price / p.credits).toFixed(2)} per credit
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.popular && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success-foreground">
                        Popular
                      </span>
                    )}
                    <span className="text-lg font-bold">₹{p.price}</span>
                  </div>
                </button>
              ))}
            </div>
            {plan === "Pro" && (
              <Button asChild variant="outline" size="sm" className="mt-1">
                <Link to="/pricing" onClick={() => onOpenChange(false)}>
                  Compare Pro vs Max →
                </Link>
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
