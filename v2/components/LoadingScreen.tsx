"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const countRef     = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let prog = 0;

    const tick = () => {
      // Simulate loading: fast at first, slows before 100
      const speed = prog < 70 ? 1.8 : prog < 90 ? 0.7 : 0.3;
      prog = Math.min(100, prog + speed);
      setProgress(Math.floor(prog));
      if (barRef.current) barRef.current.style.transform = `scaleX(${prog / 100})`;
      if (countRef.current) countRef.current.textContent = `${Math.floor(prog)}`;

      if (prog < 100) {
        requestAnimationFrame(tick);
      } else {
        // Exit animation: clip-path wipe upward
        const tl = gsap.timeline({ onComplete });
        if (reducedMotion) {
          tl.to(containerRef.current, { opacity: 0, duration: 0.3, onComplete });
        } else {
          tl.to(containerRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "power4.inOut",
          });
        }
      }
    };

    // Small delay so fonts & initial paint settle
    const timer = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "inset(0 0 0% 0)",
      }}
      aria-label="Loading OmnilertLab"
      role="status"
    >
      {/* Animated SVG logo / signature */}
      <svg
        viewBox="0 0 320 80"
        width="320"
        height="80"
        style={{ marginBottom: 48, overflow: "visible" }}
        aria-hidden="true"
      >
        {/* "OL" monogram drawn path */}
        <path
          d="M 20 60 C 20 20 80 20 80 60 C 80 80 60 80 50 80 C 40 80 20 80 20 60 Z"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="300"
          strokeDashoffset="300"
          ref={(el) => {
            if (el) {
              gsap.to(el, {
                strokeDashoffset: 0,
                duration: 1.4,
                ease: "power2.inOut",
                delay: 0.2,
              });
            }
          }}
        />
        <path
          d="M 100 20 L 100 80 L 160 80"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="200"
          strokeDashoffset="200"
          ref={(el) => {
            if (el) {
              gsap.to(el, {
                strokeDashoffset: 0,
                duration: 1.0,
                ease: "power2.inOut",
                delay: 0.8,
              });
            }
          }}
        />
        {/* Text */}
        <text
          x="180"
          y="55"
          fontFamily="var(--font-display)"
          fontSize="42"
          fill="var(--color-text)"
          opacity="0"
          ref={(el) => {
            if (el) gsap.to(el, { opacity: 1, duration: 0.6, delay: 1.4 });
          }}
        >
          mnilertLab
        </text>
      </svg>

      {/* Progress bar */}
      <div
        style={{
          width: 280,
          height: 2,
          background: "var(--color-border)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={barRef}
          className="progress-bar"
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* Counter */}
      <div
        style={{
          marginTop: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "var(--color-muted)",
        }}
      >
        <span ref={countRef}>0</span>%
      </div>
    </div>
  );
}
