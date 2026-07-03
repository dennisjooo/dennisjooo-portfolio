import { ImageResponse } from "next/og";
import { loadCaslonItalicFont, caslonFontFamily } from "@/lib/og/caslonFont";
import { FaviconImage } from "@/lib/og/faviconImage";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const caslon = await loadCaslonItalicFont();

  return new ImageResponse(
    <FaviconImage canvasSize={size.width} />,
    {
      ...size,
      fonts: [
        {
          name: caslonFontFamily,
          data: caslon,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
