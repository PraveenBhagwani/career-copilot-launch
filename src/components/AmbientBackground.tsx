import { motion } from "framer-motion";
import { useMemo } from "react";

const SKILLS = [
  "Strategy", "React", "Leadership", "SQL", "Figma", "Roadmapping",
  "TypeScript", "SLA", "Analytics", "OKRs", "GTM", "Python",
  "Storytelling", "Ownership", "Design", "Node.js", "A/B Testing", "Growth",
  "SaaS", "AWS", "Product", "Docker", "Kanban", "Empathy",
];

type Tag = { text: string; x: number; delay: number; duration: number; scale: number };

/**
 * Ambient resume-themed background:
 * - Slow floating "skill tag" pills rising upward
 * - Faint wireframe resume outlines with a soft glowing scanline
 * Purely decorative. Positioned inside a relative parent (pointer-events-none, -z-10).
 */
export function AmbientBackground() {
  const tags = useMemo<Tag[]>(() => {
    // Deterministic-ish spread so hydration doesn't mismatch visibly.
    return SKILLS.map((text, i) => ({
      text,
      x: ((i * 137) % 96) + 2, // % across width
      delay: (i % 8) * 1.6,
      duration: 22 + ((i * 7) % 14),
      scale: 0.85 + ((i % 4) * 0.08),
    }));
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Wireframe resumes with scanline */}
      <div className="absolute left-[6%] top-[18%] hidden lg:block">
        <ResumeWireframe />
      </div>
      <div className="absolute right-[4%] top-[42%] hidden lg:block">
        <ResumeWireframe delay={2.4} />
      </div>
      <div className="absolute left-[42%] bottom-[8%] hidden md:block opacity-70">
        <ResumeWireframe delay={1.2} small />
      </div>

      {/* Floating skill tags */}
      {tags.map((t) => (
        <motion.div
          key={t.text}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 0.55, 0.55, 0] }}
          transition={{
            duration: t.duration,
            delay: t.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.85, 1],
          }}
          style={{ left: `${t.x}%`, scale: t.scale }}
          className="absolute rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary/70 backdrop-blur-sm"
        >
          {t.text}
        </motion.div>
      ))}
    </div>
  );
}

function ResumeWireframe({ delay = 0, small = false }: { delay?: number; small?: boolean }) {
  const w = small ? 160 : 220;
  const h = small ? 210 : 290;
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="text-muted-foreground/30"
        fill="none"
      >
        <rect x="4" y="4" width={w - 8} height={h - 8} rx="10" stroke="currentColor" strokeWidth="1" />
        <circle cx="26" cy="30" r="10" stroke="currentColor" strokeWidth="1" />
        <rect x="46" y="22" width={w * 0.4} height="6" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="46" y="34" width={w * 0.3} height="4" rx="2" fill="currentColor" opacity="0.35" />
        {Array.from({ length: small ? 6 : 9 }).map((_, i) => (
          <rect
            key={i}
            x="18"
            y={60 + i * 20}
            width={w - 36 - ((i * 13) % 40)}
            height="4"
            rx="2"
            fill="currentColor"
            opacity="0.28"
          />
        ))}
      </svg>
      {/* Glowing scanline */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: h - 12, opacity: [0, 0.9, 0.9, 0] }}
        transition={{
          duration: 3.6,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.15, 0.85, 1],
        }}
        className="absolute inset-x-2 h-[2px] rounded-full bg-primary/70 shadow-[0_0_18px_4px_oklch(0.55_0.22_265/0.45)]"
      />
    </div>
  );
}
