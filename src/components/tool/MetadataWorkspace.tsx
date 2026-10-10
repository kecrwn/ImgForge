import React, { useState } from 'react';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { Download, RefreshCw, ShieldCheck, ShieldAlert, FileImage } from 'lucide-react';
import { readMetadata } from '../../processors/metadata';

export function MetadataWorkspace({ tool }: { tool: ToolConfig }) {
  const [files, setFiles] = useState<{ id: string; original: File; processed?: Blob; isProcessing: boolean; progress: number }[]>([]);

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped = newFiles.map(f => ({
      id: crypto.randomUUID(),
      original: f,
      isProcessing: false,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const processAll = async () => {
    // Only process files that haven't been processed yet
    const toProcess = files.filter(f => !f.processed);
    if (toProcess.length === 0) return;

    for (const fileObj of toProcess) {
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, isProcessing: true, progress: 0 } : f));
      
      try {
        const blob = await readMetadata(
          fileObj.original, 
          { action: 'remove' },
          (p) => {
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: p } : f));
          }
        );
        
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, processed: blob, isProcessing: false, progress: 100 } : f));
      } catch (err) {
        console.error('Failed to strip metadata', err);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, isProcessing: false } : f));
      }
    }
  };

  const downloadAll = () => {
    files.forEach((fileObj) => {
      if (fileObj.processed) {
        const url = URL.createObjectURL(fileObj.processed);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stripped_${fileObj.original.name}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const reset = () => {
    setFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 min-h-[500px] flex flex-col">
        <div className="mb-6 text-center max-w-lg mx-auto">
           <ShieldCheck className="w-12 h-12 text-primary-500 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Metadata Remover</h3>
           <p className="text-slate-500 dark:text-slate-400">Photos taken with smartphones and digital cameras contain hidden EXIF data including exact GPS location, camera model, and dates. Upload your photos here to strip all hidden data before sharing.</p>
        </div>
        <DropZone onFilesSelected={handleFilesSelected} accept="image/*" multiFile={true} />
      </div>
    );
  }

  const allDone = files.every(f => f.processed);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 md:p-6 min-h-[500px] flex flex-col md:flex-row gap-8">
      {/* Files List */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 px-2">Files to Clean ({files.length})</h3>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {files.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              {fileObj.isProcessing && (
                <div 
                  className="absolute left-0 bottom-0 top-0 bg-primary-50 dark:bg-primary-900/10 transition-all duration-300 -z-10" 
                  style={{ width: `${fileObj.progress}%` }} 
                />
              )}
              
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                 <FileImage className="w-6 h-6" />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{fileObj.original.name}</div>
                <div className="text-xs text-slate-500">{formatSize(fileObj.original.size)}</div>
              </div>
              
              <div>
                {fileObj.processed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/50">
                    <ShieldCheck className="w-3.5 h-3.5" /> Clean
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-800/50">
                    <ShieldAlert className="w-3.5 h-3.5" /> Unsafe
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
             <h4 className="font-bold text-primary-800 dark:text-primary-300 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5" /> EXIF Stripper
             </h4>
             <p className="text-sm text-primary-700/80 dark:text-primary-400/80">
               Click "Remove Metadata" to securely strip all hidden data from your photos before sharing them online. Your photos remain on your device.
             </p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {!allDone ? (
            <button
              onClick={processAll}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" /> Remove Metadata
            </button>
          ) : (
            <button
              onClick={downloadAll}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md shadow-green-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download Clean Files
            </button>
          )}
          
          <button
            onClick={reset}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
