import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Send, MessageCircle, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">Premium SMM panel, log upgrades, and digital tools — built for resellers, creators, and agencies.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">FAQ</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Twitter" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Telegram" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary"><Send className="h-4 w-4" /></a>
            <a href="#" aria-label="WhatsApp" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary"><MessageCircle className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary"><Instagram className="h-4 w-4" /></a>
          </div>
          <div className="flex gap-2 mt-5 text-[10px] font-mono text-muted-foreground">
            <span className="px-2 py-1 rounded border border-border">PAYSTACK</span>
            <span className="px-2 py-1 rounded border border-border">VISA</span>
            <span className="px-2 py-1 rounded border border-border">MASTERCARD</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground">© 2025 ToolzHub. All rights reserved.</div>
      </div>
    </footer>
  );
}
