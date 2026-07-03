import { caslonFontFamily } from "@/lib/og/caslonFont";

const DISC = "#fafafa";
const MARK = "#0a0a0a";

/** Keep the disc off the canvas edge so tab UIs do not clip it. */
const DISC_INSET_RATIO = 0.12;

type FaviconImageProps = {
  canvasSize: number;
};

export function faviconDiscSize(canvasSize: number): number {
  const inset = Math.max(2, Math.round(canvasSize * DISC_INSET_RATIO));
  return canvasSize - inset * 2;
}

export function faviconFontSize(canvasSize: number): number {
  return Math.round(faviconDiscSize(canvasSize) * 0.38);
}

export function FaviconImage({ canvasSize }: FaviconImageProps) {
  const discSize = faviconDiscSize(canvasSize);
  const fontSize = faviconFontSize(canvasSize);
  const opticalShift = Math.round(fontSize * 0.06);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: discSize,
          height: discSize,
          borderRadius: "50%",
          backgroundColor: DISC,
          color: MARK,
          fontFamily: caslonFontFamily,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          paddingLeft: opticalShift,
        }}
      >
        DJ
      </div>
    </div>
  );
}
