import React from 'react';
import { motion } from 'framer-motion';
import { CloudUpload, SlidersHorizontal, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: CloudUpload,
      title: '1. Upload Image',
      description: 'Drag & drop or select your image. It stays entirely in your browser.',
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: SlidersHorizontal,
      title: '2. Choose Options',
      description: 'Adjust settings using our intuitive sliders and realtime preview.',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
    },
    {
      icon: Download,
      title: '3. Download Result',
      description: 'Get your processed image instantly. No watermarks, no waiting.',
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-body">
            Simple, fast, and secure. Three steps to perfect images.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white dark:border-slate-800 transition-transform group-hover:scale-110 ${step.color} bg-white dark:bg-slate-900`}>
                  <step.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-body max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
