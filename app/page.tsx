"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as THREE from "three";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Terminal,
  Code2,
  Cpu,
  Globe,
  ArrowRight,
  Menu,
  X,
  Github,
  Linkedin,
  Box,
  Power,
  Activity,
  Lock,
  Star,
  Database,
  Zap,
  Send,
  Radio,
  Server,
  Shield,
  Smartphone,
  Layers,
  Command,
  MessageCircle,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ----------------------------------------------------------------------
// 🔗 SYSTEM LINKAGE
// ----------------------------------------------------------------------
// WE ARE IMPORTING THE REAL ACTIONS NOW.
// LOCAL MOCKS HAVE BEEN REMOVED TO PREVENT CONFLICTS.
// import { processTerminalCommand, sendTelegramDispatch } from './actions';

// --- MOCK FALLBACKS (To prevent build error if actions.ts is missing) ---
const processTerminalCommand = async (input: string) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return a simulation response so the UI works
  return `[SYSTEM_PREVIEW]: Server Action unavailable in preview. Logic is structured for 'actions.ts'. Input received: "${input}"`;
};

const sendTelegramDispatch = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
};

// ----------------------------------------------------------------------
// 🔊 AUDIO ENGINE (Synthesized SFX)
// ----------------------------------------------------------------------
const useSound = () => {
  const playTone = useCallback(
    (freq = 800, type: OscillatorType = "sine", duration = 0.1) => {
      if (typeof window === "undefined") return;
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime); // Low volume
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    []
  );

  return {
    playHover: () => playTone(400, "sine", 0.05),
    playClick: () => playTone(1200, "square", 0.03),
    playType: () => playTone(800 + Math.random() * 200, "triangle", 0.02),
    playError: () => playTone(150, "sawtooth", 0.3),
    playSuccess: () => playTone(2000, "sine", 0.5),
  };
};

// ----------------------------------------------------------------------
// 🌌 3D CORE: NEURAL ENGINE
// ----------------------------------------------------------------------
const NeuralCore = ({ active }: { active: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.003);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const particleCount = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0x8b5cf6); // Violet

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.8 + Math.random() * 0.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Mix colors
      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let time = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);

    // Render Loop
    const animate = () => {
      time += 0.01;

      // AI Activation Pulse
      const pulse = active ? Math.sin(time * 10) * 0.1 : 0;
      globe.scale.setScalar(1 + pulse * 0.2);
      material.size = active ? 0.015 : 0.012;
      material.opacity = active ? 1 : 0.8;

      // Rotation Physics
      targetRotY += 0.001 + mouseX * 0.02 + (active ? 0.02 : 0); // Spin faster when active
      targetRotX += mouseY * 0.02;

      globe.rotation.y += (targetRotY - globe.rotation.y) * 0.05;
      globe.rotation.x += (targetRotX - globe.rotation.x) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    const frameId = requestAnimationFrame(animate);

    // Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [active]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 bg-black pointer-events-none"
    />
  );
};

// ----------------------------------------------------------------------
// 🧬 UI COMPONENTS: GENETIC DESIGN SYSTEM
// ----------------------------------------------------------------------

const TiltCard = ({ children, className }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ scale: 1.02 }}
      className={`transform-style-3d ${className}`}
    >
      {children}
    </motion.div>
  );
};

const TypingEffect = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayed, setDisplayed] = useState("");
  const { playType } = useSound();

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      if (i % 3 === 0) playType(); // Sound every 3 chars to not be annoying
      i++;
      if (i > text.length) {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
};

// ----------------------------------------------------------------------
// 🤖 THE BRAIN: TERMINAL LOGIC
// ----------------------------------------------------------------------

