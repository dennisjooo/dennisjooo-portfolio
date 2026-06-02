'use client';

import { m } from '@/components/motion';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { BsGithub } from 'react-icons/bs';

interface Link {
    url: string;
    text: string;
}

interface ProjectLinksProps {
    links: Link[];
}

export default function ProjectLinks({ links }: ProjectLinksProps) {
    return (
        <div className="pt-12 border-t border-border">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Resources
                </span>
                <div className="flex-1 h-px bg-border" />
            </div>

            {/* Links Grid */}
            <nav className="flex flex-wrap gap-4">
                {links.map((link, index) => (
                    <ProjectLink key={index} index={index} {...link} />
                ))}
            </nav>
        </div>
    );
}

function ProjectLink({ url, text, index }: Link & { index: number }) {
    const isGitHubLink = url.toLowerCase().includes('github.com');

    return (
        <m.a
            href={url}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group inline-block"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="relative">
                <div className="absolute -inset-px bg-gradient-accent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-border bg-card transition-colors duration-500">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                        {isGitHubLink ? (
                            <BsGithub className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                        ) : (
                            <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                        )}
                    </span>

                    <span className="font-sans font-medium text-sm text-foreground group-hover:text-accent transition-colors duration-300">
                        {text}
                    </span>

                    <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </span>
            </div>
        </m.a>
    );
}