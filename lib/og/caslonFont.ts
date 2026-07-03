const CASLON_ITALIC_URL =
  "https://fonts.gstatic.com/s/librecaslontext/v5/DdT678IGsGw1aF1JU10PUbTvNNaDMfq91-c.ttf";

let cached: ArrayBuffer | null = null;

export async function loadCaslonItalicFont(): Promise<ArrayBuffer> {
  if (cached) return cached;

  const response = await fetch(CASLON_ITALIC_URL);
  if (!response.ok) {
    throw new Error("Failed to load Libre Caslon Text italic");
  }

  cached = await response.arrayBuffer();
  return cached;
}

export const caslonFontFamily = "Libre Caslon Text";
