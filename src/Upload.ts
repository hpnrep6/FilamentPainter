export interface ImageUpload {
	file: File | null;
	imageElement: HTMLImageElement | null; // Changed to HTMLImageElement
	error: string | null;
}

export function handleImageUpload(inputId: string, callback: (result: ImageUpload) => void): void {
	const inputElement = document.getElementById(inputId) as HTMLInputElement | null;

	if (!inputElement) {
		console.error(`Input element with ID '${inputId}' not found.`);
		return;
	}

	inputElement.addEventListener("change", (event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			callback({ file: null, imageElement: null, error: "No file selected." });
			return;
		}

		if (!file.type.startsWith("image/")) {
			callback({ file: null, imageElement: null, error: "Selected file is not an image." });
			return;
		}

		const reader = new FileReader();

		reader.onload = (readEvent) => {
			const dataUrl = readEvent.target?.result as string;
			const img = new Image();

			img.onload = () => {
				callback({ file, imageElement: img, error: null });
			};

			img.onerror = () => {
				callback({ file, imageElement: null, error: "Error loading the image." });
			};

			img.src = dataUrl;
		};

		reader.onerror = () => {
			callback({ file, imageElement: null, error: "Error reading the file." });
		};

		reader.readAsDataURL(file);
	});
}
