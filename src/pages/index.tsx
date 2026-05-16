import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Headphones, TrendingUp, Instagram, Youtube, Send, Facebook, Music2, Star, Check, UserPlus, Wallet, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Services />
        <Pricing />
        <WhyToolzHub />
        <Testimonials />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const platforms = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Music2, label: "TikTok" },
    { Icon: Youtube, label: "YouTube" },
    { Icon: Send, label: "Telegram" },
    { Icon: Facebook, label: "Facebook" },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          50,000+ orders delivered · Trusted globally
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Supercharge Your <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">Social Media</span> Growth
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Premium SMM services, log upgrades, and digital tools — trusted by thousands of resellers worldwide.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register"><Button size="lg" className="gap-2">Start Ordering <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/services"><Button size="lg" variant="outline">Explore Services</Button></Link>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            ["50K+", "Orders Delivered"],
            ["99.9%", "Uptime"],
            ["24/7", "Live Support"],
            ["⚡", "Instant Delivery"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card/40 backdrop-blur p-4">
              <div className="text-2xl font-bold">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {platforms.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { Icon: UserPlus, title: "Create Account", desc: "Sign up in seconds with Google or email — no credit card needed." },
    { Icon: Wallet, title: "Add Funds", desc: "Top up your wallet via secure mobile or bank transfer with WhatsApp support." },
    { Icon: ShoppingCart, title: "Place & Track", desc: "Choose a service, paste your link, and track orders in real-time." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground mt-3">From signup to delivery in three steps.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
            <div className="absolute -top-3 -left-3 h-8 w-8 grid place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">{i + 1}</div>
            <s.Icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const cats = [
    { name: "Instagram Growth", Icon: Instagram, desc: "Followers, likes, story views, reels boosts." },
    { name: "TikTok Boost", Icon: Music2, desc: "Followers, views, likes for the FYP." },
    { name: "YouTube Views", Icon: Youtube, desc: "Real retained views, subscribers, watch time." },
    { name: "Telegram Members", Icon: Send, desc: "Channel + group members, bot views." },
    { name: "Facebook Engagement", Icon: Facebook, desc: "Page likes, post engagement, followers." },
    { name: "Log Upgrades", Icon: Shield, desc: "Aged accounts, bio + email access." },
    { name: "Account Tools", Icon: Zap, desc: "Reseller toolkits, automation scripts." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20" id="services">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Services Built For Scale</h2>
        <p className="text-muted-foreground mt-3">Everything you need across every major platform.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((c) => (
          <div key={c.name} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="h-12 w-12 grid place-items-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <c.Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">{c.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
            <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4 hover:gap-2 transition-all">View Services <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "Free", desc: "Perfect for testing the platform", popular: false, features: ["Pay-as-you-go pricing", "Access to all services", "Email support", "Standard delivery speed"] },
    { name: "Pro", price: "$9.99", desc: "For active resellers", popular: true, features: ["10% discount on all orders", "Priority delivery", "Live chat support", "API access", "Bulk order tools"] },
    { name: "Agency", price: "$29.99", desc: "For agencies & high-volume", popular: false, features: ["20% discount on all orders", "Dedicated account manager", "Custom integrations", "White-label options", "24/7 priority support"] },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
        <p className="text-muted-foreground mt-3">Start free. Upgrade as you grow.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <div key={t.name} className={`relative rounded-2xl border p-6 ${t.popular ? "border-primary bg-card shadow-[var(--shadow-glow)]" : "border-border bg-card"}`}>
            {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">MOST POPULAR</div>}
            <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">{t.price}</span>
              {t.price !== "Free" && <span className="text-sm text-muted-foreground">/mo</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}</li>
              ))}
            </ul>
            <Link to="/register" className="mt-6 block"><Button className="w-full" variant={t.popular ? "default" : "outline"}>Get started</Button></Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyToolzHub() {
  const stats = [["50,000+", "Orders processed"], ["99.9%", "Uptime SLA"], ["15,000+", "Active users"], ["4.9/5", "Avg. rating"]];
  const features = [
    { Icon: Zap, t: "Instant delivery", d: "Most orders start within 60 seconds." },
    { Icon: Shield, t: "Secure payments", d: "Bank-grade encryption on every transaction." },
    { Icon: TrendingUp, t: "Reseller pricing", d: "Wholesale rates, infinite markup." },
    { Icon: Headphones, t: "24/7 live support", d: "Real humans on WhatsApp and Telegram." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-[image:var(--gradient-surface)] p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why ToolzHub</h2>
          <p className="text-muted-foreground mt-3">The trust layer for serious operators.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(([v, l]) => (
            <div key={l} className="text-center"><div className="text-3xl md:text-4xl font-extrabold text-primary">{v}</div><div className="text-xs text-muted-foreground mt-1">{l}</div></div>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-xl border border-border bg-card p-5">
              <f.Icon className="h-6 w-6 text-primary mb-3" />
              <div className="font-semibold">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Marcus T.", initial: "MT", service: "Instagram Growth", rating: 5, text: "Switched from 3 other panels — ToolzHub's speed and pricing are unmatched. My margins doubled." },
    { name: "Aisha K.", initial: "AK", service: "TikTok Boost", rating: 5, text: "Real engagement, fast delivery. My agency runs 200+ orders/day on ToolzHub." },
    { name: "Diego R.", initial: "DR", service: "Log Upgrades", rating: 5, text: "Aged logs are clean, no flags after 3 months. Best vendor I've used in years." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by resellers worldwide</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
            </div>
            <p className="text-sm">{t.text}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-full bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground">{t.initial}</div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.service}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogPreview() {
  const posts = [
    { slug: "grow-instagram-2026", title: "5 Proven Ways to Grow Your Instagram in 2026", category: "SMM Tips", excerpt: "A practical playbook for resellers and creators looking to scale Instagram safely.", date: "May 2026" },
    { slug: "log-upgrades-explained", title: "Log Upgrades Explained: When and Why", category: "Log Updates", excerpt: "Understand exactly what log upgrades are, when to use them, and how to stay safe.", date: "May 2026" },
    { slug: "smm-reselling-business", title: "How to Build a Profitable SMM Reselling Business", category: "Marketing", excerpt: "A step-by-step business model breakdown — from sourcing to first 100 customers.", date: "Apr 2026" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">From the blog</h2>
          <p className="text-muted-foreground mt-2">SMM tips, log updates, and growth strategies.</p>
        </div>
        <Link to="/blog" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">All posts <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
            <div className="aspect-video bg-[image:var(--gradient-primary)] opacity-80" />
            <div className="p-5">
              <div className="text-xs font-medium text-primary">{p.category}</div>
              <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
              <div className="text-xs text-muted-foreground mt-4">{p.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
