import Home from './home-client';

// Read per request rather than inlined into the client bundle, so the variable
// needs no NEXT_PUBLIC_ prefix and never reaches the browser by name.
export const dynamic = 'force-dynamic';

export default function Page() {
  // Anything other than "false" reads as open, so a typo shows the friendlier state.
  const isOpenToWork =
    (process.env.OPEN_TO_WORK ?? 'true').trim().toLowerCase() !== 'false';

  return <Home isOpenToWork={isOpenToWork} />;
}
