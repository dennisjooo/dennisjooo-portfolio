import { ImageResponse } from "next/og";
import { loadCaslonItalicFont, caslonFontFamily } from "@/lib/og/caslonFont";
import { FaviconImage } from "@/lib/og/faviconImage";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const caslon = await loadCaslonItalicFont();

  return new ImageResponse(<FaviconImage canvasSize={size.width} />, {
    ...size,
    fonts: [
      {
        name: caslonFontFamily,
        data: caslon,
        style: "italic",
        weight: 400,
      },
    ],
  });
}
