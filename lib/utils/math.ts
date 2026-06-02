export function wrap(min: number, max: number, value: number): number {
    const rangeSize = max - min;
    return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min;
}
