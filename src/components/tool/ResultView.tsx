import React from 'react';
import { ProcessedResult } from '../../types';
import { Download, RefreshCcw, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ResultViewProps {
  results: ProcessedResult[];
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ results, onReset }) => {
  if (!results.length) return null;

  const totalOriginal = results.reduce((acc, r) => acc + r.originalSize, 0);
  const totalProcessed = results.reduce((acc, r) => acc + r.processedSize, 0);
  const savedBytes = totalOriginal - totalProcessed;
  const savedPercent = totalOriginal > 0 ? ((savedBytes / totalOriginal) * 100).toFixed(1) : '0';

  const handleDownloadSingle = (result: ProcessedResult) => {
    const url = URL.createObjectURL(result.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (results.length === 1) {
      handleDownloadSingle(results[0]);
      return;
    }
    
    const zip = new JSZip();
    results.forEach(result => {
      zip.file(result.downloadName, result.processedBlob);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'imgforge-processed.zip');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
      >
        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-2">
        {results.length > 1 ? `Processed ${results.length} files!` : 'Done!'}
      </h2>
      
      {savedBytes > 0 && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-8 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
          Saved {savedPercent}% ({(savedBytes / 1024).toFixed(1)} KB)
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
        {results.length === 1 ? (
          <button
            onClick={() => handleDownloadSingle(results[0])}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors w-full"
          >
            <Download className="w-5 h-5" />
            Download Image
          </button>
        ) : (
          <button
            onClick={handleDownloadAll}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors w-full"
          >
            <Archive className="w-5 h-5" />
            Download All as ZIP
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium text-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Edit Another
        </button>
      </div>
    </div>
  );
};
