import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { LenisProvider } from "@/components/LenisProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omnilertlab.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "OmnilertLab";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Full-Stack Dev & DevOps`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Mehrshad — Full-Stack Developer, DevOps Engineer, and Builder. Crafting high-performance web experiences and cloud infrastructure.",
  keywords: [
    "Mehrshad",
    "Full-Stack Developer",
    "DevOps",
    "Next.js",
    "React",
    "OmnilertLab",
    "Web Development",
    "Cloud Infrastructure",
  ],
  authors: [{ name: "Mehrshad", url: SITE_URL }],
  creator: "Mehrshad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Full-Stack Dev & DevOps`,
    description: "Mehrshad — Full-Stack Developer, DevOps Engineer, and Builder.",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Full-Stack Dev & DevOps`,
    description: "Mehrshad — Full-Stack Developer, DevOps Engineer, and Builder.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mehrshad",
              url: SITE_URL,
              jobTitle: "Full-Stack Developer & DevOps Engineer",
              worksFor: { "@type": "Organization", name: "OmnilertLab" },
              sameAs: [`https://github.com/mehrshud`],
            }),
          }}
        />
      </head>
      <body className={`${bebas.variable} ${inter.variable} ${jetbrains.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <LenisProvider>
            <GrainOverlay />
            <CustomCursor />
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
