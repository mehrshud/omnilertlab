"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "/work", href: "#projects" },
  { label: "/about", href: "#about" },
  { label: "/order", href: "#order" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className={`glass rounded-full px-2 py-1.5 flex items-center gap-1 transition-all duration-500 ${
            scrolled
              ? "shadow-lg shadow-black/20"
              : ""
          }`}
          style={{
            backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(20px) saturate(180%)",
            WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(20px) saturate(180%)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            className="px-3 py-1.5 font-bold text-sm tracking-wider"
            style={{
              fontFamily: "var(--font-syne), system-ui",
              color: "var(--text-primary)",
            }}
          >
            MH
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-200 ${
                  activeSection === l.href
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
              color: "#fff",
            }}
          >
            Let&apos;s Talk →
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ color: "var(--text-primary)" }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)" }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-mono font-bold transition-colors hover:text-violet-400"
                  style={{ color: "var(--text-primary)" }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold px-6 py-3 rounded-full mt-4"
                style={{
                  background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
                  color: "#fff",
                }}
              >
                Let&apos;s Talk →
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
