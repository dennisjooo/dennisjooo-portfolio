import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

export function OgBackground({
  children,
  backgroundImage,
}: {
  children: ReactNode;
  backgroundImage?: string | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element -- OG ImageResponse requires native img
        <img
          src={backgroundImage}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: backgroundImage
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(26,26,26,0.9) 0%, rgba(10,10,10,0.95) 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1a 0%, #0a0a0a 100%)",
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
          backgroundImage: OG_NOISE_BACKGROUND,
        }}
      />

      {children}
    </div>
  );
}

export function OgDivider({ width = 64 }: { width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width,
        height: 1,
        backgroundColor: "#fafafa",
        opacity: 0.3,
      }}
    />
  );
}

export function OgCaslonTitle({
  children,
  fontSize = 84,
}: {
  children: ReactNode;
  fontSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontStyle: "italic",
        fontSize,
        fontWeight: 400,
        color: "#fafafa",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

export function OgMonoLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
        fontSize: 11,
        fontWeight: 400,
        color: "#525252",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}
