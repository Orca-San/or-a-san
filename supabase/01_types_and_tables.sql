-- OrçaSan SaaS - Part 1
-- Run this first: enum types and tables.

create extension if not exists "pgcrypto";

create type public.organization_role as enum ('owner', 'admin', 'estimator', 'viewer');
create type public.bid_status as enum ('draft', 'pricing', 'review', 'submitted', 'won', 'lost', 'archived');
create type public.composition_input_type as enum ('labor', 'material', 'equipment', 'service', 'other');
create type public.document_kind as enum ('proposal_pdf', 'budget_xls', 'csv_import', 'backup_json', 'other');

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

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.organization_role not null default 'estimator',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
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
  execution_days integer default 0,
  validity_days integer default 0,
  technical_owner text,
  technical_registry text,
  status public.bid_status not null default 'pricing',
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
  source_composition_id uuid references public.compositions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
