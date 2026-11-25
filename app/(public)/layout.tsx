import { ReactNode } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { getContacts } from "@/lib/data/site";
import { resolveContactLinks } from "@/lib/content/defaultContactLinks";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contacts = resolveContactLinks(await getContacts());

  return <PublicShell contacts={contacts}>{children}</PublicShell>;
}
