import GIF from 'gif.js';

export async function createGif(
  images: File[],
  options: {
    delay: number;
    width?: number;
    height?: number;
    quality?: number;
    textOverlay?: string;
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const gif = new GIF({
    workers: 2,
    quality: options.quality ?? 10,
    width: options.width,
    height: options.height,
    // Provide a generic path, user has to put gif.worker.js in public/
    workerScript: '/gif.worker.js'
  });

  gif.on('progress', (p: number) => {
    onProgress?.(Math.round(p * 100));
  });

  return new Promise<Blob>(async (resolve, reject) => {
    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    try {
      for (const file of images) {
        const img = await createImageBitmap(file);
        
        let targetCanvas: HTMLCanvasElement | null = null;
        if (options.textOverlay || options.width || options.height) {
          targetCanvas = document.createElement('canvas');
          targetCanvas.width = options.width || img.width;
          targetCanvas.height = options.height || img.height;
          const ctx = targetCanvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, targetCanvas.width, targetCanvas.height);
          
          if (options.textOverlay) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            ctx.fillText(options.textOverlay, targetCanvas.width / 2, targetCanvas.height - 30);
            ctx.strokeText(options.textOverlay, targetCanvas.width / 2, targetCanvas.height - 30);
          }
        }
        
        gif.addFrame(targetCanvas || img, { delay: options.delay });
      }
      
      gif.render();
    } catch (err) {
      reject(err);
    }
  });
}
