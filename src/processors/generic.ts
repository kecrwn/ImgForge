export async function genericProcessor(
  file: File,
  options: any,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(100);
  return file;
}
