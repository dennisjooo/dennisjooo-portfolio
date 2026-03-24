'use client';

import { SectionHero } from '@/components/shared/SectionHero';

export const FeaturedProjectsHeader = () => (
    <SectionHero
        sectionNumber="04."
        sectionTitle="Featured Projects"
        accentText="Selected"
        headlineText="WORK"
        alignment="start"
        trigger="whileInView"
        accentClassName="text-7xl md:text-7xl ml-2 md:ml-12 mb-[-3vw] md:mb-[-2vw]"
        headlineClassName="text-[15vw] md:text-[8vw]"
        className="mb-16 md:mb-10"
        innerClassName="pt-6"
        headerClassName="mb-6"
    />
);
