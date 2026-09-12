import { tool } from 'ai';
import { z } from 'zod';

export const getResume = tool({
  description:
    'A downloadable CV file. Use only when the visitor explicitly wants the document itself - "can I see your resume", "do you have a CV", "send me your resume". If they are asking about the content of his history rather than the file, use getBackground instead.',
  parameters: z.object({}),
  execute: async () => {
    return "You can download my resume by clicking on the link above.";
  },
});
