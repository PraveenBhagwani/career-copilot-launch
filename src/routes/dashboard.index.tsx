import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { credits, plan } = useDashboard();

  const guide = [
    "1 Credit = 1 Resume Rewrite",
    "1 Credit = 1 Cover Letter",
    "1 Credit = 3 Custom Job Matches",
    "10 Credits = 1 Live Mock Interview",
    "10 Credits = 1 Salary Negotiation Session",
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-success/10 p-6 md:p-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
          Let's land your next interview.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          You're on the <span className="font-semibold text-foreground">{plan}</span> plan with{" "}
          <span className="font-semibold text-foreground">{credits}</span> AI credits.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <QuickActions />

        <Card className="border-white/20 bg-white/40 backdrop-blur-xl dark:bg-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Credit Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {guide.map((g) => (
                <li key={g} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-foreground/90">{g}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
