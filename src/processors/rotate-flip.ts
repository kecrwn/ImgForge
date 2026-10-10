export async function rotateImage(
  file: File,
  options: { angle: number },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rad = (options.angle * Math.PI) / 180;
  
  // Calculate new bounding box
  const w = img.width;
  const h = img.height;
  
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  
  const newWidth = Math.ceil(w * cos + h * sin);
  const newHeight = Math.ceil(w * sin + h * cos);

  canvas.width = newWidth;
  canvas.height = newHeight;

  if (file.type === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -w / 2, -h / 2);

  onProgress?.(50);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), file.type || 'image/png');
  });
  onProgress?.(100);
  return blob;
}

export async function flipImage(
  file: File,
  options: { horizontal?: boolean; vertical?: boolean },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.translate(
    options.horizontal ? canvas.width : 0,
    options.vertical ? canvas.height : 0
  );
  ctx.scale(
    options.horizontal ? -1 : 1,
    options.vertical ? -1 : 1
  );
  
  ctx.drawImage(img, 0, 0);

  onProgress?.(50);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), file.type || 'image/png');
  });
  onProgress?.(100);
  return blob;
}
