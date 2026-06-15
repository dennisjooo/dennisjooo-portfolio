import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { LoadingProvider } from "@/components/loader/LoadingProvider";
import { RouteProgressBar } from "@/components/transitions/RouteProgressBar";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Navbar = dynamic(() => import("@/components/layout/navbar/Navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@/components/layout/Footer"));
const CommandPalette = dynamic(() =>
  import("@/components/command-palette/CommandPalette").then((m) => ({
    default: m.CommandPalette,
  })),
);
const EasterEggs = dynamic(() =>
  import("@/components/fun/EasterEggs").then((m) => ({
    default: m.EasterEggs,
  })),
);

const MotionProvider = dynamic(() =>
  import("@/components/motion/MotionProvider").then((m) => ({
    default: m.MotionProvider,
  })),
);

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CommandPalette />
      <EasterEggs />
      <MotionProvider>
        <LoadingProvider>
          <main>{children}</main>
          <RouteProgressBar />
        </LoadingProvider>
      </MotionProvider>
      <Footer />
    </>
  );
}
