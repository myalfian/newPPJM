-- Admin v2: 8 role, matriks permission per section, RLS ketat.
-- Jalankan di Supabase SQL Editor. Jika ALTER TYPE ditolak dalam transaksi,
-- jalankan blok 1 terpisah dari blok lainnya.

-- 1. Role baru (kompatibel dengan enum user_role yang sudah ada)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_yayasan';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'kepala_sekolah';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guru';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'musyrif';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'staff_ppdb';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'keuangan';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'humas';

-- 2. Matriks permission (role x section)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role        text NOT NULL,
  section     text NOT NULL,
  can_view    boolean NOT NULL DEFAULT false,
  can_create  boolean NOT NULL DEFAULT false,
  can_edit    boolean NOT NULL DEFAULT false,
  can_delete  boolean NOT NULL DEFAULT false,
  can_publish boolean NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, section)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 3. Helper permission. SECURITY DEFINER agar tidak bergantung RLS admin_profiles.
CREATE OR REPLACE FUNCTION public.has_perm(p_section text, p_action text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE((
    SELECT CASE
      WHEN ap.role::text = 'super_admin' THEN true
      ELSE EXISTS (
        SELECT 1 FROM public.role_permissions rp
        WHERE rp.role = ap.role::text
          AND rp.section = p_section
          AND CASE p_action
                WHEN 'view'    THEN rp.can_view
                WHEN 'create'  THEN rp.can_create
                WHEN 'edit'    THEN rp.can_edit
                WHEN 'delete'  THEN rp.can_delete
                WHEN 'publish' THEN rp.can_publish
                ELSE false
              END
      )
    END
    FROM public.admin_profiles ap
    WHERE ap.id = auth.uid() AND ap.is_active IS DISTINCT FROM false
  ), false);
$$;

REVOKE ALL ON FUNCTION public.has_perm(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_perm(text, text) TO authenticated;

DROP POLICY IF EXISTS "perm_read_authenticated" ON public.role_permissions;
CREATE POLICY "perm_read_authenticated" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "perm_write_super_admin" ON public.role_permissions;
CREATE POLICY "perm_write_super_admin" ON public.role_permissions
  FOR ALL TO authenticated
  USING (public.has_perm('roles', 'edit'))
  WITH CHECK (public.has_perm('roles', 'edit'));

REVOKE ALL ON public.role_permissions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.role_permissions TO authenticated;

-- 4. Seed default (bisa diubah super admin dari halaman Role & Credential)
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish) VALUES
  ('admin_yayasan',  'visi_misi', true, true,  true,  false, true),
  ('admin_yayasan',  'roles',     true, false, false, false, false),
  ('kepala_sekolah', 'visi_misi', true, false, true,  false, true),
  ('guru',           'visi_misi', true, false, false, false, false),
  ('musyrif',        'visi_misi', true, false, false, false, false),
  ('staff_ppdb',     'visi_misi', true, false, false, false, false),
  ('keuangan',       'visi_misi', true, false, false, false, false),
  ('humas',          'visi_misi', true, true,  true,  false, true),
  ('pengurus_konten','visi_misi', true, true,  true,  false, true)
ON CONFLICT (role, section) DO NOTHING;

-- 5. Tutup celah lama: policy "FOR ALL USING (true)" + GRANT ke anon
--    membuat siapa pun bisa menulis jm_center_pages.
DROP POLICY IF EXISTS "Admin manage jm_center_pages" ON public.jm_center_pages;
DROP POLICY IF EXISTS "jm_center_pages_insert" ON public.jm_center_pages;
DROP POLICY IF EXISTS "jm_center_pages_update" ON public.jm_center_pages;
DROP POLICY IF EXISTS "jm_center_pages_delete" ON public.jm_center_pages;

CREATE POLICY "jm_center_pages_insert" ON public.jm_center_pages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_perm(replace(slug, '-', '_'), 'create'));
CREATE POLICY "jm_center_pages_update" ON public.jm_center_pages
  FOR UPDATE TO authenticated
  USING (public.has_perm(replace(slug, '-', '_'), 'edit'))
  WITH CHECK (public.has_perm(replace(slug, '-', '_'), 'edit'));
CREATE POLICY "jm_center_pages_delete" ON public.jm_center_pages
  FOR DELETE TO authenticated
  USING (public.has_perm(replace(slug, '-', '_'), 'delete'));

REVOKE INSERT, UPDATE, DELETE ON public.jm_center_pages FROM anon;

