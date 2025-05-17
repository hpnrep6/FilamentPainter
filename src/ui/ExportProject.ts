import { config } from "../config/Config.js";
import { downloadTextFile } from "./Export.js";
import { getFilamentListElements } from "./Filaments.js";

export function setupExportProject() {
	var exportButtonProject = document.getElementById("export-project") as HTMLButtonElement;
	exportButtonProject.addEventListener("click", exportProject);
}

function exportProject() {
	const imageData = config.paint.sourceImage.src;
	const heightOptionSelection = document.getElementById("height-option-selection") as HTMLSelectElement;
	const globalLayerHeightInput = document.getElementById("layer-height-input") as HTMLInputElement;
	const baseLayerHeight = document.getElementById("base-layer-height-input") as HTMLInputElement;
	const layers = getFilamentListElements();
	const imageResolutionX = document.getElementById("image-resolution-x") as HTMLInputElement;
	const imageResolutionY = document.getElementById("image-resolution-y") as HTMLInputElement;
	const detailSizeInput = document.getElementById("detail-size") as HTMLInputElement;
	const physicalXInput = document.getElementById("physical-x") as HTMLInputElement;
	const physicalYInput = document.getElementById("physical-y") as HTMLInputElement;

	downloadTextFile(
		"project.json",
		JSON.stringify({
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
		}),
	);
}
