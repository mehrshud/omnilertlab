"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassLevel = 0 | 1 | 2 | 3 | 4;

interface GlassCardProps {
  level?: GlassLevel;
  glow?: "violet" | "cyan" | "amber" | "none";
  tint?: "neutral" | "violet" | "cyan"; // preserved for future if needed
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
  children: ReactNode;
  [key: string]: any;
}

export default function GlassCard({
  level = 2,
  glow = "none",
  tint = "neutral",
  className = "",
  hover = true,
  as: Tag = "div",
  children,
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl glass-noise overflow-hidden",
        hover && "glass-hover",
        className
      )}
      style={{
        background: `var(--glass-${level}-bg)`,
        backdropFilter: `blur(var(--glass-${level}-blur))`,
        WebkitBackdropFilter: `blur(var(--glass-${level}-blur))`,
        border: `1px solid var(--glass-${level}-border)`,
        boxShadow: [
          "var(--shadow-card)",
          glow !== "none" ? `var(--shadow-glow-${glow})` : "",
        ]
          .filter(Boolean)
          .join(", "),
      }}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: "var(--glass-highlight)" }}
      />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
