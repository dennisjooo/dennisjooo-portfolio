"use client";

import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { resolveContactLinks } from "@/lib/content/defaultContactLinks";
import { CONTACT_ICON_MAP } from "@/lib/constants/contactIcons";
import type { ContactLinkData } from "@/lib/types/contacts";
import {
  m,
  viewportSettings,
  staggerContainer,
  fadeUpItem,
  fadeUpItemLarge,
  useInViewReveal,
  useMotionSafe,
} from "@/components/motion";

interface ContactsProps {
  contacts?: ContactLinkData[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => {
  const headingMotion = useInViewReveal(staggerContainer);
  const listMotion = useInViewReveal(staggerContainer);
  const fadeUp = useMotionSafe(fadeUpItem);
  const fadeUpLarge = useMotionSafe(fadeUpItemLarge);

  const links = resolveContactLinks(contacts).map((contact) => {
    const Icon = CONTACT_ICON_MAP[contact.icon];
    return {
      href: contact.href,
      ariaLabel: contact.ariaLabel,
      icon: <Icon className="size-5" />,
    };
  });

  return (
    <SectionShell
      id="contact"
      spacing="compact"
      className="flex min-h-[80vh] flex-col"
      innerClassName="flex flex-1 flex-col"
    >
      <SectionHeader number="06." title="Contact" />

      <div className="flex flex-1 flex-col items-center justify-center py-16">
        <m.div
          {...headingMotion}
          viewport={viewportSettings.onceDeep}
          className="flex max-w-xl flex-col items-center text-center"
        >
          <m.h2
            variants={fadeUpLarge}
            className="font-serif text-5xl leading-tight text-foreground md:text-7xl"
          >
            Let&apos;s talk
          </m.h2>
          <m.p
            variants={fadeUp}
            className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Have a cool idea? Want to geek out over AI, or just want to say hi?
            Drop a line.
          </m.p>
        </m.div>

        <m.ul
          {...listMotion}
          viewport={viewportSettings.once}
          className="mt-12 flex items-center gap-2"
        >
          {links.map(({ href, ariaLabel, icon }) => (
            <m.li key={ariaLabel} variants={fadeUpLarge}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                className="flex size-11 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {icon}
              </Link>
            </m.li>
          ))}
        </m.ul>
      </div>
    </SectionShell>
  );
};

export default Contacts;
