# Gotham Data Clinic — Website (SvelteKit)

The public-facing website for gothamdataclinic.org. Fetches all content from the self-hosted Payload CMS (`gdc-payload/`).

## Setup

### 1. Configure the CMS URL

Create a `.env` file:
```
VITE_CMS_URL=http://localhost:3001
```
In production, set this to your deployed CMS URL (e.g. `https://cms.gothamdataclinic.org`).

### 2. Run locally

```bash
npm install
npm run dev
```

### 3. Build for production

```bash
npm run build
node build/index.js
```

---

## Pages

| Page | URL |
|---|---|
| Home | `/` |
| About & Mission | `/about` |
| Team | `/team` |
| Events | `/events` |
| Publications | `/publications` |
| Donate | `/donate` |
| Tax Information | `/tax-info` |
