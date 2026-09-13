// Server-only: reads the availability flag per request. Do not import from a client
// component - process.env is not readable in the browser and would silently be
// undefined, quietly defaulting the badge to "open".

export function isOpenToWork(): boolean {
  return (process.env.OPEN_TO_WORK ?? 'true').trim().toLowerCase() !== 'false';
}
