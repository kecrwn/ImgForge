import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ToolCard } from '../common/ToolCard';
import { getToolsByCategory } from '@/config/tools';
import { categories } from '@/config/categories';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  categoryId: string;
  limit?: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categoryId, limit }) => {
  const category = categories.find(c => c.id === categoryId);
  const allTools = getToolsByCategory(categoryId as any);
  const tools = limit ? allTools.slice(0, limit) : allTools;

  if (!category || tools.length === 0) return null;

  return (
    <section id={`category-${categoryId}`} className="py-16 scroll-mt-20 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-body">
              {category.description}
            </p>
          </div>
          {allTools.length > (limit || 0) && limit && (
            <Link 
              to={`/category/${categoryId}`}
              className="inline-flex items-center gap-1 text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} compact={false} />
          ))}
        </div>
      </div>
    </section>
  );
};
