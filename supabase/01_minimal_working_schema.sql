-- OrçaSan minimal cloud schema
-- Run this whole file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  document_number text,
  email text,
  phone text,
  city text,
  state text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  agency text,
  edital_number text,
  location text,
  work_type text,
  opening_date date,
  execution_days integer default 0,
  validity_days integer default 0,
  technical_owner text,
  technical_registry text,
  status text not null default 'pricing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bdi_settings (
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
  created_at timestamptz not null default now()
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid not null references public.bids(id) on delete cascade,
  position integer not null default 0,
  stage text,
  code text,
  description text not null,
  unit text not null default 'un',
  quantity numeric(18,4) not null default 0,
  unit_price numeric(18,4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.compositions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text,
  title text not null,
  unit text not null default 'un',
  unit_cost numeric(18,4) not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.composition_inputs (
  id uuid primary key default gen_random_uuid(),
  composition_id uuid not null references public.compositions(id) on delete cascade,
  input_type text not null default 'material',
  description text not null,
  unit text not null default 'un',
  quantity numeric(18,4) not null default 0,
  unit_cost numeric(18,4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  bid_id uuid references public.bids(id) on delete cascade,
  kind text not null default 'other',
  file_name text not null,
  storage_path text not null,
  content_type text,
  created_at timestamptz not null default now()
);

create index if not exists bids_organization_id_idx on public.bids(organization_id);
create index if not exists budget_items_bid_id_idx on public.budget_items(bid_id);
create index if not exists compositions_organization_id_idx on public.compositions(organization_id);
create index if not exists composition_inputs_composition_id_idx on public.composition_inputs(composition_id);

select 'orcasan_minimal_schema_created' as status;
