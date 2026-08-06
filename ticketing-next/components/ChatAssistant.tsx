"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Ticket } from "@/lib/types";
import { timeAgo } from "@/lib/format";

type Msg = { from: "bot" | "you"; text: string };

// Response-time policy (SLA): urgent 24h, everything else 72h.
function etaFor(priority: string) {
  return priority === "Urgent" || priority === "High" ? "within 24 hours" : "within 72 hours";
}

const POLICY =
  "Our response policy: an agent gets back to you within 24 hours for Urgent (and High) issues, and within 72 hours for everything else. You'll always see the latest update on your ticket's activity log.";

function answer(input: string, tickets: Ticket[]): string {
  const t = input.toLowerCase().trim();

  // ticket lookup by ref e.g. TKT-1042
  const m = input.match(/tkt[-\s]?(\d{3,5})/i);
  if (m) {
    const ref = "TKT-" + m[1];
    const tk = tickets.find((x) => x.ref.toLowerCase() === ref.toLowerCase());
    if (!tk) return `I couldn't find ${ref}. Please check the number, or ask me to help you raise a new ticket.`;
    const eta = tk.status === "Resolved" || tk.status === "Closed"
      ? `It's already ${tk.status.toLowerCase()}.`
      : `An agent will get back to you ${etaFor(tk.priority)}${tk.owner ? ` — ${tk.owner} is on it` : " once it's picked up"}.`;
    return `${tk.ref} — “${tk.title}” is currently ${tk.status} (${tk.priority} priority), raised ${timeAgo(tk.createdAt)} ago. ${eta}`;
  }

  if (/(how long|when|response|reply|call ?back|get back|sla|kitna|kitne|samay|time)/.test(t))
    return POLICY;
  if (/(policy|rule|rules|guideline|terms)/.test(t))
    return POLICY + " Tickets move through Raised → Picked up → In progress → Resolved → Closed, and nothing is closed without your issue being addressed.";
  if (/(raise|create|new ticket|report|log a)/.test(t))
    return "Tap “+ Raise” at the top right to open a ticket. Add a clear title, your name, category and priority — you'll get a TKT-#### you can track here.";
  if (/(status|update|track|where|my ticket)/.test(t)) {
    const open = tickets.filter((x) => x.status !== "Closed");
    if (!open.length) return "There are no open tickets right now. Share a TKT number and I'll check it for you.";
    const urgent = open.filter((x) => x.priority === "Urgent").length;
    return `There are ${open.length} open ticket(s)${urgent ? `, ${urgent} urgent` : ""}. Tell me a TKT number (e.g. TKT-1042) and I'll give you its status and response time.`;
  }
  if (/(hi|hello|hey|namaste|help|start)/.test(t))
    return "Hi! 👋 I can check a ticket's status, explain our response times, or help you raise one. " + POLICY;
  if (/(thank|thanks|great|ok|okay)/.test(t))
    return "You're welcome! I'm here whenever you need a status or want to raise a ticket.";

  return "I can help with three things: your ticket's status (share the TKT number), our response-time policy, or raising a new ticket. " + POLICY;
}

export default function ChatAssistant({ tickets }: { tickets: Ticket[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! 👋 I'm your support assistant. Ask me a ticket's status (e.g. “TKT-1042”), our response times, or how to raise a ticket." },
    { from: "bot", text: POLICY },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const reply = answer(text, tickets);
    setMsgs((m) => [...m, { from: "you", text }, { from: "bot", text: reply }]);
    setInput("");
  }

  return (
    <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass mb-3 flex h-[440px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet to-cyan text-sm text-black">✦</span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Support Assistant</div>
                <div className="text-[0.68rem] text-faint">Replies instantly · policy-aware</div>
              </div>
              <button className="ml-auto text-dim hover:text-ink" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[0.85rem] leading-snug ${
                    m.from === "you" ? "bg-gradient-to-br from-violet to-cyan text-black" : "border border-line bg-white/[0.04] text-ink"
                  }`}>{m.text}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 px-3 pb-1">
              {["Response times?", "Status of TKT-1042", "How to raise?"].map((q) => (
                <button key={q} className="rounded-full border border-line px-2.5 py-1 text-[0.7rem] text-dim hover:border-violet hover:text-ink"
                  onClick={() => { setMsgs((m) => [...m, { from: "you", text: q }, { from: "bot", text: answer(q, tickets) }]); }}>{q}</button>
              ))}
            </div>

            <div className="flex gap-2 border-t border-line p-3">
              <input className="flex-1" placeholder="Ask about a ticket or policy…" value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
              <button className="btn btn-primary" onClick={send}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-cyan px-4 py-2.5 font-bold text-black shadow-[0_10px_30px_-8px_#00e599aa] transition-transform hover:-translate-y-0.5"
      >
        <span>✦</span> {open ? "Close" : "Ask the assistant"}
      </button>
    </div>
  );
}
