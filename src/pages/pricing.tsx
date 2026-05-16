import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

,
  component: PricingPage,
});

const tiers = [
  { name: "Starter", price: "Free", desc: "Pay-as-you-go.", popular: false, features: ["Access to all services", "Standard delivery", "Email support"] },
  { name: "Pro", price: "$9.99/mo", desc: "For active resellers.", popular: true, features: ["10% off all orders", "Priority delivery", "Live chat support", "API access"] },
  { name: "Agency", price: "$29.99/mo", desc: "For high-volume agencies.", popular: false, features: ["20% off all orders", "Dedicated manager", "White-label options", "24/7 priority support"] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Plans for every stage</h1>
          <p className="text-muted-foreground mt-3">Start free, upgrade when it makes sense.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-2xl border p-6 ${t.popular ? "border-primary bg-card shadow-[var(--shadow-glow)]" : "border-border bg-card"}`}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">MOST POPULAR</div>}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-2 text-4xl font-extrabold">{t.price}</div>
              <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
              <ul className="mt-6 space-y-2.5">{t.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}</li>)}</ul>
              <Link to="/register" className="mt-6 block"><Button className="w-full" variant={t.popular ? "default" : "outline"}>Get started</Button></Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
