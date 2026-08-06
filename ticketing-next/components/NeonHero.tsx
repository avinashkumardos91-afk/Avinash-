"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

/* Animated WebGL gradient — the neon.tech-style flowing glow, done as a
   full-screen fragment shader (the same technique those sites use). */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;

  // cheap flowing value noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float agv = uRes.x / uRes.y;
    vec2 p = uv; p.x *= agv;
    float t = uTime * 0.06;

    float n = noise(p * 2.2 + vec2(t, -t * 0.7));
    n += 0.5 * noise(p * 4.5 - vec2(t * 1.3, t));

    // moving light blobs
    float d1 = distance(uv, vec2(0.30 + 0.14 * sin(t * 2.0), 0.62 + 0.10 * cos(t * 1.6)));
    float d2 = distance(uv, vec2(0.74 + 0.10 * cos(t * 1.4), 0.36 + 0.14 * sin(t * 1.8)));
    float g1 = smoothstep(0.55, 0.0, d1);
    float g2 = smoothstep(0.62, 0.0, d2);

    vec3 base  = vec3(0.030, 0.036, 0.040);
    vec3 green = vec3(0.00, 0.90, 0.60);
    vec3 teal  = vec3(0.13, 0.83, 0.93);

    vec3 col = base;
    col += green * g1 * (0.55 + 0.25 * n);
    col += teal  * g2 * (0.40 + 0.20 * n);
    col += green * 0.06 * n;                 // ambient grain of colour
    col *= smoothstep(1.25, 0.15, distance(uv, vec2(0.5))); // vignette

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((s) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
      mat.current.uniforms.uRes.value.set(s.size.width, s.size.height);
    }
  });
  return (
    <ScreenQuad>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{ uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } }}
      />
    </ScreenQuad>
  );
}

export default function NeonHero({ onEnter }: { onEnter: () => void }) {
  const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-bg text-ink">
      <div className="absolute inset-0">
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <GradientPlane />
        </Canvas>
      </div>
      {/* soft dark gradient so text stays crisp */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 45%, transparent, #08090a 92%)" }} />
      {/* faint grid, neon/vercel style */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: "linear-gradient(#ffffff10 1px,transparent 1px),linear-gradient(90deg,#ffffff10 1px,transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent 80%)" }} />

      <motion.div
        className="relative z-10 grid h-full place-items-center px-6 text-center"
        initial="hidden" animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
      >
        <div className="max-w-3xl">
          <motion.span variants={item} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-dim backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_10px_#00e599]" /> Support &amp; Ticketing · 3D
          </motion.span>

          <motion.h1 variants={item} transition={{ duration: 0.8 }}
            className="mt-6 font-display text-[clamp(2.8rem,8vw,5.6rem)] font-extrabold leading-[0.98] tracking-tight">
            The ticket queue,<br /><span className="grad-text">rendered in 3D.</span>
          </motion.h1>

          <motion.p variants={item} transition={{ duration: 0.8 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dim">
            Every query, problem and bug flows through one live pipeline you can orbit, filter and
            resolve. Nothing forgotten — who owns it, how urgent, how long it&apos;s waited, at a glance.
          </motion.p>

          <motion.div variants={item} transition={{ duration: 0.8 }} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button onClick={onEnter}
              className="rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3 font-bold text-black shadow-[0_10px_40px_-8px_#00e599aa] transition-transform hover:-translate-y-0.5">
              Enter the console →
            </button>
            <span className="text-sm text-faint">Next.js · Prisma · three.js · Tailwind</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
