-- Storage bucket for Payload's `media` collection (headshots, event images,
-- tax PDFs). Public bucket so the frontend can render uploads directly by
-- URL without signed requests.
--
-- Writes go through Payload's server-side S3 access keys (@payloadcms/storage-s3),
-- not through Supabase Auth-authenticated browser sessions, so those keys
-- bypass RLS entirely — there's no `authenticated`-scoped write policy here to
-- mirror, only the public read policy.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
	'media',
	'media',
	true,
	20971520,
	ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read media objects"
	ON storage.objects FOR SELECT
	USING (bucket_id = 'media');
