import { tool } from 'ai';
import { z } from 'zod';

export const getPhotos = tool({
  description:
    'A photo gallery of Trần Nguyễn Duy Bảo. Use for "show me photos", "what do you look like", "can I see you", or any request to put a face to the name. Not for project screenshots - those belong to getProjects.',
  parameters: z.object({}),
  execute: async () => {
    return 'My photos are shown above.';
  },
});
