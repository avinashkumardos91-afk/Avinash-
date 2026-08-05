"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#house", label: "The House" },
  { href: "#collections", label: "Fragrances" },
  { href: "#signature", label: "Signature" },
  { href: "#services", label: "Experience" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSearch = () => window.dispatchEvent(new CustomEvent("emercia:search"));

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-14 transition-all duration-300 ${
        stuck ? "py-4 border-b border-line bg-noir/90 backdrop-blur-md" : "py-6 border-b border-transparent"
      }`}
    >
      <a href="#top" className="font-serif text-[1.4rem] uppercase tracking-[0.28em]">
        Emercia<b className="font-medium text-gold"> Decor</b>
      </a>

      <div className="flex items-center gap-9">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="hidden md:inline text-[0.76rem] uppercase tracking-[0.22em] text-ivoryDim transition-colors hover:text-ivory">
            {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search fragrances"
          className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[0.66rem] uppercase tracking-[0.16em] text-ivoryDim transition-colors hover:border-gold hover:text-ivory"
        >
          <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="hidden md:inline">Search</span>
        </button>
        <a href="#enquire" className="rounded-sm border border-line px-5 py-2.5 text-[0.76rem] uppercase tracking-[0.22em] text-goldBright transition-colors hover:bg-gold/10">
          Enquire
        </a>
      </div>
    </nav>
  );
}
