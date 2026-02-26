"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

// Lazy-load the heavy R3F scene
const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const layer1Ref   = useRef<HTMLDivElement>(null);
  const layer2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // Simple fade-in for reduced motion users
      gsap.from([headlineRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0, duration: 0.8, stagger: 0.15,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // ── ScrambleText decode on headline ──────────────────
      const scrambleParts = ["Mehrshad", "Developer", "DevOps", "Builder"];
      let partIndex = 0;
      const headline = headlineRef.current!;

      // Start headline invisible
      gsap.set(headline, { opacity: 0 });

      const playScramble = () => {
        headline.textContent = scrambleParts[partIndex];
        gsap.from(headline, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onStart: () => {
            // Manual scramble effect
            let frame = 0;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
            const final = scrambleParts[partIndex];
            const interval = setInterval(() => {
              headline.textContent = final.split("").map((c, i) =>
                frame > i * 1.5 ? c : chars[Math.floor(Math.random() * chars.length)]
              ).join("");
              frame++;
              if (frame > final.length * 2) {
                headline.textContent = final;
                clearInterval(interval);
              }
            }, 40);
          },
        });
      };

      // Initial entrance after a small delay
      setTimeout(() => {
        gsap.set(headline, { opacity: 1 });
        playScramble();
      }, 300);

      // Cycle through titles
      const cycle = setInterval(() => {
        partIndex = (partIndex + 1) % scrambleParts.length;
        playScramble();
      }, 3000);

      // ── Subtitle entrance ─────────────────────────────────
      gsap.from(subtitleRef.current, {
        y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.8,
      });

      // ── CTA entrance ──────────────────────────────────────
      gsap.from(ctaRef.current!.children, {
        y: 20, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", delay: 1.1,
      });

      // ── Cursor-move parallax ──────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX / w - 0.5) * 2;
        const ny = (e.clientY / h - 0.5) * 2;
        gsap.to(layer1Ref.current, { x: nx * -18, y: ny * -12, duration: 1.2, ease: "power2.out" });
        gsap.to(layer2Ref.current, { x: nx * 28,  y: ny * 18,  duration: 1.6, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Gyroscope parallax (mobile) ───────────────────────
      const onDeviceOrientation = (e: DeviceOrientationEvent) => {
        const bx = (e.beta  ?? 0) / 90;   // -1 to 1
        const gx = (e.gamma ?? 0) / 90;
        gsap.to(layer1Ref.current, { x: gx * -24, y: bx * -16, duration: 1.2, ease: "power2.out" });
        gsap.to(layer2Ref.current, { x: gx * 36,  y: bx * 24,  duration: 1.6, ease: "power2.out" });
      };
      window.addEventListener("deviceorientation", onDeviceOrientation);

      // ── ScrollTrigger hero exit ───────────────────────────
      gsap.to(sectionRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        y: -80,
        opacity: 0,
        scale: 0.97,
      });

      return () => {
        clearInterval(cycle);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("deviceorientation", onDeviceOrientation);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Magnetic button logic ──────────────────────────────────────────────────
  const magneticEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const onMove = (ev: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = ev.clientX - rect.left - rect.width / 2;
      const y = ev.clientY - rect.top  - rect.height / 2;
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      window.removeEventListener("mousemove", onMove);
    };
    window.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave, { once: true });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 40px 80px",
        overflow: "hidden",
      }}
      aria-label="Hero"
    >
      {/* WebGL background */}
      <HeroScene />

      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(123,97,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(123,97,255,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Parallax layer 1 — decorative line */}
      <div
        ref={layer1Ref}
        aria-hidden="true"
        style={{
          position: "absolute", top: "20%", right: "-5%",
          width: 400, height: 1,
          background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.3, pointerEvents: "none",
        }}
      />

      {/* Parallax layer 2 — accent circle */}
      <div
        ref={layer2Ref}
        aria-hidden="true"
        style={{
          position: "absolute", top: "30%", left: "-8%",
          width: 180, height: 180, borderRadius: "50%",
          border: "1px solid rgba(123,97,255,0.15)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "90vw" }}>
        {/* Label */}
        <p
          className="label"
          style={{ marginBottom: 24, color: "var(--color-accent)" }}
        >
          Full-Stack Dev &amp; DevOps Engineer
        </p>

        {/* Headline (ScrambleText target) */}
        <h1
          ref={headlineRef}
          className="display-xl glow-text"
          aria-label="Mehrshad — Developer, DevOps, Builder"
          style={{ color: "var(--color-text)" }}
        >
          Mehrshad
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            maxWidth: 480,
            marginTop: 24,
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--color-muted)",
          }}
        >
          Building elegant, high-performance web experiences and cloud infrastructure
          that scale. Based anywhere the internet reaches.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
          <a
            href="#projects"
            className="magnetic-btn primary"
            data-cursor="View"
            onMouseEnter={magneticEnter}
          >
            View Work
          </a>
          <a
            href="#contact"
            className="magnetic-btn"
            data-cursor="Talk"
            onMouseEnter={magneticEnter}
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: 40, right: 40,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: 0.4,
        }}
      >
        <span
          className="label"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}
        >
          Scroll
        </span>
        <div style={{ width: 1, height: 48, background: "var(--color-muted)" }} />
      </div>
    </section>
  );
}
