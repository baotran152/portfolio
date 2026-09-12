'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cpu, Database, Star, Users } from 'lucide-react';

// Every skill is the same shape; add `featured: true` to give one the glowing ring.
type Skill = { name: string; featured?: boolean };

type SkillSection = {
  category: string;
  icon: React.ReactNode;
  skills: Skill[];
  color: string;
};

const skillsData: SkillSection[] = [
  {
    category: 'AI & Machine Learning',
    icon: <Cpu className="h-5 w-5" />,
    skills: [
      { name: 'RAG & Vector Search', featured: true },
      { name: 'Multi-Agent Systems', featured: true },
      { name: 'Prompt Engineering' },
      { name: 'Fine-tuning (LoRA, PEFT, Distillation)', featured: true },
      { name: 'ASR' },
      { name: 'Computer Vision & OCR' },
      { name: 'Classical ML & DL (Boosting, CNN, LSTM, GANs)' },
    ],
    color:
      'bg-indigo-800/75 text-indigo-50 border-indigo-900/30 dark:bg-indigo-400/10 dark:text-indigo-100 dark:border-indigo-400/25',
  },
  {
    category: 'Backend & Systems',
    icon: <Database className="h-5 w-5" />,
    skills: [
      { name: 'Python', featured: true },
      { name: 'SQL' },
      { name: 'JavaScript' },
      { name: 'FastAPI', featured: true },
      { name: 'Flask' },
      { name: 'Node.js' },
      { name: 'Message Queue (Kafka & RabbitMQ)' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'Vector Databases (Pinecone, Chroma, Qdrant)' },
    ],
    color:
      'bg-teal-900/75 text-teal-50 border-teal-950/30 dark:bg-teal-400/10 dark:text-teal-100 dark:border-teal-400/25',
  },
  {
    category: 'Data & Infra',
    icon: <Cpu className="h-5 w-5" />,
    skills: [
      { name: 'Pandas & NumPy' },
      { name: 'Dagster & PySpark', featured: true  },
      { name: 'SpaCy' },
      { name: 'Docker' },
      { name: 'GCP & AWS' },
      { name: 'NVIDIA H100 GPU Clusters' },
      { name: 'Model Deployment', featured: true },
    ],
    color:
      'bg-amber-900/75 text-amber-50 border-amber-950/30 dark:bg-amber-400/10 dark:text-amber-100 dark:border-amber-400/25',
  },
  {
    category: 'Soft Skills',
    icon: <Users className="h-5 w-5" />,
    skills: [
      { name: 'Problem Solving', featured: true },
      { name: 'System Design', featured: true },
      { name: 'Research Mindset' },
      { name: 'Documentation' },
      { name: 'Team Collaboration', featured: true },
      { name: 'Adaptability', featured: true },
      { name: 'Critical Thinking', featured: true },
    ],
    color:
      'bg-rose-800/75 text-rose-50 border-rose-900/30 dark:bg-rose-400/10 dark:text-rose-100 dark:border-rose-400/25',
  },
];

// The gradient sits on a wrapper so it reads as a glowing ring while the label
// itself stays on a solid background at full contrast.
const FEATURED_RING =
  'inline-block rounded-md bg-gradient-to-r from-fuchsia-500/50 via-amber-400/50 to-cyan-400/50 p-[3px] shadow-[0_0_8px_-3px_rgba(217,70,239,0.3)]';

const FEATURED_BADGE =
  'bg-neutral-800 text-neutral-50 rounded-[calc(0.375rem-2px)] border-none px-3 py-1.5 font-semibold dark:bg-neutral-300 dark:text-neutral-900';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const Skills = () => {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section) => (
              <motion.div
                key={section.category}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map(({ name, featured }) => (
                    <motion.div
                      key={name}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {featured ? (
                        <span className={FEATURED_RING}>
                          <Badge className={FEATURED_BADGE}>
                            <Star
                              className="fill-amber-400/70 text-amber-400/70"
                              aria-hidden="true"
                            />
                            {/* Without this the star conveys meaning visually only. */}
                            <span className="sr-only">Core strength: </span>
                            {name}
                          </Badge>
                        </span>
                      ) : (
                        <Badge
                          className={`border px-3 py-1.5 font-normal ${section.color}`}
                        >
                          {name}
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
