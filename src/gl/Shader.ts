import { config } from "../config/Config.js";

export class GLShader {
	public shader: WebGLShader;

	constructor(type: number, source: string) {
		let gl = config.compute.gl;
		const shader = gl.createShader(type);
		if (!shader) {
			throw new Error("Shader creation error");
		}

		this.shader = shader;

		gl.shaderSource(this.shader, source);
		gl.compileShader(this.shader);

		if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
			const infoLog = gl.getShaderInfoLog(this.shader);
			gl.deleteShader(this.shader);
			throw new Error(`Shader compilation error: ${infoLog}`);
		}
	}

	dispose() {
		if (this.shader) {
			config.compute.gl.deleteShader(this.shader);
		}
	}
}
