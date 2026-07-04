import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { TeamMembers } from './collections/TeamMembers'
import { Events } from './collections/Events'
import { Publications } from './collections/Publications'
import { Programs } from './collections/Programs'
import { Media } from './collections/Media'
import { Home } from './globals/Home'
import { About } from './globals/About'
import { Donate } from './globals/Donate'
import { TaxInfo } from './globals/TaxInfo'
import { General } from './globals/General'
import { googleWorkspaceStrategy } from './authStrategies/googleWorkspace'
import { SITE_URL } from './lib/siteUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'

export default buildConfig({
  // ── Admin Panel ──────────────────────────────────────────
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Gotham Data Clinic',
      icons: [{ url: '/favicon.ico' }],
    },
    components: {
      beforeLogin: ['@/components/GoogleSignInButton#GoogleSignInButton'],
      graphics: {
        Logo: '@/components/LoginLogo#LoginLogo',
      },
      logout: {
        Button: '@/components/LogoutButton#LogoutButton',
      },
      Nav: '@/components/AdminNav#AdminNav',
    },
  },

  // ── Collections (content types) ─────────────────────────
  // Order matters for admin sidebar grouping — Events/Publications are listed
  // first so the "Pages" group (shared with the page Globals below) registers
  // before "Content" and "Admin".
  collections: [
    Events,
    Publications,
    Programs,
    Media,
    TeamMembers,
    // Built-in Users collection for admin login.
    // Google Workspace login (via the googleWorkspaceStrategy custom strategy)
    // is the primary path; the default local email/password strategy stays
    // enabled as a break-glass fallback.
    {
      slug: 'users',
      auth: {
        strategies: [googleWorkspaceStrategy],
      },
      admin: { useAsTitle: 'email', group: 'Admin' },
      fields: [
        { name: 'name', type: 'text', label: 'Full Name' },
      ],
    },
  ],

  // ── Globals (singleton settings) ────────────────────────
  globals: [Home, About, Donate, TaxInfo, General],

  // ── Editor ───────────────────────────────────────────────
  editor: lexicalEditor(),

  // ── Image processing (thumbnail/card sizes on Media) ────
  sharp,

  // ── Plugins ──────────────────────────────────────────────
  // Supabase Storage exposes an S3-compatible API — use the official S3 plugin
  // instead of local disk for uploads.
  plugins: [
    s3Storage({
      collections: {
        // The `media` bucket is public and access-unrestricted (Media's own
        // `access.read` is already `() => true`), so serve files directly
        // from Supabase's public URL instead of proxying through Payload's
        // own /api/media/file route.
        media: {
          disablePayloadAccessControl: true,
          // The S3-compatible endpoint requires signed requests even for a
          // public bucket, so the plugin's default (endpoint + bucket + key)
          // URL wouldn't be anonymously fetchable. Supabase's actual public
          // object URL lives at a different path than the S3 protocol
          // endpoint — build that instead.
          generateFileURL: ({ filename }) =>
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}/${filename}`,
        },
      },
      // Public read is controlled by the Supabase bucket's own "public" setting
      // (dashboard), not an S3 ACL header — Supabase's S3 gateway doesn't
      // reliably support per-object ACLs.
      bucket: storageBucket,
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT,
        region: process.env.SUPABASE_S3_REGION,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
        },
        // Required — Supabase's S3 gateway doesn't support virtual-hosted-style addressing.
        forcePathStyle: true,
      },
    }),
  ],

  // ── Database (Supabase Postgres) ──
  // Use the session pooler or direct connection string (port 5432), not the
  // transaction pooler (port 6543) — Payload needs prepared-statement support
  // that transaction-mode pgbouncer breaks.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // Disable dev-mode schema auto-push. With it on, removing/renaming a
    // field or global makes Payload block every request behind an
    // interactive "drop this table? (y/N)" prompt on boot — which just hangs
    // in a non-interactive process. Schema changes now go through explicit
    // `payload migrate:create` / `payload migrate` instead.
    push: false,
  }),

  // ── Secret key (change this in production!) ─────────────
  secret: process.env.PAYLOAD_SECRET || 'gdc-change-this-secret-in-production',

  // ── CORS — allow your website to fetch content ───────────
  cors: [
    'http://localhost:5173',   // SvelteKit dev
    'http://localhost:3000',   // SvelteKit preview
    SITE_URL,
  ],

  // ── TypeScript output ────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
