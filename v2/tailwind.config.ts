import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#7B61FF",
          glow: "#9F88FF",
          dim: "#4A3A99",
        },
        surface: {
          DEFAULT: "rgba(10,10,20,0.85)",
          glass: "rgba(255,255,255,0.04)",
          glassBorder: "rgba(255,255,255,0.08)",
        },
      },
      spacing: {
        "2": "8px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },
      animation: {
        grain: "grain 0.4s steps(1) infinite",
        "cursor-ring": "cursor-ring 0.6s ease-out forwards",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "20%": { transform: "translate(3%,2%)" },
          "30%": { transform: "translate(-1%,4%)" },
          "40%": { transform: "translate(2%,-1%)" },
          "50%": { transform: "translate(-3%,2%)" },
          "60%": { transform: "translate(3%,-3%)" },
          "70%": { transform: "translate(-2%,3%)" },
          "80%": { transform: "translate(1%,-2%)" },
          "90%": { transform: "translate(-1%,1%)" },
        },
        "cursor-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
