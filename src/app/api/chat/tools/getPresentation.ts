import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'A short personal introduction: who Trần Nguyễn Duy Bảo is, what he does, what he specialises in. Use for "who are you", "tell me about yourself", "introduce yourself", or as the opener when a visitor arrives with no specific question. For the employer-by-employer timeline use getBackground instead; for a downloadable CV use getResume.',
  parameters: z.object({}),
  execute: async () => {
    return "My introduction is shown above.";
  },
});
