import { interpValues } from "./AutoOpacityData.js";

const lerp = (a: number, b: number, t: number): number => {
	return a + t * (b - a);
};

// Trilinear interpolation function
const trilinearInterpolation = (array: number[][][], x: number, y: number, z: number): number => {
	const x0 = Math.floor(x);
	const x1 = Math.ceil(x);
	const y0 = Math.floor(y);
	const y1 = Math.ceil(y);
	const z0 = Math.floor(z);
	const z1 = Math.ceil(z);

	// Clamp indices to stay within array bounds
	const safeX0 = Math.max(0, Math.min(x0, array.length - 1));
	const safeX1 = Math.max(0, Math.min(x1, array.length - 1));
	const safeY0 = Math.max(0, Math.min(y0, array[0].length - 1));
	const safeY1 = Math.max(0, Math.min(y1, array[0].length - 1));
	const safeZ0 = Math.max(0, Math.min(z0, array[0][0].length - 1));
	const safeZ1 = Math.max(0, Math.min(z1, array[0][0].length - 1));

	// Get the 8 nearest points
	const c000 = array[safeX0][safeY0][safeZ0];
	const c001 = array[safeX0][safeY0][safeZ1];
	const c010 = array[safeX0][safeY1][safeZ0];
	const c011 = array[safeX0][safeY1][safeZ1];
	const c100 = array[safeX1][safeY0][safeZ0];
	const c101 = array[safeX1][safeY0][safeZ1];
	const c110 = array[safeX1][safeY1][safeZ0];
	const c111 = array[safeX1][safeY1][safeZ1];

	// Interpolate along x-axis
	const tx = x - x0;
	const c00 = lerp(c000, c100, tx);
	const c01 = lerp(c001, c101, tx);
	const c10 = lerp(c010, c110, tx);
	const c11 = lerp(c011, c111, tx);

	// Interpolate along y-axis
	const ty = y - y0;
	const c0 = lerp(c00, c10, ty);
	const c1 = lerp(c01, c11, ty);

	// Interpolate along z-axis
	const tz = z - z0;
	return lerp(c0, c1, tz);
};

export function getOpacity(r: number, g: number, b: number): number {
	// Map r, g, b values to array indices
	const x = r * (interpValues.length - 1);
	const y = g * (interpValues[0].length - 1);
	const z = b * (interpValues[0][0].length - 1);

	// Perform trilinear interpolation
	const interpolated = trilinearInterpolation(interpValues, x, y, z);

	const clampedValue = Math.max(0.1, Math.min(interpolated, 1));

	// Round the clamped value to 2 decimal places
	return Math.round(clampedValue * 100) / 100.0; // const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
	// return 1 - luminance; // Adjust this formula as needed
}
