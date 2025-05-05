import { config } from "./config/Config.js";
import { handleImageUpload } from "./Upload.js";
import { getComputeFunction, GLComputeHeights } from "./gl/compute/Heights.js";
import { GLImage } from "./gl/Image.js";
import { debugDisplayDataOutput, debugDisplayHTMLImage } from "./debug/DisplayImage.js";
import { getFilamentListElements, setupDragAndDrop } from "./ui/Filaments.js";
import { setupHeightSelector } from "./ui/Heights.js";
import { HeightFunction } from "./config/Paint.js";
import { generateLargeHeightmap, generateSTLAndDownload, getHeights } from "./tools/HeightmapExport.js";
import { setupPreviewWindow } from "./ui/PreviewWindow.js";
import { initGL } from "./gl/Init.js";
import { autoUpdateImage, updateImage, updateOtherField } from "./ui/UpdateImage.js";
import { setupExport } from "./ui/Export.js";

initGL();

// config.paint.image = new Image();
//
// config.paint.image.onload = () => {
//     let comp = getComputeFunction(HeightFunction.NEAREST);
//
//     let image = new GLImage(config.paint.image);
//
//     let result = comp.compute(image);
//
//     debugDisplayDataOutput(result, image.width, image.height);
//     debugDisplayHTMLImage(config.paint.image);
//
//
//     setupHeightSelector(() => {
//         let comp = getComputeFunction(config.paint.heightFunction);
//         let result = comp.compute(image);
//         debugDisplayDataOutput(result, image.width, image.height);
//         debugDisplayHTMLImage(config.paint.image);
//
//         // let heights = getHeights(result, image.width, image.height);
//         // console.log(heights);
//         //
//         // generateSTLAndDownload(heights);
//
//         // downloadSTL(stlString, `large_heightmap_scaled.stl`);
//     });
// }

const imageResolutionX = document.getElementById("image-resolution-x") as HTMLInputElement;
const imageResolutionY = document.getElementById("image-resolution-y") as HTMLInputElement;
const physicalXInput = document.getElementById("physical-x") as HTMLInputElement;

handleImageUpload("image-upload", (result) => {
	if (result.error) {
		console.error("Image upload error:", result.error);
	} else if (result.imageElement) {
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

const baseLayerHeight = document.getElementById("base-layer-height-input") as HTMLInputElement;
const endLayerHeight = document.getElementById("end-layer-height-label") as HTMLElement;

baseLayerHeight.addEventListener("input", () => {
	const filaments = getFilamentListElements();
	let height = parseFloat(baseLayerHeight.value);
	for (let i = 0; i < filaments.length; i++) {
		height += filaments[i].layerHeight;
	}
	endLayerHeight.innerHTML = `End Height: ${height.toString()} mm`;
});

document.addEventListener("DOMContentLoaded", () => {
	setupDragAndDrop((list: HTMLUListElement) => {
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

document.getElementById("buy-commercial")?.addEventListener("click", () => {
	window.open("https://ko-fi.com/s/1d20470ee2", "_blank");
});
