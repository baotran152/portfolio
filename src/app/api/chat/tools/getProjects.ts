
import { tool } from "ai";
import { z } from "zod";


export const getProjects = tool({
  description:
    'Every project Trần Nguyễn Duy Bảo has built, with tech stack and outcomes. Use for "what have you built", "show me your projects", "what are you working on", or any question about a specific named project.',
  parameters: z.object({}),
  execute: async () => {
    return "My projects are shown above. Ask me about any of them.";
  },
});