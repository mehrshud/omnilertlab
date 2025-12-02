import type { Metadata } from "next";
// Removing next/font/google to prevent build resolution errors in preview
import "./globals.css";

export const metadata: Metadata = {
  title: "OMNILERTLAB | Digital Architectures",
  description:
    "High-performance software engineering. AI, WebGL, and Enterprise Systems.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* fallback to standard sans/mono fonts provided by Tailwind */}
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
