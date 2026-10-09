import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, Grid } from 'lucide-react';
import { tools } from '@/config/tools';
import { ToolCard } from '@/components/common/ToolCard';

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Get 4 random or popular tools
  const popularTools = tools.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Could navigate to /tools?q=searchQuery but for now just basic push
      navigate('/tools');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24"
    >
      <Helmet>
        <title>Page Not Found - ImgForge</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.div 
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-8xl md:text-9xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary drop-shadow-sm">
            404
          </h1>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
          Oops! This page got lost in the pixels
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
          The page you were looking for doesn't exist, has been moved, or maybe just needs to be re-rendered.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-24 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            placeholder="Search for a tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              className="h-full px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            to="/tools"
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Grid size={18} />
            Browse All Tools
          </Link>
        </div>
      </div>

      {/* Popular Tools Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">
              Maybe you were looking for one of these?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Our most popular image processing tools.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} compact={true} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
