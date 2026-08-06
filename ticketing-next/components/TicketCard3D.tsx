"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PRIORITY_HEX, STATUS_HEX, type Ticket } from "@/lib/types";
import { timeAgo } from "@/lib/format";

const W = 2.3, H = 1.35, D = 0.16;

/* Draw the ticket face (ref, title, status/owner, region) to a canvas texture. */
function useFace(t: Ticket) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 520; c.height = 305;
    const g = c.getContext("2d")!;
    const pri = PRIORITY_HEX[t.priority] || "#6ea8fe";
    const st = STATUS_HEX[t.status] || "#7f89a8";
    // card background
    g.fillStyle = "#12141f"; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "rgba(255,255,255,0.03)"; g.fillRect(0, 0, c.width, c.height);
    // priority stripe
    g.fillStyle = pri; g.fillRect(0, 0, 12, c.height);
    // header row
    g.fillStyle = "#6b7395"; g.font = "600 22px Inter, Arial"; g.textBaseline = "top";
    g.fillText(t.ref, 34, 26);
    g.fillStyle = pri; g.font = "700 20px Inter, Arial";
    g.textAlign = "right"; g.fillText(t.priority.toUpperCase(), c.width - 26, 27); g.textAlign = "left";
    // title (wrap to 2 lines)
    g.fillStyle = "#eef1fb"; g.font = "600 30px Inter, Arial";
    const words = t.title.split(" "); let line = "", y = 74; let lines = 0;
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (g.measureText(test).width > c.width - 60 && line) {
        g.fillText(line, 34, y); y += 38; line = w; lines++;
        if (lines === 1) { line = line.length > 26 ? line.slice(0, 25) + "…" : line; }
        if (lines >= 2) { line = ""; break; }
      } else line = test;
    }
    if (line && lines < 2) g.fillText(line, 34, y);
    // footer: status • owner • region
    g.font = "600 19px Inter, Arial";
    g.fillStyle = st; g.fillText("● " + t.status, 34, c.height - 78);
    g.fillStyle = "#9aa3c4"; g.font = "400 19px Inter, Arial";
    g.fillText(t.owner ? "👤 " + t.owner : "unassigned", 34, c.height - 50);
    g.fillStyle = "#6b7395";
    g.fillText("🌐 " + t.region + "  ·  " + timeAgo(t.createdAt), 34, c.height - 26);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }, [t.ref, t.title, t.priority, t.status, t.owner, t.region, t.createdAt]);
}

export default function TicketCard3D({
  ticket, position, onOpen, dim,
}: {
  ticket: Ticket;
  position: [number, number, number];
  onOpen: (id: string) => void;
  dim?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const face = useFace(ticket);
  const pri = PRIORITY_HEX[ticket.priority] || "#6ea8fe";
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const floatY = Math.sin(t * 0.9 + seed) * 0.06;
    const targetY = position[1] + floatY + (hovered ? 0.4 : 0);
    g.position.y += (targetY - g.position.y) * 0.12;
    const s = hovered ? 1.09 : 1;
    g.scale.x += (s - g.scale.x) * 0.15;
    g.scale.y += (s - g.scale.y) * 0.15;
    g.scale.z += (s - g.scale.z) * 0.15;
    const rx = hovered ? -state.pointer.y * 0.32 : 0;
    const ry = hovered ? state.pointer.x * 0.32 : 0;
    g.rotation.x += (rx - g.rotation.x) * 0.1;
    g.rotation.y += (ry - g.rotation.y) * 0.1;
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; };
  const out = () => { setHovered(false); document.body.style.cursor = "auto"; };

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => { e.stopPropagation(); onOpen(ticket.id); }}
    >
      {/* glow backing (priority colour) */}
      <RoundedBox args={[W + 0.09, H + 0.09, D * 0.6]} radius={0.09} smoothness={4} position={[0, 0, -0.05]}>
        <meshStandardMaterial color={pri} emissive={pri} emissiveIntensity={hovered ? 0.9 : 0.45} toneMapped={false} transparent opacity={dim ? 0.25 : 0.9} />
      </RoundedBox>
      {/* card body with the face texture */}
      <RoundedBox args={[W, H, D]} radius={0.08} smoothness={5} castShadow>
        <meshStandardMaterial map={face} roughness={0.55} metalness={0.12} transparent opacity={dim ? 0.35 : 1} />
      </RoundedBox>
    </group>
  );
}
