-- =============================================================================
-- Migration: 20261107_security_and_storage_hardening.sql
-- Description:
--   1. Secure RPC admin_upsert_user_account against horizontal & vertical privilege escalation.
--   2. Revoke anonymous direct execute on internal SECURITY DEFINER trigger functions.
--   3. Protect Santri PII: Guest (anon) can only view public staff/teacher profiles.
--   4. Harden Storage Buckets (santri-uploads & tugas): 15 MB limit, strict MIME whitelist.
--   5. Fix Storage Objects RLS: remove anonymous UPDATE policy on public image buckets.
--   6. Fix grading & editing vulnerability in tugas & tugas_submission (remove guru_id IS NULL loophole).
--   7. Fix user_registrations insert policy to allow staff roles (guru, musyrif, ppdb, etc.) + index covering.
--   8. Cache auth.uid() in RLS policies with (SELECT auth.uid()) to optimize query performance.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HARDEN RPC admin_upsert_user_account (PRIVILEGE ESCALATION FIX)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_upsert_user_account(
  p_id uuid DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_password text DEFAULT NULL,
  p_full_name text DEFAULT NULL,
  p_username text DEFAULT NULL,
  p_role text DEFAULT 'santri',
  p_nis text DEFAULT NULL,
  p_nip text DEFAULT NULL,
  p_kelas text DEFAULT NULL,
  p_angkatan text DEFAULT NULL,
  p_asrama_kamar text DEFAULT NULL,
  p_mapel_ampu text[] DEFAULT '{}'::text[],
  p_kelas_ampu text[] DEFAULT '{}'::text[],
  p_jabatan text DEFAULT NULL,
  p_status_aktif boolean DEFAULT true,
  p_foto_url text DEFAULT NULL,
  p_bio jsonb DEFAULT NULL,
  p_alamat_lengkap text DEFAULT NULL,
  p_wa_number text DEFAULT NULL,
  p_wali_info jsonb DEFAULT NULL,
  p_hafalan_juz integer DEFAULT 1
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth', 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_current_user_role text;
  v_uid uuid;
  v_email text;
  v_uname text;
BEGIN
  v_caller_id := (SELECT auth.uid());
  
  -- 1. Mutlak tolak akses jika tidak terotentikasi (anon)
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  v_caller_role := lower(btrim(COALESCE(public.current_user_role(), 'santri')));

  -- 2. Validasi allowlist role yang diizinkan sistem
  IF p_role NOT IN ('super_admin', 'yayasan', 'kepsek', 'guru', 'musyrif', 'santri', 'ppdb', 'keuangan', 'humas') THEN
    RAISE EXCEPTION 'Role tidak valid: %', p_role;
  END IF;

  -- 3. Pembatasan kewenangan modifikasi:
  --    Jika pemanggil bukan pimpinan (Super Admin, Kepsek, Yayasan),
  --    mereka HANYA boleh mengupdate akun miliknya sendiri dan DILARANG mengubah rolenya sendiri.
  IF v_caller_role NOT IN ('super_admin', 'kepsek', 'kepala_sekolah', 'yayasan', 'admin_yayasan') THEN
    IF p_id IS NULL OR v_caller_id IS DISTINCT FROM p_id THEN
      RAISE EXCEPTION 'Akses ditolak: Anda tidak memiliki wewenang untuk membuat atau mengedit akun pengguna lain.';
    END IF;

    -- Ambil role aktif saat ini dari database
    SELECT lower(btrim(role)) INTO v_current_user_role FROM public.profiles WHERE id = v_caller_id;
    IF p_role IS DISTINCT FROM v_current_user_role THEN
      RAISE EXCEPTION 'Akses ditolak: Anda tidak dapat mengubah peran akun Anda sendiri.';
    END IF;
  END IF;

  -- 4. Hanya Super Admin yang berhak menunjuk atau mencabut peran super_admin
  IF p_role = 'super_admin' AND v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang dapat menetapkan peran Super Admin.';
  END IF;

  -- 5. Eksekusi Upsert aman
  v_uid := COALESCE(p_id, gen_random_uuid());
  v_uname := COALESCE(NULLIF(trim(p_username), ''), lower(regexp_replace(trim(p_full_name), '[^a-zA-Z0-9]+', '.', 'g')));
  v_email := COALESCE(NULLIF(trim(p_email), ''), v_uname || '@ppjauharulmaknuun.sch.id');

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    v_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email,
    extensions.crypt(COALESCE(NULLIF(p_password, ''), 'PPJM_User2026!'), extensions.gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'), 'role', p_role),
    jsonb_build_object('full_name', trim(p_full_name), 'role', p_role),
    now(), now(), '', '', '', ''
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_app_meta_data = auth.users.raw_app_meta_data || jsonb_build_object('role', p_role),
    raw_user_meta_data = auth.users.raw_user_meta_data || jsonb_build_object('full_name', trim(p_full_name), 'role', p_role),
    encrypted_password = CASE
      WHEN p_password IS NOT NULL AND p_password <> '' THEN extensions.crypt(p_password, extensions.gen_salt('bf'))
      ELSE auth.users.encrypted_password
    END,
    updated_at = now();

  INSERT INTO public.profiles (
    id, full_name, email, username, role,
    nis, nip, kelas, angkatan, asrama_kamar, kamar_asrama,
    mapel_ampu, mapel_diampu, kelas_ampu, jabatan,
    status_aktif, foto_url, bio, alamat_lengkap, wa_number, phone,
    wali_info, wali_santri, no_wa_wali, hafalan_juz,
    created_at, updated_at, last_login
  )
  VALUES (
    v_uid, trim(p_full_name), v_email, v_uname, p_role,
    p_nis, p_nip, p_kelas, p_angkatan, p_asrama_kamar, p_asrama_kamar,
    COALESCE(p_mapel_ampu, '{}'::text[]), COALESCE(p_mapel_ampu, '{}'::text[]), COALESCE(p_kelas_ampu, '{}'::text[]), p_jabatan,
    COALESCE(p_status_aktif, true), p_foto_url,
    COALESCE(p_bio, jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', trim(p_full_name) || ' — Sivitas Akademika SMP Plus Jauharul Maknuun.')))))),
    p_alamat_lengkap, p_wa_number, p_wa_number,
    COALESCE(p_wali_info, '{"nama_ayah": "", "nama_ibu": "", "kontak_wali": "", "pekerjaan": ""}'::jsonb),
    p_wali_info->>'nama_ayah', p_wali_info->>'kontak_wali', GREATEST(0, LEAST(30, COALESCE(p_hafalan_juz, 1))),
    now(), now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    nis = COALESCE(EXCLUDED.nis, public.profiles.nis),
    nip = COALESCE(EXCLUDED.nip, public.profiles.nip),
    kelas = COALESCE(EXCLUDED.kelas, public.profiles.kelas),
    angkatan = COALESCE(EXCLUDED.angkatan, public.profiles.angkatan),
    asrama_kamar = COALESCE(EXCLUDED.asrama_kamar, public.profiles.asrama_kamar),
    kamar_asrama = COALESCE(EXCLUDED.kamar_asrama, public.profiles.kamar_asrama),
    mapel_ampu = CASE WHEN array_length(EXCLUDED.mapel_ampu, 1) > 0 THEN EXCLUDED.mapel_ampu ELSE public.profiles.mapel_ampu END,
    mapel_diampu = CASE WHEN array_length(EXCLUDED.mapel_diampu, 1) > 0 THEN EXCLUDED.mapel_diampu ELSE public.profiles.mapel_diampu END,
    kelas_ampu = CASE WHEN array_length(EXCLUDED.kelas_ampu, 1) > 0 THEN EXCLUDED.kelas_ampu ELSE public.profiles.kelas_ampu END,
    jabatan = COALESCE(EXCLUDED.jabatan, public.profiles.jabatan),
    status_aktif = COALESCE(EXCLUDED.status_aktif, public.profiles.status_aktif),
    foto_url = COALESCE(EXCLUDED.foto_url, public.profiles.foto_url),
    bio = COALESCE(EXCLUDED.bio, public.profiles.bio),
    alamat_lengkap = COALESCE(EXCLUDED.alamat_lengkap, public.profiles.alamat_lengkap),
    wa_number = COALESCE(EXCLUDED.wa_number, public.profiles.wa_number),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    wali_info = COALESCE(EXCLUDED.wali_info, public.profiles.wali_info),
    hafalan_juz = GREATEST(0, LEAST(30, COALESCE(EXCLUDED.hafalan_juz, public.profiles.hafalan_juz))),
    updated_at = now();

  RETURN v_uid;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.admin_upsert_user_account FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_user_account TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. REVOKE ANONYMOUS EXECUTE ON TRIGGER FUNCTIONS
-- -----------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.normalize_galeri_foto_row() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.sync_profile_to_admin_profiles() FROM PUBLIC, anon;

-- -----------------------------------------------------------------------------
-- 3. PROTECT SANTRI PII DATA (PROFILES TABLE)
-- -----------------------------------------------------------------------------
-- Anonim hanya boleh membaca profil guru/staf publik pesantren (BUKAN santri)
DROP POLICY IF EXISTS "guest_can_view_public_guru_profiles" ON public.profiles;
CREATE POLICY "guest_can_view_public_guru_profiles" ON public.profiles
  FOR SELECT TO anon
  USING (
    status_aktif = true 
    AND role IN ('guru', 'musyrif', 'kepsek', 'yayasan', 'humas', 'staff_ppdb', 'keuangan')
  );

-- -----------------------------------------------------------------------------
-- 4. HARDEN STORAGE BUCKETS (SIZE LIMIT 15 MB & MIME TYPE WHITELIST)
-- -----------------------------------------------------------------------------
UPDATE storage.buckets
SET 
  file_size_limit = 15728640, -- 15 MB
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/x-m4a'
  ]
WHERE id IN ('santri-uploads', 'tugas');

-- -----------------------------------------------------------------------------
-- 5. FIX STORAGE OBJECTS POLICIES (ELIMINATE ANONYMOUS OVERWRITE)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow update to public image buckets" ON storage.objects;

CREATE POLICY "staff_or_owner_update_storage_objects" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    public.is_staff_or_guru()
    OR (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
    OR (bucket_id IN ('santri-uploads', 'tugas') AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
  )
  WITH CHECK (
    public.is_staff_or_guru()
    OR (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
    OR (bucket_id IN ('santri-uploads', 'tugas') AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
  );

-- -----------------------------------------------------------------------------
-- 6. HARDEN TUGAS & TUGAS_SUBMISSION (PREVENT UNAUTHORIZED GRADING & EDITING)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "guru_grade_submissions" ON public.tugas_submission;
CREATE POLICY "guru_grade_submissions" ON public.tugas_submission
  FOR UPDATE TO authenticated
  USING (public.is_staff_or_guru())
  WITH CHECK (public.is_staff_or_guru());

DROP POLICY IF EXISTS "guru_update_own_tugas" ON public.tugas;
CREATE POLICY "guru_update_own_tugas" ON public.tugas
  FOR UPDATE TO authenticated
  USING (
    public.is_staff_or_guru()
  )
  WITH CHECK (
    public.is_staff_or_guru()
  );

DROP POLICY IF EXISTS "guru_delete_own_tugas" ON public.tugas;
CREATE POLICY "guru_delete_own_tugas" ON public.tugas
  FOR DELETE TO authenticated
  USING (
    public.is_staff_or_guru()
  );

-- -----------------------------------------------------------------------------
-- 7. FIX USER_REGISTRATIONS POLICY & FOREIGN KEY INDEX
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "ppjm_registration_public_submit" ON public.user_registrations;
CREATE POLICY "ppjm_registration_public_submit" ON public.user_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND requested_role IN ('santri', 'guru', 'musyrif', 'ppdb', 'keuangan', 'humas')
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
    AND rejection_reason IS NULL
  );

CREATE INDEX IF NOT EXISTS idx_user_registrations_reviewed_by 
  ON public.user_registrations (reviewed_by);

-- -----------------------------------------------------------------------------
-- 8. OPTIMIZE RLS INITPLAN: WRAP auth.uid() IN (SELECT auth.uid())
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "santri_insert_own_submission" ON public.tugas_submission;
CREATE POLICY "santri_insert_own_submission" ON public.tugas_submission
  FOR INSERT TO authenticated
  WITH CHECK (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

DROP POLICY IF EXISTS "santri_select_own_submission" ON public.tugas_submission;
CREATE POLICY "santri_select_own_submission" ON public.tugas_submission
  FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

DROP POLICY IF EXISTS "santri_update_own_submission" ON public.tugas_submission;
CREATE POLICY "santri_update_own_submission" ON public.tugas_submission
  FOR UPDATE TO authenticated
  USING (
    (((SELECT auth.uid()) = santri_id) AND (status = ANY (ARRAY['draft'::text, 'revisi'::text, 'dikumpulkan'::text]))) 
    OR public.is_staff_or_guru()
  )
  WITH CHECK (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

DROP POLICY IF EXISTS "santri_insert_own_hafalan" ON public.hafalan_setoran;
CREATE POLICY "santri_insert_own_hafalan" ON public.hafalan_setoran
  FOR INSERT TO authenticated
  WITH CHECK (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

DROP POLICY IF EXISTS "santri_select_own_hafalan" ON public.hafalan_setoran;
CREATE POLICY "santri_select_own_hafalan" ON public.hafalan_setoran
  FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

DROP POLICY IF EXISTS "santri_select_own_performance" ON public.performance;
CREATE POLICY "santri_select_own_performance" ON public.performance
  FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = santri_id) OR public.is_staff_or_guru());

