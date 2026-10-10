import imageCompression from 'browser-image-compression';
import { compressToExactSize } from './exactSize';

export async function compressImage(
  file: File,
  options: {
    targetSizeKB?: number;
    targetKB?: number;
    targetMB?: number;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: string;
    increaseMode?: 'padding' | 'high-quality';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const finalTargetKB = options.targetSizeKB || options.targetKB || (options.targetMB ? options.targetMB * 1024 : undefined);

  if (finalTargetKB) {
    return compressToExactSize(
      file, 
      finalTargetKB, 
      { format: options.format, increaseMode: options.increaseMode }, 
      onProgress
    );
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: (options.targetSizeKB || 500) / 1024,
    maxWidthOrHeight: options.maxWidth || options.maxHeight || undefined,
    initialQuality: options.quality ? options.quality / 100 : undefined,
    useWebWorker: true,
    onProgress: onProgress,
    fileType: options.format ? `image/${options.format}` : undefined,
  });
  return compressed;
}
