/**
 * Draws a bitmap/canvas onto a new canvas scaled down to fit maxDimension
 * (never upscales) and exports it as a JPEG blob.
 */
export function drawScaledToBlob(
  source: CanvasImageSource,
  width: number,
  height: number,
  maxDimension: number,
  quality = 0.92,
): Promise<Blob | null> {
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}
