import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Eye, EyeOff, Shield, Bell, Webhook, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & API — Shefcon" },
      { name: "description", content: "Manage your account, security, and API keys for Shefcon." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [revealed, setRevealed] = useState(false);
  const [apiKey, setApiKey] = useState("sk_live_8a2f93b1c4e7d6520af9b3e1c8d4527e");
  const [copied, setCopied] = useState(false);

  const masked = apiKey.slice(0, 8) + "•".repeat(24) + apiKey.slice(-4);

  function rotate() {
    const fresh =
      "sk_live_" +
      Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
    setApiKey(fresh);
    setRevealed(true);
  }

  function copy() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">// profile</span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Account & API</h1>
        <p className="text-sm text-muted-foreground">Identity, credentials, and integration settings.</p>
      </div>

      {/* Identity */}
      <Section title="Identity" icon={Shield} description="Account information visible across the platform.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display name" defaultValue="Operator 0421" />
          <Field label="Email" defaultValue="ops@shefcon.io" type="email" />
          <Field label="Organization" defaultValue="Shefcon Labs" />
          <Field label="Timezone" defaultValue="UTC+02:00 / Europe" />
        </div>
        <div className="flex justify-end">
          <Button className="gap-2"><Save className="h-4 w-4" />Save changes</Button>
        </div>
      </Section>

      {/* API Key */}
      <Section title="API key" icon={Webhook} description="Use this key to authenticate requests against /v2/order endpoints.">
        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <code className="block flex-1 overflow-x-auto font-mono text-sm text-foreground">
              {revealed ? apiKey : masked}
            </code>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => setRevealed((r) => !r)} aria-label="toggle visibility">
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={copy} aria-label="copy">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {copied && <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-success">copied to clipboard</p>}
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Rotate API key</p>
            <p className="text-xs text-muted-foreground">Existing integrations will stop working immediately.</p>
          </div>
          <Button variant="destructive" className="gap-2" onClick={rotate}>
            <RefreshCw className="h-4 w-4" />Rotate now
          </Button>
        </div>

        <Field label="Webhook URL" defaultValue="https://your-app.com/api/shefcon/webhook" />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell} description="Control how Shefcon alerts you about orders and balance.">
        <Toggle label="Order completed" hint="Email when an order finalizes." defaultChecked />
        <Toggle label="Order failed" hint="Email + webhook on any failure." defaultChecked />
        <Toggle label="Low balance" hint="Notify when balance drops below $25." defaultChecked />
        <Toggle label="Marketing updates" hint="Product news and feature drops." />
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-[image:var(--gradient-surface)]">
      <header className="flex items-start gap-3 border-b border-border bg-secondary/30 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} type={type} className="bg-background border-border" />
    </div>
  );
}

function Toggle({ label, hint, defaultChecked }: { label: string; hint: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}