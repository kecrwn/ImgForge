import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Github, Twitter, Youtube, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOOTER_LINKS = {
  'Image Tools': [
    { name: 'Compress Image', path: '/compress' },
    { name: 'Resize Image', path: '/resize' },
    { name: 'Crop Image', path: '/crop' },
    { name: 'Convert to WebP', path: '/convert/webp' },
    { name: 'Image Upscaler', path: '/upscale' },
  ],
  'PDF Tools': [
    { name: 'Images to PDF', path: '/images-to-pdf' },
    { name: 'PDF to Images', path: '/pdf-to-images' },
    { name: 'Compress PDF', path: '/compress-pdf' },
  ],
  'GIF Tools': [
    { name: 'Video to GIF', path: '/video-to-gif' },
    { name: 'GIF to MP4', path: '/gif-to-mp4' },
    { name: 'Compress GIF', path: '/compress-gif' },
  ],
  'Legal': [
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Contact', path: '/contact' },
  ]
};

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-800/50 relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="container-max section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-electric text-white shadow-lg shadow-primary-700/20">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white">
                Img<span className="text-primary-400">Lab</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              The fastest, private web-first image toolkit for modern creators. Process images right in your browser.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns - Desktop */}
          <div className="hidden lg:grid lg:col-span-8 grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-heading font-semibold text-white mb-6">{title}</h3>
                <ul className="flex flex-col gap-3">
                  {links.map(link => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Links Columns - Mobile Accordion */}
          <div className="lg:hidden flex flex-col divide-y divide-slate-800/50 border-y border-slate-800/50">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className="py-4">
                <button 
                  onClick={() => toggleSection(title)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="font-heading font-semibold text-white">{title}</h3>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSection === title ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection === title && (
                    <motion.ul 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-3 pt-4"
                    >
                      {links.map(link => (
                        <li key={link.name}>
                          <Link to={link.path} className="text-slate-400 hover:text-primary-400 transition-colors text-sm py-1 block">
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ImgForge. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <span className="text-rose-500">❤️</span> for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
