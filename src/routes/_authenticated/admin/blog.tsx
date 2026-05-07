import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin/blog")({ component: AdminBlog });

function AdminBlog() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", category: "SMM Tips", excerpt: "", content: "", published: true });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const togglePub = async (id: string, published: boolean) => {
    await supabase.from("blog_posts").update({ published: !published }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };
  const create = async () => {
    const { error } = await supabase.from("blog_posts").insert({ ...form, author_id: user?.id ?? null });
    if (error) return toast.error(error.message);
    toast.success("Post created");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New post</Button></div>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="text-left p-3">Title</th><th className="text-left p-3">Category</th><th className="text-left p-3">Published</th><th /></tr></thead>
            <tbody>
              {(data ?? []).map((p: any) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3"><button onClick={() => togglePub(p.id, p.published)} className={`text-xs px-2 py-1 rounded ${p.published ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{p.published ? "Live" : "Draft"}</button></td>
                  <td className="p-3"><button onClick={() => del(p.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>New post</SheetTitle></SheetHeader>
          <div className="space-y-3 mt-6">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div><Label>Content (markdown)</Label><Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            <Button className="w-full" onClick={create}>Publish</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
