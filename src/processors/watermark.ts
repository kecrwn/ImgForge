export async function addWatermark(
  file: File,
  options: { 
    text: string; 
    position?: 'center' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom-left' | 'tiled';
    color?: string;
    opacity?: number;
    size?: number;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  ctx.drawImage(img, 0, 0);
  
  const fontSize = options.size || Math.floor(img.height * 0.05);
  ctx.font = `bold ${fontSize}px sans-serif`;
  
  // Convert color + opacity to rgba if needed or use globalAlpha
  ctx.fillStyle = options.color || '#ffffff';
  ctx.globalAlpha = options.opacity ?? 0.5;
  
  if (options.position === 'tiled') {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const stepX = img.width / 3;
    const stepY = img.height / 3;
    
    ctx.rotate(-Math.PI / 6);
    for (let x = -img.width; x < img.width * 2; x += stepX) {
      for (let y = -img.height; y < img.height * 2; y += stepY) {
        ctx.fillText(options.text, x, y);
      }
    }
    ctx.rotate(Math.PI / 6);
  } else {
    let x = 20, y = 20;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    if (options.position === 'center') {
      x = img.width / 2;
      y = img.height / 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    } else if (options.position === 'top-right') {
      x = img.width - 20;
      ctx.textAlign = 'right';
    } else if (options.position === 'bottom-left') {
      y = img.height - 20;
      ctx.textBaseline = 'bottom';
    } else if (options.position === 'bottom-right' || !options.position) {
      x = img.width - 20;
      y = img.height - 20;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
    }
    
    // Add shadow for better visibility
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(options.text, x, y);
  }
  
  onProgress?.(50);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), file.type || 'image/png', 0.95);
  });
  onProgress?.(100);
  return blob;
}
