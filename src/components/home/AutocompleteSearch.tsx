import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import * as Icons from 'lucide-react';
import { tools } from '../../config/tools';
import { createPortal } from 'react-dom';

const fuse = new Fuse(tools, {
  keys: ['name', 'description', 'tags', 'category'],
  threshold: 0.3,
  includeMatches: true,
});

export const AutocompleteSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(tools.slice(0, 8));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(tools.slice(0, 8));
    } else {
      const searchResults = fuse.search(query).map(r => r.item);
      setResults(searchResults.slice(0, 8));
    }
    setSelectedIndex(0);
  }, [query]);

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/tool/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Keep selected item in view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  const DropdownContent = () => {
    if (!isOpen || results.length === 0) return null;

    const content = (
      <ul 
        ref={listRef}
        className="max-h-[300px] overflow-y-auto py-2 flex flex-col"
      >
        {results.map((tool, index) => {
          const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
          return (
            <li
              key={tool.id}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                index === selectedIndex 
                  ? 'bg-slate-100 dark:bg-slate-800' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              onClick={() => handleSelect(tool.slug)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${tool.accentColor}20`, color: tool.accentColor }}
              >
                <Icon size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {tool.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {tool.category.replace('-', ' ')}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    );

    if (isMobile) {
      return createPortal(
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {content}
          </div>
        </div>,
        document.body
      );
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
        {content}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50 group">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for tools... (e.g. compress, crop)"
          className="w-full pl-12 pr-20 py-4 text-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <div className="absolute right-4 flex items-center gap-2">
          {query && (
            <button 
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>
      <DropdownContent />
    </div>
  );
};
