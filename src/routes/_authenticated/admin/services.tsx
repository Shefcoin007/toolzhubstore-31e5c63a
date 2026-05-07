import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: AdminServices });

function AdminServices() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", platform: "Instagram", description: "", price_per_unit: 0.01, min_quantity: 100, max_quantity: 10000 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from("services").update({ is_active: !is_active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
  };
  const del = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
  };
  const create = async () => {
    const { error } = await supabase.from("services").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Service added");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New service</Button></div>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="text-left p-3">Name</th><th className="text-left p-3">Platform</th><th className="text-left p-3">Price</th><th className="text-left p-3">Active</th><th className="p-3" /></tr></thead>
            <tbody>
              {(data ?? []).map((s: any) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.platform}</td>
                  <td className="p-3">{usd(s.price_per_unit)}</td>
                  <td className="p-3"><button onClick={() => toggle(s.id, s.is_active)} className={`text-xs px-2 py-1 rounded ${s.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{s.is_active ? "Active" : "Inactive"}</button></td>
                  <td className="p-3"><button onClick={() => del(s.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>New service</SheetTitle></SheetHeader>
          <div className="space-y-3 mt-6">
            {(["name", "category", "platform", "description"] as const).map((k) => (
              <div key={k}><Label className="capitalize">{k}</Label><Input value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Price</Label><Input type="number" step="0.0001" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: Number(e.target.value) })} /></div>
              <div><Label>Min</Label><Input type="number" value={form.min_quantity} onChange={(e) => setForm({ ...form, min_quantity: Number(e.target.value) })} /></div>
              <div><Label>Max</Label><Input type="number" value={form.max_quantity} onChange={(e) => setForm({ ...form, max_quantity: Number(e.target.value) })} /></div>
            </div>
            <Button className="w-full" onClick={create}>Create</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
