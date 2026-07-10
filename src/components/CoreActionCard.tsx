import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, Loader2, Phone, ShieldCheck, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";


type Step = "input" | "phone" | "otp" | "loading" | "result";

const LOADING_MESSAGES = [
  "Parsing Resume...",
  "Checking Keywords...",
  "Calculating Interview Probability...",
];

export function CoreActionCard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("input");
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadingIdx(0);
    const iv = setInterval(() => {
      setLoadingIdx((i) => {
        if (i >= LOADING_MESSAGES.length - 1) {
          clearInterval(iv);
          setTimeout(() => navigate({ to: "/results" }), 700);
          return i;
        }
        return i + 1;
      });
    }, 1400);
    return () => clearInterval(iv);
  }, [step, navigate]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const canSubmitInput = jd.trim().length > 20 && !!file;
  const canSubmitPhone = phone.replace(/\D/g, "").length >= 10;
  const canSubmitOtp = otp.every((d) => d.length === 1);

  const setOtpDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", ""];
    text.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    otpRefs.current[Math.min(text.length, 3)]?.focus();
  };

  // Magnetic 3D tilt: track mouse position on card, tilt within a small range.
  const rotX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const shadowX = useTransform(rotY, [-8, 8], [18, -18]);
  const shadowY = useTransform(rotX, [-8, 8], [-18, 18]);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== "input") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 10);
    rotX.set(-py * 10);
  };
  const resetTilt = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.div
      className="relative [perspective:1400px]"
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-success/10 blur-2xl" />
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="rounded-3xl border border-border/70 bg-card p-2 shadow-[var(--shadow-elevated)] will-change-transform"
      >
        <motion.div
          aria-hidden
          style={{ x: shadowX, y: shadowY }}
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary/20 blur-2xl"
        />
        <div className="rounded-[calc(var(--radius)+6px)] bg-gradient-to-b from-secondary/40 to-card p-6 sm:p-8">

          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">1</span>
                  Paste Job Description
                </div>
                <Textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the full job description here — the more detail, the better your match score…"
                  className="min-h-[140px] resize-none border-border/70 bg-background text-sm leading-relaxed focus-visible:ring-primary/30"
                />

                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">2</span>
                  Upload Resume (PDF / DOCX)
                </div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition ${
                    dragging
                      ? "border-primary bg-primary/5"
                      : file
                        ? "border-success/60 bg-success/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  {/* ATS scanline sweep — active once a file is uploaded */}
                  {file && (
                    <motion.div
                      aria-hidden
                      initial={{ y: "-100%" }}
                      animate={{ y: "100%" }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                      className="pointer-events-none absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_4px_oklch(0.55_0.22_265/0.5)]"
                    />
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  {file ? (
                    <div className="relative flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/20 text-success-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB · Scanning…
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Drop your resume here or <span className="text-primary underline underline-offset-4">browse</span>
                      </div>
                      <div className="text-xs text-muted-foreground">PDF or DOCX · up to 10 MB</div>
                    </>
                  )}
                </div>


                <Button
                  size="lg"
                  disabled={!canSubmitInput}
                  onClick={() => setStep("phone")}
                  className="group h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-[var(--shadow-card)] hover:bg-primary/90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Calculate My Score
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Free · No credit card · Results in ~10 seconds
                </p>
              </motion.div>
            )}

            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Secure verification
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                    Where should we send your score?
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    We'll text you a 4-digit code to unlock your report.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Phone number</label>
                  <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/30">
                    <div className="flex items-center gap-1.5 border-r border-border bg-secondary/60 px-3 text-sm font-medium text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      +1
                    </div>
                    <Input
                      autoFocus
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  disabled={!canSubmitPhone}
                  onClick={() => setStep("otp")}
                  className="h-12 w-full rounded-xl bg-primary text-base font-semibold"
                >
                  Send verification code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <button
                  onClick={() => setStep("input")}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Back to resume
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success-foreground" />
                    Code sent to +1 {phone}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                    Enter your 4-digit code
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Check your messages — it usually arrives in seconds.
                  </p>
                </div>

                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={d}
                      onChange={(e) => setOtpDigit(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          otpRefs.current[i - 1]?.focus();
                        }
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      autoFocus={i === 0}
                      className="h-16 w-14 rounded-xl border-2 border-border bg-background text-center font-display text-2xl font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  ))}
                </div>

                <Button
                  size="lg"
                  disabled={!canSubmitOtp}
                  onClick={() => setStep("loading")}
                  className="h-12 w-full rounded-xl bg-primary text-base font-semibold"
                >
                  Verify &amp; Analyze
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center opacity-60">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <ShieldCheck className="mr-1 inline h-3 w-3" />
                    By verifying this OTP, you explicitly agree to our{" "}
                    <a href="#" className="underline underline-offset-2 hover:text-foreground">
                      Terms of Service
                    </a>{" "}
                    &amp;{" "}
                    <a href="#" className="underline underline-offset-2 hover:text-foreground">
                      Privacy Policy
                    </a>{" "}
                    for AI processing.
                  </p>
                </div>

              </motion.div>
            )}

            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 py-2"
              >
                <div className="flex items-center justify-center">
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                    <div className="absolute inset-2 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Loader2 className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>

                <div className="min-h-[28px] text-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="font-display text-lg font-medium text-foreground"
                    >
                      {LOADING_MESSAGES[loadingIdx]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                          className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                        />
                      </div>
                      <div className="h-3 w-10 rounded bg-secondary" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-success/30 to-success/10 shadow-inner">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-background shadow-[var(--shadow-card)]">
                    <div className="font-display text-4xl font-bold text-foreground">92<span className="text-xl">%</span></div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Match</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">Strong interview probability</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Your resume matches 92% of the key requirements. Let AI push you to 95%+.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["React", "TypeScript", "SaaS", "B2B"].map((k) => (
                    <span key={k} className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-foreground">
                      ✓ {k}
                    </span>
                  ))}
                  {["Figma", "GraphQL"].map((k) => (
                    <span key={k} className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      + {k}
                    </span>
                  ))}
                </div>
                <Button size="lg" className="h-12 w-full rounded-xl bg-primary text-base font-semibold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Rewrite my resume to 95%
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

