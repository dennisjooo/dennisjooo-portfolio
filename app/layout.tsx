import type { Metadata, Viewport } from "next";
import { Urbanist, Roboto_Mono, Libre_Caslon_Text } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
    template: "%s | Dennis Jonathan",
  },
  description:
    "AI enthusiast and problem solver with a background in math, stats, and machine learning. I build practical tools, explore weird ideas, and make complex stuff a little more approachable.",
  keywords: [
    "AI",
    "Machine Learning",
    "Data Science",
    "Portfolio",
    "Developer",
    "Math",
    "Statistics",
  ],
  authors: [{ name: "Dennis Jonathan", url: "https://dennisjooo.vercel.app" }],
  creator: "Dennis Jonathan",
  metadataBase: new URL("https://dennisjooo.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dennisjooo.vercel.app",
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
  icons: {
    icon: "/favicon.ico",
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
        <style
          dangerouslySetInnerHTML={{
            __html: [
              "html,body{background-color:#fff}",
              "@media(prefers-color-scheme:dark){html,body{background-color:#000}}",
              "html.dark,html.dark body{background-color:#000!important}",
              "html.light,html.light body{background-color:#fff!important}",
              "#__ssr_cover{position:fixed;inset:0;z-index:99999;background:#fff;transition:opacity .4s ease;display:flex;flex-direction:column;align-items:center;justify-content:center}",
              "@media(prefers-color-scheme:dark){#__ssr_cover{background:#000}}",
              "html.dark #__ssr_cover{background:#000!important}",
              "html.light #__ssr_cover{background:#fff!important}",
              "#__ssr_cover.hidden{opacity:0;pointer-events:none;visibility:hidden}",
              "#__ssr_loader{display:flex;flex-direction:column;align-items:center;gap:2.5rem;padding:0 1.5rem}",
              "#__ssr_loader .ssr-name{display:flex;flex-direction:column;align-items:center;gap:.5rem;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:clamp(1.875rem,5vw,3rem);line-height:1.15;letter-spacing:-.025em;color:#0a0a0a}",
              "@media(prefers-color-scheme:dark){#__ssr_loader .ssr-name{color:#fafafa}}",
              "html.dark #__ssr_loader .ssr-name{color:#fafafa!important}",
              "html.light #__ssr_loader .ssr-name{color:#0a0a0a!important}",
              "#__ssr_loader .ssr-bar{width:12rem;height:1px;background:#e0e0e0;border-radius:9999px;overflow:hidden}",
              "@media(min-width:768px){#__ssr_loader .ssr-bar{width:16rem}}",
              "@media(prefers-color-scheme:dark){#__ssr_loader .ssr-bar{background:#262626}}",
              "html.dark #__ssr_loader .ssr-bar{background:#262626!important}",
              "#__ssr_loader .ssr-fill{height:100%;width:0;background:linear-gradient(90deg,#3c3c3c,#afafaf,#3c3c3c);animation:ssr-progress 1.2s linear forwards}",
              "@keyframes ssr-progress{to{width:100%}}",
              "#__ssr_loader .ssr-pct{font-family:ui-monospace,monospace;font-size:10px;text-transform:uppercase;letter-spacing:.3em;color:#666;opacity:.8}",
              "@media(prefers-color-scheme:dark){#__ssr_loader .ssr-pct{color:#a3a3a3}}",
              "html.dark #__ssr_loader .ssr-pct{color:#a3a3a3!important}",
            ].join(""),
          }}
        />
        {/* Blocking script: reads next-themes localStorage and sets colors on html + cover
                    BEFORE first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),c=d?'#000':'#fff',h=document.documentElement;h.style.backgroundColor=c;h.style.colorScheme=d?'dark':'light';if(d)h.classList.add('dark');else h.classList.add('light');var v=document.getElementById('__ssr_cover');if(v){v.style.background=c;if(sessionStorage.getItem('portfolio-has-visited')==='true')v.classList.add('hidden')}}catch(e){}})()`,
          }}
        />
        <link
          rel="preconnect"
          href="https://cdn.simpleicons.org"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
      </head>
      <body
        className={`bg-background text-foreground ${urbanist.variable} ${robotoMono.variable} ${caslon.variable}`}
        suppressHydrationWarning
      >
        {/* Server-rendered cover: pure HTML, renders on first paint before React hydrates.
                    Inherits background-color from html/body (set by inline <style> + <script> above).
                    Hidden by LoadingProvider or SSRCoverDismiss once the app is ready. */}
        <div id="__ssr_cover" aria-hidden="true">
          <div id="__ssr_loader">
            <div className="ssr-name">
              <p>Dennis</p>
              <p>Jonathan</p>
            </div>
            <div className="ssr-bar">
              <div className="ssr-fill" />
            </div>
            <span className="ssr-pct">Loading</span>
          </div>
        </div>
        <Providers>{children}</Providers>
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
