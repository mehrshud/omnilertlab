"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Unknown: "#888",
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const sectionRef   = useRef<HTMLElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const headRef      = useRef<HTMLHeadingElement>(null);

  // Fetch from our GitHub API route
  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // GSAP: horizontal scroll + headline stagger
  useEffect(() => {
    if (loading || !projects.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // ── Headline char stagger ─────────────────────────────
      const h = headRef.current!;
      const orig = h.textContent ?? "";
      h.innerHTML = orig.split("").map((c) =>
        `<span style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`
      ).join("");
      gsap.from(h.querySelectorAll("span"), {
        scrollTrigger: { trigger: h, start: "top 80%" },
        rotationX: reducedMotion ? 0 : -90,
        opacity: 0,
        stagger: 0.025,
        duration: 0.6,
        ease: "back.out(1.7)",
        transformOrigin: "0% 50% -50px",
      });

      if (!reducedMotion) {
        // ── Horizontal scroll (pinned section) ───────────────
        const track = trackRef.current!;
        const totalW = track.scrollWidth - window.innerWidth + 80;

        gsap.to(track, {
          x: -totalW,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalW}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]);

  // Clip-path image reveal on card hover
  const onCardEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const img = e.currentTarget.querySelector<HTMLDivElement>(".card-img");
    if (img) gsap.to(img, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.out" });
  };
  const onCardLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const img = e.currentTarget.querySelector<HTMLDivElement>(".card-img");
    if (img) gsap.to(img, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4, ease: "power3.in" });
  };

  // 3D tilt on card hover
  const onTiltEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const onMove = (ev: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const y = (ev.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, {
        rotationY: x * 8,
        rotationX: -y * 6,
        z: 20,
        duration: 0.5, ease: "power2.out", transformPerspective: 800,
      });
    };
    const onLeave = () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, z: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      window.removeEventListener("mousemove", onMove);
    };
    window.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave, { once: true });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ padding: "160px 0", overflow: "hidden" }}
      aria-label="Projects"
    >
      {/* Section header — bleeds to edge */}
      <div style={{ padding: "0 40px", marginBottom: 80 }}>
        <p className="label" style={{ color: "var(--color-accent)", marginBottom: 24 }}>
          Work / Projects
        </p>
        <h2 ref={headRef} className="display-lg">
          Things I&apos;ve Built
        </h2>
      </div>

      {/* Horizontal scroll track */}
      {loading ? (
        <div style={{ padding: "0 40px", display: "flex", gap: 24 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass"
              style={{
                width: 320, height: 260, borderRadius: 16, flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="h-scroll-track"
          style={{ padding: "0 40px 40px", willChange: "transform" }}
          data-cursor="Drag"
        >
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.homepage ?? project.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => { onCardEnter(e); onTiltEnter(e); }}
              onMouseLeave={onCardLeave}
              data-cursor="Open"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
                width: 320,
                minHeight: 260,
                padding: 28,
                borderRadius: 16,
                textDecoration: "none",
                color: "inherit",
                transformStyle: "preserve-3d",
                position: "relative",
                overflow: "hidden",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(20px)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            >
              {/* Light-catch glass highlight (moves with cursor via CSS var) */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                }}
              />

              {/* Image reveal overlay */}
              <div
                className="card-img"
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0, borderRadius: 16,
                  background: `linear-gradient(135deg, ${LANGUAGE_COLORS[project.language] ?? "#7b61ff"}22, rgba(0,0,0,0.6))`,
                  clipPath: "inset(0% 0% 100% 0%)",
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Language dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: LANGUAGE_COLORS[project.language] ?? "#7b61ff",
                      flexShrink: 0,
                    }}
                  />
                  <span className="label">{project.language}</span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-sans)", fontWeight: 600,
                    fontSize: 18, marginBottom: 10,
                    textTransform: "capitalize",
                    wordBreak: "break-word",
                  }}
                >
                  {project.name.replace(/-/g, " ")}
                </h3>
                <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.6 }}>
                  {project.description || "No description provided."}
                </p>
              </div>

              {/* Meta row */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 16, marginTop: 20,
                  position: "relative", zIndex: 1,
                }}
              >
                <span className="label">⭐ {project.stars}</span>
                <span className="label">🍴 {project.forks}</span>
                {project.topics.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      padding: "3px 8px", borderRadius: 100,
                      border: "1px solid var(--color-border)",
                      color: "var(--color-muted)", textTransform: "lowercase",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
