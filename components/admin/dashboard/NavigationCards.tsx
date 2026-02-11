"use client";

import { m } from 'framer-motion';
import { NavigationCard } from './NavigationCard';
import { navigationCards, containerVariants } from './constants';

export function NavigationCards() {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {navigationCards.map((card) => (
        <NavigationCard
          key={card.href}
          title={card.title}
          description={card.description}
          href={card.href}
          icon={card.icon}
          stat={card.stat}
          color={card.color}
        />
      ))}
    </m.div>
  );
}
