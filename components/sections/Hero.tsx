"use client";

import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const NeuralGlobe = dynamic(() => import("@/components/canvas/NeuralGlobe"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-void" />,
});

const HEADLINE = ["OMNI", "LERT", "LAB"];

const charVariants: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.04 + 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

export default function Hero() {
  return (
    <section className="relative h-[100dvh] flex flex-col items-start justify-center overflow-hidden">
      {/* Three.js background — hidden on mobile, replaced by CSS orbs */}
      <div className="hidden md:block" aria-hidden="true">
        <NeuralGlobe active={true} />
      </div>

      {/* Sweeping scanline effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 z-20 pointer-events-none"
        initial={{ y: "-10vh", opacity: 0 }}
        animate={{ y: "110vh", opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, ease: "linear", delay: 0.5 }}
      />

      {/* Frosted glass orbs */}
      <div className="orb-violet top-[10%] left-[-5%] pointer-events-none z-0" />
      <div className="orb-cyan bottom-[15%] right-[-8%] pointer-events-none z-0" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12">
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="absolute top-8 right-6 md:right-12"
        >
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span style={{ color: "var(--text-muted)" }}>
              Available for work · Feb 2026
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--accent-cyan)" }}
        >
          Full-Stack Developer & Creative Engineer
        </motion.p>

        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-6 flex flex-wrap gap-4"
          style={{ fontFamily: "var(--font-syne), system-ui", color: "var(--text-primary)", perspective: "1000px" }}
        >
          {HEADLINE.map((word, wordIndex) => (
            <span key={wordIndex} className={wordIndex === 2 ? "gradient-text" : ""}>
              {word.split("").map((char, charIndex) => {
                const globalIndex = wordIndex * 5 + charIndex; // rough estimate for stagger
                return (
                  <motion.span
                    key={charIndex}
                    custom={globalIndex}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="text-base sm:text-lg max-w-xl leading-relaxed mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          I build products that live at the edge of design and engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton href="#projects" variant="ghost">
            View Work ↓
          </MagneticButton>
          <MagneticButton href="/order" variant="amber">
            Commission a Project →
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float z-10"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="text-xs font-mono">SCROLL</span>
        <ChevronDown size={16} />
      </motion.a>
    </section>
  );
}
