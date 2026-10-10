import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X, History, Flame } from 'lucide-react';
import * as Icons from 'lucide-react';
import { tools } from '../config/tools';
import { ToolConfig } from '../types';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.Code;
  return <Icon className={className} />;
};

const fuse = new Fuse(tools, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'tags', weight: 1.5 }
  ],
  threshold: 0.3,
  includeScore: true
});

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<ToolConfig[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const stored = localStorage.getItem('imgforge-recent-tools');
      if (stored) {
        try {
          const slugs = JSON.parse(stored);
          const recent = slugs.map((slug: string) => tools.find(t => t.slug === slug)).filter(Boolean);
          setRecentSearches(recent);
        } catch (e) {}
      }
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const addToRecent = (tool: ToolConfig) => {
    const stored = localStorage.getItem('imgforge-recent-tools');
    let slugs = [];
    if (stored) {
      try { slugs = JSON.parse(stored); } catch (e) {}
    }
    slugs = slugs.filter((s: string) => s !== tool.slug);
    slugs.unshift(tool.slug);
    slugs = slugs.slice(0, 5); // Keep last 5
    localStorage.setItem('imgforge-recent-tools', JSON.stringify(slugs));
  };

  const handleSelect = (tool: ToolConfig) => {
    addToRecent(tool);
    setIsOpen(false);
    navigate(`/tool/${tool.slug}`);
  };

  const searchResults = query ? fuse.search(query).map(r => r.item).slice(0, 8) : [];
  const popularTools = tools.slice(0, 4); // Just take first 4 as popular for now

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 md:top-[10vh] md:bottom-auto md:left-1/2 md:-translate-x-1/2 z-[101] w-full md:w-[600px] flex flex-col pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-900 shadow-2xl md:rounded-2xl flex flex-col overflow-hidden md:border border-slate-200 dark:border-slate-700 pointer-events-auto w-full h-full md:h-auto md:max-h-[80vh]"
            >
              {/* Header / Input */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search tools... (e.g., resize, compress, passport)"
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="hidden md:flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
                </div>
              </div>

              {/* Results Area */}
              <div className="flex-1 overflow-y-auto p-2">
                {query.length > 0 ? (
                  searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {searchResults.map((tool: any) => (
                        <button
                          key={tool.id}
                          onClick={() => handleSelect(tool)}
                          className="flex items-center gap-3 p-3 w-full text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <div
                            className="p-2 rounded-lg group-hover:scale-110 transition-transform bg-primary-50 dark:bg-primary-900/20"
                            style={{ color: tool.accentColor }}
                          >
                            <DynamicIcon name={tool.icon} className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">{tool.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</div>
                          </div>
                          <div className="text-xs font-medium text-slate-400 dark:text-slate-500 capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                            {tool.category.replace('-', ' ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <p className="mb-2">No tools found for "{query}"</p>
                      <p className="text-sm">Try keywords like "shrink", "crop", or "passport"</p>
                    </div>
                  )
                ) : (
                  <div className="p-2 space-y-6">
                    {recentSearches.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                          <History className="w-3.5 h-3.5" /> Recent Searches
                        </h3>
                        <div className="flex flex-col gap-1">
                          {recentSearches.map((tool: any) => (
                            <button
                              key={`recent-${tool.id}`}
                              onClick={() => handleSelect(tool)}
                              className="flex items-center gap-3 p-2 w-full text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <DynamicIcon name={tool.icon} className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5" /> Popular Tools
                      </h3>
                      <div className="flex flex-col gap-1">
                        {popularTools.map((tool: any) => (
                          <button
                            key={`popular-${tool.id}`}
                            onClick={() => handleSelect(tool)}
                            className="flex items-center gap-3 p-2 w-full text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-primary-50 dark:bg-primary-900/20" style={{ color: tool.accentColor }}>
                              <DynamicIcon name={tool.icon} className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
