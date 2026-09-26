"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Materials                                                            */

function useMaterials() {
  return useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#16161b", metalness: 0.85, roughness: 0.38 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#0d0d10", metalness: 0.2, roughness: 0.85 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#d9dce4", metalness: 1, roughness: 0.12 }),
      violet: new THREE.MeshStandardMaterial({ color: "#8b6cff", emissive: "#8b6cff", emissiveIntensity: 2.2, toneMapped: false }),
      inner: new THREE.MeshStandardMaterial({ color: "#050507", metalness: 0.3, roughness: 0.9, side: THREE.BackSide }),
      blades: ["#23232b", "#2d2d38", "#1c1c23"].map(
        (color) => new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.45, envMapIntensity: 0.35, side: THREE.DoubleSide }),
      ),
      core: new THREE.MeshBasicMaterial({ color: "#8b6cff", toneMapped: false }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0,
        roughness: 0.03,
        transmission: 1,
        thickness: 0.6,
        ior: 1.52,
        iridescence: 0.55,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [180, 520],
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 0.7,
        transparent: true,
        opacity: 0.9,
      }),
      tick: new THREE.MeshStandardMaterial({ color: "#f4f4f6", emissive: "#f4f4f6", emissiveIntensity: 0.4 }),
    }),
    [],
  );
}

/* ------------------------------------------------------------------ */
/* Ring of small boxes (knurling / grip ridges / distance ticks)        */

