'use client';

import { SectionHero } from '@/components/shared/SectionHero';

interface BlogsHeroProps {
    activeTab: 'blog' | 'certifications';
}

const tabCaptions: Record<'blog' | 'certifications', string> = {
    blog: "Things I've built and written about (mostly coherent).",
    certifications: "Stuff that (supposedly) validates my expertise."
};

export const BlogsHero = ({ activeTab }: BlogsHeroProps) => (
    <SectionHero
        sectionNumber=""
        sectionTitle="Blog & Certifications"
        accentText="Explore"
        headlineText="WRITINGS"
        caption={tabCaptions[activeTab]}
        alignment="end"
        trigger="animate"
        HeadlineTag="h1"
        accentClassName="text-3xl md:text-5xl lg:text-5xl mr-2 md:mr-12 mb-[-2vw] md:mb-[-1.5vw]"
        headlineClassName="text-[14vw] md:text-[8vw]"
        className="mb-6"
        innerClassName="pt-4 md:pt-6"
        headerClassName="mb-6"
    />
);
