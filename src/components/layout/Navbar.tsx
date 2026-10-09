import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Monitor, Menu, X, Globe, ChevronDown, FlaskConical, FileImage, FileText, Settings, Grid, History } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { HistoryDrawer } from '../common/HistoryDrawer';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Compress', path: '/compress', hasMegaMenu: true },
  { name: 'Resize', path: '/resize', hasMegaMenu: true },
  { name: 'Convert', path: '/convert', hasMegaMenu: true },
  { name: 'PDF Tools', path: '/pdf-tools', hasMegaMenu: true },
  { name: 'Edit', path: '/edit', hasMegaMenu: true },
  { name: 'All Tools', path: '/tools' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const { mode, toggleMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const renderThemeIcon = () => {
    if (mode === 'light') return <Sun className="w-5 h-5 text-amber-500" />;
    if (mode === 'dark') return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Monitor className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-max section-padding">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-electric text-white shadow-lg shadow-primary-700/20 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
              Img<span className="text-primary-600 dark:text-primary-400">Lab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={() => link.hasMegaMenu && setActiveMegaMenu(link.name)}
                onMouseLeave={() => link.hasMegaMenu && setActiveMegaMenu(null)}
              >
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname === link.path 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                  {link.hasMegaMenu && <ChevronDown className="w-4 h-4 opacity-50" />}
                </Link>

                {/* Mega Menu Dropdown */}
                {link.hasMegaMenu && (
                  <AnimatePresence>
                    {activeMegaMenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[400px]"
                      >
                        <div className="glass-strong rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 border border-slate-200 dark:border-slate-700">
                          {/* Dummy tools for mega menu */}
                          {[1,2,3,4].map(i => (
                            <Link key={i} to={`${link.path}-tool-${i}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                                <FileImage className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Tool {i}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Short description</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button 
              onClick={toggleMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {renderThemeIcon()}
            </button>
            <button 
              onClick={() => setHistoryOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="My Files History"
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-slate-950 shadow-2xl z-50 lg:hidden flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between"
                    >
                      {link.name}
                      {link.hasMegaMenu && <ChevronDown className="w-4 h-4 opacity-50" />}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button 
                  onClick={toggleMode}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  {renderThemeIcon()}
                  <span>Theme</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900">
                  <Globe className="w-5 h-5" />
                  <span>EN</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <HistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </header>
  );
}
