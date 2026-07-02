import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1a 0%, #0a0a0a 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          zIndex: 1,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 64,
            height: 1,
            backgroundColor: "#fafafa",
            opacity: 0.3,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 84,
              fontWeight: 400,
              color: "#fafafa",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            {SITE_NAME}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#a3a3a3",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 64,
            height: 1,
            backgroundColor: "#fafafa",
            opacity: 0.3,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
            fontSize: 12,
            fontWeight: 400,
            color: "#525252",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          dennisjooo.vercel.app
        </div>
      </div>
    </div>,
    { ...size },
  );
}
