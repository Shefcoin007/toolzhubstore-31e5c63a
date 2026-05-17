import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Copy, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usd, ngn, USD_TO_NGN, fmtDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const PRESETS = [5, 10, 25, 50, 100];

const BANK = {
  bankName: "Acme Bank",
  accountName: "ToolzHub Ltd",
  accountNumber: "0123456789",
  routing: "021000021",
  reference: "Use your username as reference",
};

const WHATSAPP_NUMBER = "1234567890"; // placeholder

export default function FundsPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [amount, setAmount] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);

  const { data: tx, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied"); };

  const requestFund = async () => {
    if (!user) return;
    if (amount <= 0) return toast.error("Enter a valid amount");
    setSubmitting(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id, type: "deposit", amount, status: "pending",
      reference: `Deposit request — awaiting confirmation`,
      metadata: { method: "manual_bank_transfer", username: profile?.username },
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Request logged. Now message us on WhatsApp with proof of payment.");
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };

  const waMsg = encodeURIComponent(`Hi ToolzHub support, I just funded $${amount} for username @${profile?.username ?? ""}. Sending proof of payment now.`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Add funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer to the account below, then message us on WhatsApp with proof.</p>
      </div>

      <div className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /> Wallet balance</div>
          <div className="text-3xl font-extrabold mt-1">{usd(profile?.wallet_balance ?? 0)}</div>
          <div className="text-sm text-muted-foreground mt-1">≈ {ngn(profile?.wallet_balance ?? 0)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">1. Choose amount</h2>
          <div className="grid grid-cols-5 gap-2">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setAmount(p)} className={`rounded-md border py-2 text-sm font-medium ${amount === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>${p}</button>
            ))}
          </div>
          <Input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value) || 0)} placeholder="Custom amount" />
          <div className="text-xs text-muted-foreground">
            {usd(amount)} <span className="opacity-60">·</span> ≈ {ngn(amount)} <span className="opacity-60">(rate ₦{USD_TO_NGN.toLocaleString()}/$)</span>
          </div>
          <Button className="w-full" onClick={requestFund} disabled={submitting || amount <= 0}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Log fund request
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-semibold">2. Send payment</h2>
          {Object.entries(BANK).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2 rounded-md bg-secondary/40 px-3 py-2 text-sm">
              <div><div className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</div><div className="font-medium">{v}</div></div>
              <button onClick={() => copy(v)} className="p-1.5 rounded hover:bg-background"><Copy className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full gap-2 border-success/40 text-success hover:bg-success/10"><MessageCircle className="h-4 w-4" /> Message support on WhatsApp</Button>
          </a>
          <p className="text-xs text-muted-foreground flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-success" /> Funds appear within 5-15 minutes after support confirms your transfer.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Recent transactions</h2></div>
        {isLoading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : tx && tx.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {tx.map((t: any) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="p-4 capitalize">{t.type}</td>
                    <td className={`p-4 font-medium ${t.amount < 0 ? "text-destructive" : "text-success"}`}>
                      <div>{t.amount < 0 ? "-" : "+"}{usd(Math.abs(t.amount))}</div>
                      <div className="text-xs text-muted-foreground font-normal">≈ {ngn(Math.abs(t.amount))}</div>
                    </td>
                    <td className="p-4"><StatusBadge status={t.status} /></td>
                    <td className="p-4 text-muted-foreground">{fmtDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">No transactions yet.</div>
        )}
      </div>
    </div>
  );
}
