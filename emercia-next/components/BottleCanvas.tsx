"use client";

import { useMemo } from "react";
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

  return (
    <group scale={1.12} position={[0, -0.1, 0]}>
      {/* glass body — sleeker, taller flacon with crisper edges */}
      <RoundedBox args={[1.4, 2.55, 0.62]} radius={0.12} smoothness={10} castShadow>
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.6}
          roughness={0.035}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.08}
          color="#f4eee2"
          attenuationColor="#caa24d"
          attenuationDistance={3.2}
          specularIntensity={1}
          transparent
        />
      </RoundedBox>

      {/* amber juice filling the lower ~60% */}
      <RoundedBox args={[1.26, 1.42, 0.5]} radius={0.1} smoothness={8} position={[0, -0.5, 0]}>
        <meshPhysicalMaterial color="#a85f2b" transmission={0.5} roughness={0.22} ior={1.38} thickness={2.2} attenuationColor="#6b3512" attenuationDistance={0.7} transparent />
      </RoundedBox>

      {/* etched front label */}
      <mesh position={[0, 0.12, 0.318]}>
        <planeGeometry args={[0.98, 1.5]} />
        <meshBasicMaterial map={label} transparent opacity={0.9} />
      </mesh>

      {/* glass neck */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.2, 40]} />
        <meshPhysicalMaterial transmission={1} thickness={0.8} roughness={0.05} ior={1.5} color="#f4eee2" transparent />
      </mesh>

      {/* gold collar */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.16, 56]} />
        <meshStandardMaterial color="#e6cd8b" metalness={1} roughness={0.18} envMapIntensity={1.4} />
      </mesh>

      {/* cap — matte black with a gold rim */}
      <RoundedBox args={[0.66, 0.7, 0.5]} radius={0.08} smoothness={6} position={[0, 2.02, 0]} castShadow>
        <meshStandardMaterial color="#141010" metalness={0.55} roughness={0.42} />
      </RoundedBox>
      <mesh position={[0, 1.69, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 56]} />
        <meshStandardMaterial color="#e6cd8b" metalness={1} roughness={0.2} />
      </mesh>
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 8, 5]} intensity={2.4} color="#fff4e0" castShadow />
      <directionalLight position={[-6, 2, -3]} intensity={1.4} color="#e6cd8b" />
      <pointLight position={[0, -1, 4]} intensity={0.5} color="#b8798a" />

      {/* in-scene environment (no external HDR fetch) for glass + metal reflections */}
      <Environment resolution={512}>
        <Lightformer intensity={2.6} position={[0, 3.5, 3]} scale={[7, 7, 1]} color="#ffffff" />
        <Lightformer intensity={1.6} position={[-4, 1, -2]} scale={[5, 6, 1]} color="#e6cd8b" />
        <Lightformer intensity={1.2} position={[4, -1, 2]} scale={[5, 5, 1]} color="#b8798a" />
        <Lightformer intensity={1} position={[0, -3, -3]} scale={[6, 3, 1]} color="#caa24d" />
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
