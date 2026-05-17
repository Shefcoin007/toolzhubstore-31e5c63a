import { Routes, Route, Link } from "react-router-dom";

import Landing from "@/pages/index";
import ServicesPage from "@/pages/services";
import PricingPage from "@/pages/pricing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

import BlogIndex from "@/pages/blog/index";
import PostPage from "@/pages/blog/slug";

import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";

import DashboardLayout from "@/pages/dashboard/_layout";
import DashboardHome from "@/pages/dashboard/index";
import DashOrders from "@/pages/dashboard/orders";
import DashNewOrder from "@/pages/dashboard/new-order";
import DashFunds from "@/pages/dashboard/funds";
import DashProfile from "@/pages/dashboard/profile";

import AdminLayout from "@/pages/admin/_layout";
import AdminIndex from "@/pages/admin/index";
import AdminServices from "@/pages/admin/services";
import AdminOrders from "@/pages/admin/orders";
import AdminUsers from "@/pages/admin/users";
import AdminBlog from "@/pages/admin/blog";
import AdminTransactions from "@/pages/admin/transactions";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<PostPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<DashOrders />} />
          <Route path="new-order" element={<DashNewOrder />} />
          <Route path="funds" element={<DashFunds />} />
          <Route path="profile" element={<DashProfile />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminIndex />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
