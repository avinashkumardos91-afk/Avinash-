"use client";

import { useEffect } from "react";

/*
  Adds the `.js` class (so `.reveal` elements are hidden only when JS runs —
  no-JS renders them visible), then reveals each on scroll into view.
*/
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14 }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 3, 2) * 0.08}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
