import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { usd, fmtDate } from "@/lib/format";

const STATUSES = ["pending", "in_progress", "completed", "failed", "cancelled"];

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, services(name, platform), profiles(username)").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };
  if (isLoading) return <Skeleton className="h-64" />;
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground"><tr className="border-b border-border">
          <th className="text-left p-3">User</th><th className="text-left p-3">Service</th><th className="text-left p-3">Qty</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th>
        </tr></thead>
        <tbody>
          {(data ?? []).map((o: any) => (
            <tr key={o.id} className="border-b border-border last:border-0">
              <td className="p-3">{o.profiles?.username ?? "—"}</td>
              <td className="p-3"><div className="font-medium">{o.services?.name}</div><div className="text-xs text-muted-foreground">{o.services?.platform}</div></td>
              <td className="p-3">{o.quantity}</td>
              <td className="p-3 font-medium">{usd(o.total_price)}</td>
              <td className="p-3"><div className="flex items-center gap-2"><StatusBadge status={o.status} /><select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="h-7 rounded border border-input bg-transparent text-xs px-1">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div></td>
              <td className="p-3 text-muted-foreground">{fmtDate(o.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
