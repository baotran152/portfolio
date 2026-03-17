import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction of Trần Nguyễn Duy Bảo. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "I'm Trần Nguyễn Duy Bảo, an AI Engineer passionate about building intelligent systems using LLMs, Computer Vision, and Big Data. I’ve led projects ranging from medical AI chatbots and multimodal summarization platforms to traffic-aware navigation systems. I focus on applying state-of-the-art AI to solve real-world problems with impact.",
    };
  },
});
