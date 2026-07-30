import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";
import {
  OG_SIZE,
  OgBackground,
  OgCaslonTitle,
  OgDivider,
  OgMonoLabel,
} from "@/lib/og/createOgImage";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <OgBackground>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          zIndex: 1,
          padding: "0 80px",
          width: "100%",
          height: "100%",
        }}
      >
        <OgDivider />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <OgCaslonTitle>{SITE_NAME}</OgCaslonTitle>

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

        <OgDivider />
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
        <OgMonoLabel>dennisjooo.vercel.app</OgMonoLabel>
      </div>
    </OgBackground>,
    { ...size },
  );
}
