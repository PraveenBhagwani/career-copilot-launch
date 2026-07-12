import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

function ConstellationMesh() {
  // Deterministic node positions in a 600x400 viewBox
  const nodes: Array<[number, number]> = [
    [60, 60], [180, 40], [300, 90], [430, 50], [550, 110],
    [90, 180], [220, 160], [360, 200], [490, 180], [560, 260],
    [70, 300], [200, 320], [340, 340], [470, 310], [540, 370],
  ];
  const links: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    [5, 6], [6, 7], [7, 8], [8, 9],
    [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
    [10, 11], [11, 12], [12, 13], [13, 14],
    [1, 7], [3, 7], [6, 12], [8, 12],
  ];
  return (
    <svg
      viewBox="0 0 600 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      aria-hidden
    >
      <g stroke="currentColor" className="text-primary/25" strokeWidth="0.5" fill="none">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      <g className="fill-primary/40">
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} />
        ))}
      </g>
    </svg>
  );
}

function DocCard({
  label,
  accent,
  className,
  animate,
  transition,
}: {
  label: string;
  accent: string;
  className?: string;
  animate: { y: number[] };
  transition: { duration: number; delay?: number };
}) {
  return (
    <motion.div
      animate={animate}
      transition={{ ...transition, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute w-40 rounded-xl border border-border/70 bg-card/90 p-3 shadow-[var(--shadow-elevated)] backdrop-blur-md ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${accent}`}>
          <FileText className="h-3.5 w-3.5" />
        </div>
        <div className="text-[11px] font-semibold tracking-tight text-foreground">{label}</div>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-secondary" />
        <div className="h-1.5 w-4/5 rounded bg-secondary" />
        <div className="h-1.5 w-3/5 rounded bg-secondary" />
        <div className="h-1.5 w-2/3 rounded bg-secondary" />
      </div>
    </motion.div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative flex h-full flex-col justify-center">
      <ConstellationMesh />

      <div className="relative">
        {/* Video placeholder */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-secondary/60 via-card to-secondary/40 shadow-[var(--shadow-elevated)]">
          <div className="aspect-video w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              poster=""
            >
              <source src="/hero.webm" type="video/webm" />
            </video>
            {/* Fallback gradient sheen if video unavailable */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-success/10" />
          </div>

          {/* Floating doc cards */}
          <DocCard
            label="Resume.pdf"
            accent="bg-primary/15 text-primary"
            className="left-4 top-4 sm:left-6 sm:top-6"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 }}
          />
          <DocCard
            label="Job Description"
            accent="bg-success/20 text-success-foreground"
            className="bottom-4 right-4 sm:bottom-6 sm:right-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, delay: 0.6 }}
          />
        </div>

        {/* Glassmorphic probability pill */}
        <div className="relative mt-6 rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-xl shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Interview Probability
            </div>
            <div className="font-display tabular-nums text-foreground">
              65% <span className="text-muted-foreground">→</span>{" "}
              <span className="text-success-foreground">95%</span>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
