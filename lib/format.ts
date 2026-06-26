/**
 * Fractio — INR Currency & Number Formatting Utilities
 *
 * All monetary values use the Indian numbering system:
 *   1,00,000 (1 lakh) instead of 100,000
 *   1,00,00,000 (1 crore) instead of 10,000,000
 *
 * Uses the 'en-IN' locale with INR currency for Intl.NumberFormat.
 */

/**
 * Format a number as INR in the Indian numbering system.
 * Examples:
 *   formatINR(1205000)   → "₹12,05,000"
 *   formatINR(100000000) → "₹10,00,00,000"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as INR with decimals (for per-unit prices).
 * Examples:
 *   formatINRDecimal(15234.50) → "₹15,234.50"
 */
export function formatINRDecimal(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a large value in Crores for display.
 * Examples:
 *   formatCrore(1750000000) → "₹175 Cr"
 *   formatCrore(500000000)  → "₹50 Cr"
 */
export function formatCrore(amount: number): string {
  const crores = amount / 10000000;
  if (crores >= 100) {
    return `₹${Math.round(crores)} Cr`;
  }
  return `₹${crores.toFixed(1)} Cr`;
}

/**
 * Format a percentage with sign and color hint.
 * Examples:
 *   formatPercent(8.5)   → "+8.50%"
 *   formatPercent(-2.3)  → "-2.30%"
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a number with Indian comma separators (no currency symbol).
 * Examples:
 *   formatNumber(1205000) → "12,05,000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Determine the CSS class for a P&L value.
 */
export function plColor(value: number): string {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-slate-500";
}
