import { interpValues } from "./AutoOpacityData.js";
const lerp = (a, b, t) => {
    return a + t * (b - a);
};
const trilinearInterpolation = (array, x, y, z) => {
    const x0 = Math.floor(x);
    const x1 = Math.ceil(x);
    const y0 = Math.floor(y);
    const y1 = Math.ceil(y);
    const z0 = Math.floor(z);
    const z1 = Math.ceil(z);
    const safeX0 = Math.max(0, Math.min(x0, array.length - 1));
    const safeX1 = Math.max(0, Math.min(x1, array.length - 1));
    const safeY0 = Math.max(0, Math.min(y0, array[0].length - 1));
    const safeY1 = Math.max(0, Math.min(y1, array[0].length - 1));
    const safeZ0 = Math.max(0, Math.min(z0, array[0][0].length - 1));
    const safeZ1 = Math.max(0, Math.min(z1, array[0][0].length - 1));
    const c000 = array[safeX0][safeY0][safeZ0];
    const c001 = array[safeX0][safeY0][safeZ1];
    const c010 = array[safeX0][safeY1][safeZ0];
    const c011 = array[safeX0][safeY1][safeZ1];
    const c100 = array[safeX1][safeY0][safeZ0];
    const c101 = array[safeX1][safeY0][safeZ1];
    const c110 = array[safeX1][safeY1][safeZ0];
    const c111 = array[safeX1][safeY1][safeZ1];
    const tx = x - x0;
    const c00 = lerp(c000, c100, tx);
    const c01 = lerp(c001, c101, tx);
    const c10 = lerp(c010, c110, tx);
    const c11 = lerp(c011, c111, tx);
    const ty = y - y0;
    const c0 = lerp(c00, c10, ty);
    const c1 = lerp(c01, c11, ty);
    const tz = z - z0;
    return lerp(c0, c1, tz);
};
export function getOpacity(r, g, b) {
    const x = r * (interpValues.length - 1);
    const y = g * (interpValues[0].length - 1);
    const z = b * (interpValues[0][0].length - 1);
    const interpolated = trilinearInterpolation(interpValues, x, y, z);
    const clampedValue = Math.max(0.1, Math.min(interpolated, 1));
    return Math.round(clampedValue * 100) / 100.0;
}
