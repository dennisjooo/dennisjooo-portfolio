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
  stat?: string;
  color: string;
}

export function NavigationCard({ title, description, href, icon: Icon, stat, color }: NavigationCardProps) {
  return (
    <m.div variants={itemVariants}>
      <Link
        href={href}
        className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card/30 hover:bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/50"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="inline-flex p-2.5 rounded-lg bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-500">
              <Icon className="w-5 h-5 text-foreground" />
            </div>
            <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all mt-1" />
          </div>

          <h2 className="text-lg font-bold font-urbanist mb-1.5 group-hover:text-accent transition-colors">
            {title}
          </h2>

          <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
            {description}
          </p>

          <div className="mt-4 pt-4 border-t border-border/50">
            {stat === undefined ? (
              <div className="h-3 w-16 rounded bg-muted/40 animate-pulse" />
            ) : (
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
                {stat}
              </span>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}
