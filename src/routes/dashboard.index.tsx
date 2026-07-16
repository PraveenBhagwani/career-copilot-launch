import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, FileText, Mail, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { credits, plan, spendCredits, openUpgrade } = useDashboard();

  const run = (label: string, cost = 1) => {
    if (!spendCredits(cost)) {
      toast.error("Not enough credits", {
        description: "Upgrade your plan to keep the momentum.",
        action: { label: "Upgrade", onClick: openUpgrade },
      });
      return;
    }
    toast.success(`${label} started`, { description: `${cost} credit used · delivering shortly.` });
  };

  const actions = [
    { icon: FileText, label: "📄 Tailor Resume to New JD", cost: 1 },
    { icon: Mail, label: "✉️ Generate Cover Letter", cost: 1 },
    { icon: Zap, label: "⚡ Fetch 3 Custom Jobs", cost: 1 },
  ];

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
        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Actions
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {actions.map((a) => (
              <Button
                key={a.label}
                variant="outline"
                onClick={() => run(a.label, a.cost)}
                className="h-auto flex-col items-start gap-1.5 whitespace-normal rounded-xl border-border/70 bg-card p-4 text-left hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="text-sm font-semibold leading-snug">{a.label}</span>
                <span className="text-xs font-normal text-muted-foreground">(-{a.cost} Credit)</span>
              </Button>
            ))}
          </div>
        </div>

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

      <ProfileSettings />
    </div>
  );
}

function ProfileSettings() {
  const [form, setForm] = useState({
    name: "Pravin Kumar",
    whatsapp: "+91 98765 43210",
    email: "pravin@example.com",
    city: "Bengaluru",
    role: "Operations Manager",
    remote: true,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = () => toast.success("Profile updated", { description: "We'll re-tune your matches." });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="h-4 w-4 text-primary" /> Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Current city" value={form.city} onChange={(v) => set("city", v)} />
          <Field label="Target role" value={form.role} onChange={(v) => set("role", v)} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/40 p-3">
          <div>
            <Label className="text-sm font-medium">Open to Remote jobs</Label>
            <p className="text-xs text-muted-foreground">Prioritize fully-remote roles in your matches.</p>
          </div>
          <Switch checked={form.remote} onCheckedChange={(v) => set("remote", v)} />
        </div>
        <div className="flex justify-end">
          <Button onClick={save}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
