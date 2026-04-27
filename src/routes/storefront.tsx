import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingCart, Clock, Package } from "lucide-react";
import { fetchServices, type Service } from "@/lib/services-api";
import { useAsync } from "@/hooks/use-async";
import { LoadingState, ErrorState } from "@/components/DataState";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/storefront")({
  head: () => ({
    meta: [
      { title: "Storefront — Shefcon" },
      { name: "description", content: "Browse Shefcon's catalog of digital services with filterable categories." },
    ],
  }),
  component: StorefrontPage,
});

function StorefrontPage() {
  const { state, retry } = useAsync(() => fetchServices(), []);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const services = state.status === "success" ? state.data : [];
  const categories = useMemo(() => ["All", ...Array.from(new Set(services.map((s) => s.category)))], [services]);
  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [services, activeCategory, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">// storefront</span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Service catalog</h1>
        <p className="text-sm text-muted-foreground">Industrial-grade providers, transparent retail pricing, instant routing.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-9 bg-card border-border"
          />
        </div>

        {state.status === "success" && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {state.status === "loading" && <LoadingState label="Loading catalog" />}
      {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
      {state.status === "success" && (
        <>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card/40 py-16 text-center text-sm text-muted-foreground">
              No services match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((svc) => <ServiceCard key={svc.id} service={svc} />)}
            </div>
          )}
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {filtered.length} of {services.length} services
          </p>
        </>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{service.category}</span>
          <h3 className="text-sm font-semibold leading-tight text-foreground">{service.name}</h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{service.id}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{service.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-muted-foreground">{service.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1.5">
          <Package className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-muted-foreground">min {service.minOrder.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">per {service.unit}</div>
          <div className="text-xl font-bold tracking-tight text-primary">{formatPrice(service.retailPrice)}</div>
        </div>
        <Button size="sm" className="gap-1.5">
          <ShoppingCart className="h-3.5 w-3.5" />
          Order
        </Button>
      </div>
    </div>
  );
}