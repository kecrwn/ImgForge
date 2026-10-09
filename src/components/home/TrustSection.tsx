import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserX, Clock, Code2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary dark:bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-white blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/3 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-6">
              <ShieldCheck size={32} className="text-amber-400" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Your Privacy,<br/>Our Priority
            </h2>
            <p className="text-primary-light dark:text-slate-300 font-body text-lg max-w-md mx-auto lg:mx-0">
              We built ImgLab with security as a core principle. Your sensitive images should never be exposed.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Code2,
                title: 'Browser Processing',
                desc: 'All image processing happens directly in your browser using modern WebAssembly. Your files never touch our servers.'
              },
              {
                icon: Clock,
                title: 'Auto-Delete',
                desc: 'For tools that require server-side rendering, files are strictly auto-deleted within 30 minutes. No backups, no history.'
              },
              {
                icon: UserX,
                title: 'No Signup Required',
                desc: 'Start using tools immediately. We don\'t track your usage, collect your email, or require accounts.'
              },
              {
                icon: ShieldCheck,
                title: 'Open Source Core',
                desc: 'Many of our underlying processing algorithms are open-source and transparent for the community to audit.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/10 dark:border-slate-700 p-6 rounded-2xl hover:bg-white/15 transition-colors"
              >
                <feature.icon size={28} className="text-amber-400 mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary-100 dark:text-slate-400 text-sm font-body leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
