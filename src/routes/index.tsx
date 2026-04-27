import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Wallet, Package, TrendingUp } from "lucide-react";
import { fetchRecentOrders, fetchStats, type Order } from "@/lib/services-api";
import { useAsync } from "@/hooks/use-async";
import { LoadingState, ErrorState } from "@/components/DataState";
import { formatPrice } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Shefcon" },
      { name: "description", content: "Account balance, active orders, and 30-day spend overview." },
    ],
  }),
  component: Index,
});

function Index() {
  const stats = useAsync(() => import("@/lib/services-api").then((m) => m.fetchStats()), []);
  const orders = useAsync(() => fetchRecentOrders(), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">// dashboard</span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Operations overview</h1>
        <p className="text-sm text-muted-foreground">Real-time signals from your account, orders, and provider network.</p>
      </div>

      {/* Stats */}
      {stats.state.status === "loading" && <LoadingState label="Syncing balance" />}
      {stats.state.status === "error" && <ErrorState message={stats.state.error} onRetry={stats.retry} />}
      {stats.state.status === "success" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Account balance" value={formatPrice(stats.state.data.balance)} hint="USD · available" accent />
          <StatCard icon={TrendingUp} label="Spent · 30d" value={formatPrice(stats.state.data.spent30d)} hint="+12.4% vs prev." />
          <StatCard icon={Package} label="Orders total" value={String(stats.state.data.ordersTotal)} hint="lifetime" />
          <StatCard icon={Activity} label="Active orders" value={String(stats.state.data.ordersActive)} hint="processing now" />
        </div>
      )}

      {/* Recent orders */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <p className="text-xs text-muted-foreground">Last 5 transactions on your account.</p>
          </div>
          <Link to="/storefront" className="group flex items-center gap-1 font-mono text-xs text-primary hover:opacity-80">
            new order <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {orders.state.status === "loading" && <LoadingState label="Fetching orders" />}
        {orders.state.status === "error" && <ErrorState message={orders.state.error} onRetry={orders.retry} />}
        {orders.state.status === "success" && <OrdersTable orders={orders.state.data} />}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-lg border border-border bg-[image:var(--gradient-surface)] p-5 transition-colors hover:border-primary/40 ${accent ? "ring-1 ring-primary/30" : ""}`}>
      {accent && <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />}
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className="relative mt-4 text-2xl font-bold tracking-tight">{value}</p>
      <p className="relative mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead className="bg-secondary/40">
          <tr className="text-left font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Service</th>
            <th className="hidden px-4 py-3 sm:table-cell">Qty</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="text-sm transition-colors hover:bg-secondary/30">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
              <td className="px-4 py-3 font-medium">{o.serviceName}</td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{o.quantity.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-mono">{formatPrice(o.total)}</td>
              <td className="px-4 py-3 text-right"><StatusPill status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], string> = {
    completed: "bg-success/15 text-success border-success/30",
    processing: "bg-accent/15 text-accent border-accent/30",
    pending: "bg-muted text-muted-foreground border-border",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${map[status]}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
