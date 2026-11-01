import { ImageResponse } from "next/og";
import { loadSerifFont, serifFontFamily } from "@/lib/og/serifFont";
import { FaviconImage } from "@/lib/og/faviconImage";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const serif = await loadSerifFont();

  return new ImageResponse(<FaviconImage canvasSize={size.width} />, {
    ...size,
    fonts: [
      {
        name: serifFontFamily,
        data: serif,
        style: "normal",
        weight: 400,
      },
    ],
  });
}
