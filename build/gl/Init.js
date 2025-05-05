import { config } from "../config/Config.js";
export function initGL() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGL2RenderingContext)) {
        console.error("Unable to initialize WebGL. Your browser may not support it.");
        throw new Error("Cannot initialise WebGL.");
    }
    else {
        config.compute.gl = gl;
        config.compute.canvas = canvas;
    }
    const extension = gl.getExtension("EXT_color_buffer_float");
    if (!extension) {
        throw new Error("Required extensions not supported");
    }
}
