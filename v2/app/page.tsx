"use client";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/Hero/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TerminalSection } from "@/components/sections/TerminalSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { StackSection } from "@/components/sections/StackSection";
import { ContributionGraph } from "@/components/sections/ContributionGraph";
import { ChatWidget } from "@/components/ChatWidget";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div
        id="main-content"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}
        aria-hidden={!loaded}
      >
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <TerminalSection />
        <StatsSection />
        <ContributionGraph />
        <StackSection />
        <ChatWidget />
      </div>
    </>
  );
}
