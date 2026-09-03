import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./styles/tokens.css";
import "./globals.css";
import "./styles/animations.css";
import "./styles/marquee.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontClassNames } from "./fonts";
import { rootMetadata } from "./rootMetadata";
import { SSR_CRITICAL_CSS, SSR_THEME_SCRIPT } from "./ssrLoaderAssets";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata = rootMetadata;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: SSR_CRITICAL_CSS,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: SSR_THEME_SCRIPT,
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
        className={`bg-background text-foreground ${fontClassNames}`}
        suppressHydrationWarning
      >
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
