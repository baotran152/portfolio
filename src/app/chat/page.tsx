import { Suspense } from 'react';
import Chat from '@/components/chat/chat';
import { isOpenToWork } from '@/lib/availability';

// Same reason as the home page: the flag is read per request, server side.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat isOpenToWork={isOpenToWork()} />
    </Suspense>
  );
}
