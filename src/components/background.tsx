'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const timelineData = [
  {
    role: 'AI Engineer',
    organization: 'Trivita AI',
    duration: 'Oct. 2025 - Present',
    location: 'Ho Chi Minh City, Vietnam',
    logo: '/trivitaai.jpg',
    description:
      'Optimized MoE LLM inference throughput on H100 clusters and built robust LLM-as-a-Judge evaluation systems for medical dialogues.',
    highlights: [
      'Optimized inference throughput for MoE LLMs up to 397B parameters on H100 clusters via tensor/expert parallelism with vLLM.',
      'Built a two-tier LLM-as-a-Judge evaluation system combining heuristic pre-filtering with Prometheus evaluators.',
      'Fine-tuned PhoBERT for Vietnamese ICD-10 code classification with augmentation and resampling.',
      'Designed a Dagster orchestration pipeline for MedVita automating generation and evaluation of synthetic medical conversations.',
    ],
  },
  {
    role: 'AI Engineer',
    organization: 'MCV Complex',
    duration: 'Jul. 2023 - Oct. 2025',
    location: 'Ho Chi Minh City, Vietnam',
    logo: '/mcvgroup.jpeg',
    description:
      'Shipped 4 production AI systems across healthcare and media verticals, owning full-stack delivery from model selection through deployment on GCP and AWS.',
    highlights: [
      'Introduced a modular inference engine toggling between local open-source models (vLLM, Ollama) and cloud APIs.',
      'Designed SpaceOne, a real-time media summarization and sentiment analysis pipeline deployed on Kafka.',
      'Built Doctor Assistant, a LangGraph-powered conversational agent enabling multi-turn clinical dialogue across text, PDF, speech, and image.',
      'Fine-tuned YOLOv8 for spoof detection in FaceID system, achieving 92% accuracy with sub-1s latency.',
    ],
  },
  {
    role: 'B.Sc. in Computer Science',
    organization: 'Ton Duc Thang University',
    duration: '2021 - Jun. 2025',
    location: 'Ho Chi Minh City, Vietnam',
    logo: '/tdtu.png',
    description:
      'Graduated with a GPA of 8.1 / 10.0. Top 10 in Recursion Hackathon 2022. C1 English Proficiency.',
    highlights: [
      'Capstone: Fine-tuned YOLOv8 on NIH ChestX-ray14 with CLAHE and elastic distortion augmentation for radiology abnormality detection.',
    ],
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
