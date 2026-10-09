import { Category } from '../types';

export const categories: Category[] = [
  { id: 'basic-editing', name: 'Basic Editing', description: 'Essential tools for quick image adjustments', icon: 'Pencil', accentColor: '#6366F1' },
  { id: 'effects', name: 'Blur, Pixelate & Effects', description: 'Special effects, filters and creative transformations', icon: 'Sparkles', accentColor: '#EC4899' },
  { id: 'dpi-quality', name: 'DPI & Quality', description: 'Enhance resolution and image quality', icon: 'Gauge', accentColor: '#14B8A6' },
  { id: 'resize', name: 'General Resizing', description: 'Resize images to exact dimensions', icon: 'Maximize2', accentColor: '#F59E0B' },
  { id: 'official-sizes', name: 'Official Sizes', description: 'Standard document and ID photo sizes', icon: 'FileCheck', accentColor: '#8B5CF6' },
  { id: 'passport-id', name: 'Passport & ID Photos', description: 'Create standard passport and ID photos', icon: 'Camera', accentColor: '#06B6D4' },
  { id: 'social-media', name: 'Social Media', description: 'Optimize images for social platforms', icon: 'Share2', accentColor: '#F43F5E' },
  { id: 'conversions', name: 'Format Conversions', description: 'Convert between image formats', icon: 'RefreshCw', accentColor: '#10B981' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert images to PDF and vice versa', icon: 'FileText', accentColor: '#EF4444' },
  { id: 'compression', name: 'Compression', description: 'Reduce file size while maintaining quality', icon: 'Archive', accentColor: '#4449A6' },
  { id: 'exact-size', name: 'Exact Target Sizes', description: 'Compress to a specific file size', icon: 'Target', accentColor: '#7C3AED' },
  { id: 'pdf-tools', name: 'PDF Tools', description: 'Merge, compress and convert PDFs', icon: 'FileText', accentColor: '#DC2626' },
  { id: 'gif-tools', name: 'GIF Tools', description: 'Create, edit and compress GIFs', icon: 'Film', accentColor: '#059669' },
];
