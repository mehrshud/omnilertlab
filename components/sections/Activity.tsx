"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { GitCommit, Clock } from "lucide-react";

interface Project {
  name: string;
  language: string | null;
  pushedAt: string;
  stars: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Activity({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Language breakdown
  const langBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      if (p.language) counts[p.language] = (counts[p.language] || 0) + 1;
    });
    const total = Object.values(counts).reduce((s, c) => s + c, 0);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang, count]) => ({
        lang,
        count,
        pct: Math.round((count / total) * 100),
        color: LANG_COLORS[lang] || "#8b9bb8",
      }));
  }, [projects]);

  const lastPush = projects.length > 0 ? projects[0] : null;

  // Simulate contribution data for visualization
  const weeks = 20;
  const days = 7;

  return (
    <section id="activity" ref={ref} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-green)" }}
          >
            / activity
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12"
            style={{ fontFamily: "var(--font-syne), system-ui" }}
          >
            GitHub <span className="gradient-text">activity.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Contribution graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 glass rounded-2xl p-6"
          >
            <h3
              className="text-sm font-mono mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Contribution Graph
            </h3>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
              {Array.from({ length: weeks }).map((_, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {Array.from({ length: days }).map((_, d) => {
                    const intensity = Math.random();
                    const isActive = intensity > 0.5;
                    return (
                      <motion.div
                        key={d}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          delay: 0.3 + (w * days + d) * 0.003,
                          duration: 0.2,
                        }}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          background: isActive
                            ? intensity > 0.85
                              ? "var(--accent-violet)"
                              : intensity > 0.7
                              ? "rgba(124,58,237,0.6)"
                              : "rgba(124,58,237,0.3)"
                            : "rgba(255,255,255,0.04)",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar stats */}
          <div className="flex flex-col gap-4">
            {/* Last push ticker */}
            {lastPush && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <GitCommit size={14} style={{ color: "var(--accent-green)" }} />
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Latest Push
                  </span>
                </div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {lastPush.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  <Clock size={11} />
                  {timeAgo(lastPush.pushedAt)}
                </div>
              </motion.div>
            )}

            {/* Language donut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-2xl p-5 flex-1"
            >
              <h3
                className="text-xs font-mono mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Language Breakdown
              </h3>

              {/* Bar chart */}
              <div className="flex flex-col gap-2.5">
                {langBreakdown.map((l, i) => (
                  <div key={l.lang}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: l.color }}
                        />
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {l.lang}
                        </span>
                      </div>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {l.pct}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${l.pct}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: l.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
