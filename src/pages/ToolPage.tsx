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

import { GenericWorkspace } from '../components/tool/GenericWorkspace';
import { CropWorkspace } from '../components/tool/CropWorkspace';
import { CompressWorkspace } from '../components/tool/CompressWorkspace';
import { ImageToPdfWorkspace } from '../components/tool/ImageToPdfWorkspace';
import { ColorPickerWorkspace } from '../components/tool/ColorPickerWorkspace';
import { MetadataWorkspace } from '../components/tool/MetadataWorkspace';

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

  // Dynamic Router
  const renderWorkspace = () => {
    if (tool.processor === 'crop') {
      return <CropWorkspace tool={tool} />;
    }
    
    if (tool.processor === 'compress') {
      return <CompressWorkspace tool={tool} />;
    }
    
    if (tool.processor === 'image-to-pdf') {
      return <ImageToPdfWorkspace tool={tool} />;
    }
    
    if (tool.processor === 'color-picker') {
      return <ColorPickerWorkspace tool={tool} />;
    }
    
    if (tool.processor === 'metadata') {
      return <MetadataWorkspace tool={tool} />;
    }
    
    // Fallback for everything else
    return <GenericWorkspace tool={tool} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
      <Helmet>
        <title>{tool.name} - ImgForge</title>
        <meta name="description" content={tool.description} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize">{tool.category.replace('-', ' ')}</span>
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

        {/* Dynamic Workspace Container */}
        {renderWorkspace()}
      </div>
    </div>
  );
};
