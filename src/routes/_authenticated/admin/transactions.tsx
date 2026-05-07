import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { usd, fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/transactions")({ component: AdminTx });

function AdminTx() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-tx"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*, profiles(username, wallet_balance)").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const approve = async (t: any) => {
    if (t.type !== "deposit" || t.status !== "pending") return;
    const newBal = Number(t.profiles?.wallet_balance ?? 0) + Number(t.amount);
    const a = await supabase.from("profiles").update({ wallet_balance: newBal }).eq("id", t.user_id);
    const b = await supabase.from("transactions").update({ status: "completed" }).eq("id", t.id);
    if (a.error || b.error) return toast.error("Approval failed");
    toast.success("Deposit approved");
    qc.invalidateQueries({ queryKey: ["admin-tx"] });
  };

  if (isLoading) return <Skeleton className="h-64" />;
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="text-left p-3">User</th><th className="text-left p-3">Type</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th /></tr></thead>
        <tbody>
          {(data ?? []).map((t: any) => (
            <tr key={t.id} className="border-b border-border last:border-0">
              <td className="p-3">{t.profiles?.username ?? "—"}</td>
              <td className="p-3 capitalize">{t.type}</td>
              <td className={`p-3 font-medium ${t.amount < 0 ? "text-destructive" : "text-success"}`}>{t.amount < 0 ? "-" : "+"}{usd(Math.abs(t.amount))}</td>
              <td className="p-3"><StatusBadge status={t.status} /></td>
              <td className="p-3 text-muted-foreground">{fmtDate(t.created_at)}</td>
              <td className="p-3">{t.type === "deposit" && t.status === "pending" && <Button size="sm" onClick={() => approve(t)}>Approve</Button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
