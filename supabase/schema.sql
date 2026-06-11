-- OrçaSan SaaS database schema
-- Target: Supabase/PostgreSQL

create extension if not exists "pgcrypto";

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  document_number text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.organization_role as enum ('owner', 'admin', 'estimator', 'viewer');

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.organization_role not null default 'estimator',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create type public.bid_status as enum (
  'Identificada',
  'Em análise',
  'Aprovada',
  'Recusada',
  'Em orçamento',
  'Em revisão',
  'Proposta enviada',
  'Ganha',
  'Perdida',
  'Declinada'
);

create table public.bids (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  agency text,
  edital_number text,
  location text,
  city text,
  state text,
  work_type text,
  opening_date date,
  estimated_value numeric(18,2) default 0,
  sealed_value boolean default false,
  proposal_deadline date,
  modality text,
  execution_days integer default 0,
  validity_days integer default 0,
  technical_owner text,
  technical_registry text,
  technical_qualification jsonb default '{}'::jsonb,
  status public.bid_status not null default 'Identificada',
  decision text,
  rejection_reason text,
  decision_date date,
  budget_status text default 'Não iniciado',
  budget_owner text,
  budget_start_date date,
  budget_due_date date,
  budget_progress numeric(5,2) default 0,
  budget_progress_manual boolean default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bdi_settings (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid not null unique references public.bids(id) on delete cascade,
  admin numeric(8,4) not null default 0,
  insurance numeric(8,4) not null default 0,
  guarantees numeric(8,4) not null default 0,
  risk numeric(8,4) not null default 0,
  finance numeric(8,4) not null default 0,
  profit numeric(8,4) not null default 0,
  iss numeric(8,4) not null default 0,
  pis_cofins numeric(8,4) not null default 0,
  cprb numeric(8,4) not null default 0,
  other_taxes numeric(8,4) not null default 0,
  enabled_charges jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid not null references public.bids(id) on delete cascade,
  position integer not null default 0,
  stage text,
  code text,
  description text not null,
  unit text not null default 'un',
  quantity numeric(18,4) not null default 0,
  unit_price numeric(18,4) not null default 0,
  source_composition_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.compositions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text,
  title text not null,
  unit text not null default 'un',
  unit_cost numeric(18,4) not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.budget_items
  add constraint budget_items_source_composition_id_fkey
  foreign key (source_composition_id) references public.compositions(id) on delete set null;

create type public.composition_input_type as enum ('labor', 'material', 'equipment', 'service', 'other');

create table public.composition_inputs (
  id uuid primary key default gen_random_uuid(),
  composition_id uuid not null references public.compositions(id) on delete cascade,
  input_type public.composition_input_type not null default 'material',
  description text not null,
  unit text not null default 'un',
  quantity numeric(18,4) not null default 0,
  unit_cost numeric(18,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.document_kind as enum ('proposal_pdf', 'budget_xls', 'csv_import', 'backup_json', 'other');

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  bid_id uuid references public.bids(id) on delete cascade,
  kind public.document_kind not null default 'other',
  file_name text not null,
  storage_path text not null,
  content_type text,
  size_bytes bigint,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

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
