import { ComputeConfig } from './Compute.js';
import { ExportConfig } from './Export.js';
import { PaintConfig } from './Paint.js';
export class Config {
    constructor() {
        this._compute = new ComputeConfig();
        this._export = new ExportConfig();
        this._paint = new PaintConfig();
    }
    get compute() {
        return this._compute;
    }
    get export() {
        return this._export;
    }
    get paint() {
        return this._paint;
    }
}
export const config = new Config();
