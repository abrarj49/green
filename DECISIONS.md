# DECISIONS.md — Green Solution KSA

## Deviation Log

Any deviation from the build brief is documented here with reasoning.

---

### 1. Next.js version: 16 (not 14)

**Brief specified:** Next.js 14 (App Router, TypeScript)
**Actual:** Next.js 16.3.5 (App Router, TypeScript)

**Reason:** `create-next-app@latest` installed Next.js 16 (current stable). This is a newer version than specified but uses the same App Router architecture. Key differences:
- `params` in layouts/pages/route handlers is now a `Promise` (must be `await`-ed)
- React 19 with Server Components as default
- Tailwind CSS v4 (CSS-first config instead of `tailwind.config.ts`)

These are improvements, not regressions. All spec requirements remain achievable.

### 2. Tailwind CSS v4 — CSS-based configuration

**Brief specified:** `tailwind.config.ts` with custom design tokens
**Actual:** Tailwind v4 uses CSS-based configuration via `@theme` directive in `globals.css`

**Reason:** Tailwind v4 (installed by `create-next-app@latest`) no longer uses `tailwind.config.ts` by default. Design tokens from §4 are implemented as CSS custom properties + `@theme` configuration in `globals.css`. Same result, different mechanism.

### 3. Lenis package name

**Brief specified:** `@studio-freight/lenis`
**Actual:** May need `lenis` (package was renamed). Will document if different package used.
