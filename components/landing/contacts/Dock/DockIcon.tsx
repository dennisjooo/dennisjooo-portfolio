"use client";

import { useRef, type ReactNode } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type HTMLMotionProps,
    type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { DEFAULT_DISTANCE, DEFAULT_MAGNIFICATION } from "./constants";

export interface DockIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
    mouseX?: MotionValue<number>;
    magnification?: number;
    distance?: number;
    children: ReactNode;
}

export const DockIcon = ({
    mouseX,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    className,
    children,
    ...props
}: DockIconProps) => {
    const iconRef = useRef<HTMLDivElement>(null);

    const fallbackMouseX = useMotionValue(0);
    const safeMouseX = mouseX || fallbackMouseX;

    const distanceCalc = useTransform(safeMouseX, (val: number) => {
        const bounds = iconRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return val - bounds.x - bounds.width / 2;
    });

    const width = useSpring(
        useTransform(distanceCalc, [-distance, 0, distance], [40, magnification, 40]),
        { mass: 0.1, stiffness: 150, damping: 12 }
    );

    return (
        <motion.div
            ref={iconRef}
            style={{ width }}
            className={cn(
                "flex aspect-square cursor-pointer items-center justify-center rounded-full",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

DockIcon.displayName = "DockIcon";
