-- PanaEXIM 2026 - Canal 1 true booth numbering (1-125)
-- Corrects the earlier temporary A01/L05 scheme and adds the missing south/front booths.
-- Safe to run after 202609080001_booths.sql. Existing admin changes are mapped by physical position where possible.

begin;

alter table public.booths drop constraint if exists booths_code_format;

with legacy_map(old_code, new_code) as (
  values
    ('A01', '17'),
    ('A02', '16'),
    ('A03', '15'),
    ('A04', '14'),
    ('A05', '13'),
    ('A06', '12'),
    ('A07', '11'),
    ('A08', '10'),
    ('A09', '9'),
    ('A10', '8'),
    ('A11', '7'),
    ('A12', '6'),
    ('A13', '5'),
    ('A14', '4'),
    ('A15', '3'),
    ('A16', '2'),
    ('A17', '1'),
    ('B01', '18'),
    ('B02', '43'),
    ('B03', '19'),
    ('B04', '42'),
    ('B05', '20'),
    ('B06', '41'),
    ('B07', '21'),
    ('B08', '40'),
    ('B09', '22'),
    ('B10', '39'),
    ('B11', '23'),
    ('B12', '38'),
    ('C01', '24'),
    ('C02', '37'),
    ('C03', '25'),
    ('C04', '36'),
    ('C05', '26'),
    ('C06', '35'),
    ('C07', '27'),
    ('C08', '34'),
    ('C09', '28'),
    ('C10', '33'),
    ('C11', '29'),
    ('C12', '32'),
    ('D01', '30'),
    ('D02', '31'),
    ('E01', '44'),
    ('E02', '74'),
    ('E03', '45'),
    ('E04', '73'),
    ('E05', '46'),
    ('E06', '72'),
    ('E07', '47'),
    ('E08', '71'),
    ('E09', '48'),
    ('E10', '70'),
    ('E11', '49'),
    ('E12', '69'),
    ('E13', '50'),
    ('E14', '68'),
    ('E15', '51'),
    ('E16', '67'),
    ('E17', '52'),
    ('E18', '66'),
    ('E19', '53'),
    ('E20', '65'),
    ('E21', '54'),
    ('E22', '64'),
    ('E23', '55'),
    ('E24', '63'),
    ('E25', '56'),
    ('E26', '63'),
    ('E27', '57'),
    ('E28', '62'),
    ('F01', '58'),
    ('F02', '61'),
    ('F03', '59'),
    ('F04', '60'),
    ('G01', '75'),
    ('G02', '101'),
    ('G03', '76'),
    ('G04', '100'),
    ('G05', '77'),
    ('G06', '99'),
    ('G07', '78'),
    ('G08', '98'),
    ('G09', '79'),
    ('G10', '97'),
    ('G11', '80'),
    ('G12', '96'),
    ('H01', '81'),
    ('H02', '95'),
    ('H03', '82'),
    ('H04', '94'),
    ('H05', '83'),
    ('H06', '93'),
    ('H07', '84'),
    ('H08', '92'),
    ('H09', '85'),
    ('H10', '91'),
    ('H11', '86'),
    ('H12', '90'),
    ('J01', '87'),
    ('J02', '89'),
    ('J03', '88'),
    ('K01', '102'),
    ('K02', '103'),
    ('K03', '104'),
    ('K04', '105'),
    ('K05', '106'),
    ('K06', '107'),
    ('K07', '108'),
    ('K08', '109'),
    ('K09', '110'),
    ('K10', '111'),
    ('K11', '112'),
    ('K12', '113'),
    ('K13', '114'),
    ('K14', '115'),
    ('K15', '116'),
    ('K16', '117'),
    ('K17', '118'),
    ('L01', '119'),
    ('L02', '120'),
    ('L03', '121'),
    ('L04', '122'),
    ('L05', '123')
),
legacy_status as (
  select
    legacy_map.new_code,
    case
      when bool_or(booths.status = 'occupied') then 'occupied'
      else 'available'
    end as status,
    max(booths.updated_at) as updated_at
  from legacy_map
  join public.booths on booths.code = legacy_map.old_code
  where booths.updated_by is not null
  group by legacy_map.new_code
),
numbered(code) as (
  select generate_series(1, 125)::text
)
insert into public.booths (code, status, updated_at)
select
  numbered.code,
  coalesce(
    legacy_status.status,
    case when numbered.code in ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '27', '28', '29', '30', '31', '32', '33', '34', '55', '56', '57', '58', '59', '60', '62', '63', '85', '87', '88', '89', '90', '119', '120', '121', '122', '123') then 'occupied' else 'available' end
  ),
  coalesce(legacy_status.updated_at, now())
from numbered
left join legacy_status on legacy_status.new_code = numbered.code
on conflict (code) do nothing;

-- Remove only the obsolete temporary identifiers after their status has been copied.
delete from public.booths
where code ~ '^[A-Z][0-9]{2}$';

-- Re-apply the format constraint using the official numeric identifiers 1 through 125.
alter table public.booths
  add constraint booths_code_format
  check (
    code ~ '^[0-9]{1,3}$'
    and code::integer between 1 and 125
    and code = (code::integer)::text
  );

commit;
