import { readFileSync } from "fs";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.clerk.accounts.dev https://*.clerk.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cdn.jsdelivr.net https://raw.githubusercontent.com https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com https://vitals.vercel-insights.com; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com; worker-src 'self' blob: https://*.clerk.accounts.dev https://*.clerk.com; frame-ancestors 'none';",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

/** @type {import('next').NextConfig} */
const createConfig = (phase) => {
  // Section redirects
  const sectionRedirects = [
    { source: "/about", destination: "/#about" },
    { source: "/work", destination: "/#work" },
    { source: "/experience", destination: "/#work" },
    { source: "/projects", destination: "/#projects" },
    { source: "/project", destination: "/#projects" },
    { source: "/skills", destination: "/#skills" },
    { source: "/skill", destination: "/#skills" },
    { source: "/contact", destination: "/#contact" },
    { source: "/contacts", destination: "/#contact" },
    { source: "/sitemap", destination: "/sitemap.xml" },
    { source: "/llm.txt", destination: "/llms.txt" },
  ].map((r) => ({ ...r, permanent: true }));

  const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

  return {
    env: {
      NEXT_PUBLIC_BUILD_VERSION: version,
    },
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    images: {
      formats: ["image/avif", "image/webp"],
      qualities: [70, 75],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.public.blob.vercel-storage.com",
        },
      ],
    },
    experimental: {
      optimizePackageImports: [
        "framer-motion",
        "gsap",
        "lucide-react",
        "@heroicons/react",
        "react-icons",
        "@radix-ui/react-dialog",
        "@radix-ui/react-visually-hidden",
        "react-syntax-highlighter",
        "cmdk",
        "ogl",
        "lenis",
      ],
    },
    async redirects() {
      return sectionRedirects;
    },
    async headers() {
      return [
        {
          source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/:all*(js|css|woff|woff2)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
  };
};

export default (phase) => withBundleAnalyzer(createConfig(phase));
