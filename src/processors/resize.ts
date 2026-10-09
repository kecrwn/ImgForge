export async function resizeImage(
  file: File,
  options: {
    width?: number;
    height?: number;
    unit?: 'px' | 'cm' | 'mm' | 'in';
    dpi?: number;
    maintainAspectRatio?: boolean;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  
  let targetW = options.width || img.width;
  let targetH = options.height || img.height;
  const dpi = options.dpi || 96;

  if (options.unit === 'cm') {
    targetW = Math.round((targetW / 2.54) * dpi);
    targetH = Math.round((targetH / 2.54) * dpi);
  } else if (options.unit === 'mm') {
    targetW = Math.round((targetW / 25.4) * dpi);
    targetH = Math.round((targetH / 25.4) * dpi);
  } else if (options.unit === 'in') {
    targetW = Math.round(targetW * dpi);
    targetH = Math.round(targetH * dpi);
  }

  if (options.maintainAspectRatio) {
    const ratio = img.width / img.height;
    if (options.width && !options.height) {
      targetH = Math.round(targetW / ratio);
    } else if (options.height && !options.width) {
      targetW = Math.round(targetH * ratio);
    } else {
      const scaleW = targetW / img.width;
      const scaleH = targetH / img.height;
      const scale = Math.min(scaleW, scaleH);
      targetW = Math.round(img.width * scale);
      targetH = Math.round(img.height * scale);
    }
  }

  onProgress?.(30);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  onProgress?.(70);

  const mimeType = file.type || 'image/png';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), mimeType, 0.95);
  });

  onProgress?.(100);
  return blob;
}
