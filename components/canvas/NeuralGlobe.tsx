"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
// @ts-ignore - maath typings are missing for this specific ESM distribution path
import * as random from "maath/random/dist/maath-random.esm";

function ParticleSphere({ active }: { active: boolean }) {
  const ref = useRef<any>(null);
  
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(14000), { radius: 2.2 }) as Float32Array;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (active ? 0.3 : 0.08);
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        blending={2} // THREE.AdditiveBlending
        vertexColors={false}
      />
    </Points>
  );
}

export default function NeuralGlobe({ active = false }: { active?: boolean }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ParticleSphere active={active} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} intensity={1.5} mipmapBlur />
          <ChromaticAberration
            offset={active ? [0.004, 0.004] : [0, 0]}
            //@ts-ignore - r3f postprocessing types might mismatch
            blendFunction={2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
