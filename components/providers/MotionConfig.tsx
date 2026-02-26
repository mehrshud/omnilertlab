"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export function AppMotionConfig({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <MotionConfig
      reducedMotion="user"
      transition={
        reduced ? { duration: 0.01 } : undefined
      }
    >
      {children}
    </MotionConfig>
  );
}
