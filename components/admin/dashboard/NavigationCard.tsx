"use client";

import Link from 'next/link';
import { m } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { itemVariants } from './constants';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  stat: string;
  color: string;
}

export function NavigationCard({ title, description, href, icon: Icon, stat, color }: NavigationCardProps) {
  return (
    <m.div variants={itemVariants}>
      <Link
        href={href}
        className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card/30 hover:bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/50"
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative p-8 h-full flex flex-col">
          <div className="mb-6 inline-flex p-3 rounded-lg bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-500 w-fit">
            <Icon className="w-6 h-6 text-foreground" />
          </div>

          <h2 className="text-2xl font-bold font-urbanist mb-3 group-hover:text-accent transition-colors">
            {title}
          </h2>

          <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
              {stat}
            </span>
            <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </m.div>
  );
}
