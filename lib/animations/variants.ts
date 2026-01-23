export const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInDownVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const tabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
};

export const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

export const blurRevealVariants = {
    hidden: {
        opacity: 0,
        y: 80,
        filter: 'blur(10px)',
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 100,
        },
    },
};

export const springItemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 120,
        },
    },
};
