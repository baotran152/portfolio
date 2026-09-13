import Home from './home-client';
import { isOpenToWork } from '@/lib/availability';

// Read per request rather than inlined into the client bundle, so the variable
// needs no NEXT_PUBLIC_ prefix and never reaches the browser by name.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <Home isOpenToWork={isOpenToWork()} />;
}
