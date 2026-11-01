import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistSerif } from "geist/font/serif";

// Geist everywhere: sans, mono and serif from the one family (the `geist` package; Geist Serif is not on Google Fonts, and ships no italic, so serif headings are upright).
// tailwind.config.ts maps font-sans / font-mono / font-serif onto their --font-geist-* variables.
export const fontClassNames = `${GeistSans.variable} ${GeistMono.variable} ${GeistSerif.variable}`;
