export async function compressToExactSize(
  file: File | Blob,
  targetKB: number,
  options?: {
    format?: string;
    increaseMode?: 'padding' | 'high-quality';
    fillAlpha?: boolean;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const targetBytes = targetKB * 1024;
  let format = options?.format || file.type || 'image/jpeg';
  
  // PNG ignores quality in canvas.toBlob. If target is smaller than current, force JPEG/WEBP
  if (format === 'image/png' && file.size > targetBytes) {
    format = 'image/jpeg'; // Default to jpeg for size reduction
  }
  const mimeType = format.includes('/') ? format : `image/${format}`;

  if (file.size <= targetBytes && file.size >= targetBytes * 0.9 && file.type === mimeType) {
    onProgress?.(100);
    return file as Blob;
  }

  let img: ImageBitmap;
  try {
    img = await createImageBitmap(file);
  } catch (err) {
    throw new Error('Failed to decode image for compression.');
  }

  if (file.size < targetBytes && options?.increaseMode) {
    return await increaseImageSize(file, img, targetBytes, mimeType, options.increaseMode, onProgress);
  }

  let w = img.width;
  let h = img.height;
  
  let bestBlob: Blob | null = null;
  let bestDiff = Infinity;
  let totalEncodes = 0;
  const MAX_ENCODES = 25;

  // Helper to encode canvas to blob
  const encodeCanvas = async (width: number, height: number, quality: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Fill white background for JPEGs to prevent black transparency
    if ((mimeType === 'image/jpeg' || options?.fillAlpha) && file.type === 'image/png') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }
    
    ctx.drawImage(img, 0, 0, width, height);
    
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        mimeType,
        quality
      );
    });
  };

  while (w >= 64 && h >= 64 && totalEncodes < MAX_ENCODES) {
    let lo = 0.05;
    let hi = 0.98;
    let localBestBlob: Blob | null = null;

    // First check if even the lowest quality at this size is too big
    const lowestBlob = await encodeCanvas(w, h, 0.05);
    totalEncodes++;
    
    if (lowestBlob.size > targetBytes) {
      // Even lowest quality is too big, must reduce dimensions
      w = Math.max(64, Math.floor(w * 0.9));
      h = Math.max(64, Math.floor(h * 0.9));
      onProgress?.(Math.min(90, (totalEncodes / MAX_ENCODES) * 100));
      continue;
    }

    // Binary search for best quality at this dimension
    while (lo <= hi && totalEncodes < MAX_ENCODES) {
      let quality = (lo + hi) / 2;
      const result = await encodeCanvas(w, h, quality);
      totalEncodes++;
      
      onProgress?.(Math.min(95, (totalEncodes / MAX_ENCODES) * 100));

      if (result.size <= targetBytes) {
        // Valid candidate
        const diff = targetBytes - result.size;
        if (diff < bestDiff) {
          bestDiff = diff;
          bestBlob = result;
        }
        localBestBlob = result;
        
        // If we are within 92-100% of target, we found the sweet spot
        if (result.size >= targetBytes * 0.92) {
          onProgress?.(100);
          return result;
        }
        
        lo = quality + 0.02; // Try higher quality
      } else {
        hi = quality - 0.02; // Try lower quality
      }
    }

    // If we completed binary search at this dimension and found a valid blob, return it.
    // It's the best possible at this dimension without exceeding target.
    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      break;
    }
    
    // Fallback dimension reduction if binary search failed completely
    w = Math.max(64, Math.floor(w * 0.9));
    h = Math.max(64, Math.floor(h * 0.9));
  }

  onProgress?.(100);
  // Return the best blob found. If none found, return original file (should only happen if file is < 64px)
  return bestBlob || file as Blob;
}

async function increaseImageSize(
  originalFile: File | Blob,
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
    if ((mimeType === 'image/jpeg') && originalFile.type === 'image/png') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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
    return originalFile as Blob;
  }
  
  const padding = new Uint8Array(bytesToAdd);
  const newBlob = new Blob([originalFile, padding], { type: mimeType });
  onProgress?.(100);
  return newBlob;
}
