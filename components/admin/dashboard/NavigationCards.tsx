"use client";

import { m } from 'framer-motion';
import { NavigationCard } from './NavigationCard';
import { navigationCards, containerVariants } from './constants';

interface NavigationCardsProps {
  counts?: Record<string, number>;
  countsLoading?: boolean;
}

export function NavigationCards({ counts, countsLoading }: NavigationCardsProps) {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {navigationCards.map((card) => {
        const count = counts?.[card.href];
        const stat = countsLoading
          ? undefined
          : count !== undefined
            ? `${count} Items`
            : card.stat;
        return (
          <NavigationCard
            key={card.href}
            title={card.title}
            description={card.description}
            href={card.href}
            icon={card.icon}
            stat={stat}
          />
        );
      })}
    </m.div>
  );
}
