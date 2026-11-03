-- Izin default untuk section Sejarah (tabel jm_center_pages, slug 'sejarah').
-- Policy RLS dari 20261103_admin_v2_permissions.sql sudah berlaku via replace(slug,'-','_').
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish) VALUES
  ('admin_yayasan',  'sejarah', true, true,  true,  false, true),
  ('kepala_sekolah', 'sejarah', true, false, true,  false, true),
  ('guru',           'sejarah', true, false, false, false, false),
  ('musyrif',        'sejarah', true, false, false, false, false),
  ('staff_ppdb',     'sejarah', true, false, false, false, false),
  ('keuangan',       'sejarah', true, false, false, false, false),
  ('humas',          'sejarah', true, true,  true,  false, true),
  ('pengurus_konten','sejarah', true, true,  true,  false, true)
ON CONFLICT (role, section) DO NOTHING;

