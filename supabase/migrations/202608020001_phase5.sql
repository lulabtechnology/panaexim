-- PanaEXIM 2026 - Phase 5
-- Participant directory, admin authorization, private logo storage and rate limiting.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'PanaEXIM Admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_panaexim_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_panaexim_admin() from public;
grant execute on function public.is_panaexim_admin() to authenticated;

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 180),
  event_slug text not null check (event_slug in ('jewellery', 'cosmetica', 'defensa', 'energy')),
  country text not null check (char_length(country) between 1 and 100),
  category text not null check (char_length(category) between 1 and 140),
  website text,
  stand text,
  description_es text,
  description_en text,
  logo_path text,
  logo_alt text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists participants_event_order_idx
  on public.participants (event_slug, sort_order, name);
create index if not exists participants_published_idx
  on public.participants (is_published) where is_published = true;
create index if not exists participants_country_idx
  on public.participants (country);

alter table public.participants enable row level security;

drop policy if exists "Admins can read their profile" on public.admin_users;
create policy "Admins can read their profile"
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Admins manage participants" on public.participants;
create policy "Admins manage participants"
on public.participants
for all
to authenticated
using ((select public.is_panaexim_admin()))
with check ((select public.is_panaexim_admin()));

create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings
for all
to authenticated
using ((select public.is_panaexim_admin()))
with check ((select public.is_panaexim_admin()));

create table if not exists public.participant_login_attempts (
  identifier_hash text primary key,
  attempts integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.participant_login_attempts enable row level security;
-- No anon/authenticated policies: only the service role may use this table.

revoke all on table public.admin_users from anon;
revoke all on table public.participants from anon;
revoke all on table public.site_settings from anon;
revoke all on table public.participant_login_attempts from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.participants to authenticated;
grant select, insert, update, delete on table public.site_settings to authenticated;

drop trigger if exists participants_set_updated_at on public.participants;
create trigger participants_set_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists participant_attempts_set_updated_at on public.participant_login_attempts;
create trigger participant_attempts_set_updated_at
before update on public.participant_login_attempts
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'participant-logos',
  'participant-logos',
  false,
  4194304,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins read participant logos" on storage.objects;
create policy "Admins read participant logos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'participant-logos'
  and (select public.is_panaexim_admin())
);

drop policy if exists "Admins upload participant logos" on storage.objects;
create policy "Admins upload participant logos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'participant-logos'
  and (select public.is_panaexim_admin())
);

drop policy if exists "Admins update participant logos" on storage.objects;
create policy "Admins update participant logos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'participant-logos'
  and (select public.is_panaexim_admin())
)
with check (
  bucket_id = 'participant-logos'
  and (select public.is_panaexim_admin())
);

drop policy if exists "Admins delete participant logos" on storage.objects;
create policy "Admins delete participant logos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'participant-logos'
  and (select public.is_panaexim_admin())
);
