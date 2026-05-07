import { createFileRoute, redirect, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, ShoppingCart, Package, Wallet, UserCog, Newspaper, LogOut, Menu, X, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { usd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: AuthedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/dashboard/new-order", label: "New Order", Icon: ShoppingCart },
  { to: "/dashboard/orders", label: "My Orders", Icon: Package },
  { to: "/dashboard/funds", label: "Add Funds", Icon: Wallet },
  { to: "/dashboard/profile", label: "Profile", Icon: UserCog },
  { to: "/blog", label: "Blog", Icon: Newspaper },
];

function AuthedLayout() {
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const isActive = (to: string, exact?: boolean) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/40 sticky top-0 h-screen">
        <div className="p-5 border-b border-border"><Logo /></div>
        <div className="p-4 border-b border-border">
          <div className="text-xs text-muted-foreground">Wallet balance</div>
          <div className="text-2xl font-extrabold mt-1">{usd(profile?.wallet_balance)}</div>
          <Link to="/dashboard/funds"><Button size="sm" className="w-full mt-3">Add Funds</Button></Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, Icon, exact }) => (
            <Link key={to} to={to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(to, exact) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${location.pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
          <Logo />
          <button onClick={() => setOpen(true)} aria-label="Menu"><Menu className="h-6 w-6" /></button>
        </header>

        {open && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="text-xs text-muted-foreground">Wallet balance</div>
              <div className="text-2xl font-extrabold">{usd(profile?.wallet_balance)}</div>
            </div>
            <nav className="flex flex-col p-3 space-y-1">
              {NAV.map(({ to, label, Icon, exact }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(to, exact) ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}><Icon className="h-4 w-4" /> {label}</Link>
              ))}
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"><Shield className="h-4 w-4" /> Admin</Link>}
              <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary text-left"><LogOut className="h-4 w-4" /> Logout</button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl flex">
          {NAV.slice(0, 5).map(({ to, label, Icon, exact }) => (
            <Link key={to} to={to} className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${isActive(to, exact) ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-4 w-4" /> {label.split(" ")[0]}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
