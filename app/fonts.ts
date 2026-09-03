import { Urbanist, Roboto_Mono, Libre_Caslon_Text } from "next/font/google";

export const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  preload: true,
  adjustFontFallback: true,
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  preload: true,
  adjustFontFallback: true,
});

export const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caslon",
  weight: "400",
  preload: true,
  adjustFontFallback: true,
});

export const fontClassNames = `${urbanist.variable} ${robotoMono.variable} ${caslon.variable}`;
