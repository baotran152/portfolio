'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const timelineData = [
  {
    role: 'AI Engineer',
    organization: 'MCV Group',
    duration: '2023 - Present',
    location: 'Ho Chi Minh City, Vietnam',
    logo: '/mcvgroup.jpeg',
    description:
      'As an AI Engineer, I design and deploy intelligent systems handling unstructured and multimodal data to support real-world applications in healthcare and automation.',
    highlights: [
      'Developed and fine-tuned chatbot agents using LLMs and LangChain.',
      'Built multimedia summarization pipelines from images, PDFs, and text.',
      'Object anomaly detection with complex computer vision techniques',
      'Created an ML pipeline for diabetes risk prediction using health data.',
      'Engineered data extraction workflows with OCR and custom logic.',
      'Processed complex tabular datasets with feature engineering and normalization.',
    ],
  },
  {
    role: 'Bachelor of Technology in Computer Science Engineering',
    organization: 'Ton Duc Thang University',
    duration: '2021 - 2025',
    location: 'Ho Chi Minh City, Vietnam',
    logo: '/tdtu.png',
    description:
      'Pursuing a B.Tech degree in Computer Science with a specialization in Artificial Intelligence. This is where I began exploring the fields of AI, ML, and Data Science deeply.',
    highlights: [],
  },
];

export default function Background() {
  return (
    <div className="mx-auto mt-8 w-full max-w-5xl px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-foreground mb-8 text-3xl font-bold md:text-4xl">
          Background
        </h2>
        <ul className="space-y-10">
          {timelineData.map((entry, idx) => (
            <li key={idx} className="flex flex-col gap-6 md:flex-row">
              {/* Logo */}
              <div className="w-full max-w-[100px] md:w-[100px] md:flex-shrink-0">
                <Image
                  src={entry.logo}
                  alt={`${entry.organization} logo`}
                  width={100}
                  height={100}
                  className="rounded-lg object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {entry.role}
                  </h3>
                  <h4 className="text-muted-foreground text-sm font-medium">
                    {entry.organization}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <span>{entry.duration}</span> &nbsp;|&nbsp;
                    <span>{entry.location}</span>
                  </p>
                </div>
                <p className="text-base text-foreground">{entry.description}</p>
                {entry.highlights.length > 0 && (
                  <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                    {entry.highlights.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
