import Navbar from "@/components/layout/navbar/Navbar";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const CommandPalette = dynamic(
    () => import("@/components/command-palette/CommandPalette").then(m => ({ default: m.CommandPalette }))
);
const EasterEggs = dynamic(
    () => import("@/components/fun/EasterEggs").then(m => ({ default: m.EasterEggs }))
);

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <CommandPalette />
            <EasterEggs />
            <main>{children}</main>
            <Footer />
        </>
    );
}
