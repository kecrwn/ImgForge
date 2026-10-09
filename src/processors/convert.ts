// @ts-ignore
import heic2any from 'heic2any';

export async function convertImage(
  file: File,
  options: {
    format: 'jpeg' | 'png' | 'webp' | 'avif' | 'ico';
    quality?: number;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  let sourceBlob: Blob = file;

  // Handle HEIC input
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    onProgress?.(10);
    const converted = await heic2any({
      blob: file,
      toType: 'image/png',
    });
    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    onProgress?.(40);
  }

  const img = await createImageBitmap(sourceBlob);
  const canvas = document.createElement('canvas');
  
  if (options.format === 'ico') {
    // ICO requires square, ideally <= 256x256
    const size = Math.min(img.width, img.height, 256);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, size, size);
    
    onProgress?.(70);
    const pngBlob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
    const pngBuffer = await pngBlob.arrayBuffer();
    const pngSize = pngBuffer.byteLength;
    
    const buffer = new ArrayBuffer(22 + pngSize);
    const view = new DataView(buffer);
    
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, 1, true);
    
    view.setUint8(6, size >= 256 ? 0 : size);
    view.setUint8(7, size >= 256 ? 0 : size);
    view.setUint8(8, 0);
    view.setUint8(9, 0);
    view.setUint16(10, 1, true);
    view.setUint16(12, 32, true);
    view.setUint32(14, pngSize, true);
    view.setUint32(18, 22, true);
    
    const imgArray = new Uint8Array(buffer, 22);
    imgArray.set(new Uint8Array(pngBuffer));
    
    onProgress?.(100);
    return new Blob([buffer], { type: 'image/x-icon' });
  }

  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  if (options.format === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0);
  onProgress?.(60);

  const mimeType = `image/${options.format}`;
  const quality = options.quality ?? 0.92;
  
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), mimeType, quality);
  });
  
  onProgress?.(100);
  return blob;
}
