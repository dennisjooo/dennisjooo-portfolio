import { PHASE_EXPORT } from 'next/constants.js';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
});

const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cdn.jsdelivr.net https://raw.githubusercontent.com; frame-ancestors 'none';"
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
    },
    {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin'
    },
    {
        key: 'Cross-Origin-Resource-Policy',
        value: 'same-origin'
    }
];

/** @type {import('next').NextConfig} */
const createConfig = (phase) => {
    const isExportPhase = phase === PHASE_EXPORT;

    // Section redirects - cleaner than dynamic routes with output: export
    const sectionRedirects = [
        { source: '/about', destination: '/#about' },
        { source: '/work', destination: '/#work' },
        { source: '/experience', destination: '/#work' },
        { source: '/projects', destination: '/#projects' },
        { source: '/project', destination: '/#projects' },
        { source: '/skills', destination: '/#skills' },
        { source: '/skill', destination: '/#skills' },
        { source: '/contact', destination: '/#contact' },
        { source: '/contacts', destination: '/#contact' },
    ].map(r => ({ ...r, permanent: true }));

    return {
        distDir: 'out',
        output: 'export',
        images: {
            unoptimized: true,
            formats: ['image/avif', 'image/webp']
        },
        experimental: {
            optimizePackageImports: [
                'framer-motion',
                'gsap',
                '@gsap/react',
                'lucide-react',
                '@heroicons/react',
                'react-icons',
                '@radix-ui/react-dialog',
                '@radix-ui/react-icons',
                '@radix-ui/react-scroll-area',
                '@radix-ui/react-visually-hidden',
                'react-syntax-highlighter',
                'simple-icons',
                'cmdk',
                'ogl',
                'lenis',
            ]
        },
        async redirects() {
            return sectionRedirects;
        },
        async headers() {
            if (isExportPhase) {
                return [];
            }

            return [
                {
                    source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'public, max-age=31536000, immutable'
                        }
                    ]
                },
                {
                    source: '/:all*(js|css|woff|woff2)',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'public, max-age=31536000, immutable'
                        }
                    ]
                },
                {
                    source: '/(.*)',
                    headers: securityHeaders
                }
            ];
        }
    };
};

export default (phase) => withBundleAnalyzer(createConfig(phase));
