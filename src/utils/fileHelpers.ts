export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileType(file: File, acceptedFormats: string[]): boolean {
  if (!acceptedFormats || acceptedFormats.length === 0) return true;
  
  // Handle mime types
  if (acceptedFormats.some(f => f.includes('/'))) {
    return acceptedFormats.some(f => {
      // Direct exact match (e.g. image/jpeg)
      if (file.type === f) return true;
      // Wildcard match (e.g. image/*)
      if (f.endsWith('/*') && file.type.startsWith(f.replace('/*', ''))) return true;
      return false;
    });
  }

  // Handle extensions
  const ext = getFileExtension(file.name);
  return acceptedFormats.some(f => f.toLowerCase() === ext || f.toLowerCase() === `.${ext}`);
}

export function isFileTooLarge(file: File, maxSize: number): boolean {
  return file.size > maxSize;
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(files: { blob: Blob; name: string }[]): Promise<void> {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.blob));
    const content = await zip.generateAsync({ type: 'blob' });
    await downloadBlob(content, 'imglab-batch.zip');
  } catch (error) {
    console.error('Error creating zip file:', error);
    throw error;
  }
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
