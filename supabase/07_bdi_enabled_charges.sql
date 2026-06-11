alter table public.bdi_settings
add column if not exists enabled_charges jsonb not null default '{}'::jsonb;
