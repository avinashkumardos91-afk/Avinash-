"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  STATUSES, PRIORITIES, CATEGORIES, REGIONS, LANGUAGES, REGION_TZ,
  PRIORITY_HEX, STATUS_HEX, nextActions, type Ticket,
} from "@/lib/types";
import { timeAgo, fmt, fmtTz, clientNow, isOpen } from "@/lib/format";
import NeonHero from "@/components/NeonHero";

const TicketCanvas = dynamic(() => import("@/components/TicketCanvas"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-faint text-sm">Preparing the 3D pipeline…</div>,
});

type Filters = { status: string; priority: string; category: string; owner: string; region: string; language: string; q: string };
const EMPTY: Filters = { status: "", priority: "", category: "", owner: "", region: "", language: "", q: "" };

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [agent, setAgent] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [entered, setEntered] = useState(false);

  useEffect(() => { setAgent(localStorage.getItem("tk.agent") || ""); }, []);
  useEffect(() => { localStorage.setItem("tk.agent", agent); }, [agent]);

  async function load() {
    const r = await fetch("/api/tickets"); setTickets(await r.json()); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function flash(m: string) { setToast(m); clearTimeout((flash as any)._t); (flash as any)._t = setTimeout(() => setToast(""), 1900); }
  function replace(t: Ticket) { setTickets((prev) => prev.map((x) => (x.id === t.id ? t : x))); }

  async function patch(id: string, body: Record<string, unknown>) {
    const r = await fetch(`/api/tickets/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) { replace(await r.json()); }
  }
  async function note(id: string, text: string) {
    const r = await fetch(`/api/tickets/${id}/activity`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    if (r.ok) replace(await r.json());
  }

  const owners = useMemo(() => Array.from(new Set(tickets.map((t) => t.owner).filter(Boolean))) as string[], [tickets]);

  const filterActive = Object.values(filters).some(Boolean);
  const passes = (t: Ticket) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.owner && (t.owner || "Unassigned") !== filters.owner) return false;
    if (filters.region && t.region !== filters.region) return false;
    if (filters.language && t.language !== filters.language) return false;
    if (filters.q) { const h = `${t.ref} ${t.title} ${t.description} ${t.requester} ${t.owner || ""}`.toLowerCase(); if (!h.includes(filters.q.toLowerCase())) return false; }
    return true;
  };
  const activeIds = useMemo(() => (filterActive ? new Set(tickets.filter(passes).map((t) => t.id)) : null), [tickets, filters]);

  // dashboard — the four questions
  const open = tickets.filter((t) => isOpen(t.status));
  const urgent = open.filter((t) => t.priority === "Urgent").length;
  const unassigned = open.filter((t) => !t.owner).length;
  const oldest = open.length ? timeAgo(open.reduce((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? a : b)).createdAt) : "—";

  const sel = tickets.find((t) => t.id === selected) || null;

  const sel3 = "min-w-[120px]";
  const setF = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v }));

  if (!entered) return <NeonHero onEnter={() => setEntered(true)} />;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-bg text-ink">
      {/* 3D pipeline behind everything */}
      <div className="absolute inset-0">
        {!loading && <TicketCanvas tickets={tickets} activeIds={activeIds} onOpen={setSelected} />}
      </div>

      {/* top bar */}
      <header className="glass absolute inset-x-0 top-0 z-20 flex flex-wrap items-center gap-3 px-4 py-2.5 md:px-6">
        <div className="flex items-center gap-2 font-display font-extrabold">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-violet to-cyan text-[0.7rem] text-black">T</span>
          Ticketing <span className="text-faint text-sm">· 3D</span>
        </div>
        <input className="w-40 md:w-56" placeholder="Search tickets…" value={filters.q} onChange={(e) => setF("q", e.target.value)} />
        <div className="ml-auto flex items-center gap-2">
          <label className="hidden items-center gap-1 text-xs text-faint sm:flex">You are
            <input className="w-28" placeholder="agent name" value={agent} onChange={(e) => setAgent(e.target.value)} />
          </label>
          <button className="btn btn-primary" onClick={() => setRaiseOpen(true)}>+ Raise</button>
        </div>
      </header>

      {/* stats + filters */}
      <div className="glass absolute inset-x-0 top-[52px] z-10 flex flex-wrap items-center gap-2 px-4 py-2 md:px-6">
        {[
          { b: open.length, s: "Open", c: "text-ink" },
          { b: urgent, s: "Urgent", c: urgent ? "text-urgent" : "text-ink" },
          { b: unassigned, s: "Unassigned", c: unassigned ? "text-high" : "text-ink" },
          { b: oldest, s: "Oldest open", c: "text-ink" },
        ].map((t) => (
          <div key={t.s} className="rounded-lg border border-line bg-surface px-3 py-1">
            <span className={`font-display text-lg font-extrabold ${t.c}`}>{t.b}</span>
            <span className="ml-2 text-[0.62rem] uppercase tracking-wider text-dim">{t.s}</span>
          </div>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select className={sel3} value={filters.status} onChange={(e) => setF("status", e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={sel3} value={filters.priority} onChange={(e) => setF("priority", e.target.value)}><option value="">All priorities</option>{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={sel3} value={filters.region} onChange={(e) => setF("region", e.target.value)}><option value="">All regions</option>{REGIONS.map((r) => <option key={r.name}>{r.name}</option>)}</select>
          <select className={sel3} value={filters.owner} onChange={(e) => setF("owner", e.target.value)}><option value="">All owners</option><option>Unassigned</option>{owners.map((o) => <option key={o}>{o}</option>)}</select>
          {filterActive && <button className="btn" onClick={() => setFilters(EMPTY)}>Clear</button>}
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-[0.66rem] uppercase tracking-[0.2em] text-faint">
        Drag to orbit · scroll to zoom · click a ticket
      </p>

      {/* ---------- TICKET MODAL ---------- */}
      <AnimatePresence>
        {sel && (
          <motion.div className="absolute inset-0 z-40 grid place-items-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div className="glass relative max-h-[86vh] w-[min(660px,100%)] overflow-y-auto rounded-2xl"
              initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, opacity: 0 }}>
              <TicketDetail t={sel} agent={agent}
                onAction={async (to) => { await patch(sel.id, { status: to, owner: agent || undefined }); flash(sel.ref + " → " + to); }}
                onOwner={async (o) => { await patch(sel.id, { owner: o }); }}
                onPriority={async (p) => { await patch(sel.id, { priority: p }); }}
                onNote={async (n) => { await note(sel.id, n); }}
                onClose={() => setSelected(null)} owners={owners} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- RAISE DRAWER ---------- */}
      <AnimatePresence>
        {raiseOpen && (
          <motion.div className="absolute inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setRaiseOpen(false)} />
            <motion.aside className="glass absolute right-0 top-0 h-full w-[min(420px,100%)] overflow-y-auto p-6"
              initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40, opacity: 0 }}>
              <RaiseForm onClose={() => setRaiseOpen(false)} onCreated={(t) => { setTickets((p) => [t, ...p]); flash(t.ref + " raised"); setRaiseOpen(false); }} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="glass absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-2 text-sm"
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------- ticket detail ---------------- */
function TicketDetail({ t, agent, owners, onAction, onOwner, onPriority, onNote, onClose }: {
  t: Ticket; agent: string; owners: string[];
  onAction: (to: string) => void; onOwner: (o: string) => void; onPriority: (p: string) => void; onNote: (n: string) => void; onClose: () => void;
}) {
  const [noteText, setNoteText] = useState("");
  const tz = REGION_TZ[t.region]; const cn = tz ? clientNow(tz) : null;
  return (
    <div className="p-6">
      <button className="absolute right-4 top-4 rounded-lg border border-line px-2 py-1 text-dim hover:text-ink" onClick={onClose}>✕</button>
      <div className="text-xs font-bold text-faint">{t.ref} · raised by {t.requester} · {fmt(t.createdAt)}</div>
      <h2 className="mt-1 font-display text-2xl font-bold">{t.title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="pill" style={{ color: PRIORITY_HEX[t.priority], borderColor: PRIORITY_HEX[t.priority] + "66" }}>{t.priority}</span>
        <span className="pill">{t.category}</span>
        <span className="pill" style={{ color: STATUS_HEX[t.status], borderColor: STATUS_HEX[t.status] + "66" }}>{t.status}</span>
        <span className="pill">{t.owner ? "👤 " + t.owner : "unassigned"}</span>
        <span className="pill">🌐 {t.region}</span>
        <span className="pill">🗣 {t.language}</span>
      </div>
      {tz && (
        <div className="mt-2 text-xs text-dim">
          Client local time <b className="text-ink">{cn ? cn.time : "—"}</b>{" "}
          {cn && <span style={{ color: cn.business ? "#3fe0a0" : "#ffab5e" }}>· {cn.business ? "business hours" : "outside client hours"}</span>}
          {" "}· raised {fmtTz(t.createdAt, tz)} client time · open {timeAgo(t.createdAt)}
        </div>
      )}
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-dim">{t.description || "No description."}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {nextActions(t.status).map((a) => (
          <button key={a.label} className={a.tone === "go" ? "btn btn-primary" : "btn"} style={a.tone === "warn" ? { color: "#ffab5e" } : {}}
            onClick={() => onAction(a.to)}>{a.label}</button>
        ))}
        {nextActions(t.status).length === 0 && <span className="text-xs text-faint">Ticket is closed — reopen to act.</span>}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Owner
          <input list="owners" defaultValue={t.owner || ""} placeholder="assign someone" onBlur={(e) => e.target.value.trim() !== (t.owner || "") && onOwner(e.target.value.trim())} />
          <datalist id="owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
        </label>
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Priority
          <select defaultValue={t.priority} onChange={(e) => onPriority(e.target.value)}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <input className="flex-1" placeholder="Add a note…" value={noteText} onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && noteText.trim()) { onNote(noteText.trim()); setNoteText(""); } }} />
        <button className="btn" onClick={() => { if (noteText.trim()) { onNote(noteText.trim()); setNoteText(""); } }}>Add</button>
      </div>

      <div className="mt-5 text-[0.68rem] uppercase tracking-wider text-dim">Activity</div>
      <ul className="log mt-2">
        {t.activity.map((a) => (
          <li key={a.id}><div className="text-sm">{a.text}</div><div className="text-xs text-faint">{fmt(a.at)}</div></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- raise form ---------------- */
function RaiseForm({ onClose, onCreated }: { onClose: () => void; onCreated: (t: Ticket) => void }) {
  const [f, setF] = useState({ title: "", requester: "", category: CATEGORIES[0], priority: "Normal", region: "Europe", language: "English", description: "" });
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim() || !f.requester.trim()) { setErr("Title and your name are required."); return; }
    const r = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) onCreated(await r.json()); else setErr("Could not create ticket.");
  }
  const field = "w-full";
  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Raise a ticket</h2>
        <button type="button" className="text-dim hover:text-ink" onClick={onClose}>✕</button>
      </div>
      <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Title *
        <input className={field} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Short summary" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Your name *<input value={f.requester} onChange={(e) => set("requester", e.target.value)} /></label>
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Category<select value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Region<select value={f.region} onChange={(e) => set("region", e.target.value)}>{REGIONS.map((r) => <option key={r.name}>{r.name}</option>)}</select></label>
        <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Language<select value={f.language} onChange={(e) => set("language", e.target.value)}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></label>
      </div>
      <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Priority<select value={f.priority} onChange={(e) => set("priority", e.target.value)}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></label>
      <label className="grid gap-1 text-[0.66rem] uppercase tracking-wider text-faint">Description<textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="What went wrong?" /></label>
      <button className="btn btn-primary" type="submit">Submit ticket</button>
      {err && <p className="text-xs text-urgent">{err}</p>}
    </form>
  );
}
