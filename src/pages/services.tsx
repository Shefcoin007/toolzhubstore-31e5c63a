import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usd } from "@/lib/format";

export default function ServicesPage() {
  const [platform, setPlatform] = useState("All");
  const { data, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true);
      if (error) throw error;
      return data ?? [];
    },
  });

  const platforms = useMemo(() => ["All", ...Array.from(new Set((data ?? []).map((s: any) => s.platform)))], [data]);
  const filtered = (data ?? []).filter((s: any) => platform === "All" || s.platform === platform);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">All services</h1>
          <p className="text-muted-foreground mt-3">Wholesale SMM rates. No subscription required.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {platforms.map((p) => (
            <button key={p} onClick={() => setPlatform(p)} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${platform === p ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{p}</button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s: any) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex justify-between gap-2"><div className="text-xs font-medium text-primary">{s.platform}</div><div className="text-xs text-muted-foreground">{s.category}</div></div>
                <h3 className="font-semibold mt-2">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{s.description}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div><div className="text-xs text-muted-foreground">per unit</div><div className="font-bold">{usd(s.price_per_unit)}</div></div>
                  <Link to="/register"><Button size="sm">Order</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
