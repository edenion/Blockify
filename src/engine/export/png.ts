export function downloadPNG(canvas: HTMLCanvasElement, filename?: string): void {
  const link = document.createElement('a');
  link.download = filename || `pixelart_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
