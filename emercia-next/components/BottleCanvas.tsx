"use client";

import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/* Gold "E · EMERCIA" label drawn to a canvas → texture (no external font). */
function useLabelTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 384;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#e6cd8b";
    ctx.textAlign = "center";
    ctx.font = "300 150px Georgia, 'Times New Roman', serif";
    ctx.fillText("E", c.width / 2, 210);
    ctx.font = "500 26px Georgia, serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("EMERCIA", c.width / 2, 268);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function Bottle() {
  const label = useLabelTexture();
  const glass = useRef<THREE.Mesh>(null);

  return (
    <group scale={1.15}>
      {/* glass body */}
      <RoundedBox ref={glass} args={[1.55, 2.2, 0.72]} radius={0.2} smoothness={8} castShadow>
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.4}
          roughness={0.06}
          ior={1.46}
          clearcoat={1}
          clearcoatRoughness={0.12}
          color="#f2ecdf"
          attenuationColor="#c9a54e"
          attenuationDistance={2.4}
          transparent
        />
      </RoundedBox>

      {/* amber juice, sitting in the lower two-thirds */}
      <RoundedBox args={[1.4, 1.35, 0.58]} radius={0.16} smoothness={6} position={[0, -0.4, 0]}>
        <meshPhysicalMaterial color="#b5763a" transmission={0.55} roughness={0.28} ior={1.36} thickness={2} attenuationColor="#7a3f18" attenuationDistance={0.8} transparent />
      </RoundedBox>

      {/* front label */}
      <mesh position={[0, 0.15, 0.372]}>
        <planeGeometry args={[1.05, 1.55]} />
        <meshBasicMaterial map={label} transparent opacity={0.92} />
      </mesh>

      {/* gold collar */}
      <mesh position={[0, 1.24, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.44, 0.2, 48]} />
        <meshStandardMaterial color="#e6cd8b" metalness={1} roughness={0.22} />
      </mesh>

      {/* cap */}
      <RoundedBox args={[0.74, 0.66, 0.56]} radius={0.1} smoothness={5} position={[0, 1.66, 0]} castShadow>
        <meshStandardMaterial color="#17120f" metalness={0.7} roughness={0.35} />
      </RoundedBox>
    </group>
  );
}

export default function BottleCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.4], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow />
      <directionalLight position={[-6, 2, -3]} intensity={1.3} color="#e6cd8b" />

      {/* in-scene environment (no external HDR fetch) for glass + metal reflections */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 3, 3]} scale={[6, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-4, 1, -2]} scale={[5, 5, 1]} color="#e6cd8b" />
        <Lightformer intensity={1.1} position={[4, -1, 2]} scale={[5, 5, 1]} color="#b8798a" />
      </Environment>

      <Float speed={1.4} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.08, 0.12]}>
        <Bottle />
      </Float>

      <ContactShadows position={[0, -1.7, 0]} opacity={0.5} blur={2.8} scale={9} far={4} color="#000000" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={0.7}
        maxPolarAngle={2.3}
      />
    </Canvas>
  );
}
