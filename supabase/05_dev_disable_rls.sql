-- OrçaSan - temporary RLS unlock for prototype testing
-- Use only before the app has login and production security policies.
-- This lets the static PWA write/read through the Supabase Data API.

alter table if exists public.organizations disable row level security;
alter table if exists public.bids disable row level security;
alter table if exists public.bdi_settings disable row level security;
alter table if exists public.budget_items disable row level security;
alter table if exists public.compositions disable row level security;
alter table if exists public.composition_inputs disable row level security;
alter table if exists public.documents disable row level security;
alter table if exists public.profiles disable row level security;
alter table if exists public.organization_members disable row level security;

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.organizations to anon, authenticated;
grant select, insert, update, delete on table public.bids to anon, authenticated;
grant select, insert, update, delete on table public.bdi_settings to anon, authenticated;
grant select, insert, update, delete on table public.budget_items to anon, authenticated;
grant select, insert, update, delete on table public.compositions to anon, authenticated;
grant select, insert, update, delete on table public.composition_inputs to anon, authenticated;
grant select, insert, update, delete on table public.documents to anon, authenticated;
grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.organization_members to anon, authenticated;

notify pgrst, 'reload schema';

select 'orcasan_dev_rls_disabled' as status;
