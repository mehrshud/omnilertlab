"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import * as d3 from "d3-force";

interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  category: "Frontend" | "Backend" | "AI/ML" | "DevOps";
  level: number;
}

interface SkillLink extends d3.SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
}

const SKILLS: SkillNode[] = [
  { id: "React", category: "Frontend", level: 5 },
  { id: "Next.js", category: "Frontend", level: 5 },
  { id: "TypeScript", category: "Frontend", level: 5 },
  { id: "Three.js", category: "Frontend", level: 4 },
  { id: "Tailwind CSS", category: "Frontend", level: 5 },
  { id: "Framer Motion", category: "Frontend", level: 4 },
  { id: "HTML/CSS", category: "Frontend", level: 5 },
  { id: "Node.js", category: "Backend", level: 5 },
  { id: "Python", category: "Backend", level: 4 },
  { id: "Rust", category: "Backend", level: 3 },
  { id: "PostgreSQL", category: "Backend", level: 4 },
  { id: "Supabase", category: "Backend", level: 4 },
  { id: "REST APIs", category: "Backend", level: 5 },
  { id: "GraphQL", category: "Backend", level: 3 },
  { id: "TensorFlow", category: "AI/ML", level: 3 },
  { id: "LangChain", category: "AI/ML", level: 4 },
  { id: "OpenAI API", category: "AI/ML", level: 5 },
  { id: "RAG Systems", category: "AI/ML", level: 4 },
  { id: "Vercel", category: "DevOps", level: 5 },
  { id: "Docker", category: "DevOps", level: 4 },
  { id: "Git", category: "DevOps", level: 5 },
  { id: "CI/CD", category: "DevOps", level: 4 },
  { id: "Linux", category: "DevOps", level: 4 },
];

const LINKS: SkillLink[] = [
  { source: "React", target: "Next.js" },
  { source: "TypeScript", target: "React" },
  { source: "TypeScript", target: "Next.js" },
  { source: "TypeScript", target: "Node.js" },
  { source: "HTML/CSS", target: "React" },
  { source: "Tailwind CSS", target: "React" },
  { source: "Framer Motion", target: "React" },
  { source: "Three.js", target: "React" },
  { source: "Node.js", target: "REST APIs" },
  { source: "Node.js", target: "GraphQL" },
  { source: "Node.js", target: "PostgreSQL" },
  { source: "Supabase", target: "PostgreSQL" },
  { source: "Python", target: "TensorFlow" },
  { source: "Python", target: "LangChain" },
  { source: "LangChain", target: "OpenAI API" },
  { source: "RAG Systems", target: "LangChain" },
  { source: "Vercel", target: "Next.js" },
  { source: "Docker", target: "Linux" },
  { source: "CI/CD", target: "Git" },
  { source: "Docker", target: "Node.js" },
  { source: "Rust", target: "Node.js" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#7c3aed", // violet
  Backend: "#06b6d4", // cyan
  "AI/ML": "#f59e0b", // amber
  DevOps: "#10b981", // green
};

function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const height = 600;

    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Deep copy to prevent mutation issues with hot reload
    const nodes: SkillNode[] = SKILLS.map(d => ({ ...d }));
    const links: SkillLink[] = LINKS.map(d => ({ ...d }));

    const simulation = d3
      .forceSimulation<SkillNode>(nodes)
      .force("link", d3.forceLink<SkillNode, SkillLink>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => (d as SkillNode).level * 6 + 10))
      .on("tick", ticked);

    function ticked() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw links
      ctx.beginPath();
      links.forEach((d) => {
        const source = d.source as SkillNode;
        const target = d.target as SkillNode;
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
      });
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw nodes
      nodes.forEach((d) => {
        const radius = d.level * 3 + 8;
        ctx.beginPath();
        ctx.arc(d.x!, d.y!, radius, 0, 2 * Math.PI);
        ctx.fillStyle = CATEGORY_COLORS[d.category];
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = "11px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.textAlign = "center";
        ctx.fillText(d.id, d.x!, d.y! + radius + 12);
      });
    }

    let isDragging = false;
    let dragNode: SkillNode | null = null;

    const pointerDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      dragNode = nodes.find(d => {
        const dx = d.x! - x;
        const dy = d.y! - y;
        return dx * dx + dy * dy < 400; // rough hit area
      }) || null;

      if (dragNode) {
        isDragging = true;
        simulation.alphaTarget(0.3).restart();
        dragNode.fx = x;
        dragNode.fy = y;
      }
    };

    const pointerMove = (e: MouseEvent) => {
      if (!isDragging || !dragNode) return;
      const rect = canvas.getBoundingClientRect();
      dragNode.fx = e.clientX - rect.left;
      dragNode.fy = e.clientY - rect.top;
    };

    const pointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      simulation.alphaTarget(0);
      if (dragNode) {
        dragNode.fx = null;
        dragNode.fy = null;
        dragNode = null;
      }
    };

    canvas.addEventListener("mousedown", pointerDown);
    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("mouseup", pointerUp);

    return () => {
      simulation.stop();
      canvas.removeEventListener("mousedown", pointerDown);
      window.removeEventListener("mousemove", pointerMove);
      window.removeEventListener("mouseup", pointerUp);
    };
  }, []);

  return (
    <div className="relative mx-auto hidden md:flex items-center justify-center min-h-[600px] cursor-grab active:cursor-grabbing w-full">
      <canvas ref={canvasRef} className="max-w-full" style={{ touchAction: 'none' }} />
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const categories = ["Frontend", "Backend", "AI/ML", "DevOps"] as const;

  return (
    <section id="skills" ref={ref} className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-cyan)" }}
          >
            / skills
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "var(--font-syne), system-ui" }}
          >
            Tech <span className="gradient-text">constellation.</span>
          </h2>
          <p className="text-sm mb-12 max-w-lg" style={{ color: "var(--text-muted)" }}>
            A directed network graph of my technical toolkit. Nodes are physics-enabled on desktop—pull them around!
          </p>
        </motion.div>

        {/* Category legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-10"
        >
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {cat}
              </span>
            </div>
          ))}
        </motion.div>

        {/* D3 Canvas Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass rounded-3xl overflow-hidden border border-white/5"
        >
          <NetworkGraph />

          {/* Mobile: simple grid fallback */}
          <div className="md:hidden grid grid-cols-2 gap-4 p-6">
            {categories.map((cat) => (
              <div key={cat} className="glass rounded-xl p-4">
                <h4
                  className="font-mono text-xs font-bold mb-3"
                  style={{ color: CATEGORY_COLORS[cat] }}
                >
                  {cat}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS.filter((s) => s.category === cat).map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] font-mono px-2 py-1 rounded-full"
                      style={{
                        background: `${CATEGORY_COLORS[cat]}15`,
                        color: CATEGORY_COLORS[cat],
                        border: `1px solid ${CATEGORY_COLORS[cat]}25`,
                      }}
                    >
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