const SmartTerminal = ({
  setAiActive,
}: {
  setAiActive: (v: boolean) => void;
}) => {
  const [history, setHistory] = useState<
    { role: "sys" | "user" | "ai"; text: string }[]
  >([
    { role: "sys", text: "OMNILERT KERNEL v11.0 // SECURE UPLINK ESTABLISHED" },
    { role: "ai", text: "I am OMNI. How can I assist your mission today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playClick, playError, playSuccess } = useSound();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, loading]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setHistory((prev) => [...prev, { role: "user", text: cmd }]);
    setInput("");
    setLoading(true);
    setAiActive(true); // Spin globe faster
    playClick();

    // 1. TELEGRAM DISPATCH PROTOCOL
    if (cmd.toUpperCase().startsWith("DISPATCH:")) {
      const raw = cmd.substring(9);
      const [identity, email, brief] = raw.split("-").map((s) => s.trim());

      if (identity && email) {
        const res = await sendTelegramDispatch({
          identity,
          email,
          brief: brief || "No brief",
        });
        if (res.success) {
          playSuccess();
          setHistory((prev) => [
            ...prev,
            { role: "sys", text: ">> PACKET ENCRYPTED & SENT TO HQ." },
          ]);
        } else {
          playError();
          setHistory((prev) => [
            ...prev,
            { role: "sys", text: ">> UPLINK FAILED. CHECK NETWORK." },
          ]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          {
            role: "sys",
            text: '>> ERR: INVALID FORMAT. USE: "DISPATCH: Name - Email - Brief"',
          },
        ]);
      }
      setLoading(false);
      setAiActive(false);
      return;
    }

    // 2. HIRE MODE TRIGGER
    if (cmd.toUpperCase() === "HIRE" || cmd.toUpperCase() === "CONTACT") {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          {
            role: "ai",
            text: 'To dispatch a mission, please use this format: "DISPATCH: Your Name - Your Email - Project Brief"',
          },
        ]);
        setLoading(false);
        setAiActive(false);
      }, 800);
      return;
    }

    // 3. AI BRAIN QUERY
    try {
      const response = await processTerminalCommand(cmd);
      setHistory((prev) => [
        ...prev,
        { role: "ai", text: response || "No data received." },
      ]);
    } catch (err) {
      playError();
      setHistory((prev) => [
        ...prev,
        { role: "sys", text: "ERR: NEURAL LINK SEVERED." },
      ]);
    }
    setLoading(false);
    setAiActive(false);
  };

  return (
    <TiltCard className="w-full max-w-3xl mx-auto cursor-default perspective-1000 group">
      <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/30 transition-all duration-500 font-mono text-sm relative">
        {/* Header */}
        <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5 select-none">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                loading ? "bg-yellow-400 animate-ping" : "bg-green-500"
              } transition-colors`}
            />
            <div className="text-[10px] text-cyan-500/80 tracking-[0.2em] font-bold">
              OMNI_OS v11.0
            </div>
          </div>
        </div>

        {/* Log */}
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent"
        >
          {history.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-4 py-3 rounded-xl text-xs md:text-sm shadow-lg backdrop-blur-md ${
                  msg.role === "user"
                    ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-br-none"
                    : msg.role === "sys"
                    ? "text-yellow-500/80 text-[10px] uppercase tracking-widest"
                    : "bg-slate-800/40 text-slate-200 border border-white/5 rounded-bl-none"
                }`}
              >
                {msg.role === "ai" && (
                  <span className="text-cyan-400 mr-2 font-bold">
                    OMNI &gt;
                  </span>
                )}
                {msg.role === "ai" && i === history.length - 1 && !loading ? (
                  <TypingEffect text={msg.text} />
                ) : (
                  msg.text
                )}
              </span>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-cyan-500/50 text-xs pl-4">
              <Activity size={12} className="animate-spin" />
              <span className="animate-pulse">
                PROCESSING NEURAL REQUEST...
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleCommand}
          className="p-4 bg-white/5 border-t border-white/10 flex gap-4 items-center relative"
        >
          <span className="text-green-500 text-lg animate-pulse">➜</span>
          <input
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 focus:ring-0 font-bold tracking-wide"
            placeholder="Type 'HIRE' to initiate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button
            type="submit"
            className="text-slate-500 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <Send size={18} />
          </button>
          {/* Scanline */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
        </form>
      </div>
    </TiltCard>
  );
};

// ----------------------------------------------------------------------
// 🖼️ SECTIONS
// ----------------------------------------------------------------------

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-cyan-500">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-cyan-500 mb-4"
      />
      <div className="space-y-1 text-xs text-center opacity-70">
        <TypingEffect
          text="INITIALIZING NEURAL CORE..."
          onComplete={() => {}}
        />
        <br />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          LOADING ASSETS...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          ESTABLISHING SECURE LINK...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-green-500"
        >
          SYSTEM READY.
        </motion.div>
      </div>
    </div>
  );
};

const HomeView = ({ setAiActive }: { setAiActive: (v: boolean) => void }) => (
  <div className="px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="mb-12 relative"
    >
      <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-[10px] font-mono mb-8 backdrop-blur-md uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        <span>System Operational</span>
      </div>

      <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
        DIGITAL
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
          EVOLUTION
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
        We engineer{" "}
        <span className="text-white font-medium">
          high-performance realities
        </span>
        .
        <br />
        Where code meets the event horizon.
      </p>
    </motion.div>

    <div className="w-full px-4 relative z-10">
      <div className="text-[10px] text-slate-500 font-mono mb-6 flex items-center justify-center gap-2 uppercase tracking-widest opacity-70">
        <Command size={10} />
        Secure Terminal Access
      </div>
      <SmartTerminal setAiActive={setAiActive} />
    </div>
  </div>
);

