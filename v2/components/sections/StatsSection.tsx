"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Stats {
  followers: number;
  publicRepos: number;
  totalStars: number;
}

function AnimatedCounter({ target, duration = 1.8, suffix = "" }: {
  target: number; duration?: number; suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { el.textContent = `${target}${suffix}`; return; }

    const obj = { value: 0 };
    gsap.to(obj, {
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
      value: target,
      duration,
      ease: "power2.out",
      onUpdate: () => { el.textContent = `${Math.floor(obj.value)}${suffix}`; },
      onComplete: () => { el.textContent = `${target}${suffix}`; },
    });
  }, [target, duration, suffix]);

  return <span ref={ref} aria-label={`${target}${suffix}`}>0{suffix}</span>;
}

const STATIC_STATS = [
  { label: "Years Coding",   value: 4,   suffix: "+" },
  { label: "Projects Shipped", value: 25, suffix: "+" },
  { label: "Cups of Coffee",  value: 1337, suffix: "" },
];

export function StatsSection() {
  const [ghStats, setGhStats] = useState<Stats | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => setGhStats(d.stats ?? null))
      .catch(() => {});
  }, []);

  const allStats = [
    ...STATIC_STATS,
    { label: "GitHub Stars",  value: ghStats?.totalStars ?? 0,   suffix: "" },
    { label: "Public Repos",  value: ghStats?.publicRepos ?? 0,  suffix: "" },
    { label: "Followers",     value: ghStats?.followers ?? 0,    suffix: "" },
  ];

  return (
    <section
      ref={sectionRef}
      id="stats"
      style={{
        padding: "120px 40px",
        background: "linear-gradient(180deg, transparent, rgba(123,97,255,0.04), transparent)",
        overflow: "hidden",
      }}
      aria-label="Statistics"
    >
      <p className="label" style={{ color: "var(--color-accent)", marginBottom: 64, textAlign: "center" }}>
        By the Numbers
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {allStats.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "48px 32px",
              borderTop: "1px solid var(--color-border)",
              borderLeft: i % 3 !== 0 ? "none" : "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                lineHeight: 1,
                color: "var(--color-text)",
                marginBottom: 12,
              }}
              aria-hidden="true"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
