/**
 * Wraps a value within a range, creating a seamless loop.
 * Useful for infinite scrolling animations.
 * 
 * @param min - The minimum value of the range
 * @param max - The maximum value of the range
 * @param value - The value to wrap
 * @returns The wrapped value within [min, max)
 */
export function wrap(min: number, max: number, value: number): number {
    const rangeSize = max - min;
    return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Clamps a value between a minimum and maximum.
 * 
 * @param min - The minimum value
 * @param max - The maximum value
 * @param value - The value to clamp
 * @returns The clamped value
 */
export function clamp(min: number, max: number, value: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 * 
 * @param start - The start value
 * @param end - The end value
 * @param t - The interpolation factor (0-1)
 * @returns The interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}
