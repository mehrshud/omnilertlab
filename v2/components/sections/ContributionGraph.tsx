"use client";
// Embeds GitHub's contribution graph via their public SVG endpoint.
// Animates cells in on scroll using GSAP.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GH_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "mehrshud";

export function ContributionGraph() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(wrapRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contributions"
      style={{ padding: "80px 40px" }}
      aria-label="GitHub Contribution Graph"
    >
      <p className="label" style={{ color: "var(--color-accent)", marginBottom: 32 }}>
        GitHub Activity
      </p>

      <div ref={wrapRef}>
        {/* GitHub's public contribution SVG – no auth required */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ghchart.rshah.org/7b61ff/${GH_USER}`}
          alt={`${GH_USER}'s GitHub contribution graph`}
          style={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 8,
            filter: "invert(0)",
            opacity: 0.9,
          }}
          loading="lazy"
        />
        <p className="label" style={{ marginTop: 12, color: "var(--color-muted)" }}>
          {GH_USER}&apos;s contributions in the last year
        </p>
      </div>
    </section>
  );
}
