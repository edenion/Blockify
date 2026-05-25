export function edgeEnhance(source: ImageData, threshold: number = 30): ImageData {
  const { width, height, data } = source;
  const result = new Uint8ClampedArray(data);

  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    gray[i] = data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
  }

  // Sobel 3x3 kernels in row-major order: indices map to (ky+1)*3+(kx+1)
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          const kidx = (ky + 1) * 3 + (kx + 1);
          gx += gray[idx] * sobelX[kidx];
          gy += gray[idx] * sobelY[kidx];
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const isEdge = magnitude > threshold;

      const idx = (y * width + x) * 4;
      if (isEdge) {
        // Darken edge pixels
        result[idx] = Math.max(0, result[idx] - 60);
        result[idx + 1] = Math.max(0, result[idx + 1] - 60);
        result[idx + 2] = Math.max(0, result[idx + 2] - 60);
      }
    }
  }

  return new ImageData(result, width, height);
}
