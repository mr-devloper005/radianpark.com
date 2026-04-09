/** Safe in-app path only — blocks open redirects. */
export function getSafeReturnPath(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return null
  if (t.includes('://')) return null
  return t
}
