"use client";

import dynamic from "next/dynamic";

/*
  Real 3D perfume bottle (three.js / react-three-fiber): drag to rotate from
  every side, auto-rotating, studio-lit glass + amber juice + gold collar.
  Loaded client-only (WebGL) with an elegant fallback while it boots.

  To use a hand-made model instead, export a .glb from Blender/Spline into
  /public and load it with drei's useGLTF inside BottleCanvas — nothing else
  in the layout changes.
*/
const BottleCanvas = dynamic(() => import("./BottleCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[460px] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-goldBright" />
        <p className="text-[0.62rem] uppercase tracking-luxe text-muted">Preparing the showcase…</p>
      </div>
    </div>
  ),
});

export default function Bottle3D() {
  return (
    <div className="relative min-h-[460px] cursor-grab active:cursor-grabbing md:min-h-[520px]">
      <BottleCanvas />
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[0.62rem] uppercase tracking-luxe text-muted">
        Drag to rotate · every side
      </p>
    </div>
  );
}
