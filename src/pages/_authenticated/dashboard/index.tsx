import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, CheckCircle2, DollarSign, Plus, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { usd, fmtDate } from "@/lib/format";

,
  component: DashboardHome,
});

export default function DashboardHome() {
  const { user, profile } = useAuth();

  const { data: stats, isLoading: l1 } = useQuery({
    queryKey: ["stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("status,total_price").eq("user_id", user!.id);
      const rows = data ?? [];
      return {
        total: rows.length,
        pending: rows.filter((r) => r.status === "pending" || r.status === "in_progress").length,
        completed: rows.filter((r) => r.status === "completed").length,
        spent: rows.reduce((a, r) => a + Number(r.total_price), 0),
      };
    },
  });

  const { data: recent, isLoading: l2 } = useQuery({
    queryKey: ["recent-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, quantity, total_price, status, created_at, link, services(name, platform)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  const cards = [
    { Icon: Package, label: "Total Orders", value: stats?.total ?? 0 },
    { Icon: Clock, label: "Pending", value: stats?.pending ?? 0 },
    { Icon: CheckCircle2, label: "Completed", value: stats?.completed ?? 0 },
    { Icon: DollarSign, label: "Total Spent", value: usd(stats?.spent ?? 0) },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {profile?.username ?? "operator"} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Wallet balance</p>
          <div className="text-3xl md:text-4xl font-extrabold mt-1">{usd(profile?.wallet_balance ?? 0)}</div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/new-order"><Button className="gap-2"><Plus className="h-4 w-4" />Place Order</Button></Link>
          <Link to="/dashboard/funds"><Button variant="outline" className="gap-2"><Wallet className="h-4 w-4" />Add Funds</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{label}</div>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            {l1 ? <Skeleton className="h-8 w-20 mt-2" /> : <div className="text-2xl font-bold mt-2">{value}</div>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Recent orders</h2>
          <Link to="/dashboard/orders" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        {l2 ? (
          <div className="p-5 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : recent && recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-left p-4 font-medium">Qty</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o: any) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="p-4"><div className="font-medium">{o.services?.name ?? "—"}</div><div className="text-xs text-muted-foreground">{o.services?.platform}</div></td>
                    <td className="p-4">{o.quantity}</td>
                    <td className="p-4 font-medium">{usd(o.total_price)}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                    <td className="p-4 text-muted-foreground">{fmtDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet. Ready to place your first one?</p>
            <Link to="/dashboard/new-order"><Button className="mt-4">Place an order</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
