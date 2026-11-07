-- ==============================================================================
-- MIGRATION: 20261107_rbac_three_layer_hardening.sql
-- TUJUAN:
-- 1. Tambah label 'osis_pengurus' ke enum public.user_role
-- 2. Perbarui trigger sync_profile_to_admin_profiles & fungsi has_perm
-- 3. Ganti blanket RLS pada karya_siswa & program_activity_photos dengan granular RLS
-- 4. Tambah policy DELETE pada storage.objects untuk pembersihan file yatim
-- 5. Lengkapi izin role_permissions untuk osis_pengurus
-- ==============================================================================

-- 1. Perbarui enum user_role
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'osis_pengurus';

-- 2. Perbarui trigger sync_profile_to_admin_profiles
CREATE OR REPLACE FUNCTION public.sync_profile_to_admin_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.admin_profiles (id, full_name, role, is_active, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.full_name, NEW.username, 'User PPJM'),
    CASE
      WHEN NEW.role IN (
        'super_admin','admin_yayasan','kepala_sekolah','staff_ppdb','pengurus_konten',
        'guru_akademik','yayasan','kepsek','guru','musyrif','santri','ppdb','keuangan',
        'humas','osis_pengurus','user'
      )
        THEN NEW.role::public.user_role
      ELSE 'user'::public.user_role
    END,
    COALESCE(NEW.status_aktif, true),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Perbarui fungsi has_perm
CREATE OR REPLACE FUNCTION public.has_perm(p_section text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_raw_role text;
  v_canonical_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  -- Check public.profiles first, fallback to public.admin_profiles
  SELECT COALESCE(
    (SELECT p.role::text FROM public.profiles p WHERE p.id = v_uid AND COALESCE(p.status_aktif, true) = true LIMIT 1),
    (SELECT ap.role::text FROM public.admin_profiles ap WHERE ap.id = v_uid AND ap.is_active IS DISTINCT FROM false LIMIT 1)
  ) INTO v_raw_role;

  IF v_raw_role IS NULL THEN
    RETURN false;
  END IF;

  v_canonical_role := lower(btrim(v_raw_role));
  IF v_canonical_role IN ('super_admin', 'superadmin', 'admin') THEN
    RETURN true;
  ELSIF v_canonical_role IN ('yayasan', 'admin_yayasan') THEN
    v_canonical_role := 'yayasan';
  ELSIF v_canonical_role IN ('kepsek', 'kepala_sekolah') THEN
    v_canonical_role := 'kepsek';
  ELSIF v_canonical_role IN ('humas', 'pengurus_konten', 'media') THEN
    v_canonical_role := 'humas';
  ELSIF v_canonical_role IN ('guru', 'guru_akademik', 'ustadz') THEN
    v_canonical_role := 'guru';
  ELSIF v_canonical_role IN ('ppdb', 'staff_ppdb') THEN
    v_canonical_role := 'ppdb';
  ELSIF v_canonical_role IN ('osis_pengurus', 'pengurus_osis', 'osis', 'ketua_osis') THEN
    v_canonical_role := 'osis_pengurus';
  END IF;

  -- Super Admin always has full permission
  IF v_canonical_role = 'super_admin' THEN
    RETURN true;
  END IF;

  -- Check role_permissions matching either raw role or canonical role
  RETURN EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    WHERE (lower(rp.role) = v_canonical_role OR lower(rp.role) = lower(v_raw_role))
      AND rp.section = p_section
      AND CASE p_action
            WHEN 'view'    THEN rp.can_view
            WHEN 'create'  THEN rp.can_create
            WHEN 'edit'    THEN rp.can_edit
            WHEN 'delete'  THEN rp.can_delete
            WHEN 'publish' THEN rp.can_publish
            ELSE false
          END
  );
END;
$function$;

-- 4. Granular RLS Policy untuk karya_siswa
DROP POLICY IF EXISTS "Auth CRUD karya_siswa" ON public.karya_siswa;
DROP POLICY IF EXISTS "Public Read karya_siswa" ON public.karya_siswa;
DROP POLICY IF EXISTS "ppjm_public_karya_siswa" ON public.karya_siswa;
DROP POLICY IF EXISTS "perm_insert_karya_siswa" ON public.karya_siswa;
DROP POLICY IF EXISTS "perm_update_karya_siswa" ON public.karya_siswa;
DROP POLICY IF EXISTS "perm_delete_karya_siswa" ON public.karya_siswa;

