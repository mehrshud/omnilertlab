"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

interface Project {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  stars: number;
  forks: number;
  language: string | null;
  languages: string[];
  topics: string[];
  pushedAt: string;
  defaultBranch: string;
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Web Apps", value: "web" },
  { label: "AI/ML", value: "ai" },
  { label: "Three.js", value: "threejs" },
  { label: "Python", value: "Python" },
  { label: "Rust", value: "Rust" },
];

function matchFilter(project: Project, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "web")
    return (
      project.language === "TypeScript" ||
      project.language === "JavaScript" ||
      project.topics.some((t) =>
        ["nextjs", "react", "web", "website", "webapp"].includes(t.toLowerCase())
      )
    );
  if (filter === "ai")
    return project.topics.some((t) =>
      ["ai", "ml", "machine-learning", "llm", "gpt", "langchain", "openai"].includes(
        t.toLowerCase()
      )
    );
  if (filter === "threejs")
    return project.topics.some((t) =>
      ["threejs", "three-js", "3d", "webgl"].includes(t.toLowerCase())
    );
  // Language match
  return project.language === filter;
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = projects.filter((p) => matchFilter(p, filter));
  const featured = filtered.slice(0, 6);
  const remaining = filtered.slice(6);

  return (
    <section id="projects" ref={ref} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--accent-violet)" }}
            >
              / projects
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "var(--font-syne), system-ui" }}
            >
              Live <span className="gradient-text">GitHub</span> projects
            </h2>
          </div>
          <a
            href="https://github.com/mehrshud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono glass glass-hover px-4 py-2 rounded-full transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <Github size={14} /> View all <ArrowUpRight size={12} />
          </a>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value);
                setShowAll(false);
              }}
              className="text-xs font-mono px-4 py-1.5 rounded-full transition-all duration-200"
              style={{
                background:
                  filter === f.value
                    ? "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))"
                    : "var(--glass-bg)",
                color: filter === f.value ? "#fff" : "var(--text-muted)",
                border: `1px solid ${
                  filter === f.value ? "transparent" : "var(--glass-border)"
                }`,
              }}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Featured grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: "var(--text-muted)" }}
          >
            <Github size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-mono text-sm">No projects match this filter.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {featured.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Show more / remaining */}
        {remaining.length > 0 && (
          <div className="mt-8">
            {!showAll ? (
              <motion.button
                onClick={() => setShowAll(true)}
                className="mx-auto block text-xs font-mono glass glass-hover px-6 py-2.5 rounded-full transition-all"
                style={{ color: "var(--text-muted)" }}
                whileTap={{ scale: 0.97 }}
              >
                Show {remaining.length} more projects ↓
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {remaining.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
