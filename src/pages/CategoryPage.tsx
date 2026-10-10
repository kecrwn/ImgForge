import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { TOOLS } from '../config/tools';
import { categories } from '../config/categories';
import { CategoryId } from '../types';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.Code;
  return <Icon className={className} />;
};

// Top-level custom routes mapped to underlying category IDs
const PATH_TO_CATEGORIES: Record<string, CategoryId[]> = {
  'compress': ['compression', 'exact-size'],
  'resize': ['resize', 'official-sizes', 'passport-id', 'social-media'],
  'convert': ['conversions'],
  'pdf-tools': ['pdf-tools', 'image-to-pdf'],
  'edit': ['basic-editing', 'effects', 'dpi-quality', 'gif-tools'],
};

const PATH_TITLES: Record<string, { title: string, description: string }> = {
  'compress': { title: 'Image Compression Tools', description: 'Reduce image file size without losing quality.' },
  'resize': { title: 'Image Resizing Tools', description: 'Resize your images for social media, passports, and more.' },
  'convert': { title: 'Image Conversion Tools', description: 'Convert between different image formats easily.' },
  'pdf-tools': { title: 'PDF & Document Tools', description: 'Convert images to PDF and extract images from PDF.' },
  'edit': { title: 'Image Editing Tools', description: 'Basic and advanced image editing utilities.' },
};

export default function CategoryPage() {
  const { category: pathCategory, id: categoryId } = useParams<{ category?: string, id?: string }>();
  
  // It could be from /:category (like /compress) or /category/:id (like /category/basic-editing)
  let resolvedCategoryIds: CategoryId[] | undefined = undefined;
  let pageInfo = { title: 'Tools', description: 'Explore our tools.' };

  if (pathCategory && PATH_TO_CATEGORIES[pathCategory]) {
    resolvedCategoryIds = PATH_TO_CATEGORIES[pathCategory];
    pageInfo = PATH_TITLES[pathCategory];
  } else if (categoryId) {
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      resolvedCategoryIds = [cat.id];
      pageInfo = { title: cat.name, description: cat.description };
    }
  } else if (pathCategory) {
    // Maybe they visited /basic-editing directly?
    const cat = categories.find(c => c.id === pathCategory);
    if (cat) {
      resolvedCategoryIds = [cat.id];
      pageInfo = { title: cat.name, description: cat.description };
    }
  }

  if (!resolvedCategoryIds) {
    return <Navigate to="/not-found" replace />;
  }

  const categoryTools = useMemo(() => {
    return TOOLS.filter(tool => resolvedCategoryIds?.includes(tool.category));
  }, [resolvedCategoryIds]);

  return (
    <div className="container-max section-padding py-12 pt-28 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
          {pageInfo.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {pageInfo.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryTools.map(tool => (
          <Link
            key={tool.id}
            to={`/tool/${tool.slug}`}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${tool.accentColor}20`, color: tool.accentColor }}>
              <DynamicIcon name={tool.icon} className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
