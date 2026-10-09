import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ToolConfig } from '@/types';

interface ToolCardProps {
  tool: ToolConfig;
  compact?: boolean;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, compact = false, onFavorite, isFavorite = false }) => {
  const Icon = useMemo(() => {
    const iconName = tool.icon;
    const LucideIcon = (LucideIcons as any)[iconName];
    return LucideIcon || LucideIcons.Wrench;
  }, [tool.icon]);

  return (
    <div style={{ perspective: '1000px' }} className="h-full">
      <motion.div
        whileHover={{
          scale: 1.02,
          rotateX: 2,
          rotateY: -2,
          boxShadow: `0 10px 30px -10px ${tool.accentColor}40`,
          borderColor: `${tool.accentColor}50`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-hidden group transition-colors`}
      >
        {tool.comingSoon && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">
            Coming Soon
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div 
            className="p-3 rounded-xl flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${tool.accentColor}15`, color: tool.accentColor }}
          >
            <Icon size={24} />
          </div>
          {onFavorite && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavorite(tool.id);
              }}
              className="text-slate-400 hover:text-amber-500 transition-colors p-1"
            >
              <Star size={20} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
            </button>
          )}
        </div>

        <Link to={`/${tool.slug}`} className="flex-grow flex flex-col outline-none">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          {!compact && (
            <p className="font-body text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
              {tool.description}
            </p>
          )}
          
          <div className="mt-auto pt-2">
            <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
              {tool.category}
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};
