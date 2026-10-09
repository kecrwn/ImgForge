import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, X, FileImage } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  multiFile?: boolean;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 50 * 1024 * 1024,
  multiFile = false,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const processFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      (file) =>
        acceptedFormats.includes(file.type) && file.size <= maxFileSize
    );
    
    if (validFiles.length > 0) {
      const newFiles = multiFile ? validFiles : [validFiles[0]];
      setSelectedFiles((prev) => multiFile ? [...prev, ...newFiles] : newFiles);
      onFilesSelected(newFiles);
    }
  }, [acceptedFormats, maxFileSize, multiFile, onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 scale-[1.02] shadow-lg shadow-primary-500/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          className="hidden"
          multiple={multiFile}
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          disabled={disabled}
        />
        
        <motion.div
          animate={{
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.3, type: "spring" }}
          className="flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-primary-400 rounded-full blur-xl"
            />
            <UploadCloud className={`w-16 h-16 relative z-10 ${isDragActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`} />
          </div>

          <p className="mb-2 text-xl font-heading font-semibold text-slate-800 dark:text-slate-100 md:block hidden">
            Drag & drop your images here
          </p>
          <p className="mb-2 text-xl font-heading font-semibold text-slate-800 dark:text-slate-100 md:hidden">
            Tap to select images
          </p>
          
          <div className="flex items-center gap-4 my-3 md:flex hidden w-full max-w-xs">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
            <span className="text-sm font-medium text-slate-400">or</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          </div>

          <div className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium shadow-sm hover:bg-primary-700 transition-colors md:block hidden">
            Select Images
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Supports {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {Math.round(maxFileSize / 1024 / 1024)}MB
          </p>
        </motion.div>
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4">
          {selectedFiles.map((file, idx) => (
            <motion.div
              key={`${file.name}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm pr-12"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileImage className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
