import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Info, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/jobs")({
  component: Jobs,
});

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function useExpiryLabel(addedAt: number) {
  const [label, setLabel] = useState(() => formatExpiry(addedAt));
  useEffect(() => {
    const id = setInterval(() => setLabel(formatExpiry(addedAt)), 60_000);
    return () => clearInterval(id);
  }, [addedAt]);
  return label;
}

function formatExpiry(addedAt: number) {
  const ms = addedAt + SEVEN_DAYS - Date.now();
  if (ms <= 0) return "Expired";
  const d = Math.floor(ms / (24 * 60 * 60 * 1000));
  const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `Expires in ${d}d ${h}h ${m}m`;
}

function Jobs() {
  const { jobs } = useDashboard();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Handpicked for your resume</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by ATS match probability. Apply in one click.
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <Info className="h-3.5 w-3.5" /> To keep your leads fresh, job matches auto-delete after 7 days.
        </p>
      </div>
      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No active matches. Trigger the Job Radar from the{" "}
            <Link to="/dashboard" className="text-primary underline">Overview</Link> to fetch fresh roles.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: ReturnType<typeof useDashboard>["jobs"][number] }) {
  const expiry = useExpiryLabel(job.addedAt);
  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${job.accent}`} />
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-sm font-semibold">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success-foreground">
            {job.match}%
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </span>
          <span>·</span>
          <span>{job.salary}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button asChild className="flex-1 gap-1.5">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <span className="whitespace-nowrap font-mono text-xs text-orange-500/80">
            ⏳ {expiry}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
