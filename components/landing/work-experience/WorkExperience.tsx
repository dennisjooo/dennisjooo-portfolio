import Image from 'next/image';
import type { TimelineItemData } from '@/lib/types/workExperience';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { WorkExperienceMobileClient } from './WorkExperienceMobileClient';

export type { TimelineItemData };

const defaultWorkExperienceData: TimelineItemData[] = [];

interface WorkExperienceProps {
    workExperience?: TimelineItemData[];
}

export default function WorkExperience({ workExperience }: WorkExperienceProps) {
    const items = workExperience ?? defaultWorkExperienceData;
    const groupedItems = groupItemsByCompany(items);

    return (
        <section
            id="work"
            className="py-24 md:py-32 w-full bg-background text-foreground"
        >
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="relative w-full flex justify-between items-end border-b border-border pb-4 mb-16">
                    <span className="font-playfair italic text-3xl md:text-4xl text-foreground">03.</span>
                    <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground">
                        Work Experience
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent" />
                </div>

                <div className="hidden md:flex flex-col w-full relative">
                    {groupedItems.map((group, groupIndex) => (
                        <div key={`${group.companyName}-${groupIndex}`} className="group relative w-full">
                            <div className="md:grid md:grid-cols-12 md:gap-16 min-h-[50vh]">
                                <div className="col-span-5 relative">
                                    <div className="sticky top-32 flex flex-col items-end pb-20">
                                        <div className="flex flex-col md:items-end gap-4 md:gap-6 w-full">
                                            <div className="relative w-12 h-12 md:w-16 md:h-16 overflow-hidden shrink-0">
                                                <Image
                                                    src={group.logo}
                                                    alt={group.companyName}
                                                    fill
                                                    className="object-contain object-left md:object-right"
                                                />
                                            </div>
                                            <h3 className="text-4xl md:text-6xl lg:text-7xl font-playfair italic font-bold text-foreground leading-[0.9] md:text-right tracking-tight">
                                                {group.companyName}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-7 pt-8 pb-20 border-l border-foreground/10 pl-16">
                                    <div className="flex flex-col space-y-16">
                                        {group.roles.map((role) => (
                                            <div key={role.id ?? `${group.companyName}-${role.title}-${role.date}`}>
                                                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-5 gap-3">
                                                    <h4 className="text-3xl md:text-4xl font-sans font-bold leading-none text-gradient-primary tracking-tight pb-1">
                                                        {role.title}
                                                    </h4>
                                                    <span className="font-mono text-xs md:text-sm tracking-widest uppercase text-muted-foreground bg-foreground/5 px-3 py-1 rounded w-fit">
                                                        {role.date}
                                                    </span>
                                                </div>

                                                <ul className="space-y-3">
                                                    {role.responsibilities.map((resp, idx) => (
                                                        <li
                                                            key={`${role.id ?? role.title}-${idx}`}
                                                            className="flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed"
                                                        >
                                                            <span className="mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                                                            <span>{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <WorkExperienceMobileClient items={items} />
            </div>
        </section>
    );
}
