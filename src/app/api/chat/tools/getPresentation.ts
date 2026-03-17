import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction of Trần Nguyễn Duy Bảo. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "I'm Trần Nguyễn Duy Bảo, starting as an AI Engineer since 2023, with years of production experience in building and optimizing LLM systems, NLP pipelines, and multimodal AI applications. I specialize in LLM inference optimization, multi-agent orchestration, and RAG architectures using tools like vLLM, LangChain, and Dagster. I focus on solving real-world problems in healthcare and media.",
    };
  },
});
