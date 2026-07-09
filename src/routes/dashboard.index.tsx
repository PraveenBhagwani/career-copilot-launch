import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Briefcase, MessageSquareText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { credits, plan, referralCode } = useDashboard();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-success/10 p-6 md:p-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
          Let's land your next interview.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          You're on the <span className="font-semibold text-foreground">{plan}</span> plan with{" "}
          <span className="font-semibold text-foreground">{credits}</span> AI credits. Run a fresh
          scan or explore matched roles below.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/">
              Run a new scan <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/results">View last result</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={TrendingUp} label="Last ATS Score" value="65 → 95" hint="After AI rewrite" />
        <StatCard icon={Briefcase} label="Job matches" value="3" hint="Curated for your resume" />
        <StatCard icon={MessageSquareText} label="Referral code" value={referralCode} hint="Share and earn 10 credits" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-display text-2xl font-semibold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
