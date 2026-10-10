import React from 'react';
import { ToolConfig } from '../../types';
import { DropZone } from './DropZone';
import { OptionsPanel } from './OptionsPanel';
import { ResultView } from './ResultView';
import { ProcessingState } from './ProcessingState';
import { useFileProcessor } from '../../hooks/useFileProcessor';

export function GenericWorkspace({ tool }: { tool: ToolConfig }) {
  const {
    state,
    files,
    results,
    progress,
    options,
    setOptions,
    handleFilesSelected,
    processFiles,
    reset,
  } = useFileProcessor(tool);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 relative overflow-hidden min-h-[500px]">
      {state === 'processing' && <ProcessingState progress={progress} />}
      
      {state === 'idle' && (
        <DropZone 
          onFilesSelected={handleFilesSelected} 
          accept={tool.acceptedFormats?.join(',')} 
          multiFile={tool.multiFile} 
        />
      )}

      {state === 'uploaded' && (
        <div className="flex flex-col md:flex-row gap-10 h-full">
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-4 border border-slate-200 dark:border-slate-800">
            {files[0] && (
              <img
                src={URL.createObjectURL(files[0])}
                alt="Preview"
                className="max-w-full max-h-[400px] object-contain rounded-lg"
              />
            )}
          </div>
          <div className="w-full md:w-80 flex flex-col gap-6">
            {tool.options && tool.options.length > 0 && (
              <OptionsPanel
                options={tool.options}
                values={options}
                onChange={(key, val) => setOptions(prev => ({ ...prev, [key]: val }))}
              />
            )}
            <button
              onClick={processFiles}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98]"
            >
              Process Image
            </button>
          </div>
        </div>
      )}

      {state === 'done' && (
        <ResultView results={results} onReset={reset} />
      )}
      
      {state === 'error' && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-red-500 text-xl mb-4">An error occurred during processing.</div>
          <button onClick={reset} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">Try Again</button>
        </div>
      )}
    </div>
  );
}
