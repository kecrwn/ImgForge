import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Shield, Image as ImageIcon, ZapOff, Fingerprint, Chrome } from 'lucide-react';
import { AutocompleteSearch } from './AutocompleteSearch';

export const Hero: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-amber-500/20 dark:bg-amber-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[40%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
              <Zap size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">150+ Free Tools • Privacy-First</span>
            </motion.div>

            <motion.h1 variants={item} className="text-5xl lg:text-7xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
              Transform Your <br className="hidden lg:block" />
              Images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-amber-500">Precision</span>
            </motion.h1>

            <motion.p variants={item} className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl font-body">
              The ultimate all-in-one image toolkit right in your browser. No signups, no watermarks, completely free. Your files never leave your device.
            </motion.p>

            <motion.div variants={item} className="w-full relative z-50 mb-8">
              <AutocompleteSearch />
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {['Resize', 'Compress', 'Convert to WebP', 'Remove Background'].map((chip) => (
                <span key={chip} className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                  {chip}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block relative h-full w-full max-w-lg mx-auto"
          >
            <div className="relative w-full aspect-square rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl p-6 flex flex-col transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Original vs Optimized</div>
              </div>
              
              <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center border-r-2 border-white/50 dark:border-slate-600 relative overflow-hidden">
                     <ImageIcon size={48} className="text-slate-400 dark:text-slate-500 mb-2 opacity-50" />
                     <span className="text-sm font-bold text-slate-500 dark:text-slate-400">4.2 MB</span>
                     <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white">Before</div>
                  </div>
                  <div className="w-1/2 h-full bg-gradient-to-br from-primary/10 to-amber-500/10 flex flex-col items-center justify-center relative overflow-hidden">
                     <ImageIcon size={48} className="text-primary dark:text-primary-light mb-2" />
                     <span className="text-sm font-bold text-primary dark:text-primary-light">340 KB</span>
                     <div className="absolute bottom-2 right-2 bg-primary/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white">After</div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white dark:bg-slate-600 -ml-[0.5px] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-600">
                    <div className="flex gap-[2px]">
                      <div className="w-[2px] h-3 bg-slate-300 dark:bg-slate-500 rounded-full" />
                      <div className="w-[2px] h-3 bg-slate-300 dark:bg-slate-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                <span>Optimization: <span className="text-green-500">-92%</span></span>
                <span>Format: WebP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges Row */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-4 opacity-70">
            {[
              { icon: ZapOff, text: "Free Forever" },
              { icon: Fingerprint, text: "No Signup Required" },
              { icon: Shield, text: "Files Auto-Deleted in 30min" },
              { icon: Chrome, text: "100% Browser Processing" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <badge.icon size={18} className="text-primary dark:text-primary-light" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
