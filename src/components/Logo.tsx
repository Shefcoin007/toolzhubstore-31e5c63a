import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const txt = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`relative flex ${sz} items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]`}>
        <Zap className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.8} fill="currentColor" />
      </div>
      <span className={`font-extrabold tracking-tight ${txt}`}>
        Toolz<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}
