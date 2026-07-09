import { useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { WalletPill } from "./WalletPill";
import { useDashboard } from "@/lib/dashboard-store";
import { Button } from "@/components/ui/button";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/jobs": "Job Matches",
  "/dashboard/coach": "AI Career Coach",
  "/dashboard/refer": "Refer & Earn",
};

export function DashboardHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { plan, setPlan } = useDashboard();
  const title = TITLES[pathname] ?? "Dashboard";
  const nextPlan = plan === "Free" ? "Pro" : plan === "Pro" ? "Max" : "Free";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="font-display text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPlan(nextPlan)}
          className="hidden gap-1.5 sm:inline-flex"
          title={`Toggle plan (demo) — switch to ${nextPlan}`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              plan === "Max"
                ? "bg-primary"
                : plan === "Pro"
                  ? "bg-success"
                  : "bg-muted-foreground"
            }`}
          />
          {plan}
        </Button>
        <WalletPill />
      </div>
    </header>
  );
}
