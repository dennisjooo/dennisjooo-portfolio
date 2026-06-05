'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import { CustomCursor } from '@/components/cursor/CustomCursor';

const SmoothScroll = dynamic(
    () => import('@/components/shared/SmoothScroll').then(m => ({ default: m.SmoothScroll })),
    { ssr: false }
);

type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CustomCursor />
            <SmoothScroll>
                {children}
            </SmoothScroll>
            <Toaster richColors position="top-center" />
        </ThemeProvider>
    );
}
