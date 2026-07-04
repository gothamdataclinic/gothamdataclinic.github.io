# Gotham Data Clinic — Architecture

This repo (`gothamdataclinic/gothamdataclinic.github.io`) is a monorepo holding two separately-deployed apps that together make up gothamdataclinic.org. The repo was never renamed and never moved off GitHub Pages — an earlier plan to rename it `gdc-website` and cut over to Cloudflare Pages was deliberately dropped in favor of staying on the existing GitHub Pages + custom-domain setup, since it already worked and avoided an unnecessary DNS cutover.

```
┌───────────────────────┐        REST API (public,        ┌──────────────────────────┐
│   website/             │        no auth required)         │   cms/                     │
│   SvelteKit 5, SPA      │ ────────────────────────────▶   │   Payload CMS 3.85,        │
│   adapter-static        │                                   │   Next.js 16 app router    │
│   → GitHub Pages         │ ◀────────────────────────────   │   → Render (Node)          │
│   gothamdataclinic.org   │        JSON content               │   cms.gothamdataclinic.org │
└───────────────────────┘                                    └────────────┬─────────────┘
                                                                            │
                                                              ┌─────────────┴─────────────┐
                                                              │                            │
                                                       ┌──────▼──────┐            ┌────────▼───────┐
                                                       │  Supabase    │            │  Supabase       │
                                                       │  Postgres    │            │  Storage (S3)   │
                                                       │  (content DB)│            │  (media bucket) │
                                                       └─────────────┘             └────────────────┘
```

## Why two apps, one repo

Payload needs a persistent Node process (it uses `sharp`, a native binary, for image resizing) — that rules out a static/edge host for the CMS. The frontend has no server-only logic (everything it needs is public content fetched from Payload's REST API), so it stays a static SPA. Different runtimes, different hosts, but no reason to split them into separate repos — they deploy independently from subdirectories of one repo via each host's own "root directory" setting (`website/` for GitHub Pages' build step, `cms/` for Render).

Root-level `package.json` just orchestrates both for local dev — no real npm workspaces, just `--prefix`-based scripts: `install:all`, `dev:website`, `dev:cms`, `build:website`, `build:cms`, `start:cms`, `preview:website`.

## `cms/` — CMS backend

**Stack:** Payload CMS 3.85 on Next.js 16 (app router), Postgres via `@payloadcms/db-postgres`, file storage via `@payloadcms/storage-s3` pointed at Supabase Storage's S3-compatible endpoint. `next.config.mjs` wraps the config with `withPayload()` — Payload's admin UI, REST API, and GraphQL are all served by this one Next.js app; there is no separate server process (an earlier prototype used a standalone Express server, which isn't a real Payload 3.x deployment shape).

**Layout:**
```
src/
  app/(payload)/
    admin/[[...segments]]/    — admin panel (catch-all route)
    admin/importMap.js        — generated; must be committed (see "Admin nav" below)
    api/[...slug]/            — REST API (catch-all route)
    api/graphql/              — GraphQL endpoint
    api/auth/callback/        — Supabase Auth OAuth code exchange (see "Auth")
    layout.tsx                — Payload's RootLayout wrapper
  collections/          — Events, Publications, Programs, Media, TeamMembers
  globals/              — Home, About, Donate, TaxInfo, General (see "Content model")
  authStrategies/       — custom Google Workspace auth strategy
  components/
    GoogleSignInButton.tsx  — admin login button (Supabase OAuth)
    LoginLogo.tsx            — click-to-reveal local email/password login
    LogoutButton.tsx         — signs out of Supabase before Payload's own logout
    AdminNav.tsx              — custom sidebar ordering (see "Admin nav")
  lib/
    supabase/client.ts    — browser Supabase client (signInWithOAuth)
    supabase/server.ts    — server Supabase client (Next.js cookies())
    allowedEmailDomain.ts — shared @gothamdataclinic.org domain constant
    getRequestOrigin.ts   — trusts X-Forwarded-Host/Proto (see "A quirk worth knowing")
    siteUrl.ts             — shared SITE_URL constant (CORS + live-preview links)
  proxy.ts                — root-path (`/`) → `/admin` redirect
scripts/                  — one-off content migration scripts (not run at runtime):
                             seed.ts, seed-followup.ts, seed-followup2.ts (old-site
                             → Payload migration), migrate-site-settings.ts (the
                             SiteSettings → per-page-globals split), update-vision-intro.ts
```

**Auth:** the built-in `users` collection keeps its default email/password strategy (a break-glass fallback, revealed by clicking the logo on the login screen) plus a custom `google-workspace` strategy built on **Supabase Auth's Google provider** rather than a hand-rolled OAuth client. Supabase still needs a Google Cloud OAuth Client ID/Secret under the hood, it's just registered against Supabase's own callback URL (configured in Supabase Dashboard → Authentication → Providers → Google), not this app's.

1. `GoogleSignInButton.tsx` calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/api/auth/callback` } })`.
2. `/api/auth/callback` exchanges the returned code for a Supabase session (`exchangeCodeForSession`) and checks the actual security boundary: the returned, *verified* email must end in `@gothamdataclinic.org`, or the session is immediately signed back out. Google's `hd` request parameter is also sent as a UI hint on the account chooser, but it's never trusted on its own since it's spoofable.
3. Payload's `googleWorkspaceStrategy` re-validates the Supabase session cookie on every admin/API request via `supabase.auth.getUser()` (revalidates against Supabase's Auth server, unlike the cheaper but spoofable `getSession()`), re-checks the domain, and finds-or-creates a matching Payload `users` doc.
4. **Logout** has to undo both sessions: Payload's default logout button only clears Payload's own cookie, but step 3 re-derives a Payload session from Supabase's session on every request — so a lingering Supabase session silently logs the user back in. `LogoutButton.tsx` calls `supabase.auth.signOut()` first, then follows Payload's normal logout route.

**A quirk worth knowing — origin detection behind Render's proxy:** anywhere the server needs to build an absolute URL (the OAuth callback's post-login redirect, the root-path proxy), it must not use `new URL(request.url).origin` directly. Next.js under `next start` builds that from the raw `Host` header it receives, and Render's proxy forwards requests to the container using an internal `Host: localhost:<PORT>` rather than the public hostname — so naive origin detection resolves to `localhost:10000` in production instead of `cms.gothamdataclinic.org`. `lib/getRequestOrigin.ts` fixes this by trusting `X-Forwarded-Host`/`X-Forwarded-Proto` (which Render does set) and only falling back to `request.url`'s origin for local dev where those headers aren't present.

**Admin nav — routes visible like Collections:** Payload's built-in sidebar always lists every Collection before every Global within a navigational group — there's no config option to interleave them, so a "Pages" group would always show Events/Publications before Home/About/Donate/Tax & Legal regardless of array order in `payload.config.ts`. `components/AdminNav.tsx` (wired via `admin.components.Nav`) overrides the default sidebar just enough to build the "Pages" group by hand in the site's actual nav order — Home, About, Events, Press, Donate, Tax & Legal — then falls back to Payload's normal grouping for everything else. It reuses Payload's own rendering (`DefaultNavClient`, `NavWrapper`, `NavHamburger`, `Logout`) from `@payloadcms/next`/`@payloadcms/ui` — only the *ordering* is custom. One operational gotcha: Payload's admin component map (`src/app/(payload)/admin/importMap.js`) is a **generated, committed file** — any change to `admin.components.*` in `payload.config.ts` needs `npm run generate:importmap` re-run and the result committed, or the new component silently isn't picked up in production.

**Database:** Supabase Postgres via the session pooler or direct connection (port 5432) — not the transaction pooler (port 6543), which breaks Payload's need for prepared statements. **Dev-mode schema auto-push is disabled** (`push: false` in the `postgresAdapter` config) — with it on, removing or renaming a field/global makes Payload block every request behind an interactive "drop this table? (y/N)" prompt on boot, which just hangs in a non-interactive process (discovered when splitting `SiteSettings` into per-page globals below). Schema changes now need an explicit `payload migrate:create` / `payload migrate` — no such migration has been generated yet, since the current schema was created by the last auto-push before `push: false` was set; formalizing that into a real migration snapshot is still outstanding.

**Storage:** Supabase Storage's S3-compatible API via the official `@payloadcms/storage-s3` plugin (`forcePathStyle: true` is required for Supabase's gateway). Public read is controlled by the Supabase bucket's own "public" setting, not an S3 ACL — Supabase doesn't reliably support per-object ACLs.

