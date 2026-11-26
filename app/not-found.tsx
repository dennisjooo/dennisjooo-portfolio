import type { Metadata } from "next";
import { NotFoundPage } from "@/components/errors/NotFoundPage";
import { PublicShell } from "@/components/layout/PublicShell";
import { getContacts } from "@/lib/data/site";
import { resolveContactLinks } from "@/lib/content/defaultContactLinks";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const contacts = resolveContactLinks(await getContacts());

  return (
    <PublicShell contacts={contacts}>
      <NotFoundPage />
    </PublicShell>
  );
}
