/**
 * Pricing Middleware
 * Single source of truth for converting hidden Base Price → displayed Retail Price.
 * Retail = Base * MARKUP (default 1.15 → 15% margin).
 */
export const PRICING_MARKUP = 1.15;

export function toRetail(basePrice: number, markup: number = PRICING_MARKUP): number {
  return Math.round(basePrice * markup * 100) / 100;
}

export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}