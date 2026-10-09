export async function cropImage(
  file: File,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    shape?: 'rectangle' | 'circle' | 'square' | 'freehand';
    points?: {x: number, y: number}[];
    borderRadius?: number;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext('2d')!;

  if (options.shape === 'circle') {
    const radius = Math.min(options.width, options.height) / 2;
    ctx.beginPath();
    ctx.arc(options.width / 2, options.height / 2, radius, 0, Math.PI * 2);
    ctx.clip();
  } else if (options.shape === 'freehand' && options.points && options.points.length > 0) {
    ctx.beginPath();
    ctx.moveTo(options.points[0].x - options.x, options.points[0].y - options.y);
    for (let i = 1; i < options.points.length; i++) {
      ctx.lineTo(options.points[i].x - options.x, options.points[i].y - options.y);
    }
    ctx.closePath();
    ctx.clip();
  } else if (options.borderRadius) {
    const r = options.borderRadius;
    ctx.beginPath();
    ctx.roundRect(0, 0, options.width, options.height, r);
    ctx.clip();
  }

  onProgress?.(50);
  ctx.drawImage(img, options.x, options.y, options.width, options.height, 0, 0, options.width, options.height);
  
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png', 1);
  });
  onProgress?.(100);
  return blob;
}
