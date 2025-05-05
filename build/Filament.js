import { vec3 } from "./Types.js";
export class Filament {
    constructor(colour, endHeight, name, opacity, colorFormat = "normalised") {
        this.colour = vec3(0, 0, 0);
        this.endHeight = 0;
        this.opacity = 0;
        this.name = "";
        this.endHeight = endHeight;
        this.name = name;
        this.opacity = opacity;
        if (Array.isArray(colour)) {
            let r = colour[0];
            let g = colour[1];
            let b = colour[2];
            const format = colorFormat || "normalised";
            if (format === "byte") {
                this.colour = vec3(r / 255, g / 255, b / 255);
            }
            else {
                this.colour = vec3(r, g, b);
            }
        }
        else if (typeof colour === "string") {
            this.colour = this.hexToRgbNormalized(colour);
        }
        else {
            throw new Error("Invalid color format provided. Use RGB array or hex string.");
        }
    }
    hexToRgbNormalized(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return vec3(r / 255, g / 255, b / 255);
    }
}
