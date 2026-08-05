"use client";

import { useEffect, useState } from "react";
import Bottle3D from "./Bottle3D";
import FrameScrubber, { type FrameScrubberProps } from "./FrameScrubber";

/*
  Chooses the hero showcase:

  · If a cinematic frame sequence exists in /public/bottle/ (the Apple-style
    scroll-scrubbed technique), use FrameScrubber.
  · Otherwise fall back to the live react-three-fiber 3D bottle, so the hero
    always shows a rotating product.

  ── To switch to the cinematic sequence ──
  1. Generate a 360° / exploded clip (Veo, Whisk, Midjourney video) or shoot a
     turntable, then extract frames (e.g. EZGif) to WEBP/JPG.
  2. Drop them in  public/bottle/  as  frame_0001.webp … frame_0120.webp
  3. Set `count` (and prefix/ext/pad) below to match. Done — it activates
     automatically and the 3D fallback is no longer used.
*/
const FRAMES: Required<FrameScrubberProps> = {
  dir: "bottle",
  prefix: "frame_",
  ext: "webp",
  count: 120,
  pad: 4,
};

export default function HeroBottle() {
  const [mode, setMode] = useState<"probing" | "frames" | "webgl">("probing");

  useEffect(() => {
    const img = new Image();
    img.onload = () => setMode("frames");
    img.onerror = () => setMode("webgl");
    img.src = `/${FRAMES.dir}/${FRAMES.prefix}${"1".padStart(FRAMES.pad, "0")}.${FRAMES.ext}`;
  }, []);

  if (mode === "frames") return <FrameScrubber {...FRAMES} />;
  if (mode === "webgl") return <Bottle3D />;

  // brief probe state — keep layout height stable
  return <div className="min-h-[460px] md:min-h-[520px]" />;
}
