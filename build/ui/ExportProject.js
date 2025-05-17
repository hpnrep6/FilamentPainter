import { config } from "../config/Config.js";
import { downloadTextFile } from "./Export.js";
import { getFilamentListElements } from "./Filaments.js";
export function setupExportProject() {
    var exportButtonProject = document.getElementById("export-project");
    exportButtonProject.addEventListener("click", exportProject);
}
function exportProject() {
    const imageData = config.paint.sourceImage.src;
    const heightOptionSelection = document.getElementById("height-option-selection");
    const globalLayerHeightInput = document.getElementById("layer-height-input");
    const baseLayerHeight = document.getElementById("base-layer-height-input");
    const layers = getFilamentListElements();
    const imageResolutionX = document.getElementById("image-resolution-x");
    const imageResolutionY = document.getElementById("image-resolution-y");
    const detailSizeInput = document.getElementById("detail-size");
    const physicalXInput = document.getElementById("physical-x");
    const physicalYInput = document.getElementById("physical-y");
    downloadTextFile("project.json", JSON.stringify({
        imageData,
        heightOptionSelection: heightOptionSelection.value,
        globalLayerHeightInput: globalLayerHeightInput.value,
        baseLayerHeight: baseLayerHeight.value,
        layers,
        imageResolutionX: imageResolutionX.value,
        imageResolutionY: imageResolutionY.value,
        detailSizeInput: detailSizeInput.value,
        physicalXInput: physicalXInput.value,
        physicalYInput: physicalYInput.value,
    }));
}
