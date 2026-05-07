import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { usd, fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/orders")({
  head: () => ({ meta: [{ title: "My Orders — ToolzHub" }] }),
  component: OrdersPage,
});

const STATUSES = ["all", "pending", "in_progress", "completed", "failed", "cancelled"];

function OrdersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const PER = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id, quantity, total_price, status, link, created_at, services(name, platform)").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Realtime
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("orders-rt").on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, () => {
      qc.invalidateQueries({ queryKey: ["orders", user.id] });
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((o: any) => (status === "all" || o.status === status) && (q === "" || o.id.includes(q) || o.link?.toLowerCase().includes(q.toLowerCase())));
  }, [data, status, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const slice = filtered.slice(page * PER, (page + 1) * PER);

  return (
    <div className="space-y-6 max-w-6xl">
      <div><h1 className="text-2xl font-extrabold tracking-tight">My orders</h1></div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order ID or link…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize">
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : slice.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No orders to show.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-left p-4 font-medium">Link</th>
                  <th className="text-left p-4 font-medium">Qty</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((o: any) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="p-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="p-4"><div className="font-medium">{o.services?.name ?? "—"}</div><div className="text-xs text-muted-foreground">{o.services?.platform}</div></td>
                    <td className="p-4 max-w-[200px] truncate text-muted-foreground">{o.link}</td>
                    <td className="p-4">{o.quantity}</td>
                    <td className="p-4 font-medium">{usd(o.total_price)}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                    <td className="p-4 text-muted-foreground">{fmtDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
