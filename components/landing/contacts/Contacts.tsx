"use client";

import React from "react";
import { Dock } from "./Dock/Dock";
import { DockIconLink } from "./Dock/DockIconLink";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SectionShell } from "@/components/shared/SectionShell";
import { resolveContactLinks } from "@/data/defaultContactLinks";
import { CONTACT_ICON_MAP } from "@/lib/constants/contactIcons";
import type { ContactLinkData } from "@/lib/types/contacts";
import {
  m,
  useReducedMotion,
  viewportSettings,
  staggerContainer,
  fadeUpItem,
  fadeUpItemLarge,
} from "@/components/motion";

interface ContactsProps {
  contacts?: ContactLinkData[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => {
  const prefersReducedMotion = useReducedMotion();
  const dockLinks = resolveContactLinks(contacts).map((contact) => {
    const Icon = CONTACT_ICON_MAP[contact.icon] ?? CONTACT_ICON_MAP.website;
    return {
      href: contact.href,
      ariaLabel: contact.ariaLabel,
      icon: <Icon className="size-6" />,
    };
  });

  return (
    <SectionShell id="contact" spacing="compact" minHeight overflowHidden>
      <div className="w-full mb-16 md:mb-20">
        <SectionHeader number="06." title="Contact" />
      </div>

      <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[50vh]">
        <m.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportSettings.onceDeep}
          className="flex flex-col items-center relative mb-12 text-center"
        >
          <m.span
            variants={prefersReducedMotion ? undefined : fadeUpItem}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            Get In Touch
          </m.span>

          <m.h2
            variants={prefersReducedMotion ? undefined : fadeUpItemLarge}
            className="font-caslon italic text-5xl md:text-6xl leading-tight text-foreground select-none"
          >
            Let&apos;s Talk
          </m.h2>
        </m.div>

        <m.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportSettings.once}
          className="flex flex-col items-center gap-8"
        >
          <m.p
            variants={prefersReducedMotion ? undefined : fadeUpItemLarge}
            className="text-base md:text-xl font-light text-muted-foreground font-sans text-center max-w-md px-4"
          >
            Have a cool idea? Want to geek out over AI, or just want to say hi?
            Drop a line.
          </m.p>

          <m.div variants={prefersReducedMotion ? undefined : fadeUpItemLarge}>
            <Dock className="mx-auto">
              {dockLinks.map(({ href, ariaLabel, icon }) => (
                <DockIconLink
                  key={ariaLabel}
                  href={href}
                  ariaLabel={ariaLabel}
                  icon={icon}
                />
              ))}
            </Dock>
          </m.div>
        </m.div>
      </div>
    </SectionShell>
  );
};

export default Contacts;
