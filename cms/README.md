# Gotham Data Clinic — CMS (Payload)

Self-hosted content management system for gothamdataclinic.org. Your team uses this to manage all website content — no code required.

## What your team can manage

| Section | What they can do |
|---|---|
| **Team Members** | Add/remove members, upload headshots, edit bios, set roles |
| **Events** | Add events with dates, times, locations, registration links, images |
| **Publications** | Add papers with authors, journal, year, abstract, DOI/PDF links |
| **Programs** | Edit program descriptions shown on the homepage |
| **Site Settings → Donation** | Paste any donation platform URL (PayPal, Donorbox, Stripe, etc.) |
| **Site Settings → Background Images** | Upload new hero images for any page |
| **Site Settings → Tax & Legal** | Update EIN, upload Form 990s and tax documents |

---

## Setup (one-time, done by a developer)

### Step 1 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
- Set `PAYLOAD_SECRET` to a long random string
- Set `SITE_URL` to your website URL

### Step 2 — Install and start

```bash
npm install
npm run dev
```

Visit `http://localhost:3001/admin` — you'll be prompted to create your first admin account.

### Step 3 — Deploy to your server

```bash
npm run build
node dist/server.js
```

Deploy to Railway, Render, or any Node.js server. The SQLite database (`gdc-content.db`) is stored as a single file on your server — back it up regularly.

---

## How team members log in

1. Go to `https://your-cms-url/admin` in any browser
2. Log in with email and password
3. Use the left sidebar to navigate to Team Members, Events, Publications, etc.
4. Make changes and click **Save** — the website updates immediately

---

## Adding a new team member (step by step)

1. Click **Team Members** in the left sidebar
2. Click **Create New** (top right)
3. Fill in: Full Name, Credentials, Role, Member Type
4. Click **Upload** next to Photo to add a headshot
5. Type the Bio in the text box
6. Add Expertise Tags (e.g. "Data Science", "Neuroscience")
7. Click **Save** — appears on the website immediately

---

## Architecture

```
gdc-payload/          ← This CMS (runs on your server, port 3001)
  src/
    collections/      ← Content types (TeamMembers, Events, etc.)
    globals/          ← Site-wide settings (SiteSettings)
    payload.config.ts ← Main configuration
  gdc-content.db      ← SQLite database (all your content lives here)
  public/media/       ← Uploaded images and files

gdc-svelte/           ← The public website (runs on port 3000 or 5173)
  src/lib/cms.ts      ← Fetches content from this CMS via REST API
```

## Color Palette

Navy `#1D2B4A` | Ink `#131B2E` | Slate `#3D4A73` | Ember `#D9581F` | Canvas `#F3F5FA` | Paper `#FFFFFF`
