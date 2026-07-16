import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Lock, Mic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/coach")({
  component: Hivemind,
});

function Hivemind() {
  const { plan, credits, spendCredits, openUpgrade } = useDashboard();
  const isMax = plan === "Max";

  const unlock = (label: string) => {
    if (!isMax) {
      openUpgrade();
      return;
    }
    if (!spendCredits(10)) {
      toast.error("You need 10 credits", { description: "Top up from the wallet in the header." });
      return;
    }
    toast.success(`${label} deployed`, { description: "10 credits used · session starting." });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">Command the Hivemind AI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deploy your elite AI-powered agents to secure the offer and maximize compensation.
        </p>
        {!isMax && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Hivemind agents are exclusive to the Max plan.
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <AgentCard
          icon={<Mic className="h-5 w-5" />}
          emoji="🎙️"
          title="The Challenger"
          body="Face a FAANG-trained AI Hiring Manager. Real-time STAR method grading and voice practice."
          cta="Unlock Challenger"
          onClick={() => unlock("Challenger")}
          locked={!isMax}
        />
        <AgentCard
          icon={<Handshake className="h-5 w-5" />}
          emoji="🤝"
          title="The Diplomat"
          body="Generate data-backed counter-offer emails and learn psychological negotiation scripts to secure a 20-30% salary hike."
          cta="Unlock Diplomat"
          onClick={() => unlock("Diplomat")}
          locked={!isMax}
        />
      </div>

      {isMax && (
        <p className="text-center text-xs text-muted-foreground">
          You have {credits} credits · Each Hivemind session costs 10.
        </p>
      )}
    </div>
  );
}

function AgentCard({
  icon,
  emoji,
  title,
  body,
  cta,
  onClick,
  locked,
}: {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  locked: boolean;
}) {
  return (
    <Card className="relative flex flex-col overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-secondary/40 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="font-display text-xl font-semibold tracking-tight">
          <span className="mr-1">{emoji}</span>
          {title}
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs font-medium text-muted-foreground">Cost: 10 Credits</span>
        <Button onClick={onClick} className="rounded-xl">
          {locked && <Lock className="mr-1.5 h-3.5 w-3.5" />}
          {cta}
        </Button>
      </div>
    </Card>
  );
}
