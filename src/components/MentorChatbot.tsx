import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/lib/dashboard-store";

type Msg = { id: number; role: "bot" | "user"; text: string };

/**
 * Floating "Mentor" widget:
 * - Free/Pro → Sales Assistant persona
 * - Max     → AI Interview Coach persona with pulsing mic
 * Mounted globally from __root so it persists across all routes.
 */
export function MentorChatbot() {
  const { plan } = useDashboard();
  const isMax = plan === "Max";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const persona = isMax
    ? {
        name: "Navigator · AI Interview Coach",
        greet:
          "You're on Max — I'm your dedicated Interview Coach. Tap the mic or type an answer and I'll grade you in real time.",
        placeholder: "Type your answer, or tap mic to speak…",
        accent: "from-[oklch(0.62_0.2_150)] to-[oklch(0.55_0.22_265)]",
      }
    : {
        name: "Navigator",
        greet: "Hey! 👋 Wondering which plan is right for you? Ask me anything!",
        placeholder: "Ask about plans, credits, features…",
        accent: "from-primary to-[oklch(0.55_0.22_265)]",
      };

  // Reset transcript when persona changes so greeting matches plan.
  useEffect(() => {
    setMessages([{ id: 1, role: "bot", text: persona.greet }]);
  }, [isMax]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);
    setInput("");
    setTimeout(() => {
      const reply = isMax
        ? "Good start — quantify one impact number and I'll re-score you."
        : "Great question! For most users, Pro (₹299) is the sweet spot — 50 credits + credit store. Want a quick comparison?";
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", text: reply }]);
    }, 700);
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label={`Open ${persona.name}`}
            className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${persona.accent} text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.55_0.22_265/0.6)] transition hover:scale-105`}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
            <Sparkles className="relative h-6 w-6 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-5 right-5 z-50 flex h-[500px] w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_20px_60px_-15px_oklch(0.2_0.05_265/0.4)]"
          >
            <div className={`flex items-center justify-between bg-gradient-to-r ${persona.accent} px-4 py-3 text-primary-foreground`}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  {isMax ? <Sparkles className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{persona.name}</div>
                  <div className="text-[10px] opacity-90">
                    {isMax ? "Max plan · live coaching" : "Usually replies instantly"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/15"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-secondary/30 to-background p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-card border border-border/60 text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-border/60 bg-background p-2.5">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={persona.placeholder}
                className="h-9 flex-1 text-sm"
              />
              {isMax && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  title="Voice mode (Max)"
                  className="relative h-9 w-9 shrink-0"
                >
                  <span className="absolute inset-0 animate-pulse rounded-md bg-primary/20" />
                  <Mic className="relative h-4 w-4 text-primary" />
                </Button>
              )}
              <Button type="submit" size="icon" disabled={!input.trim()} className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
