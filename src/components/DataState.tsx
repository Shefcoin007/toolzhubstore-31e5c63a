import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Loading data" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 px-6 py-16">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while fetching data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Request failed</p>
        <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry request
        </Button>
      )}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="h-14 animate-pulse rounded-md border border-border bg-card/50" />
  );
}