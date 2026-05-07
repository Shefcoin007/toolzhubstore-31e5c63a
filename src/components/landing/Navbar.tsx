import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeOptions={{ exact: l.to === "/" }} activeProps={{ className: "text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link to="/dashboard"><Button>Dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button>Get Started</Button></Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">{l.label}</Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border mt-2">
              {user ? (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full">Dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1"><Button variant="ghost" className="w-full">Login</Button></Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
