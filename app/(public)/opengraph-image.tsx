import { ImageResponse } from "next/og";
import { getSiteHostname, SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";
import { loadOgFonts } from "@/lib/og/caslonFont";
import {
  OG_SIZE,
  OgBackground,
  OgCaslonTitle,
  OgMonoLabel,
} from "@/lib/og/createOgImage";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage() {
  const fonts = await loadOgFonts();
  const [firstName, ...rest] = SITE_NAME.split(" ");
  const lastName = rest.join(" ");

  return new ImageResponse(
    <OgBackground variant="hero">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "48px 60px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <OgMonoLabel muted>A Portfolio</OgMonoLabel>
          <OgMonoLabel muted>Jakarta, Indonesia</OgMonoLabel>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            flex: 1,
          }}
        >
          <OgCaslonTitle fontSize={108}>{firstName}</OgCaslonTitle>
          {lastName ? (
            <OgCaslonTitle fontSize={108}>{lastName}</OgCaslonTitle>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: "70%",
            }}
          >
            <OgMonoLabel size="md" muted>
              Role
            </OgMonoLabel>
            <div
              style={{
                display: "flex",
                fontFamily:
                  "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
                fontSize: 18,
                fontWeight: 400,
                color: "#d4d4d4",
                letterSpacing: "0.02em",
                lineHeight: 1.4,
              }}
            >
              {SITE_TAGLINE}
            </div>
          </div>

          <OgMonoLabel>{getSiteHostname()}</OgMonoLabel>
        </div>
      </div>
    </OgBackground>,
    { ...size, fonts },
  );
}
