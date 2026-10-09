export async function generateSignature(
  file: File,
  options: {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Usually this wouldn't take a file but a canvas input. Conforming to interface.
  onProgress?.(100);
  return file;
}
