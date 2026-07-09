import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Mic, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/lib/dashboard-store";

export const Route = createFileRoute("/dashboard/coach")({
  component: Coach,
});

type Msg = { id: number; role: "bot" | "user"; text: string };

const INITIAL_BOT =
  "Paste your Job Description (JD), and I'll conduct a mock interview tailored to that role. This costs 10 Credits. Type YES to proceed.";

const INTERVIEW_SCRIPT = [
  "Great — paste the JD below and I'll get started. To warm up: tell me about a time you led a cross-functional project under a tight deadline.",
  "Solid framing. Follow-up: what was the single biggest tradeoff you made, and how would you approach it differently today?",
  "Nice. Now a scenario question — a key stakeholder pushes back on your roadmap two days before launch. Walk me through your first 60 minutes.",
  "Final question: what's one metric you'd add to this role in your first 30 days, and why does it matter more than the ones already tracked?",
  "That's a wrap. Overall: strong structure, quantify impact more (numbers > adjectives). I'll email you a full scorecard shortly.",
];

function Coach() {
  const { credits, spendCredits } = useDashboard();
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "bot", text: INITIAL_BOT },
  ]);
  const [input, setInput] = useState("");
  const [consented, setConsented] = useState(false);
  const [typing, setTyping] = useState(false);
  const [turn, setTurn] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const pushBot = (text: string, delay = 800) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now(), role: "bot", text }]);
      setTyping(false);
    }, delay);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (!consented) {
      if (text.toLowerCase() === "yes") {
        if (credits < 10) {
          toast.error("You need 10 credits for this session.", {
            description: "Top up from the wallet in the header.",
          });
          return;
        }
        spendCredits(10);
        setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);
        setConsented(true);
        setInput("");
        toast.success("Session started — 10 credits used.");
        pushBot(INTERVIEW_SCRIPT[0], 900);
        setTurn(1);
        return;
      }
      toast("Type Yes to continue", { description: "Consent is required before the session begins." });
      return;
    }

    setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);
    setInput("");
    const next = INTERVIEW_SCRIPT[Math.min(turn, INTERVIEW_SCRIPT.length - 1)];
    pushBot(next, 900);
    setTurn((t) => Math.min(t + 1, INTERVIEW_SCRIPT.length - 1));
  };

  const inputDisabled = false; // never fully disabled — the guard is on send
  const placeholder = consented
    ? "Type your answer…"
    : "Type Yes to accept the 10-credit session";

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold">AI Career Coach</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A private mock interview, calibrated to the job you want.
        </p>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <ScrollArea className="flex-1" ref={scrollRef as never}>
          <div ref={scrollRef} className="space-y-4 p-5">
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <Avatar role="bot" />
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3">
                  <Dot /> <Dot delay={150} /> <Dot delay={300} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border bg-background p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={inputDisabled}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => toast("Voice mode coming soon", { description: "Tap the mic to speak your answer." })}
            title="Voice mode (beta)"
            className="relative"
          >
            <span className="absolute inset-0 animate-pulse rounded-md bg-primary/15" />
            <Mic className="relative h-4 w-4 text-primary" />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
      {!consented && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Session cost: 10 credits · You have {credits}
        </p>
      )}
    </div>
  );
}

function Avatar({ role }: { role: "bot" | "user" }) {
  const isBot = role === "bot";
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isBot ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
      }`}
    >
      {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={msg.role} />
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-secondary text-foreground"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
