import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Geist Serif for the OG images and icons. next/og (Satori) cannot read woff2, and the `geist` package only ships woff2, so a TTF copy of
// GeistSerif-Regular (converted from geist 1.9.0, SIL Open Font License) lives next to this file. Upright only: Geist Serif has no italic.
const SERIF_PATH = join(process.cwd(), "lib/og/fonts/GeistSerif-Regular.ttf");

let cached: Buffer | null = null;

export async function loadSerifFont(): Promise<Buffer> {
  if (!cached) cached = await readFile(SERIF_PATH);
  return cached;
}

export const serifFontFamily = "Geist Serif";

export async function loadOgFonts() {
  const serif = await loadSerifFont();

  return [
    {
      name: serifFontFamily,
      data: serif,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
