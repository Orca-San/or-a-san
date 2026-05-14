-- Use only if the first schema execution failed halfway and you want to start over.
-- This removes OrçaSan tables, functions and enum types from the public schema.

drop table if exists public.audit_events cascade;
drop table if exists public.documents cascade;
drop table if exists public.composition_inputs cascade;
drop table if exists public.budget_items cascade;
drop table if exists public.compositions cascade;
drop table if exists public.bdi_settings cascade;
drop table if exists public.bids cascade;
drop table if exists public.organization_members cascade;
drop table if exists public.profiles cascade;
drop table if exists public.organizations cascade;

drop function if exists public.user_can_edit_organization(uuid) cascade;
drop function if exists public.user_belongs_to_organization(uuid) cascade;
drop function if exists public.touch_updated_at() cascade;

drop type if exists public.document_kind cascade;
drop type if exists public.composition_input_type cascade;
drop type if exists public.bid_status cascade;
drop type if exists public.organization_role cascade;
