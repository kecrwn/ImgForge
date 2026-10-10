export async function readMetadata(
  file: File,
  options: { action?: 'view' | 'edit' | 'remove' },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Currently we only support "remove" action on the client side without UI modifications.
  // Drawing the image to a new canvas and re-exporting it inherently strips ALL EXIF data, 
  // GPS locations, and camera metadata because canvas does not preserve them.

  if (options.action === 'view' || options.action === 'edit') {
    throw new Error('View and Edit metadata are currently unsupported in this viewer. Please use "Remove Metadata".');
  }

  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // If it is a JPEG, fill with white to prevent transparency issues
  if (file.type === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  
  onProgress?.(50);

  const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'image/jpeg' ? 0.95 : undefined;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to strip metadata'));
      },
      format,
      quality
    );
  });

  onProgress?.(100);
  return blob;
}
