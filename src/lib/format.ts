export const usd = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(n ?? 0));

// Approximate static USD -> NGN rate. Update as needed.
export const USD_TO_NGN = 1600;
export const ngn = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(n ?? 0) * USD_TO_NGN);

export const num = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US").format(Number(n ?? 0));
export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
