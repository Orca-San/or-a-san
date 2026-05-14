-- OrçaSan - secure SaaS mode with Supabase Auth + RLS
-- Run after the app has the "Conta OrçaSan" login UI.
-- This replaces the temporary prototype unlock from 04/05.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

alter table if exists public.organizations
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

delete from public.organization_members a
using public.organization_members b
where a.ctid < b.ctid
  and a.organization_id = b.organization_id
  and a.user_id = b.user_id;

create unique index if not exists organization_members_org_user_unique
  on public.organization_members(organization_id, user_id);

drop event trigger if exists ensure_rls;
drop function if exists public.rls_auto_enable() cascade;
drop function if exists public.user_belongs_to_organization(uuid) cascade;
drop function if exists public.user_can_edit_organization(uuid) cascade;

create or replace function private.can_access_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1
      from public.organizations org
      where org.id = target_organization_id
        and org.owner_user_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.organization_members om
      where om.organization_id = target_organization_id
        and om.user_id = (select auth.uid())
    );
$$;

create or replace function private.can_access_bid(target_bid_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, auth
as $$
  select exists (
    select 1
    from public.bids b
    where b.id = target_bid_id
      and private.can_access_organization(b.organization_id)
  );
$$;

revoke all on function private.can_access_organization(uuid) from public;
revoke all on function private.can_access_bid(uuid) from public;
grant execute on function private.can_access_organization(uuid) to authenticated;
grant execute on function private.can_access_bid(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.bids enable row level security;
alter table public.bdi_settings enable row level security;
alter table public.budget_items enable row level security;
alter table public.compositions enable row level security;
alter table public.composition_inputs enable row level security;
alter table public.documents enable row level security;

revoke all on table public.organizations from anon;
revoke all on table public.profiles from anon;
revoke all on table public.organization_members from anon;
revoke all on table public.bids from anon;
revoke all on table public.bdi_settings from anon;
revoke all on table public.budget_items from anon;
revoke all on table public.compositions from anon;
revoke all on table public.composition_inputs from anon;
revoke all on table public.documents from anon;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.organizations to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.organization_members to authenticated;
grant select, insert, update, delete on table public.bids to authenticated;
grant select, insert, update, delete on table public.bdi_settings to authenticated;
grant select, insert, update, delete on table public.budget_items to authenticated;
grant select, insert, update, delete on table public.compositions to authenticated;
grant select, insert, update, delete on table public.composition_inputs to authenticated;
grant select, insert, update, delete on table public.documents to authenticated;

drop policy if exists "profiles can read own profile" on public.profiles;
drop policy if exists "profiles can insert own profile" on public.profiles;
drop policy if exists "profiles can update own profile" on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy profiles_select_own
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (id = (select auth.uid()));

create policy profiles_update_own
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "members can read organizations" on public.organizations;
drop policy if exists "admins can update organizations" on public.organizations;
drop policy if exists organizations_select_member on public.organizations;
drop policy if exists organizations_insert_owner on public.organizations;
drop policy if exists organizations_update_member on public.organizations;
drop policy if exists organizations_delete_owner on public.organizations;

create policy organizations_select_member
on public.organizations for select
to authenticated
using (private.can_access_organization(id));

create policy organizations_insert_owner
on public.organizations for insert
to authenticated
with check (owner_user_id = (select auth.uid()));

create policy organizations_update_member
on public.organizations for update
to authenticated
using (private.can_access_organization(id))
with check (private.can_access_organization(id));

create policy organizations_delete_owner
on public.organizations for delete
to authenticated
using (owner_user_id = (select auth.uid()));

drop policy if exists "members can read memberships" on public.organization_members;
drop policy if exists "admins can manage memberships" on public.organization_members;
drop policy if exists organization_members_select_member on public.organization_members;
drop policy if exists organization_members_insert_self on public.organization_members;
drop policy if exists organization_members_update_member on public.organization_members;
drop policy if exists organization_members_delete_self on public.organization_members;

create policy organization_members_select_member
on public.organization_members for select
to authenticated
using (private.can_access_organization(organization_id) or user_id = (select auth.uid()));

create policy organization_members_insert_self
on public.organization_members for insert
to authenticated
with check (user_id = (select auth.uid()) and private.can_access_organization(organization_id));

create policy organization_members_update_member
on public.organization_members for update
to authenticated
using (private.can_access_organization(organization_id))
with check (private.can_access_organization(organization_id));

create policy organization_members_delete_self
on public.organization_members for delete
to authenticated
using (user_id = (select auth.uid()) or private.can_access_organization(organization_id));

drop policy if exists "members can manage bids" on public.bids;
drop policy if exists bids_manage_member on public.bids;

create policy bids_manage_member
on public.bids for all
to authenticated
using (private.can_access_organization(organization_id))
with check (private.can_access_organization(organization_id));

drop policy if exists "members can manage bdi" on public.bdi_settings;
drop policy if exists bdi_settings_manage_member on public.bdi_settings;

create policy bdi_settings_manage_member
on public.bdi_settings for all
to authenticated
using (private.can_access_bid(bid_id))
with check (private.can_access_bid(bid_id));

drop policy if exists "members can manage budget items" on public.budget_items;
drop policy if exists budget_items_manage_member on public.budget_items;

create policy budget_items_manage_member
on public.budget_items for all
to authenticated
using (private.can_access_bid(bid_id))
with check (private.can_access_bid(bid_id));

drop policy if exists "members can manage compositions" on public.compositions;
drop policy if exists compositions_manage_member on public.compositions;

create policy compositions_manage_member
on public.compositions for all
to authenticated
using (private.can_access_organization(organization_id))
with check (private.can_access_organization(organization_id));

drop policy if exists "members can manage composition inputs" on public.composition_inputs;
drop policy if exists composition_inputs_manage_member on public.composition_inputs;

create policy composition_inputs_manage_member
on public.composition_inputs for all
to authenticated
using (
  exists (
    select 1
    from public.compositions c
    where c.id = composition_id
      and private.can_access_organization(c.organization_id)
  )
)
with check (
  exists (
    select 1
    from public.compositions c
    where c.id = composition_id
      and private.can_access_organization(c.organization_id)
  )
);

drop policy if exists "members can manage documents" on public.documents;
drop policy if exists documents_manage_member on public.documents;

create policy documents_manage_member
on public.documents for all
to authenticated
using (
  private.can_access_organization(organization_id)
  and (bid_id is null or private.can_access_bid(bid_id))
)
with check (
  private.can_access_organization(organization_id)
  and (bid_id is null or private.can_access_bid(bid_id))
);

notify pgrst, 'reload schema';

select 'orcasan_secure_auth_rls_enabled' as status;
