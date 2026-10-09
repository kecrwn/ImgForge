import { createWorker } from 'tesseract.js';

export async function extractText(
  file: File,
  language: string = 'eng',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Use createWorker dynamically
  const worker = await createWorker(language, 1, {
    logger: (m: any) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });
  
  const url = URL.createObjectURL(file);
  try {
    const { data: { text } } = await worker.recognize(url);
    return text;
  } finally {
    await worker.terminate();
    URL.revokeObjectURL(url);
  }
}
