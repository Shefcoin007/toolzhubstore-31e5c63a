
# Full rebuild: TanStack Start → Static SPA + PWA on GitHub Pages

Target repo: `Shefcoin007/toolzhubstore-31e5c63a` → published URL `https://shefcoin007.github.io/toolzhubstore-31e5c63a/`

## What stays

- Supabase database, RLS policies, `profiles` / `services` / `orders` / `transactions` / `blog_posts` / `user_roles`, `has_role()`, `handle_new_user()` — untouched.
- All UI components, design tokens (`src/styles.css`), shadcn components, brand, copy.
- Google OAuth credentials (live on the Supabase auth provider — already configured by Lovable Cloud).

## What changes

### 1. Framework swap (TanStack Start → Vite + React Router v6)

- Remove: `@tanstack/react-start`, `@tanstack/start-*`, `@lovable.dev/vite-tanstack-config`, `wrangler`, `src/routeTree.gen.ts`, `src/router.tsx`, `wrangler.jsonc`, `supabase/config.toml` server bits.
- Replace `vite.config.ts` with a plain Vite + React + PWA config: `base: "/toolzhubstore-31e5c63a/"`, `@vitejs/plugin-react`, `vite-plugin-pwa`, `@tailwindcss/vite`, path alias `@`.
- New entry: `src/main.tsx` mounting `<App />` inside `BrowserRouter basename={import.meta.env.BASE_URL}`.
- New `index.html` at project root (replaces TSS shell), with manifest + theme-color + meta tags.

### 2. Route migration

Every `src/routes/**` file is ported to `src/pages/**` and registered in a central `<Routes>` table. File map:

```
/                       → pages/Landing.tsx           (from routes/index.tsx)
/services               → pages/Services.tsx
/pricing                → pages/Pricing.tsx
/blog                   → pages/Blog.tsx
/blog/:slug             → pages/BlogPost.tsx
/login                  → pages/Login.tsx
/register               → pages/Register.tsx
/dashboard              → pages/dashboard/Home.tsx     (under <RequireAuth>)
/dashboard/new-order    → pages/dashboard/NewOrder.tsx
/dashboard/orders       → pages/dashboard/Orders.tsx
/dashboard/funds        → pages/dashboard/Funds.tsx
/dashboard/profile      → pages/dashboard/Profile.tsx
/admin/*                → pages/admin/*               (under <RequireAdmin>)
*                       → pages/NotFound.tsx
```

- `<RequireAuth>` / `<RequireAdmin>` wrappers replace `_authenticated.tsx` `beforeLoad` redirects — they read `useAuth()` and `<Navigate to="/login" state={{ from }} />` when missing.
- All `<Link to="/x">` from `@tanstack/react-router` become `react-router-dom` Links. `useNavigate`, `useLocation`, `useParams` swapped to RR v6 equivalents.

### 3. OAuth: native Supabase (drops `/~oauth/*` proxy)

- Remove `src/integrations/lovable/index.ts` and `@lovable.dev/cloud-auth-js`.
- Login + Register call:
  ```ts
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + import.meta.env.BASE_URL + "dashboard" }
  })
  ```
- Supabase redirects through `hazifvcxfgtwzdjfozvp.supabase.co/auth/v1/callback` then back to GH Pages — no Cloudflare edge needed.
- **Manual step for user (one-time)**: add `https://shefcoin007.github.io/toolzhubstore-31e5c63a/**` to Supabase auth "Redirect URLs" and set Site URL. I'll surface a one-click action.

### 4. Server-function removal

The app has no `createServerFn` business logic that isn't expressible via supabase-js + RLS. All admin mutations (services CRUD, blog publish, order status updates, wallet adjustments) already go through `supabase.from(...).insert/update()` guarded by `has_role(auth.uid(), 'admin')` policies. Delete:

- `src/integrations/supabase/auth-middleware.ts`
- `src/integrations/supabase/auth-attacher.ts`
- `src/integrations/supabase/client.server.ts`
- `src/start.ts`
- Any `.functions.ts` / `.server.ts` files

`src/integrations/supabase/client.ts` stays exactly as-is.

### 5. PWA (installable, no aggressive caching)

`vite-plugin-pwa` in **manifest-first** mode:

- Manifest: name "ToolzHub", short_name "ToolzHub", `display: "standalone"`, `theme_color` from design tokens, icons 192/512/maskable.
- Service worker: `registerType: "autoUpdate"`, `devOptions.enabled: false` (preview iframe safety), `navigateFallback: "/toolzhubstore-31e5c63a/index.html"`, NetworkFirst for HTML so deploys aren't trapped by a stale shell.
- Iframe/preview-host guard in `main.tsx`: skip SW registration on `id-preview--*.lovable.app` and inside iframes.
- Generate icons via image gen (1024×1024 source → resized).

### 6. GitHub Pages plumbing

- `public/404.html` = copy of `index.html` (SPA fallback for deep-link refreshes).
- `.github/workflows/deploy.yml` — on push to `main`: install, `bun run build`, upload `dist/`, deploy to `gh-pages` via official `actions/deploy-pages@v4`.
- `.env.production` ships `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key is safe in client; RLS enforces auth).
- `public/.nojekyll` to stop GitHub stripping `_*` paths.

### 7. Hydration error cleanup

The current SSR hydration errors are an SSR-only problem — they vanish automatically because there is no more SSR. Landing page renders client-only.

## Out of scope

- Custom domain (can add later — just delete `base` and update workflow).
- Server-side email sending, scheduled jobs, or anything needing a runtime (none exist today).
- Lovable in-editor preview will continue to work (Vite dev server runs at `/`); only the production build uses the `/toolzhubstore-31e5c63a/` base.

## Risks / things you must do after merge

1. Open the **Connectors → Lovable Cloud → Auth settings** and add `https://shefcoin007.github.io/toolzhubstore-31e5c63a/**` to **Redirect URLs**, set the **Site URL** to the same.
2. In GitHub repo settings → Pages → Source = "GitHub Actions".
3. After first deploy, sign in once with Google to confirm the round-trip works.
4. Add an admin row to `user_roles` for your account if not already done.

## Order of execution

1. Install new deps, remove old deps. *(1 batch)*
2. Write `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, PWA manifest, icons.
3. Port all 18 route files + add `RequireAuth` / `RequireAdmin`.
4. Swap OAuth call sites + delete `lovable` integration.
5. Delete server-side files + `routeTree.gen.ts` + `wrangler.jsonc`.
6. Add `.github/workflows/deploy.yml`, `public/404.html`, `public/.nojekyll`.
7. Smoke-test login, OAuth, dashboard load, admin gate, order placement, PWA install prompt.

Approve and I'll execute end to end.
