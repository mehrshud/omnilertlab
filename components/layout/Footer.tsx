"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="py-12 px-4 border-t"
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <span
          className="font-bold tracking-widest text-sm gradient-text"
          style={{ fontFamily: "var(--font-syne), system-ui" }}
        >
          OMNILERTLAB
        </span>

        <p
          className="text-xs font-mono text-center italic"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-fraunces), serif" }}
        >
          &ldquo;Somewhere between the terminal and tomorrow&rdquo;
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover p-2 rounded-xl transition-all hover:text-violet-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Github size={16} />
          </a>
          <a
            href="https://ir.linkedin.com/in/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover p-2 rounded-xl transition-all hover:text-cyan-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:mehrshad@omnilertlab.dev"
            className="glass glass-hover p-2 rounded-xl transition-all hover:text-amber-400"
            style={{ color: "var(--text-muted)" }}
          >
            <Mail size={16} />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t flex items-center justify-center" style={{ borderColor: "var(--glass-border)" }}>
        <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Omnilertlab · Mehrshad Hamavandy · All
          systems operational
        </p>
      </div>
    </footer>
  );
}
