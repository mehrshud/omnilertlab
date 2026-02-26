import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Mehrshad Hamavandy";
  const subtitle =
    searchParams.get("subtitle") ||
    "Full-Stack Developer & Creative Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #050508 0%, #0D0D14 50%, #050508 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            MH
          </div>
          <span
            style={{
              color: "#64748B",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "4px",
            }}
          >
            OMNILERTLAB
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1,
            margin: 0,
            background: "linear-gradient(135deg, #F1F5F9, #94a3b8)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#64748B",
            marginTop: "16px",
            maxWidth: "600px",
          }}
        >
          {subtitle}
        </p>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748B",
            fontSize: "16px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              display: "flex",
            }}
          />
          omnilertlab.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
