"use client";

import { useRef, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import type { GitHubRepo } from "@/lib/github";

export default function About({ projects = [] }: { projects?: GitHubRepo[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const avatarY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const totalStars = useMemo(() => {
    return projects.reduce((acc, repo) => acc + (repo.stars || 0), 0);
  }, [projects]);

  return (
    <section id="about" ref={ref} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Avatar Portrait (Pinned) */}
          <div className="order-2 md:order-1 relative md:sticky md:top-32">
            <motion.div
              style={{ y: avatarY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-square rounded-2xl overflow-hidden glass p-1 group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-2xl transition-transform duration-700 group-hover:scale-105" />
              
              <div 
                className="relative w-full h-full rounded-[14px] bg-black/60 flex items-center justify-center overflow-hidden"
                style={{ mixBlendMode: 'luminosity' }}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-8xl font-bold opacity-80"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "var(--font-syne), system-ui"
                  }}
                >
                  MH
                </div>
              </div>
              {/* Cyan Border Glow on Scroll/Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/0 transition-colors duration-500 group-hover:border-cyan-400/50" />
            </motion.div>
          </div>

          {/* Right: Editorial Content */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 md:order-2 flex flex-col gap-8 pb-12"
          >
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "var(--accent-cyan)" }}
              >
                LEAD ARCHITECT // MEHRSHAD HAMAVANDY
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "var(--font-syne), system-ui" }}
              >
                Building the infrastructure others <span className="gradient-text">run on.</span>
              </h2>
              
              <p className="text-base sm:text-lg leading-relaxed text-slate-400">
                We engineer systems at the intersection of performance and design. Emphasizing uncompromising quality, from deep backend architecture securely powering platforms to the polished WebGL 3D surfaces users interact with.
              </p>
            </div>

            {/* Live GitHub Stats Tiles */}
            <div className="grid grid-cols-3 gap-4">
              <GlassCard level={2} hover={false} className="p-4 flex flex-col items-center justify-center text-center">
                <AnimatedCounter value={projects.length} className="text-2xl font-bold text-white" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-2">Repos</span>
              </GlassCard>
              
              <GlassCard level={2} hover={false} className="p-4 flex flex-col items-center justify-center text-center">
                <AnimatedCounter value={totalStars} className="text-2xl font-bold text-cyan-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-2">Stars</span>
              </GlassCard>

              <GlassCard level={2} hover={false} className="p-4 flex flex-col items-center justify-center text-center">
                <AnimatedCounter value={5} suffix="+" className="text-2xl font-bold text-violet-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-2">Years</span>
              </GlassCard>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <MagneticButton href="https://github.com/mehrshud" variant="ghost" className="!px-4 !py-3">
                <Github size={18} /> <span className="text-sm">GitHub</span>
              </MagneticButton>
              <MagneticButton href="https://ir.linkedin.com/in/mehrshud" variant="ghost" className="!px-4 !py-3">
                <Linkedin size={18} /> <span className="text-sm">LinkedIn</span>
              </MagneticButton>
            </div>
            
            <div className="h-20" /> {/* Spacer for trailing scroll */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
