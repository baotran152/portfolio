import { tool } from 'ai';
import { z } from 'zod';

export const getBackground = tool({
  description:
    'This tool show my background education and working experience.',
  parameters: z.object({}),
  execute: async () => {
    return "You can see all my background above.";
  },
});
