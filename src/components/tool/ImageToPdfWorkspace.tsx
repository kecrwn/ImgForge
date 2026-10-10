import React, { useState } from 'react';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { Download, RefreshCw, FileText, ArrowRight, Trash2, GripVertical, Plus } from 'lucide-react';
import { imageToPdf } from '../../processors/imageToPdf';

export function ImageToPdfWorkspace({ tool }: { tool: ToolConfig }) {
  const [files, setFiles] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [format, setFormat] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [targetSizeKB, setTargetSizeKB] = useState<number>(0);

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped = newFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f)
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // For now, if multiple files, imageToPdf processor needs to support an array.
      // Wait, imageToPdf processor only takes ONE file! Let's just process the first one for now, 
      // or we must update imageToPdf to take File[]. Let's pass an array to a modified function.
      
      // I will implement a multi-page PDF generation here directly if imageToPdf only takes one file.
      // But we import `jsPDF` here directly to merge them.
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: orientation,
        format: format,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        if (i > 0) pdf.addPage();
        
        const img = await createImageBitmap(files[i].file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
        const imgX = (pdfWidth - img.width * ratio) / 2;
        const imgY = (pdfHeight - img.height * ratio) / 2;
        
        pdf.addImage(imgData, 'JPEG', imgX, imgY, img.width * ratio, img.height * ratio);
        setProgress(((i + 1) / files.length) * 100);
      }
      
      let blob = pdf.output('blob');
      
      // Target Size compression can't easily be done directly on the final PDF 
      // without compressing images beforehand, but we'll accept it as-is for now if targetSize is 0.
      setResultBlob(blob);
      
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF. ' + (e as Error).message);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const reset = () => {
    setFiles([]);
    setResultBlob(null);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (files.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 min-h-[500px]">
        <DropZone onFilesSelected={handleFilesSelected} accept="image/*" multiFile={true} />
      </div>
    );
  }

  if (resultBlob && !isProcessing) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">PDF Ready!</h2>
          
          <div className="flex flex-col items-center p-8 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/50 mb-8 max-w-sm w-full">
            <FileText className="w-16 h-16 text-primary-600 mb-4" />
            <span className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Generated PDF</span>
            <span className="text-sm text-slate-500">{(resultBlob.size / 1024 / 1024).toFixed(2)} MB • {files.length} Pages</span>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] text-lg"
            >
              <Download className="w-6 h-6" /> Download PDF
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 md:p-6 min-h-[500px] flex flex-col md:flex-row gap-8">
      {/* Pages Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300">Pages ({files.length})</h3>
          <label className="flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold rounded-lg cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add More
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
              if (e.target.files) handleFilesSelected(Array.from(e.target.files));
            }} />
          </label>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {files.map((fileObj, index) => (
            <div key={fileObj.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-slate-400 font-bold w-6">{index + 1}</span>
              <img src={fileObj.preview} className="w-16 h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-800" alt="Preview" />
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{fileObj.file.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowRight className="w-4 h-4 -rotate-90" />
                </button>
                <button onClick={() => moveDown(index)} disabled={index === files.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </button>
                <button onClick={() => removeFile(fileObj.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors ml-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Page Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Orientation</label>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setOrientation('portrait')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${orientation === 'portrait' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Portrait
            </button>
            <button 
              onClick={() => setOrientation('landscape')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${orientation === 'landscape' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Landscape
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6">
          {isProcessing ? (
            <div className="space-y-3">
               <div className="flex justify-between text-sm font-medium">
                  <span className="text-primary-600">Generating PDF...</span>
                  <span className="text-slate-500">{Math.round(progress)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
               </div>
            </div>
          ) : (
            <button
              onClick={processFiles}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" /> Generate PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
