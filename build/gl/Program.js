import { config } from '../config/Config.js';
export class GLProgram {
    constructor(vertexGLShader, fragmentGLShader) {
        let gl = config.compute.gl;
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Cannot create gl program');
        }
        let vertexShader = vertexGLShader.shader;
        let fragmentShader = fragmentGLShader.shader;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            throw new Error('Program linking error: ' + gl.getProgramInfoLog(program));
        }
        this.program = program;
    }
    dispose() {
        if (this.program) {
            config.compute.gl.deleteProgram(this.program);
        }
    }
}
