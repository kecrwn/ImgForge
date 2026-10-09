export async function compressToExactSize(
  file: File | Blob,
  targetKB: number,
  options?: {
    format?: string;
    increaseMode?: 'padding' | 'high-quality';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const targetBytes = targetKB * 1024;
  const minBytes = targetBytes * 0.9;
  const format = options?.format || file.type || 'image/jpeg';
  const mimeType = format.includes('/') ? format : `image/${format}`;

  let img: ImageBitmap;
  try {
    img = await createImageBitmap(file);
  } catch (err) {
    throw new Error('Failed to decode image for compression.');
  }

  if (file.size >= minBytes && file.size <= targetBytes && file.type === mimeType) {
    onProgress?.(100);
    return file as Blob;
  }

  if (file.size < minBytes && options?.increaseMode) {
    return await increaseImageSize(file, img, targetBytes, mimeType, options.increaseMode, onProgress);
  }

  let w = img.width;
  let h = img.height;
  
  let scale = 1.0;
  let result: Blob | null = null;
  
  let bestBlob: Blob | null = null;
  let bestDiff = Infinity;

  while (w >= 100 && h >= 100) {
    let lo = 0.05;
    let hi = 1.0;
    let iterations = 0;
    
    while (iterations < 10 && lo <= hi) {
      let quality = (lo + hi) / 2;
      
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      ctx.drawImage(img, 0, 0, w, h);
      
      result = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          mimeType,
          quality
        );
      });
      
      onProgress?.(Math.min(90, (scale * 50) + (iterations * 5)));

      const diff = Math.abs(result.size - targetBytes);
      if (diff < bestDiff && result.size <= targetBytes) {
        bestDiff = diff;
        bestBlob = result;
      }

      if (result.size > targetBytes) {
        hi = quality - 0.05;
      } else if (result.size < minBytes) {
        lo = quality + 0.05;
      } else {
        onProgress?.(100);
        return result;
      }
      
      iterations++;
    }
    
    if (result && result.size <= targetBytes && result.size >= minBytes) {
      break;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);
    
    const lowestBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), mimeType, 0.05);
    });
    
    if (lowestBlob.size <= targetBytes) {
      break;
    }
    
    scale *= 0.9;
    w = Math.round(img.width * scale);
    h = Math.round(img.height * scale);
  }

  onProgress?.(100);
  return bestBlob || result || file;
}

async function increaseImageSize(
  originalFile: Blob,
  img: ImageBitmap,
  targetBytes: number,
  mimeType: string,
  mode: 'padding' | 'high-quality',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (mode === 'high-quality') {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    
    const hqBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), mimeType, 1.0);
    });
    
    if (hqBlob.size >= targetBytes * 0.9 && hqBlob.size <= targetBytes) {
      onProgress?.(100);
      return hqBlob;
    }
    
    if (hqBlob.size > targetBytes) {
      return compressToExactSize(originalFile, targetBytes / 1024, { format: mimeType }, onProgress);
    }
    
    originalFile = hqBlob;
  }
  
  const currentSize = originalFile.size;
  const bytesToAdd = targetBytes - currentSize;
  if (bytesToAdd <= 0) {
    onProgress?.(100);
    return originalFile;
  }
  
  const padding = new Uint8Array(bytesToAdd);
  const newBlob = new Blob([originalFile, padding], { type: mimeType });
  onProgress?.(100);
  return newBlob;
}
