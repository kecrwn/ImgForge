import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { tools } from '@/config/tools';
import { ToolConfig } from '@/types';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredTools = tools.filter((tool) => 
    tool.name.toLowerCase().includes(query.toLowerCase()) || 
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter' && filteredTools.length > 0) {
        e.preventDefault();
        handleSelect(filteredTools[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose]);

  const handleSelect = (tool: ToolConfig) => {
    navigate(`/${tool.slug}`);
    onClose();
  };

  const IconForTool = (iconName: string) => {
    const LucideIcon = (LucideIcons as any)[iconName] || LucideIcons.Wrench;
    return <LucideIcon size={18} />;
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
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
          >
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-200 dark:border-slate-800">
              <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <Search className="text-slate-400 mr-3" size={20} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search tools... (e.g., resize, crop, filter)"
                  className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-body"
                />
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredTools.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No tools found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTools.map((tool, index) => (
                      <div
                        key={tool.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => handleSelect(tool)}
                        className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${tool.accentColor}15`, color: tool.accentColor }}
                        >
                          {IconForTool(tool.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="font-heading font-medium">{tool.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate w-[250px] sm:w-[350px]">
                            {tool.description}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400">
                          {tool.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                <span>Use arrows to navigate</span>
                <span>Enter to select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
