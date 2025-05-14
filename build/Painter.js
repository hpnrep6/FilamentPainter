import { config } from "./config/Config.js";
import { handleImageUpload } from "./Upload.js";
import { getFilamentListElements, setupDragAndDrop } from "./ui/Filaments.js";
import { setupHeightSelector } from "./ui/Heights.js";
import { setupPreviewWindow } from "./ui/PreviewWindow.js";
import { initGL } from "./gl/Init.js";
import { autoUpdateImage, updateImage, updateOtherField } from "./ui/UpdateImage.js";
import { setupExport } from "./ui/Export.js";
import { setupExportProject } from "./ui/ExportProject.js";
initGL();
const imageResolutionX = document.getElementById("image-resolution-x");
const imageResolutionY = document.getElementById("image-resolution-y");
const physicalXInput = document.getElementById("physical-x");
handleImageUpload("image-upload", (result) => {
    if (result.error) {
        console.error("Image upload error:", result.error);
    }
    else if (result.imageElement) {
        config.paint.image = result.imageElement;
        config.paint.sourceImage = result.imageElement;
        imageResolutionX.value = `${config.paint.image.width}`;
        imageResolutionY.value = `${config.paint.image.height}`;
        physicalXInput.value = "100";
        updateOtherField(physicalXInput);
        updateImage();
    }
});
setupPreviewWindow();
setupHeightSelector();
const baseLayerHeight = document.getElementById("base-layer-height-input");
const endLayerHeight = document.getElementById("end-layer-height-label");
baseLayerHeight.addEventListener("input", () => {
    const filaments = getFilamentListElements();
    let height = parseFloat(baseLayerHeight.value);
    for (let i = 0; i < filaments.length; i++) {
        height += filaments[i].layerHeight;
    }
    endLayerHeight.innerHTML = `End Height: ${height.toString()} mm`;
});
document.addEventListener("DOMContentLoaded", () => {
    setupDragAndDrop((list) => {
        const filaments = getFilamentListElements();
        let height = parseFloat(baseLayerHeight.value);
        for (let i = 0; i < filaments.length; i++) {
            height += filaments[i].layerHeight;
        }
        height = Math.round(height * 100) / 100;
        endLayerHeight.innerHTML = `End Height: ${height.toString()} mm`;
        autoUpdateImage();
    });
});
setupExport();
setupExportProject();
document.getElementById("buy-commercial")?.addEventListener("click", () => {
    window.open("https://ko-fi.com/s/1d20470ee2", "_blank");
});
