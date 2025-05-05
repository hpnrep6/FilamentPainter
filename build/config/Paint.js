export var HeightFunction;
(function (HeightFunction) {
    HeightFunction[HeightFunction["NEAREST"] = 0] = "NEAREST";
    HeightFunction[HeightFunction["GREYSCALE_MAX"] = 1] = "GREYSCALE_MAX";
    HeightFunction[HeightFunction["GREYSCALE_LUMINANCE"] = 2] = "GREYSCALE_LUMINANCE";
})(HeightFunction || (HeightFunction = {}));
export class PaintConfig {
    constructor() {
        this._image = new Image();
        this._sourceImage = new Image();
        this._filaments = [];
        this._heightFunction = HeightFunction.NEAREST;
        this._computedResult = new Float32Array();
        this.startHeight = 0.2;
        this.endHeight = 0.2;
        this.increment = 0.08;
    }
    get sourceImage() {
        return this._sourceImage;
    }
    set sourceImage(value) {
        this._sourceImage = value;
    }
    get computedResult() {
        return this._computedResult;
    }
    set computedResult(value) {
        this._computedResult = value;
    }
    get heightFunction() {
        return this._heightFunction;
    }
    set heightFunction(value) {
        this._heightFunction = value;
    }
    get filaments() {
        return this._filaments;
    }
    set filaments(value) {
        this._filaments = value;
    }
    get image() {
        if (this._image == null) {
            throw new Error("No image selected");
        }
        return this._image;
    }
    set image(value) {
        this._image = value;
    }
    hasImage() {
        return this._image != null;
    }
}
