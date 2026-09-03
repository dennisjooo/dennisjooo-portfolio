import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/site";

export const rootMetadata: Metadata = {
  title: {
    default: "Dennis' Portfolio",
    template: "%s | Dennis Jonathan",
  },
  description:
    "AI enthusiast and problem solver with a background in math, stats, and machine learning. I build practical tools, explore weird ideas, and make complex stuff a little more approachable.",
  authors: [{ name: "Dennis Jonathan", url: SITE_URL }],
  creator: "Dennis Jonathan",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Dennis' Portfolio",
    description:
      "AI enthusiast and problem solver with a background in math, stats, and machine learning.",
    siteName: "Dennis Jonathan's Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dennis' Portfolio",
    description:
      "AI enthusiast and problem solver with a background in math, stats, and machine learning.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
