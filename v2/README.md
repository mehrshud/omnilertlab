# OmnilertLab

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

**Award-caliber portfolio** for full-stack development and DevOps — built with Next.js 15, React 19, React Three Fiber, GSAP, Lenis, and Tailwind CSS. By **Mehrshad** ([@mehrshud](https://github.com/mehrshud)).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [AI Chat & Telegram](#ai-chat--telegram)
- [Customization](#customization)
- [Deployment](#deployment)
- [Accessibility & PWA](#accessibility--pwa)
- [License & Contact](#license--contact)

---

## Overview

OmnilertLab is a single-page portfolio showcasing full-stack development, DevOps, and creative engineering. It includes a WebGL hero, smooth scroll, glassmorphism UI, AI-powered chat (Groq/Perplexity), and a live chat bridge to Telegram. Designed for performance, accessibility, and easy deployment on Vercel.

---

## Features

- **WebGL hero** — React Three Fiber particle field with GLSL effects
- **Smooth scroll** — Lenis + GSAP ScrollTrigger
- **Glassmorphism** — Custom cursor, grain overlay, magnetic interactions
- **AI chat widget** — OmnilertBot (Groq primary, Perplexity fallback), configurable system prompt
- **Telegram bridge** — Visitor messages forwarded to your Telegram
- **GitHub integration** — Live repos, stats, and contribution graph via API
- **PWA-ready** — Installable, with manifest and optional notifications
- **Accessibility** — Reduced motion, ARIA, skip links, WCAG AA contrast

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS, CSS custom properties |
| 3D / Motion | React Three Fiber, Three.js, GSAP, Framer Motion |
| Scroll | Lenis |
| AI Chat | Groq SDK, Perplexity API |
| Infra | Vercel, GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Install and run

From the **repository root** (`omnilertlab`), go into this app and install:

```bash
git clone https://github.com/mehrshud/omnilertlab.git
cd omnilertlab/v2
npm install
```

Copy environment variables and add your keys:

```bash
cp .env.example .env.local
# Edit .env.local with your values (see table below)
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub username for API (e.g. `mehrshud`) | Yes |
| `GITHUB_TOKEN` | [Personal Access Token](https://github.com/settings/tokens) — `public_repo` scope | Recommended |
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com/keys) — AI chat primary | For chat |
| `PERPLEXITY_API_KEY` | [Perplexity API](https://www.perplexity.ai/settings/api) — fallback | For chat |
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/botfather) | For Telegram |
| `TELEGRAM_CHAT_ID` | From `getUpdates` after messaging your bot | For Telegram |
| `TELEGRAM_WEBHOOK_SECRET` | Random string for webhook verification | For Telegram |
| `AI_SYSTEM_PROMPT` | System prompt for OmnilertBot (see `.env.example`) | Yes (default provided) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://omnilertlab.com`) | Yes |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata | Optional |

Never commit `.env.local`. Use `.env.example` as a template only.

---

## Project Structure

```
v2/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata, JSON-LD
│   ├── page.tsx                # Main page, section composition
│   ├── globals.css              # Design system, variables, glass, typography
│   └── api/
│       ├── github/route.ts     # GitHub API — repos, stars (cached 1h)
│       ├── chat/route.ts       # AI chat — Groq → Perplexity fallback
│       └── telegram/route.ts   # Telegram webhook handler
├── components/
│   ├── GrainOverlay.tsx        # Film-grain overlay
│   ├── ThemeProvider.tsx       # Dark/light theme + toggle
│   ├── LenisProvider.tsx       # Lenis + GSAP ScrollTrigger
│   ├── CustomCursor.tsx        # Magnetic cursor + trail
│   ├── LoadingScreen.tsx       # Logo + progress + exit animation
│   ├── Navigation.tsx          # Full-screen nav + thumbnails
│   ├── ChatWidget.tsx          # AI chat + Telegram toggle
│   ├── Hero/
│   │   ├── HeroScene.tsx       # R3F WebGL particle field
│   │   └── HeroSection.tsx     # Scramble text, parallax, CTAs
│   └── sections/
│       ├── AboutSection.tsx    # Stacked cards, variable font
│       ├── ProjectsSection.tsx # GitHub feed, horizontal scroll
│       ├── TerminalSection.tsx # Typing terminal “whoami”
│       ├── StatsSection.tsx    # Animated counters
│       ├── ContributionGraph.tsx
│       └── StackSection.tsx    # Built-with + footer
├── public/
│   └── site.webmanifest        # PWA manifest
├── .env.example                # Env template (documented)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## AI Chat & Telegram

### AI Chat (OmnilertBot)

- **Primary:** Groq (fast, free tier).
- **Fallback:** Perplexity when Groq fails.
- **Persona:** Set `AI_SYSTEM_PROMPT` in `.env.local` (see `.env.example` for a full example). The bot can answer questions about Mehrshad, OmnilertLab, and services.

The widget supports **AI mode** and **Telegram mode** (direct messages to you).

### Telegram live chat

1. Create a bot with [@BotFather](https://t.me/botfather) → get `TELEGRAM_BOT_TOKEN`.
2. Message the bot, then open:
   `https://api.telegram.org/bot<TOKEN>/getUpdates` to find `TELEGRAM_CHAT_ID`.
3. Set `TELEGRAM_WEBHOOK_SECRET` (any random string).
4. After deploy, set the webhook:

   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://your-domain.com/api/telegram" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```

---

## Customization

### Design tokens (`app/globals.css`)

```css
:root {
  --color-accent: #7b61ff;       /* Brand accent */
  --color-bg: #06060e;
  --font-display: "Bebas Neue", sans-serif;
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

Update `next/font` imports in `app/layout.tsx` to match.

### Nav thumbnails

Add images under `public/thumbs/` (e.g. `work.jpg`, `about.jpg`, `terminal.jpg`, `stack.jpg`, `contact.jpg`) for hover previews in the nav. ~1200×800 recommended.

### GSAP premium plugins

The project uses **free** GSAP plugins. With a [GSAP Club](https://gsap.com/club/) license you can use SplitText, ScrambleText, etc.:

```bash
npm install gsap@npm:@gsap/shockingly
```

Current code uses manual equivalents where needed.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. [Vercel](https://vercel.com) → Import Project → select repo (root or `v2` as root).
3. Add all variables from `.env.local` in **Settings → Environment Variables**.
4. Deploy.

### GitHub Actions

If using `.github/workflows/deploy.yml`, add in **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN` — [Vercel token](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — from `vercel link` / `.vercel/project.json`

---

## Accessibility & PWA

- Skip-to-content link, `prefers-reduced-motion` for animations, ARIA labels, `aria-live` in chat.
- PWA: add `icon-192.png`, `icon-512.png`, `favicon.ico`, `apple-touch-icon.png`, `og-image.png` (1200×630) in `public/` to complete setup.

---

## License & Contact

- **Author:** Mehrshad ([@mehrshud](https://github.com/mehrshud))
- **Studio:** [OmnilertLab](https://omnilertlab.com) — full-stack development and DevOps

For commit and push steps to get this code onto the `main` branch, see [COMMIT_PUSH_GUIDE.md](./COMMIT_PUSH_GUIDE.md).
