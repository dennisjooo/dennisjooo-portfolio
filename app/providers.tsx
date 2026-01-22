'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SmoothScroll } from '@/components/shared';

type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SmoothScroll>
                {children}
            </SmoothScroll>
            <Toaster richColors position="top-center" />
        </ThemeProvider>
    );
}
