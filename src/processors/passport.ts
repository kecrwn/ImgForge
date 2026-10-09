export async function createPassportPhoto(
  file: File,
  options: { 
    size?: string; 
    bgColor?: string; 
    printSheet?: 'none' | 'a4' | '4x6';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const img = await createImageBitmap(file);
  const dpi = 300;
  
  let wMM = 35;
  let hMM = 45;

  if (options.size === '2x2in') {
    wMM = 50.8;
    hMM = 50.8;
  } else if (options.size === '35x45mm') {
    wMM = 35;
    hMM = 45;
  } else if (options.size === 'passport-us') {
    wMM = 51;
    hMM = 51;
  }
  
  const wPx = Math.round((wMM / 25.4) * dpi);
  const hPx = Math.round((hMM / 25.4) * dpi);
  
  const canvas = document.createElement('canvas');
  canvas.width = wPx;
  canvas.height = hPx;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = options.bgColor || '#ffffff';
  ctx.fillRect(0, 0, wPx, hPx);
  
  const scale = Math.max(wPx / img.width, hPx / img.height);
  const dx = (wPx - img.width * scale) / 2;
  const dy = (hPx - img.height * scale) / 2;
  
  ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale);

  onProgress?.(50);

  let finalCanvas = canvas;
  let finalMime = 'image/jpeg';
  
  if (options.printSheet && options.printSheet !== 'none') {
    const sheetCanvas = document.createElement('canvas');
    const sheetCtx = sheetCanvas.getContext('2d')!;
    
    let sheetWMm = 210;
    let sheetHMm = 297;
    
    if (options.printSheet === '4x6') {
      sheetWMm = 4 * 25.4;
      sheetHMm = 6 * 25.4;
    }
    
    const sheetWPx = Math.round((sheetWMm / 25.4) * dpi);
    const sheetHPx = Math.round((sheetHMm / 25.4) * dpi);
    
    sheetCanvas.width = sheetWPx;
    sheetCanvas.height = sheetHPx;
    
    sheetCtx.fillStyle = '#ffffff';
    sheetCtx.fillRect(0, 0, sheetWPx, sheetHPx);
    
    const gapPx = Math.round((5 / 25.4) * dpi); // 5mm gap
    const marginPx = Math.round((10 / 25.4) * dpi); // 10mm margin
    
    const cols = Math.floor((sheetWPx - marginPx * 2 + gapPx) / (wPx + gapPx));
    const rows = Math.floor((sheetHPx - marginPx * 2 + gapPx) / (hPx + gapPx));
    
    const totalW = cols * wPx + (cols - 1) * gapPx;
    const totalH = rows * hPx + (rows - 1) * gapPx;
    
    const startX = (sheetWPx - totalW) / 2;
    const startY = (sheetHPx - totalH) / 2;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        sheetCtx.drawImage(
          canvas, 
          startX + c * (wPx + gapPx), 
          startY + r * (hPx + gapPx)
        );
        // Draw cut lines
        sheetCtx.strokeStyle = '#cccccc';
        sheetCtx.lineWidth = 1;
        sheetCtx.strokeRect(
          startX + c * (wPx + gapPx), 
          startY + r * (hPx + gapPx),
          wPx, hPx
        );
      }
    }
    finalCanvas = sheetCanvas;
  }

  const blob = await new Promise<Blob>((resolve) => {
    finalCanvas.toBlob((b) => resolve(b!), finalMime, 0.95);
  });
  
  onProgress?.(100);
  return blob;
}
