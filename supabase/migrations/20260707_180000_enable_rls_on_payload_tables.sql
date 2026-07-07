-- Every table Payload owns in the `public` schema currently has RLS
-- disabled, while Supabase's default `anon`/`authenticated` roles hold full
-- CRUD grants (INSERT/SELECT/UPDATE/DELETE/...) on all of them — including
-- `users` (Payload admin accounts). Since `anon`'s key is public (embedded
-- client-side for Supabase Auth), anyone could currently read or write any
-- row via Supabase's auto-generated PostgREST API, completely bypassing
-- Payload's own access control.
--
-- Payload itself connects as the `postgres` role (via DATABASE_URL), which
-- has BYPASSRLS in Supabase — so enabling RLS here has zero effect on
-- Payload's own reads/writes. It only removes anon/authenticated's ability
-- to hit these tables directly through Supabase's REST/GraphQL API. No
-- policies are added on purpose: these tables aren't meant to be reachable
-- through that API at all — Payload's own REST/GraphQL API is the intended
-- data layer for the website.
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_history_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donate_impact_blurbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_org_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_kv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_locked_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_locked_documents_rels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payload_preferences_rels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_info_faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_info_tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_sessions ENABLE ROW LEVEL SECURITY;
