'use client';

// Dev-only preview of the chat tool components, so their UI can be worked on
// without spending API calls to make the model invoke each tool.
import { useState } from 'react';

import { Contact } from '@/components/contact';
import { Presentation } from '@/components/presentation';
import AllProjects from '@/components/projects/AllProjects';
import Resume from '@/components/resume';
import Skills from '@/components/skills';
import Background from '@/components/background';
import { ThemeToggle } from '@/components/theme-toggle';

const TOOLS = {
  Skills: <Skills />,
  Background: <Background />,
  Projects: <AllProjects />,
  Resume: <Resume />,
  Contact: <Contact />,
  Presentation: <Presentation />,
} as const;

type ToolName = keyof typeof TOOLS;

const TOOL_NAMES = Object.keys(TOOLS) as ToolName[];

export default function PreviewPage() {
  const [active, setActive] = useState<ToolName>('Skills');

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <ThemeToggle />
          {TOOL_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active === name
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {TOOLS[active]}
      </div>
    </div>
  );
}
