import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usd } from "@/lib/format";

export default function AdminUsers() {
  const qc = useQueryClient();
  const [edits, setEdits] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleMap = new Map<string, string>();
      (roles ?? []).forEach((r: any) => roleMap.set(r.user_id, r.role));
      return (profiles ?? []).map((p: any) => ({ ...p, role: roleMap.get(p.id) ?? "user" }));
    },
  });

  const setBalance = async (id: string) => {
    const v = Number(edits[id]);
    if (isNaN(v)) return toast.error("Invalid number");
    const { error } = await supabase.from("profiles").update({ wallet_balance: v }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Balance updated");
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const toggleAdmin = async (uid: string, isAdmin: boolean) => {
    if (isAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
    }
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  if (isLoading) return <Skeleton className="h-64" />;
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="text-left p-3">User</th><th className="text-left p-3">Email</th><th className="text-left p-3">Balance</th><th className="text-left p-3">Role</th></tr></thead>
        <tbody>
          {(data ?? []).map((u: any) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="p-3 font-medium">{u.username ?? "—"}</td>
              <td className="p-3 text-muted-foreground">{u.email}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{usd(u.wallet_balance)}</span>
                  <Input className="h-7 w-24" type="number" placeholder="set $" value={edits[u.id] ?? ""} onChange={(e) => setEdits({ ...edits, [u.id]: e.target.value })} />
                  <Button size="sm" variant="outline" onClick={() => setBalance(u.id)}>Save</Button>
                </div>
              </td>
              <td className="p-3"><button onClick={() => toggleAdmin(u.id, u.role === "admin")} className={`text-xs px-2 py-1 rounded ${u.role === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{u.role}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
