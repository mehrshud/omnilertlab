import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mehrshad Hamavandy — Full-Stack Developer & Creative Engineer | Omnilertlab",
  description:
    "Portfolio of Mehrshad Hamavandy — full-stack developer and creative technologist building at the intersection of performance, AI, and design. Omnilertlab.",
  keywords: [
    "Mehrshad Hamavandy",
    "Omnilertlab",
    "Full-Stack Developer",
    "Creative Engineer",
    "Next.js",
    "TypeScript",
    "React",
    "Three.js",
    "AI",
    "Python",
    "Rust",
  ],
  authors: [{ name: "Mehrshad Hamavandy", url: "https://github.com/mehrshud" }],
  openGraph: {
    title: "Mehrshad Hamavandy — Full-Stack Developer & Creative Engineer",
    description: "I build products that live at the edge of design and engineering.",
    type: "website",
    url: "https://omnilertlab.dev",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehrshad Hamavandy — Omnilertlab",
    description: "I build products that live at the edge of design and engineering.",
    images: ["/api/og"],
  },
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL("https://omnilertlab.dev"),
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { AppMotionConfig } from "@/components/providers/MotionConfig";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        <AppMotionConfig>
          {children}
        </AppMotionConfig>
      </body>
    </html>
  );
}
