import { ScrollToTop } from "@/components/shared/scroll/ScrollToTop";
import { LoadingProvider } from "@/components/loader/LoadingProvider";
import { RouteProgressBar } from "@/components/transitions/RouteProgressBar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { getContacts } from "@/lib/data/site";
import { resolveContactLinks } from "@/lib/content/defaultContactLinks";

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

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contacts = resolveContactLinks(await getContacts());

  return (
    <MotionProvider>
      <LoadingProvider>
        <ScrollToTop />
        <Navbar />
        <CommandPalette contacts={contacts} />
        <EasterEggs />
        <main>{children}</main>
        <RouteProgressBar />
        <Footer />
      </LoadingProvider>
    </MotionProvider>
  );
}
