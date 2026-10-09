import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Hero } from '@/components/home/Hero';
import { PopularTools } from '@/components/home/PopularTools';
import { CategorySection } from '@/components/home/CategorySection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustSection } from '@/components/home/TrustSection';
import { FAQ } from '@/components/common/FAQ';
import { categories } from '@/config/categories';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqItems = [
    {
      question: "Is ImgForge really free to use?",
      answer: "Yes, 100% free. We don't have premium tiers, watermarks, or hidden costs. We believe basic image processing should be accessible to everyone."
    },
    {
      question: "What happens to my uploaded images?",
      answer: "Most of our tools process images entirely in your browser. This means your files never leave your device. For a few tools that require complex server processing, images are automatically and permanently deleted within 30 minutes."
    },
    {
      question: "Do I need to create an account?",
      answer: "No. You can start using all tools immediately without signing up. We value your time and privacy."
    },
    {
      question: "Is there a file size limit?",
      answer: "Browser-based tools generally handle files up to 50MB well, though this depends on your device's memory. Server-processed tools have a generous 20MB limit per file."
    }
  ];

  // Highlight active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(c => document.getElementById(`category-${c.id}`));
      let currentActive = null;
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top >= 0 && rect.top <= 300) {
            currentActive = section.id.replace('category-', '');
            break;
          }
        }
      }
      
      if (currentActive && currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-slate-950"
    >
      <Helmet>
        <title>ImgForge | Premium Free Online Image Tools</title>
        <meta name="description" content="The ultimate all-in-one image toolkit. Resize, compress, convert, and edit images for free. Privacy-first, browser-based processing." />
      </Helmet>

      <Hero />
      
      <PopularTools />

      {/* Category Navigation Bar (Sticky) */}
      <div className="sticky top-[72px] z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm py-3 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 items-center">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2 whitespace-nowrap">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950">
        {categories.map((category) => (
          <CategorySection key={category.id} categoryId={category.id} limit={8} />
        ))}
      </div>

      <HowItWorks />
      
      <TrustSection />

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-body">
              Everything you need to know about ImgForge.
            </p>
          </div>
          
          <FAQ items={faqItems} />
        </div>
      </section>
    </motion.div>
  );
};
