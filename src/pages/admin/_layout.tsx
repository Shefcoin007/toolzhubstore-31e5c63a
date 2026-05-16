import { Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
const TABS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/transactions", label: "Transactions" },
];

export default function AdminLayout() {
  const loc = useLocation();
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the ToolzHub platform.</p>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => {
          const active = t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to);
          return <Link key={t.to} to={t.to} className={`rounded-md px-3 py-1.5 text-sm font-medium ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{t.label}</Link>;
        })}
      </div>
      <Outlet />
    </div>
  );
}
