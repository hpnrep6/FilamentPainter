export function getHeights(outputData: Float32Array, width: number, height: number): number[][] {
	const result: number[][] = [];
	for (let i = 0; i < height; i++) {
		result[i] = [];
		for (let j = 0; j < width; j++) {
			const index = (i * width + j) * 4;
			// We are interested in the 4th element (alpha in RGBA)
			result[i][j] = outputData[index + 3];
		}
	}
	return result;
}

// function downloadSTL(stlContent: string, filename: string) {
//     const blob = new Blob([stlContent], { type: 'application/vnd.ms-stlascii' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
// }

export function generateSTLAndDownload(
	heightmap: number[][],
	filename: string = "filament-painting.stl",
	scaleFactor: number = 1,
): void {
	const numRows = heightmap.length;
	const numCols = heightmap[0].length;

	// Function to add a triangle to the binary STL data
	const addTriangle = (
		v1: [number, number, number],
		v2: [number, number, number],
		v3: [number, number, number],
		normal: [number, number, number],
		data: DataView,
		offset: number,
	): number => {
		// Normal vector
		data.setFloat32(offset, normal[0], true);
		offset += 4;
		data.setFloat32(offset, normal[1], true);
		offset += 4;
		data.setFloat32(offset, normal[2], true);
		offset += 4;

		// Vertex 1
		data.setFloat32(offset, v1[0] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, -v1[1] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, v1[2], true);
		offset += 4;

		// Vertex 2
		data.setFloat32(offset, v2[0] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, -v2[1] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, v2[2], true);
		offset += 4;

		// Vertex 3
		data.setFloat32(offset, v3[0] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, -v3[1] * scaleFactor, true);
		offset += 4;
		data.setFloat32(offset, v3[2], true);
		offset += 4;

		data.setUint16(offset, 0, true);
		offset += 2;

		return offset;
	};

	// Calculate the number of triangles
	let numTriangles = 0;

	// Count triangles for the top surface
	numTriangles += (numRows - 1) * (numCols - 1) * 2;

	// Count triangles for the bottom surface
	for (let i = 0; i < numRows - 1; i++) {
		for (let j = 0; j < numCols - 1; j++) {
			const h1 = heightmap[i][j];
			const h2 = heightmap[i][j + 1];
			const h3 = heightmap[i + 1][j + 1];
			const h4 = heightmap[i + 1][j];

			if (h1 !== 0 || h2 !== 0 || h3 !== 0 || h4 !== 0) {
				numTriangles += 2;
			}
		}
	}

	// Count triangles for the side faces
	for (let i = 0; i < numRows - 1; i++) {
		if (heightmap[i][0] !== 0 || heightmap[i + 1][0] !== 0) numTriangles += 2;
		if (heightmap[i][numCols - 1] !== 0 || heightmap[i + 1][numCols - 1] !== 0) numTriangles += 2;
	}

	for (let j = 0; j < numCols - 1; j++) {
		if (heightmap[0][j] !== 0 || heightmap[0][j + 1] !== 0) numTriangles += 2;
		if (heightmap[numRows - 1][j] !== 0 || heightmap[numRows - 1][j + 1] !== 0) numTriangles += 2;
	}

	// Create a buffer for the binary STL data
	const buffer = new ArrayBuffer(84 + numTriangles * 50); // 80 bytes header + 4 bytes for numTriangles + 50 bytes per triangle
	const dataView = new DataView(buffer);

	// Write the header (80 bytes of 0)
	for (let i = 0; i < 80; i++) {
		dataView.setUint8(i, 0);
	}

	// Write the number of triangles (4 bytes)
	dataView.setUint32(80, numTriangles, true);

	let offset = 84; // Start writing triangle data after the header and numTriangles

	// Generate top surface triangles
	for (let i = 0; i < numRows - 1; i++) {
		for (let j = 0; j < numCols - 1; j++) {
			const h1 = heightmap[i][j];
			const h2 = heightmap[i][j + 1];
			const h3 = heightmap[i + 1][j + 1];
			const h4 = heightmap[i + 1][j];

			offset = addTriangle([j, i, h1], [j + 1, i, h2], [j + 1, i + 1, h3], [0, 0, 1], dataView, offset);
			offset = addTriangle([j, i, h1], [j + 1, i + 1, h3], [j, i + 1, h4], [0, 0, 1], dataView, offset);
		}
	}

	// Generate bottom surface triangles
	for (let i = 0; i < numRows - 1; i++) {
		for (let j = 0; j < numCols - 1; j++) {
			const h1 = heightmap[i][j];
			const h2 = heightmap[i][j + 1];
			const h3 = heightmap[i + 1][j + 1];
			const h4 = heightmap[i + 1][j];

			if (h1 !== 0 || h2 !== 0 || h3 !== 0 || h4 !== 0) {
				offset = addTriangle([j, i, 0], [j + 1, i, 0], [j + 1, i + 1, 0], [0, 0, -1], dataView, offset);
				offset = addTriangle([j, i, 0], [j + 1, i + 1, 0], [j, i + 1, 0], [0, 0, -1], dataView, offset);
			}
		}
	}

	// Generate side faces for the edges
	for (let i = 0; i < numRows - 1; i++) {
		// Left edge
		if (heightmap[i][0] !== 0 || heightmap[i + 1][0] !== 0) {
			offset = addTriangle(
				[0, i, heightmap[i][0]],
				[0, i + 1, heightmap[i + 1][0]],
				[0, i + 1, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
			offset = addTriangle([0, i, heightmap[i][0]], [0, i + 1, 0], [0, i, 0], [0, 0, 0], dataView, offset);
		}
		// Right edge
		if (heightmap[i][numCols - 1] !== 0 || heightmap[i + 1][numCols - 1] !== 0) {
			offset = addTriangle(
				[numCols - 1, i, heightmap[i][numCols - 1]],
				[numCols - 1, i + 1, heightmap[i + 1][numCols - 1]],
				[numCols - 1, i + 1, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
			offset = addTriangle(
				[numCols - 1, i, heightmap[i][numCols - 1]],
				[numCols - 1, i + 1, 0],
				[numCols - 1, i, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
		}
	}

	for (let j = 0; j < numCols - 1; j++) {
		// Front edge
		if (heightmap[0][j] !== 0 || heightmap[0][j + 1] !== 0) {
			offset = addTriangle(
				[j, 0, heightmap[0][j]],
				[j + 1, 0, heightmap[0][j + 1]],
				[j + 1, 0, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
			offset = addTriangle([j, 0, heightmap[0][j]], [j + 1, 0, 0], [j, 0, 0], [0, 0, 0], dataView, offset);
		}
		// Back edge
		if (heightmap[numRows - 1][j] !== 0 || heightmap[numRows - 1][j + 1] !== 0) {
			offset = addTriangle(
				[j, numRows - 1, heightmap[numRows - 1][j]],
				[j + 1, numRows - 1, heightmap[numRows - 1][j + 1]],
				[j + 1, numRows - 1, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
			offset = addTriangle(
				[j, numRows - 1, heightmap[numRows - 1][j]],
				[j + 1, numRows - 1, 0],
				[j, numRows - 1, 0],
				[0, 0, 0],
				dataView,
				offset,
			);
		}
	}

	// Download the binary STL file
	const blob = new Blob([buffer], { type: "application/octet-stream" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);

	console.log("Binary STL generation and download initiated.");
}

// Function to generate a larger test heightmap with a clear hole
export function generateLargeHeightmap(rows: number, cols: number): number[][] {
	const heightmap: number[][] = [];
	const holeRadius = Math.min(rows, cols) / 4;
	const centerX = rows / 2;
	const centerY = cols / 2;

	for (let i = 0; i < rows; i++) {
		heightmap[i] = [];
		for (let j = 0; j < cols; j++) {
			const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
			if (distance < holeRadius) {
				heightmap[i][j] = 0; // Zero height in the circular area
			} else {
				heightmap[i][j] = Math.sin(i * 0.2) + Math.cos(j * 0.2) + 2; // Some wavy pattern
			}
		}
	}
	return heightmap;
}
