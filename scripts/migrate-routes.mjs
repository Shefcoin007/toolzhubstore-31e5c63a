#!/usr/bin/env node
// One-shot migration: src/routes/**/*.tsx (TanStack) -> src/pages/**/*.tsx (React Router v6).
// Strips createFileRoute wrappers, swaps imports, rewrites param syntax, exports default.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";

const SRC = "src/routes";
const DEST = "src/pages";

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

// Map src/routes/foo.tsx → src/pages/Foo.tsx (PascalCase, $slug stays slug)
function destPath(src) {
  const rel = relative(SRC, src).replace(/\\/g, "/");
  // Drop __root.tsx, _authenticated.tsx (handled separately as layouts)
  if (rel === "__root.tsx" || rel === "_authenticated.tsx") return null;
  return join(DEST, rel).replace(/\\/g, "/");
}

function transform(code) {
  let out = code;

  // Strip the createFileRoute(...)(...) export block. Match the full statement.
  out = out.replace(
    /export\s+const\s+Route\s*=\s*createFileRoute\([^)]*\)\(\{[\s\S]*?\}\);?\s*/g,
    ""
  );

  // Rewrite imports from @tanstack/react-router → react-router-dom (and drop server-only symbols).
  out = out.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']@tanstack\/react-router["'];?/g,
    (_, names) => {
      const wanted = names
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((n) => n.replace(/\s+as\s+\w+/, ""))
        .filter((n) =>
          ["Link", "Outlet", "useNavigate", "useLocation", "useParams", "Navigate"].includes(n)
        );
      const unique = [...new Set(wanted)];
      if (unique.length === 0) return "";
      return `import { ${unique.join(", ")} } from "react-router-dom";`;
    }
  );

  // Route.useParams<{ x: string }>() → useParams() as { x: string }
  out = out.replace(/Route\.useParams<[^>]+>\(\)/g, "useParams()");
  out = out.replace(/Route\.useParams\(\)/g, "useParams()");
  out = out.replace(/Route\.useNavigate\(\)/g, "useNavigate()");
  out = out.replace(/Route\.useLoaderData\(\)/g, "{}");

  // navigate({ to: "/x" }) → navigate("/x")
  out = out.replace(/navigate\(\s*\{\s*to:\s*(["'`][^"'`]+["'`])\s*\}\s*\)/g, "navigate($1)");
  out = out.replace(
    /navigate\(\s*\{\s*to:\s*(["'`][^"'`]+["'`])\s*,\s*replace:\s*true\s*\}\s*\)/g,
    "navigate($1, { replace: true })"
  );

  // <Link to="/blog/$slug" params={{ slug: x }}>  →  <Link to={`/blog/${x}`}>
  out = out.replace(
    /to=\{?["'`]\/blog\/\$slug["'`]\}?\s+params=\{\{\s*slug:\s*([^}]+)\s*\}\}/g,
    (_, expr) => `to={\`/blog/\${${expr.trim()}}\`}`
  );
  // Generic $param fallback
  out = out.replace(/to=["'`]([^"'`]*)\$(\w+)([^"'`]*)["'`]\s+params=\{\{\s*\w+:\s*([^}]+)\}\}/g,
    (_, pre, _name, post, expr) => `to={\`${pre}\${${expr.trim()}}${post}\`}`);

  // <Link activeOptions={{...}} → drop (RR v6 uses NavLink for active styling)
  out = out.replace(/\s*activeOptions=\{\{[^}]*\}\}/g, "");
  // activeProps={{ className: "..." }} → drop too (handled with custom isActive logic in our app)
  out = out.replace(/\s*activeProps=\{\{[^}]*\}\}/g, "");

  // Make the page component the default export.
  // Detect `function FooBar(` defined at top level after our strip, mark first one as default.
  const fnMatch = out.match(/^function\s+(\w+)\s*\(/m);
  if (fnMatch && !/export\s+default/.test(out)) {
    out = out.replace(
      new RegExp(`^function\\s+${fnMatch[1]}\\s*\\(`, "m"),
      `export default function ${fnMatch[1]}(`
    );
  }

  // Drop dead `notFound`/`redirect` imports that might still be referenced.
  out = out.replace(/throw\s+notFound\(\)/g, 'throw new Error("Not found")');

  // Tidy multiple blank lines at top.
  out = out.replace(/^\s*\n+/, "");
  return out;
}

for (const file of walk(SRC)) {
  const dest = destPath(file);
  if (!dest) continue;
  const code = readFileSync(file, "utf8");
  const transformed = transform(code);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, transformed);
  console.log("→", dest);
}
console.log("done");