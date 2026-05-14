-- OrçaSan - temporary API grants for prototype testing
-- Run this only while the app does not have login/RLS yet.
-- Before real customers, replace this with authenticated RLS policies.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.organizations to anon, authenticated;
grant select, insert, update, delete on table public.bids to anon, authenticated;
grant select, insert, update, delete on table public.bdi_settings to anon, authenticated;
grant select, insert, update, delete on table public.budget_items to anon, authenticated;
grant select, insert, update, delete on table public.compositions to anon, authenticated;
grant select, insert, update, delete on table public.composition_inputs to anon, authenticated;
grant select, insert, update, delete on table public.documents to anon, authenticated;

-- Profiles and organization_members are not used by the static prototype yet,
-- but are kept readable/writable for the same temporary development flow.
grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.organization_members to anon, authenticated;

select 'orcasan_dev_api_grants_applied' as status;
