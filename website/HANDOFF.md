# Gotham Data Clinic — Developer Handoff

## What's in this package

| Folder | What it is |
|---|---|
| `gdc-svelte/` | The public website (SvelteKit + Tailwind) |
| `gdc-payload/` | The self-hosted CMS admin panel (Payload CMS + SQLite) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Public website | SvelteKit 2, Tailwind CSS 4 |
| CMS / Admin | Payload CMS v3, SQLite |
| Hosting | Any Node.js server (Railway, Render, Fly.io, VPS) |
| Fonts | Plus Jakarta Sans (Google Fonts CDN) |

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Navy | `#1D2B4A` | Header, hero, footer |
| Ink | `#131B2E` | Footer band, body text |
| Slate | `#3D4A73` | Secondary text, stats |
| Ember | `#D9581F` | CTAs, labels, accents |
| Canvas | `#F3F5FA` | Page background |
| Paper | `#FFFFFF` | Cards, surfaces |

---

## Pages

| Page | URL | CMS-managed? |
|---|---|---|
| Home | `/` | Partial |
| About & Mission | `/about` | No |
| Team | `/team` | ✅ Yes |
| Events | `/events` | ✅ Yes |
| Research / Publications | `/publications` | ✅ Yes |
| Donate | `/donate` | ✅ Yes (donation URL) |
| Tax Information | `/tax-info` | ✅ Yes |

---

## Deployment Steps

### Step 1 — Deploy the CMS (`gdc-payload/`)

```bash
cd gdc-payload
npm install
cp .env.example .env
# Edit .env: set PAYLOAD_SECRET and SITE_URL
npm run build
node dist/server.js
```

Deploy to Railway, Render, or any Node.js host. Note the deployed URL (e.g. `https://gdc-cms.up.railway.app`).

**First time:** Visit `[CMS_URL]/admin` to create the first admin account.

### Step 2 — Deploy the website (`gdc-svelte/`)

```bash
cd gdc-svelte
npm install
# Create .env:
echo "VITE_CMS_URL=https://your-cms-url.railway.app" > .env
npm run build
node build/index.js
```

Deploy to your host and point `gothamdataclinic.org` to it.

---

## One-time content setup (after CMS is live)

1. Log into `[CMS_URL]/admin`
2. Go to **Site Settings** → paste the real donation URL (PayPal, Donorbox, etc.)
3. Go to **Team Members** → add each team member with headshot and bio
4. Go to **Events** → add any upcoming events

---

## What the team can manage via CMS (no code needed)

- ✅ Team member photos, bios, roles
- ✅ Upcoming and past events (dates, locations, registration links)
- ✅ Publications (title, authors, journal, abstract, DOI)
- ✅ Donation platform URL (updates the Donate button site-wide)
- ✅ Hero background images for any page
- ✅ Tax documents (Form 990s, determination letters)
- ✅ EIN, tax-exempt status, fiscal year

---

## To update hardcoded content (requires code edit)

- About & Mission page text
- Homepage mission statement
- Program descriptions (unless added to CMS Programs collection)

---

## Domain setup

Point `gothamdataclinic.org` DNS to your hosting provider's IP/CNAME. Most hosts (Railway, Render, Vercel) have a one-click custom domain setup in their dashboard.

---

## Questions?

Contact: info@gothamdataclinic.org
