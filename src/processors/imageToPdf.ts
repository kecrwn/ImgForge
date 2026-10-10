// Using jspdf for real impl, but placeholder for now if not installed
import { jsPDF } from 'jspdf';
import { compressToExactSize } from './exactSize';

export async function imageToPdf(
  file: File,
  options: { 
    format?: 'a4' | 'letter'; 
    orientation?: 'portrait' | 'landscape';
    targetSizeKB?: number;
    increaseMode?: 'padding' | 'high-quality';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  let imgBlob: Blob = file;
  
  if (options.targetSizeKB) {
    // Leave ~2KB margin for PDF overhead
    const imgTargetKB = Math.max(10, options.targetSizeKB - 2);
    imgBlob = await compressToExactSize(
      file, 
      imgTargetKB, 
      { format: 'jpeg', increaseMode: options.increaseMode },
      (p) => onProgress?.(p * 0.8) // first 80% for compression
    );
  }

  const img = await createImageBitmap(imgBlob);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    format: options.format || 'a4',
  });
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
  const imgX = (pdfWidth - img.width * ratio) / 2;
  const imgY = (pdfHeight - img.height * ratio) / 2;
  
  pdf.addImage(imgData, 'JPEG', imgX, imgY, img.width * ratio, img.height * ratio);
  
  const pdfBlob = pdf.output('blob');
  
  if (options.targetSizeKB && pdfBlob.size < options.targetSizeKB * 1024 * 0.9 && options.increaseMode === 'padding') {
    // If PDF is still too small, pad the PDF itself
    const targetBytes = options.targetSizeKB * 1024;
    const padding = new Uint8Array(targetBytes - pdfBlob.size);
    const paddedBlob = new Blob([pdfBlob, padding], { type: 'application/pdf' });
    onProgress?.(100);
    return paddedBlob;
  }
  
  onProgress?.(100);
  return pdfBlob;
}
