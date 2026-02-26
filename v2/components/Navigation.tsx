"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "Work",     href: "#projects",     thumb: "/thumbs/work.jpg" },
  { label: "About",    href: "#about",         thumb: "/thumbs/about.jpg" },
  { label: "Terminal", href: "#terminal",      thumb: "/thumbs/terminal.jpg" },
  { label: "Stack",    href: "#stack",         thumb: "/thumbs/stack.jpg" },
  { label: "Contact",  href: "#contact",       thumb: "/thumbs/contact.jpg" },
];

// Easter egg key sequence: type "omni" to reveal a secret nav link
const EASTER_EGG_CODE = "omni";

export function Navigation() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const linksRef     = useRef<HTMLUListElement>(null);
  const thumbRef     = useRef<HTMLDivElement>(null);
  const thumbImgRef  = useRef<HTMLImageElement>(null);
  const inputBuffer  = useRef("");

  const openMenu = useCallback(() => {
    setOpen(true);
    const tl = gsap.timeline();
    tl.set(overlayRef.current, { display: "flex", clipPath: "inset(100% 0 0 0)" })
      .to(overlayRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.7,
        ease: "power4.inOut",
      })
      .from(
        linksRef.current!.querySelectorAll("li"),
        { y: 60, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );
  }, []);

  const closeMenu = useCallback(() => {
    const tl = gsap.timeline({ onComplete: () => setOpen(false) });
    tl.to(linksRef.current!.querySelectorAll("li"), {
      y: -40, opacity: 0, stagger: 0.05, duration: 0.4, ease: "power3.in",
    }).to(overlayRef.current, {
      clipPath: "inset(0% 0 100% 0)",
      duration: 0.6,
      ease: "power4.inOut",
    });
  }, []);

  const showThumb = useCallback((src: string) => {
    if (thumbImgRef.current) thumbImgRef.current.src = src;
    gsap.to(thumbRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const hideThumb = useCallback(() => {
    gsap.to(thumbRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.4,
      ease: "power3.in",
    });
  }, []);

  // Easter egg: listen for "omni" typed anywhere
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      inputBuffer.current += e.key.toLowerCase();
      inputBuffer.current = inputBuffer.current.slice(-EASTER_EGG_CODE.length);
      if (inputBuffer.current === EASTER_EGG_CODE) {
        setEasterEgg(true);
      }
      // Escape closes menu
      if (e.key === "Escape" && open) closeMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeMenu]);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
          padding: "24px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <a
          href="#main-content"
          style={{ pointerEvents: "auto", fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.05em" }}
          aria-label="OmnilertLab Home"
        >
          OL
        </a>

        <div style={{ display: "flex", gap: 16, alignItems: "center", pointerEvents: "auto" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{
              background: "none", border: "1px solid var(--color-border)",
              borderRadius: "100px", padding: "6px 14px",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
              color: "var(--color-muted)", textTransform: "uppercase",
            }}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {/* Hamburger */}
          <button
            onClick={open ? closeMenu : openMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              background: "none", border: "none",
              display: "flex", flexDirection: "column", gap: 5, padding: 4,
            }}
            data-cursor="Menu"
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                style={{
                  display: "block", width: 28, height: 1,
                  background: "var(--color-text)",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform: open
                    ? i === 0 ? "translateY(3px) rotate(45deg)" : "translateY(-3px) rotate(-45deg)"
                    : "none",
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* ── Overlay Menu ────────────────────────────── */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{
          display: "none",
          position: "fixed", inset: 0, zIndex: 499,
          background: "var(--color-bg-2)",
          clipPath: "inset(100% 0 0 0)",
          flexDirection: "row",
          alignItems: "center",
          padding: "0 10vw",
          gap: "10vw",
        }}
      >
        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          <ul ref={linksRef} style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="display-lg"
                  onMouseEnter={() => showThumb(link.thumb)}
                  onMouseLeave={hideThumb}
                  data-cursor="Go"
                  style={{
                    display: "block",
                    color: "var(--color-text)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    lineHeight: 1.1,
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {/* Easter egg link */}
            {easterEgg && (
              <li>
                <a
                  href="#secret"
                  onClick={closeMenu}
                  className="display-lg"
                  style={{
                    display: "block",
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}
                >
                  🔐 Secret
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* Thumbnail preview */}
        <div
          ref={thumbRef}
          style={{
            width: "30vw",
            aspectRatio: "16/10",
            overflow: "hidden",
            borderRadius: 8,
            clipPath: "inset(0% 0% 100% 0%)",
          }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={thumbImgRef}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </>
  );
}
