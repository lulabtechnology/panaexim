-- PanaEXIM 2026 - Canal 1 booth availability
-- 124 public booth codes. Exhibitor names are intentionally not stored here.

create table if not exists public.booths (
  code text primary key,
  status text not null default 'available' check (status in ('available', 'occupied')),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booths_code_format check (code ~ '^[A-Z][0-9]{2}$')
);

create index if not exists booths_status_idx on public.booths (status, code);

alter table public.booths enable row level security;

drop policy if exists "Admins manage booths" on public.booths;
create policy "Admins manage booths"
on public.booths
for all
to authenticated
using ((select public.is_panaexim_admin()))
with check ((select public.is_panaexim_admin()));

revoke all on table public.booths from anon;
grant select, insert, update on table public.booths to authenticated;

drop trigger if exists booths_set_updated_at on public.booths;
create trigger booths_set_updated_at
before update on public.booths
for each row execute function public.set_updated_at();

-- Seed the exact 124 booth identifiers used by the interactive Canal 1 plan.
-- ON CONFLICT DO NOTHING keeps any availability already changed by an administrator.
with booth_groups(prefix, quantity) as (
  values
    ('A', 17),
    ('B', 12),
    ('C', 12),
    ('D', 2),
    ('E', 28),
    ('F', 4),
    ('G', 12),
    ('H', 12),
    ('J', 3),
    ('K', 17),
    ('L', 5)
), booth_codes as (
  select prefix || lpad(number::text, 2, '0') as code
  from booth_groups
  cross join lateral generate_series(1, quantity) as series(number)
), occupied_codes(code) as (
  values
    ('A01'), ('A02'), ('A03'), ('A04'), ('A05'), ('A06'), ('A07'), ('A08'), ('A09'),
    ('A10'), ('A11'), ('A12'), ('A13'), ('A14'), ('A15'), ('A16'), ('A17'),
    ('C07'), ('C08'), ('C09'), ('C10'), ('C11'), ('C12'),
    ('D01'), ('D02'),
    ('E23'), ('E25'), ('E26'), ('E27'), ('E28'),
    ('F01'), ('F03'), ('F04'),
    ('H07'), ('H10'),
    ('J01'), ('J02'), ('J03'),
    ('L01'), ('L02'), ('L03'), ('L04'), ('L05')
)
insert into public.booths (code, status)
select
  booth_codes.code,
  case when occupied_codes.code is null then 'available' else 'occupied' end
from booth_codes
left join occupied_codes using (code)
on conflict (code) do nothing;
