export async function pickColors(
  file: File,
  options: {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Placeholder returning original file since a color picker would 
  // typically return colors array, not a blob, but conforming to interface
  onProgress?.(100);
  return file;
}
