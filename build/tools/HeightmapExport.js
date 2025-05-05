export function getHeights(outputData, width, height) {
    const result = [];
    for (let i = 0; i < height; i++) {
        result[i] = [];
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4;
            result[i][j] = outputData[index + 3];
        }
    }
    return result;
}
export function generateSTLAndDownload(heightmap, filename = "filament-painting.stl", scaleFactor = 1) {
    const numRows = heightmap.length;
    const numCols = heightmap[0].length;
    const addTriangle = (v1, v2, v3, normal, data, offset) => {
        data.setFloat32(offset, normal[0], true);
        offset += 4;
        data.setFloat32(offset, normal[1], true);
        offset += 4;
        data.setFloat32(offset, normal[2], true);
        offset += 4;
        data.setFloat32(offset, v1[0] * scaleFactor, true);
        offset += 4;
        data.setFloat32(offset, -v1[1] * scaleFactor, true);
        offset += 4;
        data.setFloat32(offset, v1[2], true);
        offset += 4;
        data.setFloat32(offset, v2[0] * scaleFactor, true);
        offset += 4;
        data.setFloat32(offset, -v2[1] * scaleFactor, true);
        offset += 4;
        data.setFloat32(offset, v2[2], true);
        offset += 4;
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
    let numTriangles = 0;
    numTriangles += (numRows - 1) * (numCols - 1) * 2;
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
    for (let i = 0; i < numRows - 1; i++) {
        if (heightmap[i][0] !== 0 || heightmap[i + 1][0] !== 0)
            numTriangles += 2;
        if (heightmap[i][numCols - 1] !== 0 || heightmap[i + 1][numCols - 1] !== 0)
            numTriangles += 2;
    }
    for (let j = 0; j < numCols - 1; j++) {
        if (heightmap[0][j] !== 0 || heightmap[0][j + 1] !== 0)
            numTriangles += 2;
        if (heightmap[numRows - 1][j] !== 0 || heightmap[numRows - 1][j + 1] !== 0)
            numTriangles += 2;
    }
    const buffer = new ArrayBuffer(84 + numTriangles * 50);
    const dataView = new DataView(buffer);
    for (let i = 0; i < 80; i++) {
        dataView.setUint8(i, 0);
    }
    dataView.setUint32(80, numTriangles, true);
    let offset = 84;
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
    for (let i = 0; i < numRows - 1; i++) {
        if (heightmap[i][0] !== 0 || heightmap[i + 1][0] !== 0) {
            offset = addTriangle([0, i, heightmap[i][0]], [0, i + 1, heightmap[i + 1][0]], [0, i + 1, 0], [0, 0, 0], dataView, offset);
            offset = addTriangle([0, i, heightmap[i][0]], [0, i + 1, 0], [0, i, 0], [0, 0, 0], dataView, offset);
        }
        if (heightmap[i][numCols - 1] !== 0 || heightmap[i + 1][numCols - 1] !== 0) {
            offset = addTriangle([numCols - 1, i, heightmap[i][numCols - 1]], [numCols - 1, i + 1, heightmap[i + 1][numCols - 1]], [numCols - 1, i + 1, 0], [0, 0, 0], dataView, offset);
            offset = addTriangle([numCols - 1, i, heightmap[i][numCols - 1]], [numCols - 1, i + 1, 0], [numCols - 1, i, 0], [0, 0, 0], dataView, offset);
        }
    }
    for (let j = 0; j < numCols - 1; j++) {
        if (heightmap[0][j] !== 0 || heightmap[0][j + 1] !== 0) {
            offset = addTriangle([j, 0, heightmap[0][j]], [j + 1, 0, heightmap[0][j + 1]], [j + 1, 0, 0], [0, 0, 0], dataView, offset);
            offset = addTriangle([j, 0, heightmap[0][j]], [j + 1, 0, 0], [j, 0, 0], [0, 0, 0], dataView, offset);
        }
        if (heightmap[numRows - 1][j] !== 0 || heightmap[numRows - 1][j + 1] !== 0) {
            offset = addTriangle([j, numRows - 1, heightmap[numRows - 1][j]], [j + 1, numRows - 1, heightmap[numRows - 1][j + 1]], [j + 1, numRows - 1, 0], [0, 0, 0], dataView, offset);
            offset = addTriangle([j, numRows - 1, heightmap[numRows - 1][j]], [j + 1, numRows - 1, 0], [j, numRows - 1, 0], [0, 0, 0], dataView, offset);
        }
    }
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
export function generateLargeHeightmap(rows, cols) {
    const heightmap = [];
    const holeRadius = Math.min(rows, cols) / 4;
    const centerX = rows / 2;
    const centerY = cols / 2;
    for (let i = 0; i < rows; i++) {
        heightmap[i] = [];
        for (let j = 0; j < cols; j++) {
            const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
            if (distance < holeRadius) {
                heightmap[i][j] = 0;
            }
            else {
                heightmap[i][j] = Math.sin(i * 0.2) + Math.cos(j * 0.2) + 2;
            }
        }
    }
    return heightmap;
}
