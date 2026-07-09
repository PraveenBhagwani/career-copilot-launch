import { useState } from "react";
import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-store";
import { TopUpDialog } from "./TopUpDialog";

export function WalletPill() {
  const { credits } = useDashboard();
  const [open, setOpen] = useState(false);
  const empty = credits === 0;

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
            empty
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-border bg-secondary text-foreground"
          }`}
        >
          <Coins className="h-4 w-4" />
          Credits: {credits}
        </div>
        {empty ? (
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" /> Top-Up
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" /> Top-Up
          </Button>
        )}
      </div>
      <TopUpDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
