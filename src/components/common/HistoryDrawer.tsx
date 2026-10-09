import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Download, ExternalLink, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const { files, loading, removeFile } = useStorage();

  const handleDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[400px] max-w-[90vw] bg-white dark:bg-slate-950 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                My Files History
              </span>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <FileIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">No history yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Processed files will appear here</p>
                  </div>
                </div>
              ) : (
                files.map(file => (
                  <div key={file.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.timestamp).toLocaleDateString()}</span>
                        </div>
                        {file.toolUsed && (
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                            Tool: {file.toolUsed}
                          </div>
                        )}
                      </div>
                      
                      {/* Thumbnail if available */}
                      {file.thumbnail ? (
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                          <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                      {file.toolSlug && (
                        <a 
                          href={`/${file.toolSlug}`}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                          title="Re-open tool"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Re-open
                        </a>
                      )}
                      <button 
                        onClick={() => handleDownload(file.blob, file.name)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
