"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STACK = [
  { name: "Next.js 15",       role: "Framework",         color: "#fff" },
  { name: "React Three Fiber", role: "WebGL / 3D",       color: "#61dafb" },
  { name: "Three.js",          role: "3D Engine",         color: "#049ef4" },
  { name: "GSAP",              role: "Animation",         color: "#88ce02" },
  { name: "Framer Motion",     role: "UI Transitions",    color: "#b080ff" },
  { name: "Lenis",             role: "Smooth Scroll",     color: "#e8e8f0" },
  { name: "Tailwind CSS",      role: "Styling",           color: "#38bdf8" },
  { name: "TypeScript",        role: "Language",          color: "#3178c6" },
  { name: "Vercel",            role: "Deployment",        color: "#fff" },
  { name: "GitHub API",        role: "Live Data",         color: "#f0f0f0" },
  { name: "Groq API",          role: "AI Chat (Primary)", color: "#f55036" },
  { name: "Perplexity API",    role: "AI Chat (Backup)",  color: "#20b2aa" },
  { name: "Telegram Bot API",  role: "Live Chat Bridge",  color: "#26a5e4" },
  { name: "Lemon Squeezy",     role: "Payments (opt)",    color: "#ffd859" },
];

export function StackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current!.querySelectorAll(".stack-item"), {
        scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
        opacity: 0,
        y: 30,
        stagger: { amount: 0.6, grid: "auto", from: "start" },
        duration: 0.6,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      style={{
        padding: "160px 40px",
        borderTop: "1px solid var(--color-border)",
      }}
      aria-label="Tech Stack"
    >
      <p className="label" style={{ color: "var(--color-accent)", marginBottom: 24 }}>
        Built With
      </p>
      <h2 className="display-lg" style={{ marginBottom: 80, maxWidth: "18ch" }}>
        The Tools Behind the Magic
      </h2>

      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 1,
          border: "1px solid var(--color-border)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {STACK.map((item) => (
          <div
            key={item.name}
            className="stack-item"
            style={{
              padding: "28px 24px",
              borderRight: "1px solid var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 15,
                color: item.color,
                marginBottom: 6,
              }}
            >
              {item.name}
            </p>
            <p className="label">{item.role}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 120,
          paddingTop: 40,
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 24,
        }}
        id="contact"
      >
        <div>
          <p
            className="display-xl"
            style={{ fontSize: "clamp(2rem, 6vw, 6rem)", maxWidth: "12ch", lineHeight: 1 }}
          >
            Let&apos;s Build Something
          </p>
          <a
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "mehrshud"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn"
            style={{ marginTop: 32, display: "inline-flex" }}
            data-cursor="Open"
          >
            GitHub ↗
          </a>
        </div>

        <p className="label" style={{ color: "var(--color-muted)" }}>
          © {new Date().getFullYear()} OmnilertLab · Mehrshad
        </p>
      </div>
    </section>
  );
}
