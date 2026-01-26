import { ScrollToTop } from "@/components/shared/ScrollToTop";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Critical path: Navbar is visible immediately but we defer hydration
const Navbar = dynamic(() => import("@/components/layout/navbar/Navbar"), {
    ssr: true, // SSR for initial render, but defer JS
});

// Below-fold / non-critical
const Footer = dynamic(() => import("@/components/layout/Footer"));
const CommandPalette = dynamic(
    () => import("@/components/command-palette/CommandPalette").then(m => ({ default: m.CommandPalette }))
);
const EasterEggs = dynamic(
    () => import("@/components/fun/EasterEggs").then(m => ({ default: m.EasterEggs }))
);

// MotionProvider wraps content that needs framer-motion
// SSR enabled for consistent hydration, but LazyMotion defers feature loading
const MotionProvider = dynamic(
    () => import("@/components/motion/MotionProvider").then(m => ({ default: m.MotionProvider }))
);

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <CommandPalette />
            <EasterEggs />
            <MotionProvider>
                <main>{children}</main>
            </MotionProvider>
            <Footer />
        </>
    );
}
