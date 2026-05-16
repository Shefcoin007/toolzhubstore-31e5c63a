import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { usd } from "@/lib/format";

export default function Overview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [u, o, t] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_price"),
        supabase.from("transactions").select("amount,created_at,type"),
      ]);
      const orders = o.data ?? [];
      const tx = t.data ?? [];
      const today = new Date(); today.setHours(0,0,0,0);
      const todayRev = tx.filter((x: any) => x.type === "deposit" && new Date(x.created_at) >= today).reduce((a, x: any) => a + Number(x.amount), 0);
      return {
        users: u.count ?? 0,
        orders: orders.length,
        revenue: orders.reduce((a, x: any) => a + Number(x.total_price), 0),
        revenueToday: todayRev,
      };
    },
  });
  const cards = [
    { label: "Total users", value: data?.users ?? 0 },
    { label: "Total orders", value: data?.orders ?? 0 },
    { label: "Total revenue", value: usd(data?.revenue ?? 0) },
    { label: "Revenue today", value: usd(data?.revenueToday ?? 0) },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">{c.label}</div>
          {isLoading ? <Skeleton className="h-8 w-20 mt-2" /> : <div className="text-2xl font-bold mt-2">{c.value}</div>}
        </div>
      ))}
    </div>
  );
}
