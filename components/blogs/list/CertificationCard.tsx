'use client';

import { m } from 'framer-motion';
import { ArrowUpRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export interface Certification {
    id?: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    link: string;
}

interface CertificationCardProps {
    certification: Certification;
    index: number;
}

export const CertificationCard = ({ certification, index }: CertificationCardProps) => {
    const { title, issuer, date, description, link } = certification;

    return (
        <m.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <article className="relative flex flex-col h-full p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-all duration-500">
                {/* Gradient Glow on Hover */}
                <div className="absolute -inset-px bg-gradient-accent rounded-lg opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 -z-10" />

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                            <AcademicCapIcon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div>
                            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">
                                {date}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">
                                {issuer}
                            </span>
                        </div>
                    </div>
                    <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-urbanist font-bold text-lg md:text-xl tracking-tight leading-tight text-foreground group-hover:text-accent transition-colors duration-300 mb-3">
                        {title}
                    </h3>

                    <p className="font-urbanist text-muted-foreground text-sm leading-relaxed flex-1">
                        {description}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-border">
                    <span className="font-urbanist font-bold text-sm text-foreground group-hover:text-accent transition-colors duration-300 inline-flex items-center gap-2">
                        View Certificate
                        <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </span>
                </div>
            </article>
        </m.a>
    );
};
