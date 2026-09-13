// src/components/chat/tool-renderer.tsx
import { memo } from 'react';
import { Contact } from '../contact';
import { Presentation } from '../presentation';
import AllProjects from '../projects/AllProjects';
import Resume from '../resume';
import Skills from '../skills';
import Background from '../background';
import { Photos } from '../photos';
import { PHOTOS } from '@/lib/photos';

interface ToolRendererProps {
  toolInvocations: any[];
  messageId: string;
}

function ToolRenderer({ toolInvocations, messageId }: ToolRendererProps) {
  return (
    <div className="w-full transition-all duration-300">
      {toolInvocations.map((tool) => {
        const { toolCallId, toolName } = tool;

        // Return specialized components based on tool name
        switch (toolName) {
          case 'getProjects':
            return (
              <div
                key={toolCallId}
                className="w-full overflow-hidden rounded-lg"
              >
                <AllProjects />
              </div>
            );

          case 'getPresentation':
            return (
              <div
                key={toolCallId}
                className="w-full overflow-hidden rounded-lg"
              >
                <Presentation />
              </div>
            );

          case 'getResume':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Resume />
              </div>
            );

          case 'getContact':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Contact />
              </div>
            );

          case 'getSkills':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Skills />
              </div>
            );

          case 'getPhotos':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Photos photos={PHOTOS} title="Photos" />
              </div>
            );

          case 'getBackground':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Background />
              </div>
            );

          // case 'getSports':
          //   return (
          //     <div key={toolCallId} className="w-full rounded-lg">
          //       <Sports />
          //     </div>
          //   );


          // Default renderer for other tools
          default:
            return (
              <div
                key={toolCallId}
                className="bg-secondary/10 w-full rounded-lg p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{toolName}</h3>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                    Tool Result
                  </span>
                </div>
                <div className="mt-2">
                  {typeof tool.result === 'object' ? (
                    <pre className="bg-secondary/20 overflow-x-auto rounded p-3 text-sm">
                      {JSON.stringify(tool.result, null, 2)}
                    </pre>
                  ) : (
                    <p>{String(tool.result)}</p>
                  )}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}

// A finished tool result never changes, but the streaming text that follows it gives
// `toolInvocations` a new array identity on every token. Comparing by id and state
// stops that cascade here, so the tool UI below is not re-rendered ~50 times a second.
export default memo(ToolRenderer, (prev, next) => {
  if (prev.messageId !== next.messageId) return false;
  if (prev.toolInvocations.length !== next.toolInvocations.length) return false;
  return prev.toolInvocations.every((tool, i) => {
    const other = next.toolInvocations[i];
    return tool.toolCallId === other.toolCallId && tool.state === other.state;
  });
});
