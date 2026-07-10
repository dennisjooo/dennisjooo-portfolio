import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import React from "react";
import { ImageResponse } from "next/og";
import { loadCaslonItalicFont, caslonFontFamily } from "../lib/og/caslonFont";
import { FaviconImage } from "../lib/og/faviconImage";

const TARGETS = [
  { path: "public/images/favicon-32.png", size: 32 },
  { path: "public/images/favicon-180.png", size: 180 },
  { path: "public/images/favicon-512.png", size: 512 },
] as const;

async function exportIcon(path: string, size: number): Promise<void> {
  const caslon = await loadCaslonItalicFont();
  const response = new ImageResponse(<FaviconImage canvasSize={size} />, {
    width: size,
    height: size,
    fonts: [
      {
        name: caslonFontFamily,
        data: caslon,
        style: "italic",
        weight: 400,
      },
    ],
  });

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  console.log(`Wrote ${path} (${size}x${size})`);
}

async function main() {
  for (const target of TARGETS) {
    await exportIcon(target.path, target.size);
  }
}

main().catch((error) => {
  console.error("Failed to export favicon:", error);
  process.exit(1);
});
