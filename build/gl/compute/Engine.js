import { GLShader } from '../Shader.js';
import { GLProgram } from '../Program.js';
import { config } from '../../config/Config.js';
export class GLComputeEngine {
    constructor(vertexShader, fragmentShader) {
        this.vertexShader = new GLShader(config.compute.gl.VERTEX_SHADER, vertexShader);
        this.fragmentShader = new GLShader(config.compute.gl.FRAGMENT_SHADER, fragmentShader);
        this.program = new GLProgram(this.vertexShader, this.fragmentShader);
    }
    dispose() {
        this.vertexShader.dispose();
        this.fragmentShader.dispose();
        this.program.dispose();
    }
}
