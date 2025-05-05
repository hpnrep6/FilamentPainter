import { config } from "../config/Config.js";
import { HeightFunction } from "../config/Paint.js";
import { getComputeFunction } from "../gl/compute/Heights.js";
import { GLImage } from "../gl/Image.js";
import { debugDisplayDataOutput, debugDisplayHTMLImage } from "../debug/DisplayImage.js";
import { getFilamentListElements } from "./Filaments.js";
import { Filament } from "../Filament.js";
function getTopographyFunction() {
    const heightOptionSelect = document.getElementById("height-option-selection");
    const selectedValue = heightOptionSelect.value;
    let selectedHeightFunction;
    switch (selectedValue) {
        case "nearest":
            selectedHeightFunction = HeightFunction.NEAREST;
            break;
        case "greyscale-max":
            selectedHeightFunction = HeightFunction.GREYSCALE_MAX;
            break;
        case "greyscale-luminance":
            selectedHeightFunction = HeightFunction.GREYSCALE_LUMINANCE;
            break;
        default:
            throw new Error("Invalid option");
    }
    return selectedHeightFunction;
}
const detailSizeInput = document.getElementById("detail-size");
const imageResolutionX = document.getElementById("image-resolution-x");
const imageResolutionY = document.getElementById("image-resolution-y");
const physicalXInput = document.getElementById("physical-x");
const physicalYInput = document.getElementById("physical-y");
const fileSizeEstimate = document.getElementById("file-size-estimate");
export function updateOtherField(changedInput) {
    const aspectRatio = config.paint.sourceImage.width / config.paint.sourceImage.height;
    if (changedInput === physicalXInput) {
        const newY = parseFloat(physicalXInput.value) / aspectRatio;
        physicalYInput.value = isNaN(newY) ? "" : newY.toString();
    }
    else if (changedInput === physicalYInput) {
        const newX = parseFloat(physicalYInput.value) * aspectRatio;
        physicalXInput.value = isNaN(newX) ? "" : newX.toString();
    }
    const detailSize = parseFloat(detailSizeInput.value);
    if (isNaN(detailSize) || detailSize <= 0) {
        console.error("Invalid detail size.");
        return;
    }
    const pixelWidth = Math.round(parseFloat(physicalXInput.value) / detailSize);
    const pixelHeight = Math.round(parseFloat(physicalYInput.value) / detailSize);
    imageResolutionX.value = Math.round(pixelWidth).toString();
    imageResolutionY.value = Math.round(pixelHeight).toString();
    fileSizeEstimate.innerHTML = `Estimated file size: ${(pixelWidth * pixelHeight * 200) / 1000000} MB`;
    autoUpdateImage();
}
physicalXInput.addEventListener("input", () => updateOtherField(physicalXInput));
physicalYInput.addEventListener("input", () => updateOtherField(physicalYInput));
detailSizeInput.addEventListener("input", () => updateOtherField(physicalYInput));
function resizePaintImage(afterResize) {
    if (!config.paint.sourceImage) {
        console.error("Source image is not loaded.");
        return;
    }
    const detailSize = parseFloat(detailSizeInput.value);
    if (isNaN(detailSize) || detailSize <= 0) {
        console.error("Invalid detail size.");
        return;
    }
    const pixelWidth = Math.round(parseFloat(physicalXInput.value) / detailSize);
    const pixelHeight = Math.round(parseFloat(physicalYInput.value) / detailSize);
    fileSizeEstimate.innerHTML = `Estimated file size: ${(pixelWidth * pixelHeight * 200) / 1000000} MB`;
    const canvas = document.getElementById("canvas-source");
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(config.paint.sourceImage, 0, 0, pixelWidth, pixelHeight);
        const resizedImage = new Image();
        resizedImage.onload = () => {
            config.paint.image = resizedImage;
            imageResolutionX.value = Math.round(pixelWidth).toString();
            imageResolutionY.value = Math.round(pixelHeight).toString();
            afterResize();
        };
        resizedImage.src = canvas.toDataURL();
    }
    else {
        console.error("Could not get 2D rendering context for canvas.");
    }
}
const baseLayerHeight = document.getElementById("base-layer-height-input");
const globalLayerHeightInput = document.getElementById("layer-height-input");
let glImage;
export function updateImage() {
    if (config.paint.image.height == 0) {
        console.log("no image");
        return;
    }
    resizePaintImage(() => {
        let image = config.paint.image;
        let heightFunction = getTopographyFunction();
        let computeEngine = getComputeFunction(heightFunction);
        if (glImage !== undefined) {
            glImage.dispose();
            glImage = undefined;
        }
        glImage = new GLImage(image);
        let filaments = getFilamentListElements().reverse();
        let layerHeight = parseFloat(baseLayerHeight.value);
        config.paint.filaments = [];
        for (let i = 0; i < filaments.length; i++) {
            config.paint.filaments.push(new Filament(filaments[i].color, filaments[i].layerHeight + layerHeight, filaments[i].name, filaments[i].opacity));
            layerHeight += filaments[i].layerHeight;
        }
        config.paint.startHeight = parseFloat(baseLayerHeight.value);
        config.paint.endHeight = layerHeight;
        config.paint.increment = parseFloat(globalLayerHeightInput.value);
        let computedResult = computeEngine.compute(glImage);
        debugDisplayDataOutput(computedResult, image.width, image.height);
        debugDisplayHTMLImage(image);
        config.paint.computedResult = computedResult;
    });
}
export function autoUpdateImage() {
    const autoCheckbox = document.getElementById("auto-update-checkbox");
    if (autoCheckbox.checked) {
        updateImage();
    }
}
document.getElementById("update-painting-button").addEventListener("click", updateImage);
