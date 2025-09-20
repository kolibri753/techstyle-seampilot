export function initialOrder(i: number) {
  return i * 1000 // big gaps for easy inserts
}

export function between(prev?: number, next?: number): number | null {
  if (prev == null && next == null) return 0
  if (prev == null) return next! - 1000
  if (next == null) return prev + 1000
  const mid = (prev + next) / 2
  // If we’re out of space (neighbors too close), signal caller to normalize
  return Math.abs(next - prev) < 1e-6 ? null : mid
}
