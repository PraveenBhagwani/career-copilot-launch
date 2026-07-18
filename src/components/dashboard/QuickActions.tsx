import { useState, type ReactNode } from "react";
import { FileText, Mail, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/lib/dashboard-store";

type ActionKey = "tailor" | "cover" | "radar" | null;

export function QuickActions() {
  const { spendCredits, openUpgrade } = useDashboard();
  const [open, setOpen] = useState<ActionKey>(null);
  const [jd, setJd] = useState("");

  const close = () => {
    setOpen(null);
    setJd("");
  };

  const run = (label: string) => {
    if (!spendCredits(1)) {
      toast.error("Not enough credits", {
        description: "Upgrade your plan to keep the momentum.",
        action: { label: "Upgrade", onClick: openUpgrade },
      });
      return;
    }
    toast.success(`${label} started`, { description: "1 credit used · delivering shortly." });
    close();
  };

  const actions = [
    { key: "tailor" as const, icon: FileText, label: "📄 Tailor Resume to New JD" },
    { key: "cover" as const, icon: Mail, label: "✉️ Generate Cover Letter" },
    { key: "radar" as const, icon: Zap, label: "⚡ Fetch 3 Custom Jobs" },
  ];

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((a) => (
            <Button
              key={a.key}
              variant="outline"
              onClick={() => setOpen(a.key)}
              className="h-auto flex-col items-start gap-1.5 whitespace-normal rounded-xl border-border/70 bg-card p-4 text-left hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="text-sm font-semibold leading-snug">{a.label}</span>
              <span className="text-xs font-normal text-muted-foreground">(-1 Credit)</span>
            </Button>
          ))}
        </div>
      </div>

      <ActionDialog
        open={open === "tailor"}
        onClose={close}
        title="Tailor Resume to New Role"
        description="Paste the job description and the Architect will rewrite your resume to a 90+ match."
      >
        <JDField value={jd} onChange={setJd} label="Paste New Job Description" />
        <Button
          className="w-full"
          size="lg"
          disabled={!jd.trim()}
          onClick={() => run("Architect")}
        >
          🚀 Run Architect (-1 Credit)
        </Button>
      </ActionDialog>

      <ActionDialog
        open={open === "cover"}
        onClose={close}
        title="Generate Cover Letter"
        description="Paste the JD and we'll craft a hiring-manager-ready draft in seconds."
      >
        <JDField value={jd} onChange={setJd} label="Paste Target Job Description" />
        <Button
          className="w-full"
          size="lg"
          disabled={!jd.trim()}
          onClick={() => run("Cover letter")}
        >
          ✍️ Generate Draft (-1 Credit)
        </Button>
      </ActionDialog>

      <ActionDialog
        open={open === "radar"}
        onClose={close}
        title="On-Demand Job Radar"
        description="A one-tap scan across our real-time job graph."
      >
        <div className="rounded-xl border border-border/70 bg-secondary/40 p-4 text-sm text-muted-foreground">
          <Sparkles className="mb-2 h-4 w-4 text-primary" />
          Deploy the Radar to immediately scrape and fetch 3 high-probability jobs matching your
          profile in <span className="font-semibold text-foreground">Bengaluru</span>.
        </div>
        <Button className="w-full" size="lg" onClick={() => run("Job Radar")}>
          📡 Trigger Radar (-1 Credit)
        </Button>
      </ActionDialog>
    </>
  );
}

function JDField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here…"
        className="min-h-40 resize-none"
      />
    </div>
  );
}

function ActionDialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="sm:max-w-lg animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

// Keep Card export helper unused-friendly
export const _cardShim = { Card, CardHeader, CardTitle, CardContent };
