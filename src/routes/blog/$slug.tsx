import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({ meta: [{ title: "Post — ToolzHub" }] }),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> All posts</Link>
        {isLoading ? (
          <><Skeleton className="h-10 w-3/4 mb-4" /><Skeleton className="h-64 w-full" /></>
        ) : post ? (
          <article>
            <div className="text-xs font-medium text-primary">{post.category}</div>
            <h1 className="text-4xl font-extrabold tracking-tight mt-2">{post.title}</h1>
            <div className="text-sm text-muted-foreground mt-3">{fmtDate(post.created_at)}</div>
            <div className="aspect-video rounded-2xl bg-[image:var(--gradient-primary)] opacity-80 my-8" />
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90">{post.content}</div>
          </article>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
