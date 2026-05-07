import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Blog — ToolzHub" }, { name: "description", content: "SMM tips, log updates, marketing tutorials and growth strategies." }] }),
  component: BlogIndex,
});

const CATS = ["All", "SMM Tips", "Log Updates", "Marketing", "Tutorials"];

function BlogIndex() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => (data ?? []).filter((p: any) => (cat === "All" || p.category === cat) && (q === "" || p.title.toLowerCase().includes(q.toLowerCase()))), [data, cat, q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ToolzHub Blog</h1>
          <p className="text-muted-foreground mt-3">SMM tips, log updates, and growth strategies.</p>
        </div>

        <div className="max-w-md mx-auto relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1.5 text-sm font-medium ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{c}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-5">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No posts found.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map((p: any) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
                <div className="aspect-video bg-[image:var(--gradient-primary)] opacity-80" />
                <div className="p-5">
                  <div className="text-xs font-medium text-primary">{p.category}</div>
                  <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
                  <div className="text-xs text-muted-foreground mt-4">{fmtDate(p.created_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
