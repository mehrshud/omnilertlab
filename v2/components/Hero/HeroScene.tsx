"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── GLSL Shaders ───────────────────────────────────────────────────────────
const VERTEX = `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uDistortion;

  attribute float aSize;
  attribute float aSpeed;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Wave distortion driven by mouse proximity
    float dist = length(uMouse - pos.xy);
    float ripple = sin(dist * 3.0 - uTime * 2.0) * uDistortion / (dist + 1.0);
    pos.z += ripple * 2.5;

    // Slow drift
    pos.y += sin(uTime * aSpeed + position.x * 0.5) * 0.08;
    pos.x += cos(uTime * aSpeed * 0.7 + position.y * 0.5) * 0.06;

    vAlpha = 0.4 + 0.6 * abs(sin(uTime * aSpeed + position.z));

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (180.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAGMENT = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Soft circle
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = (1.0 - d * 2.0) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ─── Particles ───────────────────────────────────────────────────────────────
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const COUNT = 2500;

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const speeds    = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i]  = Math.random() * 2.5 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.3;
    }

    return { positions, sizes, speeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uMouse:       { value: new THREE.Vector2(0, 0) },
      uDistortion:  { value: 1.5 },
      uColor:       { value: new THREE.Color("#7b61ff") },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    // Convert normalised mouse to world-space approximation
    uniforms.uMouse.value.set(mouse.x * 10, mouse.y * 6);
    // Slow auto-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Exported Scene ──────────────────────────────────────────────────────────
export function HeroScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Kill WebGL when not visible
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (el) el.style.visibility = entry.isIntersecting ? "visible" : "hidden";
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={canvasRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}           // cap pixel ratio for perf
        gl={{ antialias: false, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
