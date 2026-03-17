'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function Contact() {
  // Contact information
  const contactInfo = {
    name: 'Trần Nguyễn Duy Bảo',
    email: 'trannguyenduybao152@gmail.com',
    handle: '@bao.tran',
    socials: [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/bao-tran-nguyen-duy',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/Baro1502',
      },
      {
        name: 'CV',
        url: 'resume.pdf',
      },
    ],
  };

  // Function to handle email click
  const openEmail = () => {
    window.open(`mailto:${contactInfo.email}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contact
          </h2>
          <span className="mt-2 sm:mt-0 text-muted-foreground">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email */}
        <div className="mb-6">
          <div
            className="group inline-flex cursor-pointer items-center gap-1"
            onClick={openEmail}
            title="Send me an email"
          >
            <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
              {contactInfo.email}
            </span>
            <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
          {contactInfo.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              title={social.name}
            >
              {social.name}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
