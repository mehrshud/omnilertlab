"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/layout/Navbar";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Activity from "@/components/sections/Activity";
import Order from "@/components/sections/Order";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import type { GitHubRepo } from "@/lib/github";

export default function ClientPage({ projects }: { projects: GitHubRepo[] }) {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const { progress } = useScrollProgress();

  return (
    <>
      {/* Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* Custom cursor (hidden on mobile via CSS) */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, var(--accent-violet), var(--accent-cyan), var(--accent-amber))",
          transformOrigin: "0%",
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        <Hero />
        <About projects={projects} />
        <Skills />
        <Projects projects={projects} />
        <Activity projects={projects} />
        <Order />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
