/**
 * 2-dimensional vector using Float32Array.
 */
export type vec2 = Float32Array & { length: 2 };

/**
 * 3-dimensional vector using Float32Array.
 */
export type vec3 = Float32Array & { length: 3 };

/**
 * 4-dimensional vector using Float32Array.
 */
export type vec4 = Float32Array & { length: 4 };

export function vec2(x: number, y: number): vec2 {
	const v = new Float32Array(2) as vec2;
	v[0] = x;
	v[1] = y;
	return v;
}

export function vec3(x: number, y: number, z: number): vec3 {
	const v = new Float32Array(3) as vec3;
	v[0] = x;
	v[1] = y;
	v[2] = z;
	return v;
}

export function vec4(x: number, y: number, z: number, w: number): vec4 {
	const v = new Float32Array(4) as vec4;
	v[0] = x;
	v[1] = y;
	v[2] = z;
	v[3] = w;
	return v;
}

export class vec2i {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
