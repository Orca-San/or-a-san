-- OrçaSan SaaS - Part 3
-- Run this after 02_functions_and_rls.sql.

create policy "profiles can read own profile"
on public.profiles for select
using (id = auth.uid());

create policy "profiles can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can read their organizations"
on public.organizations for select
using (public.user_belongs_to_organization(id));

create policy "admins can update organization"
on public.organizations for update
using (public.user_can_edit_organization(id))
with check (public.user_can_edit_organization(id));

create policy "members can read memberships"
on public.organization_members for select
using (public.user_belongs_to_organization(organization_id));

create policy "admins can manage memberships"
on public.organization_members for all
using (public.user_can_edit_organization(organization_id))
with check (public.user_can_edit_organization(organization_id));

create policy "members can read bids"
on public.bids for select
using (public.user_belongs_to_organization(organization_id));

create policy "editors can manage bids"
on public.bids for all
using (public.user_can_edit_organization(organization_id))
with check (public.user_can_edit_organization(organization_id));

create policy "members can read bdi settings"
on public.bdi_settings for select
using (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_belongs_to_organization(b.organization_id)
  )
);

create policy "editors can manage bdi settings"
on public.bdi_settings for all
using (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_can_edit_organization(b.organization_id)
  )
)
with check (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_can_edit_organization(b.organization_id)
  )
);

create policy "members can read budget items"
on public.budget_items for select
using (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_belongs_to_organization(b.organization_id)
  )
);

create policy "editors can manage budget items"
on public.budget_items for all
using (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_can_edit_organization(b.organization_id)
  )
)
with check (
  exists (
    select 1 from public.bids b
    where b.id = bid_id
      and public.user_can_edit_organization(b.organization_id)
  )
);

create policy "members can read compositions"
on public.compositions for select
using (public.user_belongs_to_organization(organization_id));

create policy "editors can manage compositions"
on public.compositions for all
using (public.user_can_edit_organization(organization_id))
with check (public.user_can_edit_organization(organization_id));

create policy "members can read composition inputs"
on public.composition_inputs for select
using (
  exists (
    select 1 from public.compositions c
    where c.id = composition_id
      and public.user_belongs_to_organization(c.organization_id)
  )
);

create policy "editors can manage composition inputs"
on public.composition_inputs for all
using (
  exists (
    select 1 from public.compositions c
    where c.id = composition_id
      and public.user_can_edit_organization(c.organization_id)
  )
)
with check (
  exists (
    select 1 from public.compositions c
    where c.id = composition_id
      and public.user_can_edit_organization(c.organization_id)
  )
);

create policy "members can read documents"
on public.documents for select
using (public.user_belongs_to_organization(organization_id));

create policy "editors can manage documents"
on public.documents for all
using (public.user_can_edit_organization(organization_id))
with check (public.user_can_edit_organization(organization_id));

create policy "members can read audit events"
on public.audit_events for select
using (organization_id is null or public.user_belongs_to_organization(organization_id));

create index bids_organization_id_idx on public.bids(organization_id);
create index bids_status_idx on public.bids(status);
create index bids_opening_date_idx on public.bids(opening_date);
create index budget_items_bid_id_idx on public.budget_items(bid_id);
create index compositions_organization_id_idx on public.compositions(organization_id);
create index composition_inputs_composition_id_idx on public.composition_inputs(composition_id);
create index documents_organization_id_idx on public.documents(organization_id);
create index documents_bid_id_idx on public.documents(bid_id);
