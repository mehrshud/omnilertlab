"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "amber";
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  variant = "primary",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const cursorXSpring = useSpring(x, springConfig);
  const cursorYSpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    variant === "primary"
      ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
      : variant === "amber"
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold"
      : "glass border border-white/10 text-white";

  const pulseGlow =
    variant === "amber"
      ? "shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]"
      : "";

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: cursorXSpring, y: cursorYSpring }}
      whileTap={{ scale: 0.95 }}
    >
      <Tag
        href={href}
        onClick={onClick}
        data-magnetic="true"
        className={cn(
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
          baseStyles,
          pulseGlow,
          className
        )}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
