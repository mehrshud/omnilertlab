"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    number: "01",
    title: "Full-Stack Development",
    body: "Next.js, React, Node.js, PostgreSQL, Redis. From pixel-perfect UIs to rock-solid APIs — the whole stack, owned end to end.",
    accent: "#7b61ff",
  },
  {
    number: "02",
    title: "DevOps & Infrastructure",
    body: "Docker, Kubernetes, CI/CD pipelines, AWS/GCP, Terraform. I ship fast and keep it running.",
    accent: "#5eead4",
  },
  {
    number: "03",
    title: "Creative Engineering",
    body: "WebGL, GSAP, Three.js. I build the kind of web experiences that make people say 'wait, how did they do that?'",
    accent: "#f472b6",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // ── Headline: SplitText-style char stagger ────────────
      const h = headRef.current!;
      const original = h.textContent ?? "";
      h.innerHTML = original
        .split("")
        .map((c) => `<span class="char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`)
        .join("");

      gsap.from(h.querySelectorAll(".char"), {
        scrollTrigger: { trigger: h, start: "top 80%" },
        rotationX: reducedMotion ? 0 : -90,
        opacity: 0,
        y: reducedMotion ? 0 : 40,
        stagger: 0.03,
        duration: 0.7,
        ease: "back.out(1.7)",
        transformOrigin: "0% 50% -50px",
      });

      // ── 3D stacked card reveal ─────────────────────────────
      const cards = cardsRef.current!.querySelectorAll<HTMLDivElement>(".about-card");
      if (!reducedMotion) {
        gsap.from(cards, {
          scrollTrigger: { trigger: cardsRef.current, start: "top 70%" },
          rotationX: -30,
          z: -200,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          transformOrigin: "50% 0%",
        });
      } else {
        gsap.from(cards, {
          scrollTrigger: { trigger: cardsRef.current, start: "top 70%" },
          opacity: 0, stagger: 0.15, duration: 0.5,
        });
      }

      // ── Variable font animation on scroll ─────────────────
      if (!reducedMotion) {
        cards.forEach((card) => {
          const titleEl = card.querySelector<HTMLElement>(".card-title");
          if (!titleEl) return;
          ScrollTrigger.create({
            trigger: card,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => gsap.to(titleEl, { fontWeight: 700, duration: 0.6 }),
            onLeave: () => gsap.to(titleEl, { fontWeight: 300, duration: 0.6 }),
            onEnterBack: () => gsap.to(titleEl, { fontWeight: 700, duration: 0.6 }),
            onLeaveBack: () => gsap.to(titleEl, { fontWeight: 300, duration: 0.6 }),
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic hover on cards
  const magneticHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const onMove = (ev: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (ev.clientX - rect.left - rect.width  / 2) * 0.04;
      const y = (ev.clientY - rect.top  - rect.height / 2) * 0.04;
      gsap.to(card, { rotationY: x, rotationX: -y, duration: 0.6, ease: "power2.out", transformPerspective: 800 });
    };
    const onLeave = () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      window.removeEventListener("mousemove", onMove);
    };
    window.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave, { once: true });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ padding: "160px 40px", overflow: "hidden" }}
      aria-label="About"
    >
      {/* Misaligned decorative number */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute", right: "-2vw", top: "10%",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(8rem,18vw,22rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          lineHeight: 1, pointerEvents: "none",
          userSelect: "none",
        }}
      >
        02
      </span>

      <p className="label" style={{ color: "var(--color-accent)", marginBottom: 32 }}>
        About
      </p>

      <h2 ref={headRef} className="display-lg" style={{ marginBottom: 80, maxWidth: "14ch" }}>
        I Build Things That Matter
      </h2>

      {/* 3D stacked cards */}
      <div
        ref={cardsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
          perspective: 1000,
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.number}
            className="about-card glass"
            onMouseEnter={magneticHover}
            data-cursor="View"
            style={{
              borderRadius: 16,
              padding: 32,
              transformStyle: "preserve-3d",
            }}
          >
            <span
              className="label"
              style={{ color: card.accent, marginBottom: 16, display: "block" }}
            >
              {card.number}
            </span>
            <h3
              className="card-title"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: 22,
                marginBottom: 16,
                transition: "font-weight 0.3s",
              }}
            >
              {card.title}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.7 }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
