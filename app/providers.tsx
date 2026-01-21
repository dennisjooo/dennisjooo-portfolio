'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { ScrollRestorer, SmoothScroll } from '@/components/shared';

type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ScrollRestorer />
            <SmoothScroll>
                {children}
            </SmoothScroll>
            <Toaster richColors position="top-center" />
        </ThemeProvider>
    );
}
