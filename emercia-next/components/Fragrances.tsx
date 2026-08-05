"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FILTERS, type Category, type Fragrance } from "@/lib/products";

export default function Fragrances({ products }: { products: Fragrance[] }) {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter, products]
  );

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.line} ${p.notes}`.toLowerCase().includes(q));
  }, [query, products]);

  // open on nav event, '/' and Cmd/Ctrl+K
  useEffect(() => {
    const open = () => setSearchOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if (!searchOpen && !typing && (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"))) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (searchOpen && e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("emercia:search", open as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("emercia:search", open as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setCursor(0);
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (!finePointer) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `translateY(-4px) rotateX(${((0.5 - py) * 9).toFixed(2)}deg) rotateY(${((px - 0.5) * 11).toFixed(2)}deg)`;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  const gotoResult = (p: Fragrance) => {
    setSearchOpen(false);
    setFilter("all");
    setTimeout(() => {
      const el = document.getElementById(`frag-${p.id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("is-flash");
      void el.offsetWidth;
      el.classList.add("is-flash");
    }, 60);
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => (c + 1) % Math.max(results.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[cursor]) gotoResult(results[cursor]); }
    else if (e.key === "Escape") { setSearchOpen(false); }
  };

  return (
    <section className="relative py-[clamp(5rem,12vh,9rem)]" id="collections">
      <div className="mx-auto w-[min(1180px,100%-3rem)]">
        <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The Fragrances</p>
            <hr className="rule" />
            <h2 className="lead-h2">A wardrobe of <em>scent</em>.</h2>
          </div>
          <p className="measure">Eau de parfum, everyday deodorants and layering mists — for him, for her, for both.</p>
        </div>

        {/* filters */}
        <div className="reveal mb-10 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-[1.1rem] py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                filter === f.value
                  ? "border-gold bg-gold font-medium text-noir"
                  : "border-line text-ivoryDim hover:border-gold hover:text-ivory"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* grid */}
        <div className="grid gap-5 [perspective:1000px] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.id}
              id={`frag-${p.id}`}
              className="card reveal"
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              <div className="card__glare" />
              {p.tag && <span className="card__tag">{p.tag}</span>}
              <span className="card__index">{p.index}</span>
              <div className="card__body">
                <small>{p.line}</small>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                {p.price && <span className="card__price">{p.price}</span>}
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="py-8 font-serif text-[1.3rem] italic text-muted">No fragrances in this category yet.</p>
        )}
      </div>

      {/* search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] grid justify-items-center px-4 pt-[clamp(3rem,12vh,8rem)]">
          <div className="search__backdrop" onClick={() => setSearchOpen(false)} />
          <div className="search__panel" role="dialog" aria-modal="true" aria-label="Search fragrances">
            <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4 text-gold">
              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                onKeyDown={onSearchKey}
                placeholder="Search fragrances, notes, deodorants…"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-[1.1rem] text-ivory outline-none placeholder:text-muted"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-[0.72rem] uppercase tracking-[0.16em] text-muted">
                Esc
              </button>
            </div>

            <ul className="m-0 list-none overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-5 py-8 text-center font-serif text-[1.2rem] italic text-muted">
                  No fragrances match “{query}”.
                </li>
              ) : (
                results.map((p, n) => (
                  <li
                    key={p.id}
                    className={`search__result ${n === cursor ? "is-cursor" : ""}`}
                    onMouseEnter={() => setCursor(n)}
                    onClick={() => gotoResult(p)}
                  >
                    <div>
                      <div className="font-serif text-[1.25rem] text-ivory">{p.name}</div>
                      <div className="text-[0.72rem] uppercase tracking-[0.14em] text-gold">{p.line}</div>
                    </div>
                    <div className="ml-auto max-w-[46%] text-right text-[0.82rem] text-muted">{p.notes}</div>
                  </li>
                ))
              )}
            </ul>

            <div className="flex gap-6 border-t border-line-soft px-5 py-3 text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              <span>↑ ↓ navigate</span><span>Enter to open</span><span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
