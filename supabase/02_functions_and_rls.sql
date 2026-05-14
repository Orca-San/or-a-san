-- OrçaSan SaaS - Part 2
-- Run this after 01_types_and_tables.sql.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_touch_updated_at
before update on public.organizations
for each row execute function public.touch_updated_at();

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger bids_touch_updated_at
before update on public.bids
for each row execute function public.touch_updated_at();

create trigger bdi_settings_touch_updated_at
before update on public.bdi_settings
for each row execute function public.touch_updated_at();

create trigger budget_items_touch_updated_at
before update on public.budget_items
for each row execute function public.touch_updated_at();

create trigger compositions_touch_updated_at
before update on public.compositions
for each row execute function public.touch_updated_at();

create trigger composition_inputs_touch_updated_at
before update on public.composition_inputs
for each row execute function public.touch_updated_at();

create or replace function public.user_belongs_to_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.user_can_edit_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin', 'estimator')
  );
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.bids enable row level security;
alter table public.bdi_settings enable row level security;
alter table public.budget_items enable row level security;
alter table public.compositions enable row level security;
alter table public.composition_inputs enable row level security;
alter table public.documents enable row level security;
alter table public.audit_events enable row level security;
