import type { Metadata, Viewport } from "next";
import { Urbanist, Roboto_Mono, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5f3ff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' }
    ],
};

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
    preload: false,
});

// Playfair is used for LCP element - prioritize loading (italic only for hero)
const playfair = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair",
    style: "italic",
    weight: "400",
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
            <head>
                {/* Preconnect to external domains for faster resource loading */}
                <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
            </head>
            <body className={`bg-white dark:bg-black ${urbanist.variable} ${robotoMono.variable} ${playfair.variable}`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
