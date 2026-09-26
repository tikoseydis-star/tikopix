"use client";

import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Img } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Velvet curtain: a finely segmented plane whose vertical folds sway,  */
/* shaded with a physical "sheen" (fabric) material.                    */

const VELVET = {
  color: "#2a0b3d",
  sheenColor: "#c58bff",
};

function Curtain({ width = 20, height = 13, z = -3.2 }: { width?: number; height?: number; z?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const base = useRef<Float32Array | null>(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: VELVET.color,
        roughness: 0.92,
        sheen: 1,
        sheenColor: new THREE.Color(VELVET.sheenColor),
        sheenRoughness: 0.32,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const geometry = mesh.current?.geometry;
    if (!geometry) return;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    base.current ??= Float32Array.from(arr);
    const flat = base.current;
    const t = clock.elapsedTime;
    for (let i = 0; i < arr.length; i += 3) {
      const x = flat[i];
      const y = flat[i + 1];
      // Deep main folds + finer secondary folds, swaying slowly; folds relax toward the top
      const hang = 0.75 + 0.25 * (1 - (y + height / 2) / height);
      arr[i + 2] =
        (Math.sin(x * 1.7 + Math.sin(t * 0.35 + y * 0.12) * 0.6) * 0.34 + Math.sin(x * 4.9 - t * 0.25) * 0.07) * hang;
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} material={material} position={[0, 0.2, z]}>
      <planeGeometry args={[width, height, 180, 24]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Portraits: framed prints on an arc; scroll brings each to the front */

const CARD_H = 2.05;
const RADIUS = 2.9;
const STEP = 0.72; // radians between prints

function Portrait({ texture, index, count, progress }: { texture: THREE.Texture; index: number; count: number; progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const photoMat = useRef<THREE.MeshStandardMaterial>(null);
  const img = texture.image as { width: number; height: number };
  const aspect = img.width / img.height;
  const w = Math.min(CARD_H * aspect, 2.5);
  const h = w / aspect;

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    // 0 → first print in front, 1 → last print in front (over 85% of the section)
    const active = THREE.MathUtils.clamp(progress.get() / 0.85, 0, 1) * (count - 1);
    const offset = index - active;
    const theta = offset * STEP;
    g.position.set(Math.sin(theta) * RADIUS, Math.sin(clock.elapsedTime * 0.7 + index) * 0.04, Math.cos(theta) * RADIUS - RADIUS);
    g.rotation.y = -theta * 0.85;
    const focus = 1 - Math.min(Math.abs(offset), 1);
    g.scale.setScalar(0.82 + focus * 0.18);
    if (photoMat.current) photoMat.current.color.setScalar(0.38 + focus * 0.62);
  });

  return (
    <group ref={group}>
      {/* Silver frame + dark mat */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.04]} />
        <meshStandardMaterial color="#c8cbd4" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[w + 0.08, h + 0.08]} />
        <meshStandardMaterial color="#0a0a0d" roughness={0.9} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial ref={photoMat} map={texture} roughness={0.55} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Portraits({ images, progress }: { images: Img[]; progress: MotionValue<number> }) {
  const textures = useTexture(images.map((i) => i.src));
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  return (
    <>
      {textures.map((t, i) => (
        <Portrait key={images[i].src} texture={t} index={i} count={images.length} progress={progress} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const p = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    p.current.x = THREE.MathUtils.damp(p.current.x, state.pointer.x, 2.5, delta);
    p.current.y = THREE.MathUtils.damp(p.current.y, state.pointer.y, 2.5, delta);
    if (g.current) {
      g.current.rotation.y = p.current.x * 0.08;
      g.current.rotation.x = -p.current.y * 0.04;
    }
  });
  return <group ref={g}>{children}</group>;
}

export default function VelvetStage({ images, progress, active }: { images: Img[]; progress: MotionValue<number>; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 7.3], fov: 34 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      aria-hidden
    >
      <color attach="background" args={["#12051b"]} />
      <fog attach="fog" args={["#12051b", 7, 14]} />
      <ambientLight intensity={0.25} />
      {/* Key light on the print in front, violet + pink rims grazing the velvet folds */}
      <spotLight position={[0, 4.5, 5]} angle={0.3} penumbra={1} intensity={60} distance={14} color="#fff4ec" />
      {/* Grazing side light: it is what makes the velvet folds read */}
      <directionalLight position={[-7, 1.5, -2.2]} intensity={2.2} color="#c58bff" />
      <directionalLight position={[7, 2.5, -2.2]} intensity={1.2} color="#ff7fd0" />
      <pointLight position={[-5, 2.5, -1.5]} intensity={40} distance={12} color="#a45cff" />
      <pointLight position={[5, -0.5, -1.5]} intensity={28} distance={12} color="#ff5fc8" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={3} color="#b98cff" position={[-6, 0, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#ff8fd8" position={[6, 0, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
      <Rig>
        <Curtain />
        <Suspense fallback={null}>
          <Portraits images={images} progress={progress} />
        </Suspense>
      </Rig>
    </Canvas>
  );
}
