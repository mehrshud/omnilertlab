"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> initializing omnilertlab...",
  "> loading assets █████████ 100%",
  "> ready.",
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);

  const typeNextChar = useCallback(() => {
    if (currentLine >= BOOT_LINES.length) {
      setTimeout(() => setExiting(true), 300);
      setTimeout(onComplete, 1200);
      return;
    }

    const line = BOOT_LINES[currentLine];
    if (displayedText.length < line.length) {
      setDisplayedText(line.slice(0, displayedText.length + 1));
    } else {
      setCompletedLines((prev) => [...prev, line]);
      setDisplayedText("");
      setCurrentLine((prev) => prev + 1);
    }
  }, [currentLine, displayedText, onComplete]);

  useEffect(() => {
    const speed = currentLine === 1 ? 15 : 30;
    const timer = setTimeout(typeNextChar, speed);
    return () => clearTimeout(timer);
  }, [typeNextChar, currentLine]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: "var(--bg-void)" }}
        >
          <div className="max-w-md w-full px-6">
            <div
              className="glass rounded-xl p-6 font-mono text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {completedLines.map((line, i) => (
                <div
                  key={i}
                  className="mb-1"
                  style={{
                    color:
                      line.includes("ready")
                        ? "var(--accent-green)"
                        : "var(--accent-cyan)",
                  }}
                >
                  {line}
                </div>
              ))}
              {currentLine < BOOT_LINES.length && (
                <div style={{ color: "var(--accent-cyan)" }}>
                  {displayedText}
                  <span className="cursor-blink" style={{ color: "var(--accent-violet)" }}>
                    █
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
