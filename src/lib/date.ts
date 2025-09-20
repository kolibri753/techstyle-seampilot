export function fmtDateTime(d?: Date) {
  if (!d) return '—'
  try {
    return d.toLocaleString()
  } catch {
    return '—'
  }
}
