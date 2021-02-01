export function roundToTwo(num: number) {
    // @ts-ignore
    return +(Math.round(num + 'e+2') + 'e-2');
}