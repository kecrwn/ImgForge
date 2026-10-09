import { useState, useCallback, useEffect } from 'react';
import { ProcessedResult, ToolConfig } from '../types';
import { saveSession, getSession, saveFile } from '../services/storage';

type ProcessState = 'idle' | 'uploaded' | 'processing' | 'done' | 'error';

export function useFileProcessor(tool: ToolConfig) {
  const [state, setState] = useState<ProcessState>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    tool.options?.forEach(opt => { defaults[opt.id] = opt.defaultValue; });
    try {
      const saved = localStorage.getItem(`imgforge-options-${tool.id}`);
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
    return defaults;
  });

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState('uploaded');
    setError(null);
    setResults([]);
    saveSession(tool.id, 'uploaded', newFiles, []);
    
    // Save original files to global history
    Promise.all(newFiles.map(async (f) => {
      const id = crypto.randomUUID();
      await saveFile({
        id,
        blob: f,
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
        toolUsed: 'Upload',
      });
    }));
  }, [tool.id]);

  const processFiles = useCallback(async () => {
    setState('processing');
    setProgress(0);
    setError(null);
    
    localStorage.setItem(`imgforge-options-${tool.id}`, JSON.stringify(options));

    try {
      const processor = await loadProcessor(tool.processor);
      const processedResults: ProcessedResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await processor(file, { ...(tool.processorConfig || {}), ...options } as any, (p: number) => {
          setProgress(((i / files.length) + (p / 100 / files.length)) * 100);
        });

        processedResults.push({
          originalFile: file,
          processedBlob: result,
          originalSize: file.size,
          processedSize: result.size,
          downloadName: generateDownloadName(file.name, tool),
          format: options.format,
        });
      }

      setResults(processedResults);
      setState('done');
      setProgress(100);
      saveSession(tool.id, 'done', files, processedResults);
      
      // Save to global history
      Promise.all(processedResults.map(async (res) => {
        const id = crypto.randomUUID();
        await saveFile({
          id,
          blob: res.processedBlob,
          name: res.downloadName,
          size: res.processedSize,
          type: res.processedBlob.type,
          lastModified: Date.now(),
          toolUsed: tool.name,
          toolSlug: tool.slug,
        });
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setState('error');
      saveSession(tool.id, 'error', files, []);
    }
  }, [files, options, tool]);

  // Load session on mount
  useEffect(() => {
    getSession(tool.id).then(session => {
      if (session) {
        setFiles(session.files);
        setResults(session.results);
        setState(session.state);
      }
    });
  }, [tool.id]);

  const reset = useCallback(() => {
    setState('idle');
    setFiles([]);
    setResults([]);
    setError(null);
    setProgress(0);
    saveSession(tool.id, 'idle', [], []);
  }, [tool.id]);

  return {
    state, files, results, error, progress, options,
    setOptions, handleFilesSelected, processFiles, reset,
  };
}

async function loadProcessor(type: string) {
  switch (type) {
    case 'compress': return (await import('../processors/compress')).compressImage;
    case 'resize': return (await import('../processors/resize')).resizeImage;
    case 'crop': return (await import('../processors/crop')).cropImage;
    case 'convert': return (await import('../processors/convert')).convertImage;
    case 'rotate': return (await import('../processors/rotate-flip')).rotateImage;
    case 'flip': return (await import('../processors/rotate-flip')).flipImage;
    case 'watermark': return (await import('../processors/watermark')).addWatermark;
    case 'passport': return (await import('../processors/passport')).createPassportPhoto;
    case 'signature': return (await import('../processors/signature')).generateSignature;
    case 'image-to-pdf': return (await import('../processors/imageToPdf')).imageToPdf;
    case 'color-picker': return (await import('../processors/colorPicker')).pickColors;
    case 'metadata': return (await import('../processors/metadata')).readMetadata;
    default: throw new Error(`Unknown processor: ${type}`);
  }
}

function generateDownloadName(originalName: string, tool: ToolConfig): string {
  const ext = originalName.split('.').pop() || 'jpg';
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}-imgforge-${tool.slug}.${ext}`;
}
