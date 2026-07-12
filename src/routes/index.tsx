import { useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Star,
  Target,
  Wand2,
  Zap,
} from "lucide-react";
import { CoreActionCard } from "@/components/CoreActionCard";
import { AmbientBackground } from "@/components/AmbientBackground";
import { HeroVisual } from "@/components/HeroVisual";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Copilot AI — Beat the ATS & Land More Interviews" },
      {
        name: "description",
        content:
          "Upload your resume and job description. Get an instant Interview Probability Score and let AI rewrite your resume to a 95% match.",
      },
      { property: "og:title", content: "Career Copilot AI — Beat the ATS" },
      {
        property: "og:description",
        content: "Instant Interview Probability Score. AI resume rewrites tuned to any job.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  // Referral capture: ?ref=CODE → localStorage (first-touch, preserved)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && !localStorage.getItem("cc_referral")) {
        localStorage.setItem("cc_referral", ref);
      }
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <CoreActionSection />
      <LogoRow />
      <HowItWorks />
      <Metrics />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function CoreActionSection() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <CoreActionCard />
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight">
            Career Copilot<span className="text-primary">.ai</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Button asChild className="rounded-lg bg-primary font-semibold">
            <Link to="/dashboard">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-success/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
            AI Resume Optimizer · Trained on 2M+ hires
          </div>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-[68px]">
            Stop Getting <span className="italic text-primary">Ghosted</span> by ATS Systems.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Upload your resume and job description. Get an instant{" "}
            <span className="font-medium text-foreground">Interview Probability Score</span> and let our AI rewrite
            your resume to a <span className="font-semibold text-success-foreground">95% match</span>.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              40-Point ATS Audit
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              ATS-safe formatting
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-primary"
                  style={{ opacity: 0.6 + i * 0.1 }}
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current text-warning" style={{ color: "oklch(0.78 0.17 80)" }} />
                ))}
                <span className="ml-1 font-semibold text-foreground">4.9</span>
              </div>
              <div className="text-xs text-muted-foreground">from 12,400+ job seekers</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function LogoRow() {
  const logos = ["Google", "Stripe", "Meta", "Airbnb", "Shopify", "Netflix"];
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Our users have landed interviews at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((l) => (
            <span key={l} className="font-display text-xl font-semibold text-muted-foreground/70 grayscale transition hover:text-foreground hover:grayscale-0">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: FileSearch,
      title: "Paste any job description",
      body: "We parse the role's real requirements — not just the keywords recruiters skim.",
    },
    {
      icon: BarChart3,
      title: "Get your probability score",
      body: "See exactly where you match, where you fall short, and what to fix.",
    },
    {
      icon: Wand2,
      title: "One-click AI rewrite",
      body: "Our model rewrites bullet points to hit 95%+ match while staying truthful.",
    },
  ];
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">How it works</div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
            From ghosted to shortlisted in three steps
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="group relative rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-4xl font-bold text-secondary">0{i + 1}</span>
              </div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const stats = [
    { value: "3.4x", label: "more interviews per application" },
    { value: "95%", label: "average ATS match after rewrite" },
    { value: "10s", label: "to full resume analysis" },
    { value: "12k+", label: "job seekers already hired" },
  ];
  return (
    <section className="border-y border-border/60 bg-gradient-to-b from-secondary/40 to-background py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <span className="bg-gradient-to-b from-success to-success/70 bg-clip-text text-transparent">
                {s.value}
              </span>
            </div>
            <div className="mt-2 text-xs leading-snug text-muted-foreground sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Target, title: "ATS keyword targeting", body: "Match the exact phrasing recruiters filter for." },
    { icon: Zap, title: "Instant rewrite engine", body: "Rewritten bullets in seconds, tuned per role." },
    { icon: BrainCircuit, title: "Interview probability score", body: "Know your odds before you hit apply." },
    { icon: Sparkles, title: "Truthful by design", body: "AI polishes what's there — never fabricates." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-primary">Features</div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
            Everything you need to beat the bots
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      body: "Went from 0 callbacks in 3 months to 4 interviews the first week I used Career Copilot.",
      name: "Priya S.",
      role: "Product Designer",
    },
    {
      body: "The probability score is scary accurate. Bumped mine from 62% to 94% and got the offer.",
      name: "Marcus T.",
      role: "Backend Engineer",
    },
    {
      body: "Finally a tool that doesn't make me sound like a robot wrote my resume.",
      name: "Ana R.",
      role: "Marketing Lead",
    },
  ];
  return (
    <section className="border-t border-border/60 bg-secondary/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-display text-4xl font-semibold tracking-tight">
          Real people. Real offers.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.name} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-3 flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" style={{ color: "oklch(0.78 0.17 80)" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">"{q.body}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/60 to-primary" />
                <div className="text-sm">
                  <div className="font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How does the probability score work?", a: "We compare your resume against the job description across keywords, seniority signals, and role-specific patterns from millions of hires." },
    { q: "Will my resume still sound like me?", a: "Yes. Our model only rewrites what's already there — sharper phrasing, better keywords, no fabrication." },
    { q: "Is my data private?", a: "Your resume is encrypted, never sold, and deleted on request. We don't train models on your data." },
    { q: "What file formats work?", a: "PDF and DOCX up to 10MB. We preserve ATS-safe formatting on export." },
  ];
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center font-display text-4xl font-semibold tracking-tight">Frequently asked</h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-foreground list-none">
                {f.q}
                <span className="text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-14 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 p-10 text-center text-primary-foreground shadow-[var(--shadow-elevated)]">
          <h3 className="font-display text-3xl font-semibold tracking-tight">Your next interview is one upload away.</h3>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-90">Join 12,400+ job seekers using Career Copilot to skip the ghost pile.</p>
          <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-primary transition hover:opacity-90">
            Get my score free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BrainCircuit className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-semibold text-foreground">Career Copilot.ai</span>
          <span className="text-xs">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-xs">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
