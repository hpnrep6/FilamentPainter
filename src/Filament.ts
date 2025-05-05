import { vec3 } from "./Types.js";

export class Filament {
	colour: vec3 = vec3(0, 0, 0);
	endHeight: number = 0;
	// Distance to opaque in mm
	opacity: number = 0;
	name: string = "";

	/**
	 * Creates a new Filament instance.
	 * @param colour The color of the filament, either as an RGB array [r, g, b] (0-1 or 0-255) or a hex string (e.g., "#FF0000").
	 * @param startHeight The ending height of the filament.
	 * @param colorFormat Optional: Specify 'normalized' (0-1), 'byte' (0-255) for RGB array, or leave undefined for hex. Defaults to 'normalized' if color is an array.
	 */
	constructor(
		colour: [number, number, number] | string,
		endHeight: number,
		name: string,
		opacity: number,
		colorFormat: "normalised" | "byte" = "normalised",
	) {
		this.endHeight = endHeight;
		this.name = name;
		this.opacity = opacity;

		if (Array.isArray(colour)) {
			let r = colour[0];
			let g = colour[1];
			let b = colour[2];

			const format = colorFormat || "normalised"; // Default to normalized for RGB array

			if (format === "byte") {
				this.colour = vec3(r / 255, g / 255, b / 255); // Normalize byte values to 0-1
			} else {
				this.colour = vec3(r, g, b);
			}
		} else if (typeof colour === "string") {
			this.colour = this.hexToRgbNormalized(colour);
		} else {
			throw new Error("Invalid color format provided. Use RGB array or hex string.");
		}
	}

	/**
	 * Converts a hex color string (e.g., "#RRGGBB") to normalized RGB (0-1).
	 * @param hex The hex color string.
	 * @returns An array representing the RGB color (normalized 0-1).
	 */
	private hexToRgbNormalized(hex: string): vec3 {
		const bigint = parseInt(hex.slice(1), 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return vec3(r / 255, g / 255, b / 255);
	}
}
