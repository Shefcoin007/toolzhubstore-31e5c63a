import { Outlet, NavLink, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Plus, Wallet, User, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { to: "/dashboard", label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/dashboard/orders", label: "Orders", Icon: ShoppingBag },
  { to: "/dashboard/new-order", label: "New Order", Icon: Plus },
  { to: "/dashboard/funds", label: "Add Funds", Icon: Wallet },
  { to: "/dashboard/profile", label: "Profile", Icon: User },
];

export default function DashboardLayout() {
  const { signOut, isAdmin } = useAuth();
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen border-r border-border bg-card/40 flex md:flex-col">
        <div className="p-5 border-b border-border md:border-b">
          <Logo />
        </div>
        <nav className="flex md:flex-col gap-1 p-3 flex-1 overflow-x-auto md:overflow-visible">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`
              }
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="p-3 border-t border-border hidden md:block">
          <Button variant="outline" className="w-full gap-2" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
          <Link to="/" className="block text-center text-xs text-muted-foreground mt-3 hover:text-foreground">
            Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
