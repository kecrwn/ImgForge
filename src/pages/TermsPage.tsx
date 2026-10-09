import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const lastUpdated = "October 9, 2026";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24"
    >
      <Helmet>
        <title>Terms of Service - ImgForge</title>
        <meta name="description" content="Terms of Service for using ImgForge image processing tools." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none font-body">
            <p className="lead text-lg text-slate-700 dark:text-slate-300 mb-8">
              Welcome to ImgForge. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By using ImgForge ("Service"), you signify your agreement to these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">2. Service Description</h2>
              <p>
                ImgForge provides a collection of online tools for image processing, including resizing, compressing, converting, and editing images. The Service is provided "as is" and "as available". We may add, update, or remove features at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">3. User Responsibilities</h2>
              <p>
                When using our Service, you agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Upload or process illegal, harmful, or abusive content.</li>
                <li>Attempt to bypass our security measures or file size limits.</li>
                <li>Use the Service for automated scraping or mass processing without our permission.</li>
                <li>Upload files containing malware, viruses, or malicious code.</li>
              </ul>
              <p>
                You are solely responsible for the content you upload and process using ImgForge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">4. Intellectual Property</h2>
              <p>
                You retain all rights to the images you process using ImgForge. We do not claim any ownership over your content. The ImgForge website, design, code, and original content are protected by copyright and intellectual property laws and belong to ImgForge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">5. Limitations of Liability</h2>
              <p>
                ImgForge and its creators shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or inability to use the Service. This includes data loss resulting from server errors or processing failures. Always keep a backup of your original files.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">6. Disclaimer of Warranties</h2>
              <p>
                The Service is provided without warranties of any kind, whether express or implied. We do not guarantee that the tools will meet your specific requirements, be uninterrupted, entirely secure, or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">7. Changes to Terms</h2>
              <p>
                We may revise these Terms of Service occasionally. The most current version will always be posted on this page. By continuing to use the Service after changes become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">8. Contact Us</h2>
              <p>
                If you have questions regarding these Terms of Service, please reach out via our <a href="/contact" className="text-primary hover:underline">Contact Page</a> or email us at <a href="mailto:legal@imgforge.com" className="text-primary hover:underline">legal@imgforge.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
