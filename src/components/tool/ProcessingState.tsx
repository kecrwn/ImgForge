import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingStateProps {
  progress?: number;
}

const MESSAGES = [
  'Working the magic...',
  'Crunching pixels...',
  'Almost there...',
  'Perfecting your image...'
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ progress = 0 }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-50"
    >
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-primary-500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 283' }}
            animate={{ strokeDasharray: `${(progress / 100) * 283} 283` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-200">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="h-8 relative w-full flex justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute text-slate-600 dark:text-slate-400 font-medium"
          >
            {MESSAGES[msgIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
