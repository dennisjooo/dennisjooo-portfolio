import Navbar from "@/components/navbar/Navbar";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import Footer from "@/components/shared/Footer";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Urbanist, Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";
import { Providers } from "./providers";

const urbanist = Urbanist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-urbanist",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
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
            <body className={`bg-white dark:bg-black ${urbanist.variable} ${robotoMono.variable}`} suppressHydrationWarning>
                <Providers>
                    <Navbar />
                    <CommandPalette />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
