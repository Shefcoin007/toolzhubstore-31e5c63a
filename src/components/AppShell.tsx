import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Store, UserCog, Zap } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/storefront", label: "Storefront", icon: Store, exact: false },
  { to: "/profile", label: "Profile", icon: UserCog, exact: false },
] as const;

export function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[15px] font-bold tracking-tight">SHEFCON</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">v1.0 · ops</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? location.pathname === to : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {active && (
                    <span className="absolute -bottom-[17px] left-1/2 h-[2px] w-8 -translate-x-1/2 bg-primary shadow-[var(--shadow-glow)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">all systems operational</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-primary)] ring-2 ring-border" />
          </div>
        </div>

        <nav className="flex border-t border-border md:hidden">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>© 2026 SHEFCON · ops platform</span>
          <span>node-east-3 · 14ms</span>
        </div>
      </footer>
    </div>
  );
}