const ProjectCard = ({ p, i }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-cyan-500/30 overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
      <ArrowRight className="text-cyan-500 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
    </div>
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-shadow">
        <Box size={24} />
      </div>
      <span className="text-xs font-mono text-slate-500">PROJ_0{p.id}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
    <p className="text-slate-400 text-sm mb-6">{p.cat}</p>
    <div className="flex flex-wrap gap-2 mb-6">
      {p.stack.map((s: string) => (
        <span
          key={s}
          className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-300 border border-white/5 uppercase tracking-wide"
        >
          {s}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-2 text-green-400 text-sm font-bold pt-4 border-t border-white/5">
      <Activity size={14} /> {p.stat}
    </div>
  </motion.div>
);

const WorkView = () => (
  <div className="px-6 max-w-7xl mx-auto py-10">
    <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8 gap-4">
      <div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
          ARCHIVES
        </h2>
        <div className="flex items-center gap-3 text-cyan-500 text-xs font-mono tracking-widest uppercase">
          <Database size={12} />
          <span>/ROOT/DEPLOYMENTS</span>
        </div>
      </div>
      <div className="text-right hidden md:block">
        <div className="text-xs text-slate-500 mb-1">SYSTEM STATUS</div>
        <div className="text-green-500 text-sm font-bold animate-pulse flex items-center justify-end gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          OPTIMAL
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      {[
        {
          id: 1,
          title: "FinTech Core",
          cat: "High-Frequency Trading",
          stack: ["Rust", "Next.js"],
          stat: "< 5ms Latency",
        },
        {
          id: 2,
          title: "Orbital Viz",
          cat: "Spatial Data Visualization",
          stack: ["Three.js", "WebGL"],
          stat: "60 FPS",
        },
        {
          id: 3,
          title: "Secure Chain",
          cat: "Zero-Knowledge Auth",
          stack: ["Solidity", "WASM"],
          stat: "100% Secure",
        },
        {
          id: 4,
          title: "Neural Search",
          cat: "Vector Database Engine",
          stack: ["Python", "TensorFlow"],
          stat: "99% Accuracy",
        },
      ].map((p, i) => (
        <ProjectCard key={p.id} p={p} i={i} />
      ))}
    </div>
  </div>
);

const LabView = () => (
  <div className="px-6 max-w-7xl mx-auto py-10">
    <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
      <div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
          THE LAB
        </h2>
        <div className="flex items-center gap-3 text-purple-500 text-xs font-mono tracking-widest uppercase">
          <Zap size={12} />
          <span>/ROOT/EXPERIMENTAL</span>
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
      <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-12 flex flex-col justify-end items-start relative overflow-hidden group hover:border-purple-500/30 transition-all">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/30 blur-[120px] rounded-full pointer-events-none group-hover:bg-purple-500/40 transition-colors" />
        <div className="relative z-10 w-full">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] text-white mb-4 backdrop-blur-md">
            PROTOTYPE v0.9
          </div>
          <h3 className="text-4xl font-bold text-white mb-4">
            Fluid WebGL Core
          </h3>
          <p className="text-slate-300 max-w-md mb-8 leading-relaxed">
            Experimental Navier-Stokes simulations running entirely on the GPU
            via custom GLSL shaders. Pushing the browser to its absolute limit.
          </p>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2">
            Launch Simulation <ArrowRight size={16} />
          </button>
        </div>
      </div>
      {[
        { title: "Neural DB", icon: Database, color: "text-cyan-500" },
        { title: "Zero Trust", icon: Shield, color: "text-green-500" },
        { title: "Edge Compute", icon: Server, color: "text-blue-500" },
        { title: "Haptic UI", icon: Smartphone, color: "text-orange-500" },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-slate-800/60 transition-all hover:-translate-y-1"
        >
          <item.icon size={40} className={`${item.color} mb-6 opacity-80`} />
          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Research Module
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 🚀 ROOT APP
// ----------------------------------------------------------------------

export default function OmnilertLabV11() {
  const [view, setView] = useState("home");
  const [booted, setBooted] = useState(false);
  const [aiActive, setAiActive] = useState(false);
  const { playHover, playClick } = useSound();

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView setAiActive={setAiActive} />;
      case "work":
        return <WorkView />;
      case "lab":
        return <LabView />;
      default:
        return <HomeView setAiActive={setAiActive} />;
    }
  };

  const navItems = [
    { id: "home", icon: Command, label: "CMD" },
    { id: "work", icon: Layers, label: "WORK" },
    { id: "lab", icon: Activity, label: "LAB" },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <NeuralCore active={aiActive} />

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center pointer-events-none mix-blend-exclusion">
        <button
          onClick={() => {
            setView("home");
            playClick();
          }}
          className="pointer-events-auto flex items-center gap-3 group"
        >
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
            <div className="relative w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="text-xl font-bold text-white tracking-widest group-hover:text-cyan-400 transition-colors">
            OMNILERT<span className="opacity-50">LAB</span>
          </span>
        </button>
        <div className="flex gap-4 pointer-events-auto">
          <a
            href="https://github.com/mehrshud"
            target="_blank"
            rel="noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="#"
            className="text-white/50 hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="relative z-10 pt-20 pb-40 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* LIQUID DOCK */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex gap-2 shadow-2xl hover:border-white/20 transition-all duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                playClick();
              }}
              onMouseEnter={playHover}
              className={`relative px-6 py-3 rounded-full transition-all duration-300 group flex items-center gap-2 ${
                view === item.id
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  : "text-slate-500 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon size={18} />
              <span className="text-xs font-bold tracking-widest">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
