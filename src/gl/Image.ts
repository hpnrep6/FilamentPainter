import { config } from "../config/Config.js";

export class GLImage {
	public texture: WebGLTexture;
	private imageElement: HTMLImageElement | null;
	private _width: number;
	private _height: number;

	constructor(imageElement: HTMLImageElement) {
		this.imageElement = imageElement;
		this._width = imageElement.width;
		this._height = imageElement.height;

		if (!config.compute.gl || !this.imageElement) {
			throw new Error("No WebGL instance to create texture");
		}

		this.texture = config.compute.gl.createTexture();
		config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, this.texture);
		config.compute.gl.texImage2D(
			config.compute.gl.TEXTURE_2D,
			0,
			config.compute.gl.RGBA,
			config.compute.gl.RGBA,
			config.compute.gl.UNSIGNED_BYTE,
			this.imageElement,
		);
		// Disable mipmaps:
		config.compute.gl.texParameteri(
			config.compute.gl.TEXTURE_2D,
			config.compute.gl.TEXTURE_MIN_FILTER,
			config.compute.gl.NEAREST, // or gl.NEAREST
		);
		config.compute.gl.texParameteri(
			config.compute.gl.TEXTURE_2D,
			config.compute.gl.TEXTURE_MAG_FILTER,
			config.compute.gl.NEAREST, // or gl.NEAREST
		);

		config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, null);
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	dispose(): void {
		if (this.texture) {
			config.compute.gl.deleteTexture(this.texture);
		}
		this.imageElement = null;
		this._width = 0;
		this._height = 0;
	}
}
