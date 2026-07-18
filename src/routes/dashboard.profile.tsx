import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Career Copilot AI" },
      { name: "description", content: "Manage your profile settings and job preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
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

  const save = () =>
    toast.success("Profile updated", { description: "We'll re-tune your matches." });

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-semibold md:text-3xl">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your details fresh so the AI can tailor better matches.
        </p>
      </div>

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
              <p className="text-xs text-muted-foreground">
                Prioritize fully-remote roles in your matches.
              </p>
            </div>
            <Switch checked={form.remote} onCheckedChange={(v) => set("remote", v)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={save}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
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
