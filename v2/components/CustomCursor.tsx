"use client";
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  alpha: number;
  born: number;
}

const MAX_PARTICLES = 24;
const PARTICLE_LIFE = 600; // ms

export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const ring  = useRef({ x: -200, y: -200 });

  const spawnParticle = useCallback((x: number, y: number) => {
    if (particles.current.length >= MAX_PARTICLES) {
      const oldest = particles.current.shift()!;
      oldest.el.remove();
    }
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:9990;
      width:4px; height:4px; border-radius:50%;
      background:var(--color-accent); mix-blend-mode:screen;
      transform:translate(-50%,-50%);
      left:${x}px; top:${y}px;
    `;
    document.body.appendChild(el);
    const p: Particle = { el, x, y, alpha: 1, born: Date.now() };
    particles.current.push(p);
    gsap.to(el, {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      opacity: 0,
      scale: 0.3,
      duration: PARTICLE_LIFE / 1000,
      ease: "power2.out",
      onComplete: () => {
        el.remove();
        particles.current = particles.current.filter((pp) => pp.el !== el);
      },
    });
  }, []);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    const lbl  = labelRef.current!;
    let frameId: number;
    let lastParticleTime = 0;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Throttle particles to every 40ms
      const now = Date.now();
      if (now - lastParticleTime > 40) {
        spawnParticle(e.clientX, e.clientY);
        lastParticleTime = now;
      }
    };

    const tick = () => {
      // Dot follows instantly
      gsap.set(dot, { x: mouse.current.x, y: mouse.current.y });
      // Ring follows with lag
      const rx = ring.offsetLeft  + (mouse.current.x - ring.offsetLeft)  * 0.15;
      const ry = ring.offsetTop   + (mouse.current.y - ring.offsetTop)   * 0.15;
      gsap.set(ring, { x: mouse.current.x, y: mouse.current.y });
      frameId = requestAnimationFrame(tick);
    };
    tick();

    // Context detection
    const onHoverEnter = (e: MouseEvent) => {
      const t = e.target as Element;
      const zone = t.closest("[data-cursor]");
      if (zone) {
        const type = zone.getAttribute("data-cursor") ?? "";
        lbl.textContent = type;
        gsap.to(ring, { scale: 2.5, duration: 0.4, ease: "power3.out" });
        gsap.to(dot,  { scale: 0,   duration: 0.3 });
      }
    };
    const onHoverLeave = () => {
      lbl.textContent = "";
      gsap.to(ring, { scale: 1,  duration: 0.4, ease: "power3.out" });
      gsap.to(dot,  { scale: 1,  duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onHoverEnter);
    document.addEventListener("mouseout", onHoverLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onHoverEnter);
      document.removeEventListener("mouseout", onHoverLeave);
    };
  }, [spawnParticle]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: "50%",
          background: "var(--color-accent)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9997,
          mixBlendMode: "screen",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: "50%",
          border: "1px solid var(--color-accent)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9996,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            whiteSpace: "nowrap",
          }}
        />
      </div>
    </>
  );
}
