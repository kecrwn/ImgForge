import imageCompression from 'browser-image-compression';
import { compressToExactSize } from './exactSize';

export async function compressImage(
  file: File,
  options: {
    targetSizeKB?: number;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: string;
    increaseMode?: 'padding' | 'high-quality';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (options.targetSizeKB) {
    return compressToExactSize(
      file, 
      options.targetSizeKB, 
      { format: options.format, increaseMode: options.increaseMode }, 
      onProgress
    );
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: (options.targetSizeKB || 500) / 1024,
    maxWidthOrHeight: options.maxWidth || options.maxHeight || undefined,
    useWebWorker: true,
    onProgress: onProgress,
    fileType: options.format ? `image/${options.format}` : undefined,
  });
  return compressed;
}
