-- Admin v2: RLS & Default Permissions untuk seluruh 22 section CRUD
-- Jalankan di Supabase SQL Editor setelah 20261103_admin_v2_permissions.sql

-- 1. Helper Macro Prosedur untuk memasang RLS berbasis has_perm(table_name, action)
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'sliders', 'quick_menus', 'kontak_medsos', 'sambutan_persons',
    'berita', 'agendas', 'galeri_foto', 'galeri_videos', 'prestasi',
    'programs_pondok', 'programs_sekolah', 'madin_flyers', 'ekskul', 'institutions',
    'mandarin_lessons', 'mandarin_vocabularies', 'stem_worksheets', 'stem_projects',
    'spmb_info', 'osis_events', 'osis_programs', 'osis_structure'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

      -- Pastikan publik tetap bisa membaca
      EXECUTE format('DROP POLICY IF EXISTS "public_read_%I" ON public.%I;', t, t);
      EXECUTE format('CREATE POLICY "public_read_%I" ON public.%I FOR SELECT USING (true);', t, t);

      -- Cabut hak tulis anon
      EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon;', t);
      EXECUTE format('GRANT SELECT ON public.%I TO anon;', t);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);

      -- Pasang policy tulis berbasis has_perm
      EXECUTE format('DROP POLICY IF EXISTS "perm_insert_%I" ON public.%I;', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "perm_update_%I" ON public.%I;', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "perm_delete_%I" ON public.%I;', t, t);

      EXECUTE format(
        'CREATE POLICY "perm_insert_%I" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_perm(%L, ''create''));',
        t, t, t
      );
      EXECUTE format(
        'CREATE POLICY "perm_update_%I" ON public.%I FOR UPDATE TO authenticated USING (public.has_perm(%L, ''edit'')) WITH CHECK (public.has_perm(%L, ''edit''));',
        t, t, t, t
      );
      EXECUTE format(
        'CREATE POLICY "perm_delete_%I" ON public.%I FOR DELETE TO authenticated USING (public.has_perm(%L, ''delete''));',
        t, t, t
      );
    END IF;
  END LOOP;
END $$;

-- 2. Perluas policy upload gambar di storage 'cms-images' agar mengizinkan staf aktif mana pun
DROP POLICY IF EXISTS "Perm Upload CMS Images" ON storage.objects;
CREATE POLICY "Perm Upload CMS Images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms-images' AND EXISTS (
      SELECT 1 FROM public.admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.is_active IS DISTINCT FROM false
        AND ap.role::text <> 'user'
    )
  );

-- 3. Seed default matriks permission untuk seluruh section
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish)
SELECT r.role, s.section,
  true AS can_view,
  (r.role IN ('admin_yayasan', 'kepala_sekolah', 'humas', 'pengurus_konten')
    OR (r.role = 'guru' AND s.section IN ('programs_sekolah', 'ekskul', 'mandarin_lessons', 'mandarin_vocabularies', 'stem_worksheets', 'stem_projects', 'prestasi'))
    OR (r.role = 'musyrif' AND s.section IN ('programs_pondok', 'madin_flyers', 'agendas', 'osis_events', 'osis_programs', 'osis_structure'))
    OR (r.role = 'staff_ppdb' AND s.section IN ('spmb_info', 'kontak_medsos'))
  ) AS can_create,
  (r.role IN ('admin_yayasan', 'kepala_sekolah', 'humas', 'pengurus_konten')
    OR (r.role = 'guru' AND s.section IN ('programs_sekolah', 'ekskul', 'mandarin_lessons', 'mandarin_vocabularies', 'stem_worksheets', 'stem_projects', 'prestasi'))
    OR (r.role = 'musyrif' AND s.section IN ('programs_pondok', 'madin_flyers', 'agendas', 'osis_events', 'osis_programs', 'osis_structure'))
    OR (r.role = 'staff_ppdb' AND s.section IN ('spmb_info', 'kontak_medsos'))
  ) AS can_edit,
  (r.role IN ('admin_yayasan', 'pengurus_konten')) AS can_delete,
  (r.role IN ('admin_yayasan', 'kepala_sekolah', 'humas', 'pengurus_konten')
    OR (r.role = 'staff_ppdb' AND s.section = 'spmb_info')
  ) AS can_publish
FROM (
  VALUES
    ('admin_yayasan'), ('kepala_sekolah'), ('guru'), ('musyrif'),
    ('staff_ppdb'), ('keuangan'), ('humas'), ('pengurus_konten')
) AS r(role)
CROSS JOIN (
  VALUES
    ('sliders'), ('quick_menus'), ('kontak_medsos'), ('sambutan_persons'),
    ('berita'), ('agendas'), ('galeri_foto'), ('galeri_videos'), ('prestasi'),
    ('programs_pondok'), ('programs_sekolah'), ('madin_flyers'), ('ekskul'), ('institutions'),
    ('mandarin_lessons'), ('mandarin_vocabularies'), ('stem_worksheets'), ('stem_projects'),
    ('spmb_info'), ('osis_events'), ('osis_programs'), ('osis_structure')
) AS s(section)
ON CONFLICT (role, section) DO NOTHING;

