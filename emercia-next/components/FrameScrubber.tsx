"use client";

import { useEffect, useRef } from "react";

/*
  Apple-style scroll-scrubbed image sequence.

  Draws a numbered frame sequence to a <canvas>. The frame shown is driven by
  the element's scroll position (scroll down → play forward, up → backward),
  with a gentle idle auto-rotation so the showcase always feels alive.

  Frames live in /public/<dir>/<prefix>0001.<ext> … padded to `pad` digits.
  Produce them with an AI clip (Veo/Whisk) or a turntable shoot, then extract
  to stills (e.g. EZGif) and drop them in. See the README pipeline.
*/
export type FrameScrubberProps = {
  dir?: string;        // public subfolder, e.g. "bottle"
  prefix?: string;     // filename prefix, e.g. "frame_"
  ext?: string;        // "webp" | "jpg" | "png"
  count?: number;      // number of frames
  pad?: number;        // zero-padding width
};

export default function FrameScrubber({
  dir = "bottle",
  prefix = "frame_",
  ext = "webp",
  count = 120,
  pad = 4,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const src = (i: number) =>
      `/${dir}/${prefix}${String(i + 1).padStart(pad, "0")}.${ext}`;

    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.src = src(i);
      frames[i] = img;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let auto = 0;
    let shown = -1;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      shown = -1; // force redraw
    };

    const drawCover = (img: HTMLImageElement) => {
      if (!img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const scrollProgress = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the element's top hits mid-viewport, 1 after ~1.4 viewports of scroll
      const p = (vh * 0.5 - r.top) / (r.height + vh * 0.9);
      return Math.max(0, Math.min(1, p));
    };

    const tick = () => {
      auto = (auto + (reduce ? 0 : 0.18)) % count;
      const idx = Math.floor((auto + scrollProgress() * count) % count);
      if (idx !== shown) {
        drawCover(frames[idx]);
        shown = idx;
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    // draw the first frame as soon as it loads, then start the loop
    if (frames[0].complete) drawCover(frames[0]);
    else frames[0].onload = () => drawCover(frames[0]);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dir, prefix, ext, count, pad]);

  return (
    <div ref={wrapRef} className="relative min-h-[460px] md:min-h-[520px]">
      <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[0.62rem] uppercase tracking-luxe text-muted">
        Scroll to rotate
      </p>
    </div>
  );
}
