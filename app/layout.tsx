import Navbar from "@/components/layout/navbar/Navbar";
import "katex/dist/katex.min.css";
import type { Metadata, Viewport } from "next";
import { Urbanist, Roboto_Mono, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";
import { Providers } from "./providers";

// Lazy load Footer since it's always below the fold
const Footer = dynamic(() => import("@/components/layout/Footer"));

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5f3ff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' }
    ],
};

// Lazy load non-critical components for better initial load performance
const CommandPalette = dynamic(
    () => import("@/components/command-palette/CommandPalette").then(m => ({ default: m.CommandPalette }))
);
const EasterEggs = dynamic(
    () => import("@/components/fun/EasterEggs").then(m => ({ default: m.EasterEggs }))
);

const urbanist = Urbanist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-urbanist",
    preload: true,
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
});

// Playfair is used for LCP element - prioritize loading
const playfair = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair",
    style: ["normal", "italic"],
    preload: true,
});

export const metadata: Metadata = {
    title: {
        default: "Dennis' Portfolio",
        template: "%s | Dennis Jonathan"
    },
    description: "AI enthusiast and problem solver with a background in math, stats, and machine learning. I build practical tools, explore weird ideas, and make complex stuff a little more approachable.",
    keywords: ['AI', 'Machine Learning', 'Data Science', 'Portfolio', 'Developer', 'Math', 'Statistics'],
    authors: [{ name: 'Dennis Jonathan', url: 'https://dennisjooo.github.io' }],
    creator: 'Dennis Jonathan',
    metadataBase: new URL('https://dennisjooo.github.io'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://dennisjooo.github.io',
        title: "Dennis' Portfolio",
        description: "AI enthusiast and problem solver with a background in math, stats, and machine learning.",
        siteName: "Dennis Jonathan's Portfolio",
    },
    twitter: {
        card: 'summary_large_image',
        title: "Dennis' Portfolio",
        description: "AI enthusiast and problem solver with a background in math, stats, and machine learning.",
    },
    icons: {
        icon: '/favicon.ico',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`bg-white dark:bg-black ${urbanist.variable} ${robotoMono.variable} ${playfair.variable}`} suppressHydrationWarning>
                <Providers>
                    <Navbar />
                    <CommandPalette />
                    <EasterEggs />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
