import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

export default function RequireAdmin() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