## Supabase project

Supabase project `supabase-gothamdataclinic` (ref `hfzcajwujpczyzlfsytx`, us-east-1, Postgres 17) provides Postgres + Storage + Auth (Google provider, admin login only — see "Auth" above). It does **not** host either app. Supabase Auth's Site URL / redirect allowlist (Dashboard → Authentication → URL Configuration) must include `https://cms.gothamdataclinic.org/api/auth/callback`, since that's what the OAuth flow actually redirects back to.

Payload owns its own Postgres schema directly via `@payloadcms/db-postgres` (not PostgREST, no RLS on any Payload table — Payload's own `access` config on each collection/global is the authorization layer). There's a `supabase/` CLI project in the sibling `gotham-data-clinic-FINAL-HANDOFF` directory from the original prototyping phase, but it's not part of this repo or this deployment — the Storage bucket and its policy were created there once and haven't needed to change since.

## `website/` — public site

**Stack:** SvelteKit 5 (Svelte 5 runes), `adapter-static` in SPA mode. The fallback file is `404.html`, **not** the more common `index.html` — GitHub Pages serves `404.html` for any unmatched path, which is how client-side routing survives a hard refresh/deep link on Pages specifically. Since zero routes are prerendered, `adapter-static` only emits that one shell file, so the root path (`/`) would 404 without a same-content `index.html` too — the build script copies one from the other: `"build": "vite build && cp build/404.html build/index.html"`.

**Data fetching:** every route's data comes from `+page.ts` / `+layout.ts` — universal (not `.server.ts`) load functions, fetching Payload's public REST API (`src/lib/cms.ts`) directly from the browser. This is deliberate: with no prerendering and no server-only load functions, content changes made in the CMS admin appear on next page load with **no rebuild or redeploy required**.

**Routes** (in the order they appear in `Navigation.svelte`, and the order the CMS admin's "Pages" sidebar group now matches): `/` (Home), `/about` (About & Mission), `/team` (Team), `/events` (Events), `/press` (Publications — renamed from `/publications`), `/donate` (Donate), `/tax-info` (Tax Information).

**Optional images degrade to nothing, not a stock photo:** every image on the site that comes from an optional CMS upload field (hero backgrounds, the mission-section visual, the BrainWaves program image, a featured event's photo) renders no `<img>`/`background-image` at all when the field is empty, rather than falling back to a placeholder image. Sections that need a solid background regardless (hero panels, the event card) have an explicit CSS fallback color instead.

## Content model (Payload)

| Collection / Global | Group in admin sidebar | Purpose |
|---|---|---|
| `home` (global) | Pages | Homepage hero headline/image, mission statement, mission section intro |
| `about` (global) | Pages | About page vision copy, full mission statement, mission pillars, history timeline, hero/BrainWaves images |
| `events` (collection) | Pages | Upcoming/past events; `featured` flag surfaces one on the homepage |
| `publications` (collection) | Pages | Scholarly publications / press list (serves `/press`) |
| `donate` (global) | Pages | Donate page hero, donation URL/platform name, intro copy, impact blurbs |
| `tax-info` (global) | Pages | Tax-exempt status, fiscal year, state of incorporation, tax documents, donor FAQs |
| `programs` (collection) | Content | The "What We Do" program cards on the homepage |
| `media` (collection) | Content | All uploads (headshots, event images, tax PDFs) — backed by Supabase Storage |
| `team-members` (collection) | Admin | Bios, headshots, current vs. founding member type |
| `users` (collection) | Admin | Admin accounts (Google Workspace or local email/password) |
| `general` (global) | Site-wide | Site logo, social links, contact email, EIN, and copy/images genuinely shared across multiple pages: the vision quote and org stats (Home + About), the mission-section visual (Home + About), the Team page hero image |

This replaces a single `site-settings` global that held all of the above in one document — split apart because Payload's own Collections-vs-Globals distinction (repeatable content vs. singleton page settings) maps naturally onto "one global per page" plus one shared global for cross-page content, and because it's what let the admin sidebar group cleanly by route (see "Admin nav" above). `TeamMembers` and `Events.featured` existed in the original handoff specifically to back the homepage; `Programs` likewise. Each page global also has a `admin.preview` function so its edit view shows a "Preview" button that opens the real live route.

## Environment variables

See `cms/.env` for the full list with explanatory comments. At a glance: `DATABASE_URL` (Supabase Postgres), `SUPABASE_S3_*` + `SUPABASE_STORAGE_BUCKET` (Supabase Storage), `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` + `ALLOWED_EMAIL_DOMAIN` (Supabase Auth / Google login), `PAYLOAD_SECRET`, `SITE_URL` (CORS allow-list + live-preview link base — currently `https://gothamdataclinic.org`). The Google Cloud OAuth Client ID/Secret itself lives in the Supabase Dashboard, not in this app's env vars at all.

The frontend needs one at build time: `VITE_CMS_URL`, the deployed Payload URL — set as a GitHub Actions repository variable (`vars.VITE_CMS_URL`), consumed by the `build` step in `.github/workflows/main.yml`.

## Deployment

- **`cms/`** → Render, root directory `cms`, runs `next build` / `next start`. Served at `cms.gothamdataclinic.org` (a custom domain on top of Render's own `*.onrender.com` subdomain). No Render config is checked into this repo (no `render.yaml`) — build/start commands and env vars are set directly in the Render dashboard.
- **`website/`** → GitHub Pages, via `.github/workflows/main.yml` (triggered on push to `main`). Builds `website/` with Node, uploads `website/build/` as the Pages artifact, deploys with `actions/deploy-pages`. Custom domain `gothamdataclinic.org` is configured in the repo's Pages settings (there's also a legacy root-level `CNAME` file left over from the pre-Actions branch-deployment method, but it isn't part of the build artifact).
  - The workflow has a `concurrency` group so overlapping pushes queue rather than race for the same Pages deployment — a "Deployment failed, try again later." error that recurred a few times this session was traced to exactly that: back-to-back pushes racing GitHub's Pages environment lock, not a problem with the build itself. There's also a one-shot automatic retry job (`deploy-retry`) as a safety net, since every prior occurrence resolved cleanly on a simple retry.
- **Supabase** → Postgres + Storage + Auth (admin login) only. Not used to host either app.

## Known gaps / not yet done

- No formal Payload migration has been generated for the current schema (see "Database" above) — it exists only because dev-mode auto-push created it before `push: false` was set.
- The `VITE_CMS_URL` GitHub Actions variable currently points at Render's own `*.onrender.com` subdomain rather than the `cms.gothamdataclinic.org` custom domain. Functionally equivalent (same service), but worth pointing at the custom domain for consistency.
- No CI (tests, typecheck, lint) runs on push — the GitHub Actions workflow only builds and deploys.
