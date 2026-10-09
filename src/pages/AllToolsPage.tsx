import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ToolCard } from '@/components/common/ToolCard';
import { categories } from '@/config/categories';
import { tools } from '@/config/tools';

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [scrolledCategory, setScrolledCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (activeCategory !== 'all' || searchQuery) return;
      
      const sections = categories.map(c => document.getElementById(`category-${c.id}`));
      let currentActive = 'all';
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            currentActive = section.id.replace('category-', '');
            break;
          }
        }
      }
      
      if (currentActive !== scrolledCategory) {
        setScrolledCategory(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory, searchQuery, scrolledCategory]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    setScrolledCategory(id);
    if (id !== 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20"
    >
      <Helmet>
        <title>All Image Tools - ImgForge</title>
        <meta name="description" content="Browse our complete collection of free online image tools. Resize, compress, convert, and edit images easily in your browser." />
      </Helmet>

      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              All Image Tools
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-body">
              Everything you need to process your images, right in your browser.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-transparent rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              placeholder="Search for a tool (e.g., 'compress jpg', 'resize')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar (Desktop) / Horizontal pills (Mobile) */}
        <div className="md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-[100px] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="hidden md:block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 px-2">
              Categories
            </h3>
            <div className="flex md:flex-col overflow-x-auto hide-scrollbar gap-2 md:gap-1">
              <button
                onClick={() => scrollToCategory('all')}
                className={`flex-shrink-0 md:w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Tools
                <span className="ml-2 text-xs opacity-70">({tools.length})</span>
              </button>
              {categories.map((cat) => {
                const catToolsCount = tools.filter(t => t.category === cat.id).length;
                if (catToolsCount === 0) return null;
                const isActive = activeCategory === cat.id || (activeCategory === 'all' && scrolledCategory === cat.id && !searchQuery);
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={`flex-shrink-0 md:w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                    <span className="ml-2 text-xs opacity-70">({catToolsCount})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {searchQuery || activeCategory !== 'all' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} compact={false} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-lg text-slate-500 dark:text-slate-400">No tools found matching your search.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map(category => {
                const categoryTools = tools.filter(t => t.category === category.id);
                if (categoryTools.length === 0) return null;

                return (
                  <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                    <div className="mb-6">
                      <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.name}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 font-body">
                        {category.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {categoryTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} compact={false} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
