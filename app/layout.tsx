import type { Metadata, Viewport } from "next";
import { Urbanist, Roboto_Mono, Libre_Caslon_Text } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' }
    ],
};

const urbanist = Urbanist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    preload: true,
    adjustFontFallback: true,
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
    preload: true,
    adjustFontFallback: true,
});

const caslon = Libre_Caslon_Text({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-caslon",
    weight: "400",
    preload: true,
    adjustFontFallback: true,
});

export const metadata: Metadata = {
    title: {
        default: "Dennis' Portfolio",
        template: "%s | Dennis Jonathan"
    },
    description: "AI enthusiast and problem solver with a background in math, stats, and machine learning. I build practical tools, explore weird ideas, and make complex stuff a little more approachable.",
    keywords: ['AI', 'Machine Learning', 'Data Science', 'Portfolio', 'Developer', 'Math', 'Statistics'],
    authors: [{ name: 'Dennis Jonathan', url: 'https://dennisjooo.vercel.app' }],
    creator: 'Dennis Jonathan',
    metadataBase: new URL('https://dennisjooo.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://dennisjooo.vercel.app',
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
                {/* Inline critical styles to prevent background flash on hard refresh.
                    Parsed synchronously — no network dependency. The #__ssr_cover masks
                    the body with a matching solid color until React hydrates. */}
                <style dangerouslySetInnerHTML={{ __html: [
                    'html,body{background-color:#fff}',
                    '@media(prefers-color-scheme:dark){html,body{background-color:#000}}',
                    'html.dark,html.dark body{background-color:#000!important}',
                    'html.light,html.light body{background-color:#fff!important}',
                    '#__ssr_cover{position:fixed;inset:0;z-index:99999;background:#fff;transition:opacity .4s ease}',
                    '@media(prefers-color-scheme:dark){#__ssr_cover{background:#000}}',
                    'html.dark #__ssr_cover{background:#000!important}',
                    'html.light #__ssr_cover{background:#fff!important}',
                    '#__ssr_cover.hidden{opacity:0;pointer-events:none}',
                ].join('') }} />
                {/* Blocking script: reads next-themes localStorage and sets colors on html + cover
                    BEFORE first paint. */}
                <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme'),d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),c=d?'#000':'#fff',h=document.documentElement;h.style.backgroundColor=c;h.style.colorScheme=d?'dark':'light';var v=document.getElementById('__ssr_cover');if(v)v.style.background=c}catch(e){}})()` }} />
                <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
            </head>
            <body className={`bg-white dark:bg-black ${urbanist.variable} ${robotoMono.variable} ${caslon.variable}`} suppressHydrationWarning>
                {/* Server-rendered cover: pure HTML, renders on first paint before React hydrates.
                    Inherits background-color from html/body (set by inline <style> + <script> above).
                    Removed by LoadingProvider once the app is ready. */}
                <div id="__ssr_cover" aria-hidden="true" />
                <Providers>
                    {children}
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
