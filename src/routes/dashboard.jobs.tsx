import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/jobs")({
  component: Jobs,
});

const JOBS = [
  {
    title: "Operations Manager",
    company: "Amazon",
    location: "Bengaluru, IN",
    match: 95,
    salary: "₹28–36 LPA",
    tags: ["SLA Adherence", "Program Ops", "SOP Design"],
    url: "https://www.amazon.jobs/en/search?base_query=operations+manager&loc_query=Bengaluru",
    accent: "from-orange-500/20 to-yellow-500/10",
  },
  {
    title: "Customer Success Lead",
    company: "Razorpay",
    location: "Remote, India",
    match: 92,
    salary: "₹22–30 LPA",
    tags: ["SaaS", "NPS", "Renewals"],
    url: "https://razorpay.com/jobs/",
    accent: "from-blue-500/20 to-indigo-500/10",
  },
  {
    title: "Program Manager",
    company: "Flipkart",
    location: "Gurugram, IN",
    match: 88,
    salary: "₹30–40 LPA",
    tags: ["Cross-functional", "OKRs", "Analytics"],
    url: "https://www.flipkartcareers.com/",
    accent: "from-sky-500/20 to-blue-500/10",
  },
];

function Jobs() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Handpicked for your resume</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by ATS match probability. Apply in one click.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {JOBS.map((job) => (
          <Card key={job.title} className="overflow-hidden">
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

              <Button asChild className="mt-5 w-full gap-1.5">
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
