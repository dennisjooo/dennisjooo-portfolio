import type { ReactNode } from "react";
import { caslonFontFamily } from "@/lib/og/caslonFont";

export { OgBackground } from "./OgBackground";

export const OG_SIZE = { width: 1200, height: 630 };

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
        fontFamily: caslonFontFamily,
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

export function OgMonoLabel({
  children,
  size = "sm",
  muted = false,
}: {
  children: ReactNode;
  size?: "sm" | "md";
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
        fontSize: size === "md" ? 14 : 11,
        fontWeight: 400,
        color: muted ? "#a3a3a3" : "#525252",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity: muted ? 0.8 : 1,
      }}
    >
      {children}
    </div>
  );
}
