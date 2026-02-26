"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, Clock, ExternalLink, Globe, ChevronDown, ChevronUp } from "lucide-react";
import TechTag from "./TechTag";

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

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Solidity: "#AA6746",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [loadingReadme, setLoadingReadme] = useState(false);

  const langColor = LANG_COLORS[project.language || ""] || "#8b9bb8";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (isExpanded) return; // Disable tilt when expanded
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, [isExpanded]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  const fetchReadme = async () => {
    if (readme !== null) return;
    setLoadingReadme(true);
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${project.fullName}/${project.defaultBranch}/README.md`);
      if (res.ok) {
        const text = await res.text();
        setReadme(text);
      } else {
        setReadme("No README found.");
      }
    } catch {
      setReadme("Error loading README.");
    } finally {
      setLoadingReadme(false);
    }
  };

  const handleExpand = () => {
    if (!isExpanded) fetchReadme();
    setIsExpanded(!isExpanded);
    if (!isExpanded && cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        layout
        className={`glass glass-hover rounded-2xl p-5 flex flex-col gap-3 group relative overflow-hidden cursor-pointer ${isExpanded ? 'h-auto z-50' : ''}`}
        style={{
          willChange: "transform",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        }}
        onClick={handleExpand}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none transition-opacity duration-500 rounded-2xl" />

        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            border: `1px solid ${langColor}30`,
            boxShadow: `inset 0 0 30px ${langColor}10`,
          }}
        />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <motion.div layout="position" className="flex-1 min-w-0">
            <h3
              className="font-semibold text-base mb-1.5 truncate"
              style={{ fontFamily: "var(--font-syne), system-ui", color: "var(--text-primary)" }}
            >
              {project.name}
            </h3>
            <p className={`text-xs leading-relaxed ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`} style={{ color: "var(--text-muted)" }}>
              {project.description}
            </p>
          </motion.div>
          
          <div className="flex gap-2 flex-shrink-0 flex-col items-end">
             <div className="flex gap-2">
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="glass rounded-lg p-1.5 glass-hover transition-all hover:text-cyan-400"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Globe size={14} />
                  </a>
                )}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="glass rounded-lg p-1.5 glass-hover transition-all hover:text-violet-400"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ExternalLink size={14} />
                </a>
              </div>
          </div>
        </div>

        <motion.div layout="position" className="flex flex-wrap gap-1.5 relative z-10 mt-1">
          {project.languages?.slice(0, 3).map((l) => (
            <span key={l} className="text-[10px] font-mono border border-white/10 px-2 py-0.5 rounded-full" style={{ color: LANG_COLORS[l] || '#8b9bb8' }}>{l}</span>
          ))}
          {project.topics.slice(0, 2).map((t) => (
             <span key={t} className="text-[10px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-slate-400">{t}</span>
          ))}
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               className="relative z-10 mt-4 overflow-hidden border-t border-white/10 pt-4"
               onClick={(e) => e.stopPropagation()}
            >
               <div className="text-xs text-slate-300 mb-2 font-semibold">README.md</div>
               <div className="text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar p-3 bg-black/40 rounded-lg text-slate-400">
                  {loadingReadme ? "Loading..." : (readme?.slice(0, 1000) + (readme && readme.length > 1000 ? "..." : "") || "No README content.")}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout="position" className="flex items-center gap-4 text-xs font-mono relative z-10 mt-auto pt-2" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: langColor }} />
            {project.language || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={11} />
            {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={11} />
            {project.forks}
          </span>
          <span className="flex items-center gap-1 ml-auto text-[10px]">
            {isExpanded ? <ChevronUp size={14} className="animate-pulse" /> : <ChevronDown size={14} />}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
