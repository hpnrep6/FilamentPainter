function debugCreateImageFromOutputData(outputData: Float32Array, width: number, height: number): HTMLCanvasElement {
	const canvas: HTMLElement | null = document.getElementById("canvas-preview");
	if (canvas == null || !(canvas instanceof HTMLCanvasElement)) {
		throw new Error("Can't find preview canvas");
	}
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas 2D context not available.");
	}

	const imageData = ctx.createImageData(width, height);
	const data = imageData.data;

	data.set(outputData.map((val, i) => (i % 4 === 3 ? 255 : val * 255)));

	ctx.putImageData(imageData, 0, 0);
	return canvas;
}

export function debugDisplayDataOutput(outputData: Float32Array, textureWidth: number, textureHeight: number) {
	if (outputData) {
		debugCreateImageFromOutputData(outputData, textureWidth, textureHeight);
	}
}

export function debugDisplayHTMLImage(image: HTMLImageElement) {
	const canvas: HTMLCanvasElement | null = document.getElementById("canvas-source") as HTMLCanvasElement | null;

	if (!canvas) {
		console.error('Canvas element with ID "canvas-source" not found.');
		return;
	}

	const ctx = canvas.getContext("2d");

	if (!ctx) {
		console.error("Could not get 2D rendering context.");
		return;
	}

	canvas.width = image.width;
	canvas.height = image.height;

	ctx.drawImage(image, 0, 0);
}
