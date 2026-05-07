import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "../components/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shefcon — High-Performance Digital Service Platform" },
      { name: "description", content: "Shefcon delivers industrial-grade digital services with transparent pricing and a developer-first API." },
      { name: "author", content: "Shefcon" },
      { property: "og:title", content: "Shefcon — High-Performance Digital Service Platform" },
      { property: "og:description", content: "Shefcon delivers industrial-grade digital services with transparent pricing and a developer-first API." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Shefcon — High-Performance Digital Service Platform" },
      { name: "twitter:description", content: "Shefcon delivers industrial-grade digital services with transparent pricing and a developer-first API." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cc25e3bb-7fea-4474-9003-b7a70e9a58d7/id-preview-9715b4a0--87844a46-cacc-4e7d-9025-a30175f0b8cb.lovable.app-1777315344227.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cc25e3bb-7fea-4474-9003-b7a70e9a58d7/id-preview-9715b4a0--87844a46-cacc-4e7d-9025-a30175f0b8cb.lovable.app-1777315344227.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <AppShell />;
}
