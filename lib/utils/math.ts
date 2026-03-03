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
