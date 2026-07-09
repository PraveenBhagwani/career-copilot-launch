import { createFileRoute } from "@tanstack/react-router";
import { Copy, Gift, Linkedin, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/refer")({
  component: Refer,
});

function Refer() {
  const { referralCode } = useDashboard();
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${referralCode}`
      : `https://careercopilot.ai/?ref=${referralCode}`;
  

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Referral link copied");
    } catch {
      toast.error("Couldn't copy — try manually");
    }
  };

  const shareOnLinkedIn = () => {
    window.open(
      "https://www.linkedin.com/sharing/share-offsite/?url=careercopilot.ai",
      "_blank",
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-success/15 via-background to-primary/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success-foreground">
          <Gift className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance">
          Give a 96% Resume, Get 10 AI Credits.
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Share your code. Every friend who signs up gives you 10 credits — enough for a full AI
          rewrite or a mock interview.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your referral code
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center font-display text-3xl font-bold tracking-[0.3em] text-primary">
              {referralCode}
            </div>
            <Button variant="outline" onClick={copy} className="gap-1.5">
              <Copy className="h-4 w-4" /> Copy link
            </Button>
          </div>

          <Button
            onClick={shareOnLinkedIn}
            className="mt-4 w-full gap-2 text-white hover:opacity-90"
            style={{ backgroundColor: "#0A66C2" }}
            size="lg"
          >
            <Linkedin className="h-5 w-5" /> Share on LinkedIn
          </Button>

          <div className="mt-6 flex items-center justify-center gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Friends joined: <b className="text-foreground">0</b>
            </span>
            <span>·</span>
            <span>
              Credits earned: <b className="text-foreground">0</b>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
