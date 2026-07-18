import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Plan = "Free" | "Starter" | "Pro" | "Max";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  match: number;
  salary: string;
  tags: string[];
  url: string;
  accent: string;
  addedAt: number;
};

const INITIAL_JOBS: Job[] = [
  {
    id: "seed-amazon",
    title: "Operations Manager",
    company: "Amazon",
    location: "Bengaluru, IN",
    match: 95,
    salary: "₹28–36 LPA",
    tags: ["SLA Adherence", "Program Ops", "SOP Design"],
    url: "https://www.amazon.jobs/en/search?base_query=operations+manager&loc_query=Bengaluru",
    accent: "from-orange-500/20 to-yellow-500/10",
    addedAt: Date.now(),
  },
  {
    id: "seed-razorpay",
    title: "Customer Success Lead",
    company: "Razorpay",
    location: "Remote, India",
    match: 92,
    salary: "₹22–30 LPA",
    tags: ["SaaS", "NPS", "Renewals"],
    url: "https://razorpay.com/jobs/",
    accent: "from-blue-500/20 to-indigo-500/10",
    addedAt: Date.now(),
  },
  {
    id: "seed-flipkart",
    title: "Program Manager",
    company: "Flipkart",
    location: "Gurugram, IN",
    match: 88,
    salary: "₹30–40 LPA",
    tags: ["Cross-functional", "OKRs", "Analytics"],
    url: "https://www.flipkartcareers.com/",
    accent: "from-sky-500/20 to-blue-500/10",
    addedAt: Date.now(),
  },
];

const RADAR_POOL: Omit<Job, "id" | "addedAt">[] = [
  {
    title: "Growth Product Manager",
    company: "Stripe",
    location: "Bengaluru, IN",
    match: 96,
    salary: "₹45–60 LPA",
    tags: ["Activation", "Experimentation", "SQL"],
    url: "https://stripe.com/jobs/search",
    accent: "from-violet-500/20 to-purple-500/10",
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, India",
    match: 94,
    salary: "₹40–55 LPA",
    tags: ["React", "Next.js", "Edge"],
    url: "https://vercel.com/careers",
    accent: "from-neutral-500/20 to-slate-500/10",
  },
  {
    title: "Solutions Engineer",
    company: "Linear",
    location: "Remote, India",
    match: 93,
    salary: "₹38–50 LPA",
    tags: ["Onboarding", "APIs", "SaaS"],
    url: "https://linear.app/careers",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    title: "Senior Backend Engineer",
    company: "Notion",
    location: "Bengaluru, IN",
    match: 91,
    salary: "₹42–58 LPA",
    tags: ["Distributed Systems", "Go", "Postgres"],
    url: "https://www.notion.so/careers",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Lifecycle Marketing Lead",
    company: "Figma",
    location: "Remote, India",
    match: 90,
    salary: "₹35–48 LPA",
    tags: ["Retention", "CRM", "Automation"],
    url: "https://www.figma.com/careers/",
    accent: "from-pink-500/20 to-rose-500/10",
  },
  {
    title: "Data Analyst",
    company: "Ramp",
    location: "Remote, India",
    match: 89,
    salary: "₹30–42 LPA",
    tags: ["SQL", "dbt", "Looker"],
    url: "https://ramp.com/careers",
    accent: "from-cyan-500/20 to-sky-500/10",
  },
];

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
  jobs: Job[];
  addRadarJobs: (n?: number) => Job[];
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
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

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

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const openUpgrade = useCallback(() => setUpgradeOpen(true), []);
  const closeUpgrade = useCallback(() => setUpgradeOpen(false), []);

  const addRadarJobs = useCallback((n = 3) => {
    const now = Date.now();
    const used = new Set(jobs.map((j) => `${j.company}-${j.title}`));
    const available = RADAR_POOL.filter((j) => !used.has(`${j.company}-${j.title}`));
    const pool = available.length >= n ? available : RADAR_POOL;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, n);
    const fresh: Job[] = shuffled.map((j, i) => ({
      ...j,
      id: `radar-${now}-${i}`,
      addedAt: now,
    }));
    setJobs((prev) => [...fresh, ...prev]);
    return fresh;
  }, [jobs]);

  const value = useMemo(
    () => ({ credits, plan, referralCode, addCredits, spendCredits, setPlan, upgradeOpen, openUpgrade, closeUpgrade, jobs, addRadarJobs }),
    [credits, plan, referralCode, addCredits, spendCredits, setPlan, upgradeOpen, openUpgrade, closeUpgrade, jobs, addRadarJobs],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDashboard must be used inside DashboardProvider");
  return v;
}
