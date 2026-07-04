import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Publications.authors switched from `array` (one nested `name` text
// subfield, each row an { id, name } object) to `text` with `hasMany: true`
// (a plain string array) — same class of fix as team_members.tags in the
// previous migration: avoids the object-wrapping that caused author names
// to render as [object Object] wherever the frontend forgot the `.name`
// accessor.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "publications_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );

  DO $$ BEGIN
   ALTER TABLE "publications_texts" ADD CONSTRAINT "publications_texts_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "publications_texts_order_parent_idx" ON "publications_texts" USING btree ("order","parent_id");

  INSERT INTO "publications_texts" ("order", "parent_id", "path", "text")
  SELECT "_order", "_parent_id", 'authors', "name" FROM "publications_authors"
  WHERE NOT EXISTS (SELECT 1 FROM "publications_texts");

  DROP TABLE IF EXISTS "publications_authors";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "publications_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );

  DO $$ BEGIN
   ALTER TABLE "publications_authors" ADD CONSTRAINT "publications_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  INSERT INTO "publications_authors" ("_order", "_parent_id", "id", "name")
  SELECT "order", "parent_id", gen_random_uuid()::text, "text" FROM "publications_texts" WHERE "path" = 'authors';

  DROP TABLE IF EXISTS "publications_texts";
  `)
}