CREATE POLICY "ppjm_public_karya_siswa" ON public.karya_siswa
  FOR SELECT TO anon, authenticated
  USING (is_active IS TRUE OR has_perm('karya_siswa', 'view'));

CREATE POLICY "perm_insert_karya_siswa" ON public.karya_siswa
  FOR INSERT TO authenticated
  WITH CHECK (has_perm('karya_siswa', 'create'));

CREATE POLICY "perm_update_karya_siswa" ON public.karya_siswa
  FOR UPDATE TO authenticated
  USING (has_perm('karya_siswa', 'edit'))
  WITH CHECK (has_perm('karya_siswa', 'edit'));

CREATE POLICY "perm_delete_karya_siswa" ON public.karya_siswa
  FOR DELETE TO authenticated
  USING (has_perm('karya_siswa', 'delete'));

-- 5. Granular RLS Policy untuk program_activity_photos
DROP POLICY IF EXISTS "Auth CRUD program_activity_photos" ON public.program_activity_photos;
DROP POLICY IF EXISTS "Public Read program_activity_photos" ON public.program_activity_photos;
DROP POLICY IF EXISTS "ppjm_public_program_activity_photos" ON public.program_activity_photos;
DROP POLICY IF EXISTS "perm_insert_program_photos" ON public.program_activity_photos;
DROP POLICY IF EXISTS "perm_update_program_photos" ON public.program_activity_photos;
DROP POLICY IF EXISTS "perm_delete_program_photos" ON public.program_activity_photos;

CREATE POLICY "ppjm_public_program_activity_photos" ON public.program_activity_photos
  FOR SELECT TO anon, authenticated
  USING (is_active IS TRUE OR has_perm('program_photos', 'view'));

CREATE POLICY "perm_insert_program_photos" ON public.program_activity_photos
  FOR INSERT TO authenticated
  WITH CHECK (has_perm('program_photos', 'create'));

CREATE POLICY "perm_update_program_photos" ON public.program_activity_photos
  FOR UPDATE TO authenticated
  USING (has_perm('program_photos', 'edit'))
  WITH CHECK (has_perm('program_photos', 'edit'));

CREATE POLICY "perm_delete_program_photos" ON public.program_activity_photos
  FOR DELETE TO authenticated
  USING (has_perm('program_photos', 'delete'));

-- 6. Storage Policy DELETE untuk pembersihan file yatim
DROP POLICY IF EXISTS "Staff can delete CMS images" ON storage.objects;
CREATE POLICY "Staff can delete CMS images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = ANY (ARRAY['cms-images', 'berita-images', 'galeri-foto', 'prestasi-certificates', 'stem-portfolios', 'madin-flyers'])
    AND (
      public.is_staff_or_guru()
      OR public.is_role('super_admin')
      OR public.is_role('humas')
      OR public.is_role('kepsek')
    )
  );

-- 7. Izin Lengkap role_permissions untuk osis_pengurus
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish, updated_at)
VALUES
  ('osis_pengurus', 'osis_events', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_programs', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_structure', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_data_tabel', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_foto', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_video', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_dokumen', true, true, true, true, true, now()),
  ('osis_pengurus', 'osis_naskah', true, true, true, true, true, now()),
  ('osis_pengurus', 'info_terkini', true, true, true, false, false, now()),
  ('osis_pengurus', 'karya_siswa', true, true, true, false, false, now())
ON CONFLICT (role, section) DO UPDATE
SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete,
  can_publish = EXCLUDED.can_publish,
  updated_at = now();

-- Izin karya_siswa dan program_photos untuk guru dan kepsek
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish, updated_at)
VALUES
  ('guru', 'karya_siswa', true, true, true, false, false, now()),
  ('guru', 'program_photos', true, true, true, false, false, now()),
  ('kepsek', 'karya_siswa', true, true, true, true, true, now()),
  ('kepsek', 'program_photos', true, true, true, true, true, now())
ON CONFLICT (role, section) DO UPDATE
SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete,
  can_publish = EXCLUDED.can_publish,
  updated_at = now();

