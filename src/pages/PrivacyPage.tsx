import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const lastUpdated = "October 9, 2026";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24"
    >
      <Helmet>
        <title>Privacy Policy - ImgLab</title>
        <meta name="description" content="Learn how ImgLab protects your privacy and handles your data." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none font-body">
            <p className="lead text-lg text-slate-700 dark:text-slate-300 mb-8">
              At ImgLab, your privacy is our priority. We are committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and what rights you have.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">1. Data Collection</h2>
              <p>
                We practice data minimization. We only collect the information absolutely necessary to provide our services. We do not require you to create an account, and we do not collect personal identifiers like your name, email address, or phone number unless you explicitly provide them (e.g., via our contact form).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">2. Browser Processing</h2>
              <p>
                The majority of our image editing tools utilize client-side processing. This means that your files are processed directly within your web browser and are never uploaded to our servers. For these tools, your data remains completely on your device.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">3. File Handling & Server Processing</h2>
              <p>
                For certain advanced tools that require server-side computing power, you may need to upload your files. In these cases:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Files are securely transmitted using SSL/TLS encryption.</li>
                <li>Files are stored temporarily in isolated, secure environments solely for the purpose of processing.</li>
                <li><strong>All uploaded and processed files are automatically and permanently deleted from our servers within 30 minutes of upload.</strong></li>
                <li>We do not claim any ownership rights over your files.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">4. Cookies & Tracking</h2>
              <p>
                We use strictly essential cookies required for the basic functionality of the website, such as remembering your theme preference (dark/light mode) or recent tool usage locally on your device. We do not use advertising cookies or invasive tracking scripts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">5. Analytics</h2>
              <p>
                We use privacy-friendly analytics to understand general usage trends (e.g., which tools are most popular) and to monitor server health. This data is aggregated, anonymized, and cannot be traced back to individual users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">6. Third-Party Services</h2>
              <p>
                We do not sell, trade, or otherwise transfer your information to outside parties. We may use trusted third-party service providers (like hosting providers) who assist us in operating our website, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4 text-slate-900 dark:text-white">7. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:privacy@imglab.com" className="text-primary hover:underline">privacy@imglab.com</a> or via our <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
