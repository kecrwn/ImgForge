import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const values = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: 'Privacy-First Processing',
      description: 'Your images are processed securely. Many tools process entirely in your browser, and when server processing is needed, files are automatically deleted after 30 minutes.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Lightning Fast',
      description: 'Built on modern web technologies, our tools deliver near-instant results without the need for expensive software or long loading times.'
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: 'No Strings Attached',
      description: 'No hidden fees, no required signups, no watermarks. We believe powerful image editing tools should be accessible to everyone for free.'
    },
    {
      icon: <Code className="w-6 h-6 text-indigo-500" />,
      title: 'Modern Architecture',
      description: 'Leveraging WebAssembly and the latest web APIs to bring desktop-class image processing capabilities directly to your web browser.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24"
    >
      <Helmet>
        <title>About Us - ImgLab</title>
        <meta name="description" content="Learn about ImgLab's mission to provide free, fast, and private image processing tools for everyone." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
            About ImgLab
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-body max-w-2xl mx-auto">
            We're on a mission to make professional-grade image editing accessible, fast, and secure for everyone.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 mb-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-heading font-bold mb-4">Our Story</h2>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              We built ImgLab because image editing shouldn't require expensive software, complex installations, or uploading your private files to unknown servers. 
            </p>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Too often, simple tasks like resizing a photo, compressing an image for a website, or converting between formats require navigating ad-filled websites that force you to create an account or stamp watermarks on your work. We thought there had to be a better way.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              By leveraging the power of modern web browsers, we've brought complex image processing algorithms right to your device. This means faster processing times, better privacy, and a smoother user experience.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl h-fit">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            Built by a team of passionate developers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We are a group of developers, designers, and open-source enthusiasts dedicated to creating tools that respect users' time and data.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 md:p-12 text-center border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            Ready to enhance your images?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust ImgLab for their daily image processing needs. No signup required.
          </p>
          <Link 
            to="/tools" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Start editing your images
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
