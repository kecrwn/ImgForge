import React, { useState } from 'react';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { Download, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../processors/compress';

export function CompressWorkspace({ tool }: { tool: ToolConfig }) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Options
  const [mode, setMode] = useState<'quality' | 'exact'>('quality');
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState(500);
  const [unit, setUnit] = useState<'KB' | 'MB'>('KB');
  const [format, setFormat] = useState<'jpeg' | 'webp' | 'png'>('jpeg');

  const handleFilesSelected = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      
      // Auto-set format based on input if appropriate
      if (file.type === 'image/png') setFormat('png');
      else if (file.type === 'image/webp') setFormat('webp');
      else setFormat('jpeg');
    }
  };

  const processFile = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let targetKB = undefined;
      
      if (mode === 'exact') {
         targetKB = unit === 'MB' ? targetSize * 1024 : targetSize;
      }
      
      const compressed = await compressImage(originalFile, {
        targetKB,
        quality: mode === 'quality' ? quality : undefined,
        format
      }, (p) => setProgress(p));
      
      setResultBlob(compressed);
    } catch (e) {
      console.error(e);
      alert('Failed to compress image. ' + (e as Error).message);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const reset = () => {
    setOriginalFile(null);
    setImageSrc(null);
    setResultBlob(null);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!resultBlob || !originalFile) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${originalFile.name.replace(/\.[^/.]+$/, "")}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!imageSrc) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 min-h-[500px]">
        <DropZone onFilesSelected={handleFilesSelected} accept="image/jpeg,image/png,image/webp" />
      </div>
    );
  }

  if (resultBlob && !isProcessing) {
    const originalSize = originalFile?.size || 0;
    const newSize = resultBlob.size;
    const savings = Math.max(0, ((originalSize - newSize) / originalSize) * 100).toFixed(1);

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">Compression Complete!</h2>
          
          <div className="flex gap-8 items-center w-full max-w-3xl justify-center mb-8">
             <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex-1 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 text-sm font-medium mb-1">Original Size</span>
                <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{formatSize(originalSize)}</span>
             </div>
             
             <div className="flex flex-col items-center text-primary-500 font-bold">
               <span className="text-sm bg-primary-100 dark:bg-primary-900/50 px-3 py-1 rounded-full text-primary-600 dark:text-primary-400">-{savings}%</span>
             </div>
             
             <div className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl flex-1 border border-green-100 dark:border-green-800/50">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">New Size</span>
                <span className="text-3xl font-black text-green-700 dark:text-green-300">{formatSize(newSize)}</span>
             </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] text-lg"
            >
              <Download className="w-6 h-6" /> Download Image
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Compress Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 md:p-6 min-h-[500px] flex flex-col md:flex-row gap-8">
      {/* Preview Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <img
          src={imageSrc}
          alt="Preview"
          className="max-w-full max-h-[400px] object-contain rounded-lg"
        />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-medium text-sm flex items-center gap-2 shadow-sm">
           <ImageIcon className="w-4 h-4" /> {originalFile?.name} ({formatSize(originalFile?.size || 0)})
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
           <button 
             onClick={() => setMode('quality')}
             className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'quality' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             Lossy Quality
           </button>
           <button 
             onClick={() => setMode('exact')}
             className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'exact' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             Exact Size
           </button>
        </div>

        {mode === 'quality' ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Quality</span>
                <span>{quality}%</span>
              </div>
              <input
                type="range"
                value={quality}
                min={1}
                max={100}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <p className="text-xs text-slate-500 mt-2">Lower quality means smaller file size but more visual artifacts.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target File Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={targetSize}
                  onChange={(e) => setTargetSize(Number(e.target.value))}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'KB' | 'MB')}
                  className="w-24 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-2">We will try to hit this target exactly using binary search encoding.</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
          <div className="grid grid-cols-3 gap-2">
            {(['jpeg', 'webp', 'png'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-2 text-xs font-semibold rounded-lg border ${format === fmt ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6">
          {isProcessing ? (
            <div className="space-y-3">
               <div className="flex justify-between text-sm font-medium">
                  <span className="text-primary-600">Compressing...</span>
                  <span className="text-slate-500">{Math.round(progress)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
               </div>
            </div>
          ) : (
            <button
              onClick={processFile}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Compress Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
