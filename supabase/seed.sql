-- Optional demonstration records. Run only after the Phase 5 migration.
insert into public.participants (
  name,
  event_slug,
  country,
  category,
  stand,
  description_es,
  description_en,
  is_featured,
  is_published,
  sort_order
)
values
  ('Demo Jewellery Partner', 'jewellery', 'Panama', 'Fine Jewellery', 'J-101', 'Registro de demostración para comprobar el directorio.', 'Demonstration record for testing the directory.', true, true, 10),
  ('Demo Beauty Lab', 'cosmetica', 'Colombia', 'Skincare', 'C-204', 'Registro de demostración para comprobar el directorio.', 'Demonstration record for testing the directory.', false, true, 20),
  ('Demo Security Systems', 'defensa', 'United States', 'Cybersecurity', 'D-305', 'Registro de demostración para comprobar el directorio.', 'Demonstration record for testing the directory.', false, true, 30),
  ('Demo Energy Group', 'energy', 'Spain', 'Renewable Energy', 'E-408', 'Registro de demostración para comprobar el directorio.', 'Demonstration record for testing the directory.', false, true, 40);
