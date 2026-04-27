import { toRetail } from "./pricing";

export type RawService = {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  unit: string;
  minOrder: number;
  maxOrder: number;
  deliveryTime: string;
};

export type Service = RawService & {
  retailPrice: number;
};

/** Mock dataset — replace `fetchServices` body with a real API call later. */
const MOCK_SERVICES: RawService[] = [
  { id: "srv_001", name: "Instagram Followers — HQ", description: "Real-looking high quality followers, drip-feed enabled.", category: "Instagram", basePrice: 2.5, unit: "1k", minOrder: 100, maxOrder: 500000, deliveryTime: "0–6h" },
  { id: "srv_002", name: "Instagram Likes — Instant", description: "Instant delivery, non-drop, server-balanced.", category: "Instagram", basePrice: 0.8, unit: "1k", minOrder: 50, maxOrder: 100000, deliveryTime: "0–1h" },
  { id: "srv_003", name: "TikTok Views — Worldwide", description: "Global views with smart geo-distribution.", category: "TikTok", basePrice: 0.3, unit: "1k", minOrder: 1000, maxOrder: 10000000, deliveryTime: "0–2h" },
  { id: "srv_004", name: "TikTok Followers — Premium", description: "Premium TikTok followers with profile activity.", category: "TikTok", basePrice: 4.2, unit: "1k", minOrder: 50, maxOrder: 200000, deliveryTime: "1–12h" },
  { id: "srv_005", name: "YouTube Views — Monetizable", description: "Adsense-safe YouTube views with retention.", category: "YouTube", basePrice: 1.9, unit: "1k", minOrder: 500, maxOrder: 1000000, deliveryTime: "12–48h" },
  { id: "srv_006", name: "YouTube Subscribers — Lifetime", description: "Real channel subscribers with refill guarantee.", category: "YouTube", basePrice: 9.5, unit: "1k", minOrder: 50, maxOrder: 50000, deliveryTime: "1–7d" },
  { id: "srv_007", name: "Twitter / X Followers", description: "Active X followers with profile pictures.", category: "Twitter", basePrice: 5.0, unit: "1k", minOrder: 100, maxOrder: 100000, deliveryTime: "0–24h" },
  { id: "srv_008", name: "Telegram Members — Real", description: "Real Telegram channel members, non-bot.", category: "Telegram", basePrice: 3.4, unit: "1k", minOrder: 100, maxOrder: 200000, deliveryTime: "0–6h" },
  { id: "srv_009", name: "Spotify Plays — Premium", description: "Premium Spotify plays counted toward royalties.", category: "Spotify", basePrice: 1.2, unit: "1k", minOrder: 1000, maxOrder: 5000000, deliveryTime: "0–24h" },
  { id: "srv_010", name: "SEO Traffic — Targeted", description: "Geo & keyword targeted website traffic.", category: "SEO", basePrice: 0.6, unit: "1k", minOrder: 1000, maxOrder: 1000000, deliveryTime: "0–12h" },
  { id: "srv_011", name: "Discord Members — Online", description: "Online Discord members with role assignment.", category: "Discord", basePrice: 6.0, unit: "1k", minOrder: 50, maxOrder: 50000, deliveryTime: "0–24h" },
  { id: "srv_012", name: "Facebook Page Likes", description: "Worldwide Facebook page likes, non-drop.", category: "Facebook", basePrice: 3.1, unit: "1k", minOrder: 100, maxOrder: 100000, deliveryTime: "0–24h" },
];

/** Apply pricing middleware to every service. */
function withRetail(rows: RawService[]): Service[] {
  return rows.map((s) => ({ ...s, retailPrice: toRetail(s.basePrice) }));
}

/**
 * Fetch services. Currently returns mock data with a simulated delay.
 * Replace the body with a real `fetch()` to wire an external API.
 */
export async function fetchServices(): Promise<Service[]> {
  await new Promise((r) => setTimeout(r, 600));
  // Uncomment to test the error state:
  // throw new Error("Service catalog unavailable");
  return withRetail(MOCK_SERVICES);
}

export type Order = {
  id: string;
  serviceName: string;
  quantity: number;
  total: number;
  status: "completed" | "processing" | "pending" | "failed";
  createdAt: string;
};

export async function fetchRecentOrders(): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 400));
  return [
    { id: "ORD-10421", serviceName: "Instagram Followers — HQ", quantity: 5000, total: 14.38, status: "completed", createdAt: "2026-04-26T09:14:00Z" },
    { id: "ORD-10420", serviceName: "TikTok Views — Worldwide", quantity: 50000, total: 17.25, status: "processing", createdAt: "2026-04-26T08:02:00Z" },
    { id: "ORD-10419", serviceName: "YouTube Subscribers — Lifetime", quantity: 200, total: 2.18, status: "pending", createdAt: "2026-04-25T22:41:00Z" },
    { id: "ORD-10418", serviceName: "Spotify Plays — Premium", quantity: 25000, total: 34.50, status: "completed", createdAt: "2026-04-25T14:05:00Z" },
    { id: "ORD-10417", serviceName: "Telegram Members — Real", quantity: 1000, total: 3.91, status: "failed", createdAt: "2026-04-24T11:33:00Z" },
  ];
}

export type DashboardStats = {
  balance: number;
  spent30d: number;
  ordersTotal: number;
  ordersActive: number;
};

export async function fetchStats(): Promise<DashboardStats> {
  await new Promise((r) => setTimeout(r, 300));
  return { balance: 248.42, spent30d: 1284.10, ordersTotal: 217, ordersActive: 6 };
}