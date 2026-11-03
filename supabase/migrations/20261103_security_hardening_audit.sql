-- ============================================================================
-- MIGRATION: 20261103_security_hardening_audit.sql
-- OWASP Top 10 & Supabase Security Advisor Remediation
-- ============================================================================

-- 1. Fix ERROR 0010_security_definer_view: enforce security_invoker = true on public.news view
ALTER VIEW IF EXISTS public.news SET (security_invoker = true);

-- 2. Fix WARN 0011_function_search_path_mutable: pin immutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.sync_profiles_alias_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.asrama_kamar IS DISTINCT FROM OLD.asrama_kamar AND NEW.asrama_kamar IS NOT NULL THEN
    NEW.kamar_asrama := NEW.asrama_kamar;
  ELSIF NEW.kamar_asrama IS DISTINCT FROM OLD.kamar_asrama AND NEW.kamar_asrama IS NOT NULL THEN
    NEW.asrama_kamar := NEW.kamar_asrama;
  END IF;

  IF NEW.mapel_ampu IS DISTINCT FROM OLD.mapel_ampu AND NEW.mapel_ampu IS NOT NULL THEN
    NEW.mapel_diampu := NEW.mapel_ampu;
  ELSIF NEW.mapel_diampu IS DISTINCT FROM OLD.mapel_diampu AND NEW.mapel_diampu IS NOT NULL THEN
    NEW.mapel_ampu := NEW.mapel_diampu;
  END IF;

  IF NEW.wa_number IS DISTINCT FROM OLD.wa_number AND NEW.wa_number IS NOT NULL THEN
    NEW.phone := NEW.wa_number;
  ELSIF NEW.phone IS DISTINCT FROM OLD.phone AND NEW.phone IS NOT NULL THEN
    NEW.wa_number := NEW.phone;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 3. Harden admin_upsert_user_account against unauthorized invocation & role escalation
CREATE OR REPLACE FUNCTION public.admin_upsert_user_account(
  p_id uuid DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_password text DEFAULT 'PPJM_User2026!',
  p_full_name text DEFAULT 'User PPJM',
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
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
  v_uid uuid;
  v_email text;
  v_uname text;
  v_caller_role text;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    v_caller_role := public.current_user_role();
    IF v_caller_role NOT IN ('super_admin', 'kepsek', 'kepala_sekolah', 'yayasan', 'admin_yayasan')
       AND auth.uid() IS DISTINCT FROM p_id THEN
      RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin / Pimpinan yang dapat membuat atau mengubah akun pengguna lain.';
    END IF;
    IF p_role = 'super_admin' AND v_caller_role <> 'super_admin' THEN
      RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang dapat menetapkan role super_admin.';
    END IF;
  END IF;

  IF p_role NOT IN ('super_admin', 'yayasan', 'kepsek', 'guru', 'musyrif', 'santri', 'ppdb', 'keuangan', 'humas') THEN
    RAISE EXCEPTION 'Role tidak valid: %', p_role;
  END IF;

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
$$;

-- 4. Revoke anonymous execution on SECURITY DEFINER functions (fixes WARN 0028)
REVOKE EXECUTE ON FUNCTION public.admin_upsert_user_account(
  uuid, text, text, text, text, text, text, text, text, text, text, text[], text[], text, boolean, text, jsonb, text, text, jsonb, integer
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_user_account(
  uuid, text, text, text, text, text, text, text, text, text, text, text[], text[], text, boolean, text, jsonb, text, text, jsonb, integer
) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.check_user_role(public.user_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_user_role(public.user_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_role(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_role(text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_staff_or_guru() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff_or_guru() TO authenticated;

-- 5. Tighten RLS policies on profiles & role_permissions
ALTER POLICY "rls_profiles_modify_all_roles"
  ON public.profiles
  TO authenticated
  USING (
    id = auth.uid()
    OR public.is_role('super_admin')
    OR public.is_role('kepsek')
    OR public.is_role('yayasan')
  )
  WITH CHECK (
    (
      id = auth.uid()
      AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    )
    OR public.is_role('super_admin')
    OR public.is_role('kepsek')
    OR public.is_role('yayasan')
  );

ALTER POLICY "rls_role_permissions_all"
  ON public.role_permissions
  TO authenticated
  USING (
    public.is_role('super_admin')
    OR public.has_perm('roles', 'edit')
  )
  WITH CHECK (
    public.is_role('super_admin')
    OR public.has_perm('roles', 'edit')
  );

