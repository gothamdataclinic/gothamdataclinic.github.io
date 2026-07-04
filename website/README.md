# Gotham Data Clinic — Website (SvelteKit)

The public-facing website for gothamdataclinic.org. Fetches all content from the self-hosted Payload CMS (`../cms/`, deployed at `https://cms.gothamdataclinic.org`) — see [`../ARCHITECTURE.md`](../ARCHITECTURE.md) for how the two apps fit together.

## Setup

### 1. Configure the CMS URL

Create a `.env.local` file:
```
VITE_CMS_URL=http://localhost:3000
```
In production this is set as the `VITE_CMS_URL` GitHub Actions repository variable, consumed at build time by `.github/workflows/main.yml`.

### 2. Run locally

```bash
npm install
npm run dev
```

### 3. Build for production

```bash
npm run build
```

This is a static SPA (`adapter-static`) — the build produces plain HTML/CSS/JS in `build/`, no Node server needed to serve it. `npm run preview` serves that build locally for a final check before deploying.

---

## Pages

| Page | URL |
|---|---|
| Home | `/` |
| About & Mission | `/about` |
| Team | `/team` |
| Events | `/events` |
| Press | `/press` |
| Donate | `/donate` |
| Tax Information | `/tax-info` |

All page copy and images are editable in the CMS — see `../cms/README.md`. Text fields fall back to sensible placeholder copy if left empty in the CMS (kept in sync with the real current copy, so an accidental blank field doesn't show something obviously wrong); optional images render nothing at all when empty rather than a stock photo.

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
