import { tool } from 'ai';
import { z } from 'zod';

export const getContact = tool({
  description:
    'Contact details and social links. Use for "how can I reach you", "what is your email", "are you open to work", "how do I hire you", or any question about getting in touch.',
  parameters: z.object({}),
  execute: async () => {
    return "My contact details are shown above. Feel free to reach out.";
  },
});
