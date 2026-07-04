# Gotham Data Clinic — CMS (Payload)

Self-hosted content management system for gothamdataclinic.org. Your team uses this to manage all website content — no code required. See [`../ARCHITECTURE.md`](../ARCHITECTURE.md) for the full technical picture.

## What your team can manage

| Section (admin sidebar group) | What they can do |
|---|---|
| **Home** (Pages) | Hero headline/image, mission statement and intro copy |
| **About** (Pages) | Vision copy, full mission statement, mission pillars, history timeline |
| **Events** (Pages) | Add events with dates, times, locations, registration links, images |
| **Publications** (Pages) | Add papers/press with authors, journal, year, abstract, DOI/PDF links |
| **Donate** (Pages) | Hero headline, donation platform URL, impact blurbs |
| **Tax & Legal** (Pages) | EIN, tax-exempt status, tax documents, donor FAQs |
| **Programs** (Content) | Edit program descriptions shown on the homepage |
| **Media** (Content) | All uploaded images/PDFs used across the site |
| **Team Members** (Admin) | Add/remove members, upload headshots, edit bios, set roles |
| **General** (Site-wide) | Site logo, social links, contact email, and copy shared across pages (vision quote, org stats) |

Each page under **Pages** has a **Preview** button in its edit view that opens the real live page in a new tab.

---

## Setup (one-time, done by a developer)

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — see the comments in the file for where each value comes from:
- `PAYLOAD_SECRET` — a long random string
- `SITE_URL` — the public website's URL (used for CORS + live-preview links)
- `DATABASE_URL` — Supabase Postgres connection string (session pooler, port 5432)
- `SUPABASE_S3_*`, `SUPABASE_STORAGE_BUCKET` — Supabase Storage credentials
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ALLOWED_EMAIL_DOMAIN` — Google Workspace admin login via Supabase Auth

### 2. Install and start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/admin`.

### 3. Deploy

```bash
npm run build
npm run start
```

Deployed to Render (root directory `cms`, build/start commands and env vars set directly in the Render dashboard — there's no `render.yaml` in this repo). Content lives in Supabase Postgres, not on the server itself — there's no local database file to back up.

---

## How team members log in

1. Go to `https://cms.gothamdataclinic.org/admin`
2. Click **Sign in with Google** — must be a `@gothamdataclinic.org` account
3. Use the left sidebar (grouped as **Pages** / **Content** / **Admin** / **Site-wide**, in that order) to navigate
4. Make changes and click **Save** — the website updates on next page load, no rebuild needed

There's also a local email/password login as a break-glass fallback — click the logo on the login screen to reveal it.

---

## Adding a new team member (step by step)

1. Click **Team Members** in the left sidebar (under **Admin**)
2. Click **Create New** (top right)
3. Fill in: Full Name, Credentials, Role, Member Type
4. Click **Upload** next to Photo to add a headshot
5. Type the Bio in the text box
6. Add Expertise Tags (e.g. "Data Science", "Neuroscience")
7. Click **Save** — appears on the website immediately

---

## Architecture

```
cms/                  ← This CMS (runs on Render, cms.gothamdataclinic.org)
  src/
    collections/      ← Repeatable content: Events, Publications, Programs, Media, TeamMembers
    globals/          ← Singleton page content: Home, About, Donate, TaxInfo, General
    payload.config.ts ← Main configuration
    components/       ← Custom admin UI: Google sign-in, logout, sidebar ordering

website/              ← The public website (runs on GitHub Pages)
  src/lib/cms.ts       ← Fetches content from this CMS via REST API
```

Content lives in Supabase Postgres; uploads live in Supabase Storage — nothing is stored on the CMS server's own filesystem.
