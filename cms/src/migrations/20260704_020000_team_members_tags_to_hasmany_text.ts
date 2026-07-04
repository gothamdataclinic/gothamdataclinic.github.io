import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// TeamMembers.tags switched from `array` (one nested `tag` text subfield,
// each row an { id, tag } object) to `text` with `hasMany: true` (a plain
// string array) — avoids the object-wrapping that caused tag values to
// render as [object Object] wherever the frontend forgot the `.tag`
// accessor. `hasMany` text fields share one `<collection>_texts` table per
// collection, keyed by `path`, per Payload's Postgres adapter.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "team_members_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );

  DO $$ BEGIN
   ALTER TABLE "team_members_texts" ADD CONSTRAINT "team_members_texts_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "team_members_texts_order_parent_idx" ON "team_members_texts" USING btree ("order","parent_id");

  INSERT INTO "team_members_texts" ("order", "parent_id", "path", "text")
  SELECT "_order", "_parent_id", 'tags', "tag" FROM "team_members_tags"
  WHERE NOT EXISTS (SELECT 1 FROM "team_members_texts");

  DROP TABLE IF EXISTS "team_members_tags";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "team_members_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );

  DO $$ BEGIN
   ALTER TABLE "team_members_tags" ADD CONSTRAINT "team_members_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  INSERT INTO "team_members_tags" ("_order", "_parent_id", "id", "tag")
  SELECT "order", "parent_id", gen_random_uuid()::text, "text" FROM "team_members_texts" WHERE "path" = 'tags';

  DROP TABLE IF EXISTS "team_members_texts";
  `)
}
