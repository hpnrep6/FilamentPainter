export class ComputeConfig {
    constructor() {
        this._gl = null;
        this._canvas = null;
    }
    get canvas() {
        if (this._canvas == null) {
            throw new Error("Fetched canvas before initialisation");
        }
        return this._canvas;
    }
    set canvas(value) {
        this._canvas = value;
    }
    get gl() {
        if (this._gl == null) {
            throw new Error("WebGL not supported on this browser");
        }
        return this._gl;
    }
    set gl(value) {
        this._gl = value;
    }
}
