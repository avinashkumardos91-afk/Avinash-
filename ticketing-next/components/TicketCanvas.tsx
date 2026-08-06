"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import TicketCard3D from "./TicketCard3D";
import { STATUSES, STATUS_HEX, type Ticket } from "@/lib/types";

const LANE_GAP = 3.5, TOP_Y = 1.7, CARD_GAP = 1.72;

function LaneLabel({ status, count, x }: { status: string; count: number; x: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 360; c.height = 96;
    const g = c.getContext("2d")!;
    const col = STATUS_HEX[status] || "#7f89a8";
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = col; g.font = "700 30px Inter, Arial"; g.textBaseline = "middle";
    g.fillText(status.toUpperCase(), 8, 48);
    // count pill
    const label = String(count);
    g.font = "700 26px Inter, Arial";
    const tw = g.measureText(label).width + 26;
    const px = 8 + g.measureText(status.toUpperCase()).width + 18;
    g.fillStyle = "rgba(255,255,255,0.10)";
    g.beginPath(); g.roundRect(px, 26, tw, 44, 12); g.fill();
    g.fillStyle = "#eef1fb"; g.fillText(label, px + 13, 49);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
  }, [status, count]);
  return (
    <mesh position={[x, TOP_Y + 1.35, 0]}>
      <planeGeometry args={[3.0, 0.8]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

export default function TicketCanvas({
  tickets, activeIds, onOpen,
}: {
  tickets: Ticket[];
  activeIds: Set<string> | null;
  onOpen: (id: string) => void;
}) {
  // group by status → lanes
  const lanes = useMemo(() => STATUSES.map((s) => tickets.filter((t) => t.status === s)), [tickets]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.2, 13.5], fov: 42 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#08090a"]} />
      <fog attach="fog" args={["#08090a", 16, 34]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-8, 3, 4]} intensity={0.7} color="#00e599" />
      <pointLight position={[8, -2, 6]} intensity={0.6} color="#22d3ee" />

      {STATUSES.map((status, li) => {
        const x = (li - (STATUSES.length - 1) / 2) * LANE_GAP;
        return (
          <group key={status}>
            <LaneLabel status={status} count={lanes[li].length} x={x} />
            {lanes[li].map((t, i) => (
              <TicketCard3D
                key={t.id}
                ticket={t}
                position={[x, TOP_Y - i * CARD_GAP, 0]}
                onOpen={onOpen}
                dim={activeIds ? !activeIds.has(t.id) : false}
              />
            ))}
          </group>
        );
      })}

      <Grid
        position={[0, -6.5, 0]}
        args={[40, 40]}
        cellSize={1.4}
        cellColor="#10241d"
        sectionSize={7}
        sectionColor="#134e3a"
        fadeDistance={38}
        fadeStrength={1.5}
        infiniteGrid
      />

      <OrbitControls
        enablePan
        enableDamping
        dampingFactor={0.08}
        target={[0, -0.6, 0]}
        minDistance={6}
        maxDistance={26}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
