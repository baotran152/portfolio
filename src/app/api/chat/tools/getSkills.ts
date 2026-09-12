import { tool } from 'ai';
import { z } from 'zod';

export const getSkills = tool({
  description:
    'The full skill set grouped by area: AI/ML, backend, data and infrastructure, plus soft skills. Use for "what are your skills", "what is your tech stack", "do you know X", "what languages do you use".',
  parameters: z.object({}),
  execute: async () => {
    return "You can see all my skills above.";
  },
});
