import { cn } from "@/lib/utils";
const map: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-accent/15 text-accent border-accent/30",
  processing: "bg-accent/15 text-accent border-accent/30",
  completed: "bg-success/15 text-success border-success/30",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};
export function StatusBadge({ status }: { status: string }) {
  const s = (status || "pending").toLowerCase();
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", map[s] || map.pending)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.replace("_", " ")}
    </span>
  );
}
