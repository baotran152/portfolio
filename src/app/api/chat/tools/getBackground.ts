import { tool } from 'ai';
import { z } from 'zod';

export const getBackground = tool({
  description:
    'Education and work history: degrees, university, employers and the career timeline. Use for "where did you study", "what is your background", "where have you worked", "how much experience do you have". For a general self-introduction use getPresentation instead; for a downloadable CV use getResume.',
  parameters: z.object({}),
  execute: async () => {
    return "You can see all my background above.";
  },
});
