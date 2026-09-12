'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import type { Message } from 'ai/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo, useState } from 'react';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

type ChatMessageRowProps = {
  message: Message;
  isLatest: boolean;
  isLoading: boolean;
};

const TOOL_LABELS: Record<string, string> = {
  getProjects: 'Projects',
  getPresentation: 'Introduction',
  getResume: 'Resume',
  getContact: 'Contact',
  getSkills: 'Skills',
  getBackground: 'Background',
};

function firstCompletedTool(message: Message) {
  const part = message.parts?.find(
    (p) => p.type === 'tool-invocation' && p.toolInvocation?.state === 'result'
  );
  return part?.type === 'tool-invocation' ? part.toolInvocation : null;
}

function ChatMessageRow({ message, isLatest, isLoading }: ChatMessageRowProps) {
  // Older cards start collapsed so only one heavy card (the projects carousel
  // in particular) is mounted at a time.
  const [expanded, setExpanded] = useState(false);

  const isUser = message.role === 'user';
  const tool = isUser ? null : firstCompletedTool(message);
  const hasText = message.content.trim().length > 0;
  const showCard = tool && (isLatest || expanded);

  if (isUser) {
    return (
      <div className="mb-4 flex justify-end">
        <ChatBubble variant="sent">
          <ChatBubbleMessage>
            <ChatMessageContent message={message} />
          </ChatBubbleMessage>
        </ChatBubble>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full">
      {tool && !isLatest && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="border-border hover:bg-accent text-muted-foreground mb-2 flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition"
        >
          {TOOL_LABELS[tool.toolName] ?? tool.toolName}
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      )}

      {showCard && (
        <div className="mb-4 w-full">
          <ToolRenderer
            toolInvocations={[tool]}
            messageId={message.id || 'current-msg'}
          />
        </div>
      )}

      {hasText && (
        <ChatBubble variant="received" className="w-full">
          <ChatBubbleMessage className="w-full">
            <ChatMessageContent
              message={message}
              isLast={isLatest}
              isLoading={isLoading}
              skipToolRendering={true}
            />
          </ChatBubbleMessage>
        </ChatBubble>
      )}
    </div>
  );
}

// The message list re-renders on every streamed token. Only the row whose content
// is actually growing should re-render, so compare the fields that can change
// rather than relying on object identity, which churns every token.
export default memo(ChatMessageRow, (prev, next) => {
  const p = prev.message;
  const n = next.message;
  return (
    p.id === n.id &&
    p.content.length === n.content.length &&
    p.parts?.length === n.parts?.length &&
    firstCompletedTool(p)?.toolCallId === firstCompletedTool(n)?.toolCallId &&
    prev.isLatest === next.isLatest &&
    prev.isLoading === next.isLoading
  );
});