function RidgeRing({ count, radius, y, size, material }: { count: number; radius: number; y: number; size: [number, number, number]; material: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      m.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      m.rotation.set(0, -a, 0);
      m.updateMatrix();
      ref.current!.setMatrixAt(i, m.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [count, radius, y]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} material={material}>
      <boxGeometry args={size} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Aperture: 9 blades. Each blade is the slice of the tube's disc beyond  */
/* a chord at distance r from the centre; together their straight edges   */
/* form the 9-sided opening, whose apothem r grows as the lens opens.      */

const BLADES = 9;
const TUBE_R = 0.87;
const ARC_STEPS = 24;

/** Writes a triangle fan for the circular segment x > r of a disc of radius R. */
function writeSegment(pos: Float32Array, r: number, R: number) {
  const a = Math.acos(THREE.MathUtils.clamp(r / R, -1, 1));
  let o = 0;
  for (let k = 0; k < ARC_STEPS; k++) {
    const t0 = -a + (2 * a * k) / ARC_STEPS;
    const t1 = -a + (2 * a * (k + 1)) / ARC_STEPS;
    pos.set([r, 0, 0, R * Math.cos(t0), R * Math.sin(t0), 0, R * Math.cos(t1), R * Math.sin(t1), 0], o);
    o += 9;
  }
}

function Iris({ progress, materials }: { progress: MotionValue<number>; materials: THREE.Material[] }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(ARC_STEPS * 9);
    writeSegment(pos, 0.05, TUBE_R);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(ARC_STEPS * 9).map((_, i) => (i % 3 === 2 ? 1 : 0)), 3));
    return g;
  }, []);
  const spin = useRef<THREE.Group>(null);
  const last = useRef(-1);

  useFrame(() => {
    // Closed (f/16) → wide open (f/1.4) across the first 70% of the section
    const p = THREE.MathUtils.clamp(progress.get() / 0.7, 0, 1);
    const eased = p * p * (3 - 2 * p);
    const r = THREE.MathUtils.lerp(0.07, 0.8, eased);
    if (Math.abs(r - last.current) > 0.001) {
      const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
      writeSegment(attr.array as Float32Array, r, TUBE_R);
      attr.needsUpdate = true;
      geometry.computeBoundingSphere();
      last.current = r;
    }
    // Real irises rotate slightly as they open
    if (spin.current) spin.current.rotation.z = eased * 0.9;
  });

  return (
    <group ref={spin}>
      {Array.from({ length: BLADES }, (_, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={materials[i % materials.length]}
          rotation={[0, 0, (i / BLADES) * Math.PI * 2]}
          position={[0, 0, i * 0.003]}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Lens assembly (optical axis = local +Y, rotated to face the camera)  */

function Lens({ progress }: { progress: MotionValue<number> }) {
  const mat = useMaterials();
  const root = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const p = progress.get();
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, state.pointer.x, 3, delta);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, state.pointer.y, 3, delta);
    const t = state.clock.elapsedTime;
    // Starts in 3/4 profile, turns to face the viewer as the iris opens
    g.rotation.y = THREE.MathUtils.lerp(-1.05, -0.12, Math.min(p / 0.75, 1)) + pointer.current.x * 0.25;
    g.rotation.x = THREE.MathUtils.lerp(0.35, 0.06, Math.min(p / 0.75, 1)) - pointer.current.y * 0.18;
    g.position.y = Math.sin(t * 0.8) * 0.06;
    g.rotation.z = Math.sin(t * 0.5) * 0.02;
  });

  const glassTheta = Math.asin(0.84 / 1.6);

  return (
    <group ref={root}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Rear mount + body */}
        <mesh position={[0, -1.35, 0]} material={mat.chrome}><cylinderGeometry args={[0.92, 0.92, 0.14, 96]} /></mesh>
        <mesh position={[0, -1.02, 0]} material={mat.body}><cylinderGeometry args={[1.0, 0.98, 0.52, 96]} /></mesh>
        {/* Rings below are open tubes: end caps would sit in front of the iris */}
        {/* Aperture ring with grip */}
        <mesh position={[0, -0.6, 0]} material={mat.body}><cylinderGeometry args={[1.03, 1.03, 0.3, 96, 1, true]} /></mesh>
        <RidgeRing count={36} radius={1.035} y={-0.6} size={[0.05, 0.22, 0.03]} material={mat.rubber} />
        <mesh position={[0, -0.42, 0]} material={mat.chrome}><cylinderGeometry args={[1.045, 1.045, 0.035, 96, 1, true]} /></mesh>
        <RidgeRing count={24} radius={1.05} y={-0.34} size={[0.012, 0.06, 0.01]} material={mat.tick} />
        {/* Focus ring (knurled rubber) */}
        <mesh position={[0, 0.02, 0]} material={mat.rubber}><cylinderGeometry args={[1.07, 1.07, 0.66, 96, 1, true]} /></mesh>
        <RidgeRing count={110} radius={1.075} y={0.02} size={[0.028, 0.6, 0.035]} material={mat.rubber} />
        {/* Signature violet ring */}
        <mesh position={[0, 0.4, 0]} material={mat.violet}><cylinderGeometry args={[1.095, 1.095, 0.035, 96, 1, true]} /></mesh>
        {/* Front barrel (open tube) + lip */}
        <mesh position={[0, 0.72, 0]} material={mat.body}><cylinderGeometry args={[1.14, 1.1, 0.6, 96, 1, true]} /></mesh>
        <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat.body}><ringGeometry args={[0.86, 1.14, 96]} /></mesh>
        <mesh position={[0, 1.021, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat.chrome}><ringGeometry args={[0.86, 0.9, 96]} /></mesh>
        {/* Dark inner tube */}
        <mesh position={[0, 0.55, 0]} material={mat.inner}><cylinderGeometry args={[0.87, 0.87, 1.0, 64, 1, true]} /></mesh>
        {/* Violet glow behind the iris: the aperture opening reads as light */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat.core}><circleGeometry args={[0.86, 64]} /></mesh>
        <pointLight position={[0, 0.9, 0]} intensity={1.5} distance={2} color="#c8cbd4" />
        {/* Iris sits inside the tube, facing forward */}
        <group position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Iris progress={progress} materials={mat.blades} />
        </group>
        {/* Front element: coated glass dome */}
        <mesh position={[0, 1.02 - 1.6 * Math.cos(glassTheta), 0]} material={mat.glass}>
          <sphereGeometry args={[1.6, 96, 32, 0, Math.PI * 2, 0, glassTheta]} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    // Seeded PRNG keeps the dust layout stable across renders
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3 + rand() * 5;
      const a = rand() * Math.PI * 2;
      const b = Math.acos(2 * rand() - 1);
      pos.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) * 0.6, r * Math.cos(b) - 2], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.02;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.025} color="#b9a6ff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function LensScene({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-3, -1, 2]} intensity={12} color="#8b6cff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={4} color="#8b6cff" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#c8cbd4" position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Lens progress={progress} />
      <Dust />
    </Canvas>
  );
}
