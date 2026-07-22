/** Format a number as FCFA: "1 247 500 FCFA" (space thousand separator, no decimals). */
export function formatFCFA(value: number, withSuffix = true): string {
  const rounded = Math.round(value)
  const sign = rounded < 0 ? '-' : ''
  const abs = Math.abs(rounded)
  const grouped = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${sign}${grouped}${withSuffix ? ' FCFA' : ''}`
}

/** Compact FCFA for tight axes: "1,2M FCFA" style using French decimal comma. */
export function formatFCFACompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}k`
  return `${sign}${Math.round(abs)}`
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits).replace('.', ',')}%`
}
