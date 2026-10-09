import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { tools } from '../config/tools';
import { DropZone } from '../components/tool/DropZone';
import { OptionsPanel } from '../components/tool/OptionsPanel';
import { ResultView } from '../components/tool/ResultView';
import { ProcessingState } from '../components/tool/ProcessingState';
import { useFileProcessor } from '../hooks/useFileProcessor';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Tool Not Found</h1>
        <Link to="/" className="text-primary-600 hover:underline">Return Home</Link>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
      <Helmet>
        <title>{tool.name} - ImgLab</title>
        <meta name="description" content={tool.description} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize">{tool.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 dark:text-slate-200 font-medium">{tool.name}</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            {tool.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-10 relative overflow-hidden min-h-[500px]">
          {state === 'processing' && <ProcessingState progress={progress} />}
          
          {state === 'idle' && (
            <DropZone onFilesSelected={handleFilesSelected} />
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
                <OptionsPanel
                  options={tool.options}
                  values={options}
                  onChange={(key, val) => setOptions(prev => ({ ...prev, [key]: val }))}
                />
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
      </div>
    </div>
  );
};
