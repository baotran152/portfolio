'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function Resume() {
  const resumeDetails = {
    title: "Tran Nguyen Duy Bao's Resume",
    description: 'AI Engineer • Machine Learning Specialist',
    fileType: 'PDF',
    lastUpdated: 'September 2026',
    fileSize: '131 KB',
    viewUrl: '/resume.pdf', // Make sure this file is public or in /public folder
  };

  const handleView = () => {
    window.open(resumeDetails.viewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      <motion.div
        onClick={handleView}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Details area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeDetails.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>

            {/* View icon */}
            <motion.div
              className="bg-foreground text-background group-hover:bg-foreground/80 flex h-10 w-10 items-center justify-center rounded-full"
              initial={{ scale: 1 }}
            >
              <Eye className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;
