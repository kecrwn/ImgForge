import { LucideIcon } from 'lucide-react';

export type CategoryId = 
  | 'basic-editing'
  | 'effects'
  | 'dpi-quality'
  | 'resize'
  | 'official-sizes'
  | 'passport-id'
  | 'social-media'
  | 'conversions'
  | 'image-to-pdf'
  | 'compression'
  | 'exact-size'
  | 'pdf-tools'
  | 'gif-tools';

export type ProcessorType = 
  | 'compress'
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'flip'
  | 'convert'
  | 'watermark'
  | 'passport'
  | 'signature'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'color-picker'
  | 'metadata'
  | 'blur'
  | 'filter'
  | 'border'
  | 'merge'
  | 'split'
  | 'text-overlay'
  | 'background-remove'
  | 'ai-enhance'
  | 'ocr'
  | 'gif'
  | 'coming-soon';

export type OptionType = 'number' | 'select' | 'toggle' | 'slider' | 'color' | 'segmented' | 'preset-chips';

export interface OptionSchema {
  id: string;
  label: string;
  type: OptionType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  chips?: { label: string; value: number }[];
  unit?: string;
  description?: string;
  tags?: string[];
}

export interface ToolConfig {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  icon: string; // Lucide icon name
  accentColor: string;
  description: string;
  longDescription?: string;
  metaTitle: string;
  metaDescription: string;
  acceptedFormats: string[];
  maxFileSize: number;
  multiFile: boolean;
  options: OptionSchema[];
  processor: ProcessorType;
  processorConfig?: Record<string, any>;
  comingSoon?: boolean;
  tags?: string[];
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface ProcessedResult {
  originalFile: File;
  processedBlob: Blob;
  originalSize: number;
  processedSize: number;
  width?: number;
  height?: number;
  format?: string;
  downloadName: string;
}
