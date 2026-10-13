const fadeEase = [0.25, 0.1, 0.25, 1] as const;

export function createStaggerContainer(
  staggerChildren: number,
  delayChildren: number,
) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export function createFadeUpItem(
  _y?: number,
  options?: { scale?: number; delay?: number },
) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: fadeEase,
        ...(options?.delay !== undefined ? { delay: options.delay } : {}),
      },
    },
  };
}

export const staggerContainer = createStaggerContainer(0.12, 0.1);
export const staggerContainerTight = createStaggerContainer(0.1, 0.15);
export const headerStaggerContainer = createStaggerContainer(0.12, 0.05);
export const fadeUpItem = createFadeUpItem(20);
export const fadeUpItemLarge = createFadeUpItem(30);

export const timelineDesktopContainer = createStaggerContainer(0.15, 0.1);
export const timelineDesktopItem = createFadeUpItem(40);
export const timelineMobileContainer = createStaggerContainer(0.12, 0.1);
export const timelineMobileItem = createFadeUpItem(30);

export const dashboardContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const dashboardItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const underlineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: fadeEase, delay: 0.3 },
  },
};

export const tabContentVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const articleHeroBackVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
};

export const articleHeroMetaVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay: 0.1 },
};

export const articleHeroTitleVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.45, delay: 0.15 },
};

export const articleHeroDescriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay: 0.2 },
};

export const articleHeroImageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.45, delay: 0.25 },
};

export const featuredCardVariants = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};
