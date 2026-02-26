"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Mehrshad delivered a complete AI-powered dashboard in under 3 weeks. The attention to performance and design was exceptional — our team was blown away.",
    name: "Alex Rivera",
    role: "CTO, NovaTech AI",
    rating: 5,
  },
  {
    quote:
      "Working with Omnilertlab felt like having a full engineering team. The Three.js experience he built for our product launch was genuinely stunning.",
    name: "Sarah Chen",
    role: "Head of Product, Lumino",
    rating: 5,
  },
  {
    quote:
      "Fast, reliable, and incredibly creative. The portfolio platform Mehrshad built handles thousands of daily visitors with zero issues. Highly recommend.",
    name: "James Okonkwo",
    role: "Founder, CreativeStack",
    rating: 5,
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="glass glass-hover rounded-2xl p-6 min-w-[320px] max-w-[380px] flex flex-col gap-4 flex-shrink-0 mx-3">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < t.rating ? "var(--accent-amber)" : "transparent"}
            style={{
              color: i < t.rating ? "var(--accent-amber)" : "var(--glass-border)",
            }}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className="text-sm leading-relaxed italic"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-fraunces), serif",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
          }}
        >
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {t.name}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Double the array for infinite marquee
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" ref={ref} className="relative py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-amber)" }}
          >
            / testimonials
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-syne), system-ui" }}
          >
            What people <span className="gradient-text-amber">say.</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        {/* Gradient fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, var(--bg-void), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, var(--bg-void), transparent)",
          }}
        />

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
