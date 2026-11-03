-- Admin v2: section Fasilitas (tabel public.facilities).

-- 1. Kolom yang sudah dipakai halaman publik tetapi belum ada di schema repo
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS capacity text;
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS features jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. RLS: ganti policy lama (terbuka) dengan pengecekan izin per role
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage facilities" ON public.facilities;
DROP POLICY IF EXISTS "facilities_staff_read_all" ON public.facilities;
DROP POLICY IF EXISTS "facilities_insert" ON public.facilities;
DROP POLICY IF EXISTS "facilities_update" ON public.facilities;
DROP POLICY IF EXISTS "facilities_delete" ON public.facilities;

-- staf boleh melihat juga yang non-aktif (publik tetap hanya melihat is_active lewat policy lama)
CREATE POLICY "facilities_staff_read_all" ON public.facilities
  FOR SELECT TO authenticated USING (public.has_perm('fasilitas', 'view'));
CREATE POLICY "facilities_insert" ON public.facilities
  FOR INSERT TO authenticated WITH CHECK (public.has_perm('fasilitas', 'create'));
CREATE POLICY "facilities_update" ON public.facilities
  FOR UPDATE TO authenticated
  USING (public.has_perm('fasilitas', 'edit')) WITH CHECK (public.has_perm('fasilitas', 'edit'));
CREATE POLICY "facilities_delete" ON public.facilities
  FOR DELETE TO authenticated USING (public.has_perm('fasilitas', 'delete'));

REVOKE INSERT, UPDATE, DELETE ON public.facilities FROM anon;

-- 3. Upload gambar untuk role baru (tambahan, tidak menghapus policy lama)
DROP POLICY IF EXISTS "Perm Upload CMS Images" ON storage.objects;
CREATE POLICY "Perm Upload CMS Images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-images' AND public.has_perm('fasilitas', 'edit'));

-- 4. Izin default
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish) VALUES
  ('admin_yayasan',  'fasilitas', true, true,  true,  true,  true),
  ('kepala_sekolah', 'fasilitas', true, true,  true,  false, true),
  ('guru',           'fasilitas', true, false, false, false, false),
  ('musyrif',        'fasilitas', true, false, true,  false, false),
  ('staff_ppdb',     'fasilitas', true, false, false, false, false),
  ('keuangan',       'fasilitas', true, false, false, false, false),
  ('humas',          'fasilitas', true, true,  true,  false, true),
  ('pengurus_konten','fasilitas', true, true,  true,  false, true)
ON CONFLICT (role, section) DO NOTHING;

