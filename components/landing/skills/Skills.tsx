"use client";

import React from 'react';
import { skillCategories } from '@/data/skillContent';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ParallaxText } from './ParallaxText';
import { getIconSlug } from './utils';

const Skills: React.FC = () => {
    return (
        <section id="skills" className="py-24 w-full bg-background text-foreground overflow-hidden">
            <div className="w-full">
                <div className="container mx-auto px-6 max-w-7xl mb-10">
                    <SectionHeader
                        number="05."
                        title="Skills & Stacks"
                    />
                </div>

                <div className="w-full flex flex-col border-t border-border/30">
                    {skillCategories.map((category, index) => (
                        <div key={category.title} className="relative group border-b border-border/30 overflow-hidden">
                            {/* Category Label */}
                            <div className="absolute top-3 left-4 md:left-8 z-10 pointer-events-none">
                                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
                                    {category.title}
                                </span>
                            </div>

                            {/* Kinetic Scroll Line */}
                            <div className="py-8 pt-12 w-full">
                                <ParallaxText baseVelocity={index % 2 === 0 ? -1.5 : 1.5}>
                                    <div className="flex items-center gap-12 md:gap-20 px-4 md:px-8">
                                        {category.skills.map((skill) => (
                                            <div key={skill} className="group/item flex items-center gap-3 md:gap-5 cursor-default">
                                                {/* Icon */}
                                                <div className="w-8 h-8 md:w-10 md:h-10 relative grayscale opacity-30 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-300">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={`https://cdn.simpleicons.org/${getIconSlug(skill)}`}
                                                        alt={skill}
                                                        className="w-full h-full object-contain dark:invert dark:group-hover/item:invert-0 transition-all duration-300"
                                                        loading="lazy"
                                                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                                    />
                                                </div>

                                                {/* Text */}
                                                <span
                                                    className={`
                                                        text-3xl md:text-5xl font-bold font-urbanist uppercase tracking-tight
                                                        text-foreground/20 group-hover/item:text-foreground
                                                        transition-colors duration-300
                                                    `}
                                                >
                                                    {skill}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ParallaxText>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
