"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  { prompt: "visitor@omnilertlab:~$", cmd: "whoami", delay: 0 },
  { output: "mehrshad — full-stack developer & devops engineer", delay: 800 },
  { prompt: "visitor@omnilertlab:~$", cmd: "cat skills.txt", delay: 1800 },
  { output: "├── Frontend:   React · Next.js · TypeScript · Three.js · GSAP", delay: 2600 },
  { output: "├── Backend:    Node.js · Python · Go · PostgreSQL · Redis", delay: 3100 },
  { output: "├── DevOps:     Docker · Kubernetes · AWS · GCP · Terraform · CI/CD", delay: 3600 },
  { output: "└── Toolchain:  Git · Linux · Vim · Tmux", delay: 4100 },
  { prompt: "visitor@omnilertlab:~$", cmd: "uptime --years", delay: 5000 },
  { output: "3+ years building production systems · 20+ projects shipped", delay: 5800 },
  { prompt: "visitor@omnilertlab:~$", cmd: "echo $MISSION", delay: 6800 },
  { output: '"Build things that scale, look incredible, and actually work."', delay: 7600 },
  { prompt: "visitor@omnilertlab:~$", cmd: "_", delay: 8600, isCursor: true },
];

interface Line {
  prompt?: string;
  cmd?: string;
  output?: string;
  delay: number;
  isCursor?: boolean;
}

export function TerminalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const termRef    = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<Line[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => setStarted(true),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!started) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setVisibleLines(TERMINAL_LINES);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        // Auto-scroll terminal
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
      }, line.delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      id="terminal"
      style={{ padding: "160px 40px", overflow: "hidden" }}
      aria-label="Terminal — whoami"
    >
      {/* Misaligned decorative label */}
      <span
        aria-hidden="true"
        className="label"
        style={{
          position: "absolute", left: "50vw", top: 0,
          color: "rgba(123,97,255,0.15)",
          fontSize: 11, letterSpacing: "0.3em",
          writingMode: "vertical-rl", textTransform: "uppercase",
        }}
      >
        $ terminal
      </span>

      <p className="label" style={{ color: "var(--color-accent)", marginBottom: 24 }}>
        // whoami
      </p>
      <h2
        className="display-lg"
        style={{ marginBottom: 64 }}
        aria-label="Who am I — terminal section"
      >
        Meet the Dev
      </h2>

      {/* Terminal window */}
      <div
        style={{
          maxWidth: 780,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          overflow: "hidden",
          backdropFilter: "blur(24px)",
        }}
        role="region"
        aria-label="Interactive terminal showing developer profile"
      >
        {/* Title bar */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              aria-hidden="true"
              style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
            />
          ))}
          <span
            className="label"
            style={{ marginLeft: 8, color: "var(--color-muted)" }}
          >
            bash — visitor@omnilertlab
          </span>
        </div>

        {/* Output */}
        <div
          ref={termRef}
          style={{
            padding: 24,
            minHeight: 360,
            maxHeight: 480,
            overflowY: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.8,
          }}
          aria-live="polite"
          aria-atomic="false"
        >
          {visibleLines.map((line, i) => (
            <div key={i}>
              {line.prompt && (
                <span>
                  <span style={{ color: "#28c840" }}>{line.prompt}</span>
                  {" "}
                  <span style={{ color: "#e8e8f0" }}>{line.cmd}</span>
                </span>
              )}
              {line.output && (
                <div style={{ color: "var(--color-muted)", paddingLeft: 0 }}>
                  {line.output}
                </div>
              )}
              {line.isCursor && (
                <span style={{ color: "#28c840" }}>
                  {line.prompt}{" "}
                  <span className="terminal-cursor">█</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
