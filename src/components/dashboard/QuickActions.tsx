import { useRef, useState, type ReactNode } from "react";
import { FileText, Mail, Sparkles, Upload, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
  const { spendCredits, openUpgrade, addRadarJobs } = useDashboard();
  const navigate = useNavigate();
  const [open, setOpen] = useState<ActionKey>(null);
  const [jd, setJd] = useState("");
  const [override, setOverride] = useState<File | null>(null);

  const close = () => {
    setOpen(null);
    setJd("");
    setOverride(null);
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

  const runRadar = () => {
    if (!spendCredits(1)) {
      toast.error("Not enough credits", {
        description: "Upgrade your plan to keep the momentum.",
        action: { label: "Upgrade", onClick: openUpgrade },
      });
      return;
    }
    addRadarJobs(3);
    close();
    toast.success("3 new matches found!", { description: "Fresh roles added to your Jobs tab." });
    navigate({ to: "/dashboard/jobs" });
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
        <ResumeContext override={override} onOverride={setOverride} />
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
        <ResumeContext override={override} onOverride={setOverride} />
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
        <Button className="w-full" size="lg" onClick={runRadar}>
          📡 Trigger Radar (-1 Credit)
        </Button>
      </ActionDialog>
    </>
  );
}

function ResumeContext({
  override,
  onOverride,
}: {
  override: File | null;
  onOverride: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5" />
        <span>
          📄 Active Profile: Using your saved{" "}
          <span className="font-semibold text-foreground/80">Master Resume</span>.
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onOverride(f);
        }}
        className={`flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-left text-xs transition ${
          drag ? "border-primary/60 bg-primary/5" : "border-border/60 bg-background"
        } text-muted-foreground hover:border-primary/40`}
      >
        <Upload className="h-3.5 w-3.5" />
        {override ? (
          <span className="truncate text-foreground/80">
            Using override: <span className="font-medium">{override.name}</span>
          </span>
        ) : (
          <span>Or upload a different resume (Optional)</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => onOverride(e.target.files?.[0] ?? null)}
        />
      </button>
    </div>
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
