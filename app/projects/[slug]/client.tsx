"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Github, Globe, Star, GitFork, Clock, Code2, Database, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import TechTag from "@/components/ui/TechTag";
import type { GitHubRepo } from "@/lib/github";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  if (d < 365) return `${Math.floor(d / 30)} months ago`;
  return `${Math.floor(d / 365)} years ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function ProjectDetailClient({
  project,
}: {
  project: GitHubRepo;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <motion.a
            href="/#projects"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-xs font-mono glass glass-hover px-4 py-2 rounded-full mb-8 transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} /> Back to Projects
          </motion.a>

          {/* Project header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-syne), system-ui" }}
            >
              {project.name}
            </h1>
            <p
              className="text-lg mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {project.description}
            </p>

            {/* Topics */}
            {project.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.topics.map((t) => (
                  <TechTag key={t} label={t} />
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 mb-12">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
                  color: "#fff",
                }}
              >
                <Github size={16} /> View Code
              </a>
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold glass glass-hover transition-all"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Globe size={16} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Star, label: "Stars", value: project.stars },
              { icon: GitFork, label: "Forks", value: project.forks },
              {
                icon: Code2,
                label: "Language",
                value: project.language || "—",
              },
              {
                icon: Database,
                label: "Size",
                value: formatSize(project.size),
              },
            ].map((s) => (
              <GlassCard key={s.label} className="p-4 flex flex-col gap-2">
                <div
                  className="flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  <s.icon size={12} /> {s.label}
                </div>
                <span className="text-xl font-bold gradient-text">
                  {s.value}
                </span>
              </GlassCard>
            ))}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h3
                className="text-sm font-mono mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Timeline
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm font-mono">
                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Created
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Last Updated
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Last Push
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {timeAgo(project.pushedAt)}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
