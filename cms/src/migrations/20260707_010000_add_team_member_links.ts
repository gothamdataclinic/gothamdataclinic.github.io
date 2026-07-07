import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "linkedin_url" character varying;
   ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "personal_site_url" character varying;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members" DROP COLUMN IF EXISTS "linkedin_url";
   ALTER TABLE "team_members" DROP COLUMN IF EXISTS "personal_site_url";
  `)
}
