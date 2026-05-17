import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usd } from "@/lib/format";
import { z } from "zod";

const orderSchema = z.object({
  link: z.string().url("Enter a valid URL"),
  quantity: z.number().int().positive(),
});

export default function NewOrderPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [platform, setPlatform] = useState<string>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<any | null>(null);
  const [link, setLink] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("platform");
      if (error) throw error;
      return data ?? [];
    },
  });

  const platforms = useMemo(() => ["All", ...Array.from(new Set((services ?? []).map((s: any) => s.platform)))], [services]);
  const filtered = useMemo(() => {
    return (services ?? []).filter((s: any) => (platform === "All" || s.platform === platform) && (q === "" || s.name.toLowerCase().includes(q.toLowerCase())));
  }, [services, platform, q]);

  const open = (svc: any) => { setActive(svc); setQty(svc.min_quantity); setLink(""); };
  const close = () => setActive(null);

  const total = active ? Number(active.price_per_unit) * (qty || 0) : 0;
  const insufficient = total > Number(profile?.wallet_balance ?? 0);

  const submit = async () => {
    if (!active || !user) return;
    const parse = orderSchema.safeParse({ link, quantity: qty });
    if (!parse.success) return toast.error(parse.error.issues[0].message);
    if (qty < active.min_quantity || qty > active.max_quantity) return toast.error(`Quantity must be between ${active.min_quantity} and ${active.max_quantity}`);
    if (insufficient) return toast.error("Insufficient wallet balance — please add funds.");
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id, service_id: active.id, quantity: qty, total_price: total, link, status: "pending",
    });
    if (error) { setSubmitting(false); return toast.error(error.message); }
    // Deduct from wallet
    const newBal = Number(profile?.wallet_balance ?? 0) - total;
    await supabase.from("profiles").update({ wallet_balance: newBal }).eq("id", user.id);
    await supabase.from("transactions").insert({ user_id: user.id, type: "order", amount: -total, status: "completed", reference: active.name });
    setSubmitting(false);
    toast.success("Order placed!");
    refreshProfile();
    qc.invalidateQueries({ queryKey: ["recent-orders"] });
    qc.invalidateQueries({ queryKey: ["orders"] });
    navigate("/dashboard/orders");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">New order</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick a service, enter your link, and we'll start delivery.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button key={p} onClick={() => setPlatform(p)} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${platform === p ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{p}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No services match your filters.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s: any) => (
            <button key={s.id} onClick={() => open(s)} className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-medium text-primary">{s.platform}</div>
                <div className="text-xs text-muted-foreground">{s.category}</div>
              </div>
              <h3 className="font-semibold mt-2 line-clamp-2">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex items-end justify-between">
                <div><div className="text-xs text-muted-foreground">per unit</div><div className="font-bold">{usd(s.price_per_unit)}</div></div>
                <div className="text-xs text-muted-foreground text-right">min {s.min_quantity}<br />max {s.max_quantity}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && close()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle>{active.name}</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-6">
                <p className="text-sm text-muted-foreground">{active.description}</p>
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input id="link" placeholder="https://instagram.com/yourpost" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="qty">Quantity (min {active.min_quantity} · max {active.max_quantity})</Label>
                  <Input id="qty" type="number" value={qty || ""} min={active.min_quantity} max={active.max_quantity} onChange={(e) => setQty(parseInt(e.target.value) || 0)} />
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Unit price</span><span>{usd(active.price_per_unit)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Wallet balance</span><span>{usd(profile?.wallet_balance ?? 0)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border mt-2"><span>Total</span><span>{usd(total)}</span></div>
                </div>
                {insufficient && <div className="text-xs text-destructive">Insufficient balance. Add funds first.</div>}
                <Button onClick={submit} className="w-full" disabled={submitting || insufficient || !link || !qty}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Place order
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
