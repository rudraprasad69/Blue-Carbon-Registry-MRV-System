/**
 * Date formatting utility for SSR-safe rendering
 * Uses consistent date formatting across server and client
 */

export function formatDateConsistent(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

export function formatTimeConsistent(date: Date | string): string {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatDateTimeConsistent(date: Date | string): string {
  const d = new Date(date)
  const dateStr = formatDateConsistent(d)
  const timeStr = formatTimeConsistent(d)
  return `${dateStr} at ${timeStr}`
}

/**
 * Format numbers for display (handles locale consistently)
 * Used for currency and large numbers
 */
export function formatNumberConsistent(num: number, decimals = 0): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format currency for display
 */
export function formatCurrencyConsistent(num: number, symbol = '$'): string {
  return `${symbol}${formatNumberConsistent(num, 2)}`
}
