"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--accent-cyan)" }}
          >
            / contact
          </p>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8"
            style={{ fontFamily: "var(--font-syne), system-ui" }}
          >
            Let&apos;s build{" "}
            <span className="gradient-text">something.</span>
          </h2>
        </motion.div>

        {/* Email with animated gradient underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <a
            href="mailto:mehrshad@omnilertlab.dev"
            className="relative inline-block text-xl sm:text-2xl md:text-3xl font-mono font-bold transition-colors group"
            style={{ color: "var(--text-primary)" }}
          >
            mehrshad@omnilertlab.dev
            <span
              className="absolute bottom-0 left-0 w-full h-0.5 rounded-full animate-gradient"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent-violet), var(--accent-cyan), var(--accent-amber), var(--accent-violet))",
                backgroundSize: "200% 100%",
              }}
            />
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <a
            href="https://github.com/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover rounded-xl p-3 transition-all hover:text-violet-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Github size={20} />
          </a>
          <a
            href="https://ir.linkedin.com/in/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover rounded-xl p-3 transition-all hover:text-cyan-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://twitter.com/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover rounded-xl p-3 transition-all hover:text-amber-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Twitter size={20} />
          </a>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm italic"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-fraunces), serif",
          }}
        >
          &ldquo;Somewhere between the terminal and tomorrow&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
