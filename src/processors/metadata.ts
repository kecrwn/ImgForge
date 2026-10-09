export async function readMetadata(
  file: File,
  options: {},
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Conforming to interface, but metadata tool would extract exif data
  onProgress?.(100);
  return file;
}
