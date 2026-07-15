import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Plan = "Free" | "Starter" | "Pro" | "Max";

type DashboardState = {
  credits: number;
  plan: Plan;
  referralCode: string;
  addCredits: (n: number) => void;
  spendCredits: (n: number) => boolean;
  setPlan: (p: Plan) => void;
  upgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
};

const Ctx = createContext<DashboardState | null>(null);

function generateCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 4; i++) s += letters[Math.floor(Math.random() * letters.length)];
  s += Math.floor(100 + Math.random() * 900);
  return s;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(3);
  const [plan, setPlanState] = useState<Plan>("Free");
  const [referralCode, setReferralCode] = useState("PRAV928");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const c = localStorage.getItem("cc_credits");
      const p = localStorage.getItem("cc_plan") as Plan | null;
      let ref = localStorage.getItem("cc_refcode");
      if (!ref) {
        ref = generateCode();
        localStorage.setItem("cc_refcode", ref);
      }
      if (c !== null) setCredits(Number(c));
      if (p === "Free" || p === "Starter" || p === "Pro" || p === "Max") setPlanState(p);
      setReferralCode(ref);
    } catch {}
  }, []);

  const persist = (c: number, p: Plan) => {
    try {
      localStorage.setItem("cc_credits", String(c));
      localStorage.setItem("cc_plan", p);
    } catch {}
  };

  const addCredits = useCallback((n: number) => {
    setCredits((prev) => {
      const next = prev + n;
      persist(next, plan);
      return next;
    });
  }, [plan]);

  const spendCredits = useCallback((n: number) => {
    let ok = false;
    setCredits((prev) => {
      if (prev < n) return prev;
      ok = true;
      const next = prev - n;
      persist(next, plan);
      return next;
    });
    return ok;
  }, [plan]);

  const setPlan = useCallback((p: Plan) => {
    setPlanState(p);
    persist(credits, p);
  }, [credits]);

  const value = useMemo(
    () => ({ credits, plan, referralCode, addCredits, spendCredits, setPlan }),
    [credits, plan, referralCode, addCredits, spendCredits, setPlan],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDashboard must be used inside DashboardProvider");
  return v;
}
