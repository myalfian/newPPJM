-- ============================================================================
-- MIGRATION: 20261103_dynamic_profiles_all_roles.sql
-- Dynamic Profile System for All 9 Roles + User Management + Role Matrix + RLS
-- ============================================================================

-- 1. Extend user_role enum to include all 9 canonical roles
DO $$ BEGIN
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'santri';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'yayasan';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'kepsek';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'guru';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'musyrif';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ppdb';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'keuangan';
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'humas';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Extend public.profiles with all required dynamic profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS asrama_kamar text,
  ADD COLUMN IF NOT EXISTS mapel_ampu text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS kelas_ampu text[] DEFAULT ARRAY['VII-A Tahfidz', 'VIII-A Tahfidz', 'IX-A Tahfidz']::text[],
  ADD COLUMN IF NOT EXISTS jabatan text,
  ADD COLUMN IF NOT EXISTS status_aktif boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS alamat_lengkap text,
  ADD COLUMN IF NOT EXISTS wa_number text,
  ADD COLUMN IF NOT EXISTS wali_info jsonb DEFAULT '{"nama_ayah": "", "nama_ibu": "", "kontak_wali": "", "pekerjaan": ""}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_login timestamptz DEFAULT now();

-- 3. Automatic Column Sync Trigger (asrama_kamar <-> kamar_asrama, mapel_ampu <-> mapel_diampu, wa_number <-> phone)
CREATE OR REPLACE FUNCTION public.sync_profiles_alias_columns()
RETURNS trigger
LANGUAGE plpgsql
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_profiles_alias_columns') THEN
    CREATE TRIGGER trg_sync_profiles_alias_columns
      BEFORE INSERT OR UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.sync_profiles_alias_columns();
  END IF;
END $$;

-- 4. JWT & Database Role Checker: current_user_role() and is_role(target_role text)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()),
    (SELECT ap.role::text FROM public.admin_profiles ap WHERE ap.id = auth.uid()),
    NULLIF(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    NULLIF(auth.jwt() -> 'user_metadata' ->> 'role', ''),
    'santri'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_role(target_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.current_user_role() = target_role
    OR (target_role = 'yayasan' AND public.current_user_role() IN ('yayasan', 'admin_yayasan'))
    OR (target_role = 'kepsek' AND public.current_user_role() IN ('kepsek', 'kepala_sekolah'))
    OR (target_role = 'ppdb' AND public.current_user_role() IN ('ppdb', 'staff_ppdb'))
    OR (target_role = 'guru' AND public.current_user_role() IN ('guru', 'guru_akademik'))
    OR public.current_user_role() = 'super_admin';
$$;

GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_role(text) TO anon, authenticated;

-- 5. Supabase Auth Trigger: Auto-insert into public.profiles on every new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role text;
  v_name text;
BEGIN
  v_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'santri');
  v_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (
    id, full_name, email, username, role, status_aktif,
    nis, nip, kelas, angkatan, asrama_kamar, kamar_asrama, jabatan, wa_number,
    created_at, updated_at, last_login
  )
  VALUES (
    NEW.id,
    v_name,
    NEW.email,
    split_part(NEW.email, '@', 1),
    v_role,
    true,
    NEW.raw_user_meta_data->>'nis',
    NEW.raw_user_meta_data->>'nip',
    COALESCE(NEW.raw_user_meta_data->>'kelas', CASE WHEN v_role = 'santri' THEN 'VII-A Tahfidz' ELSE NULL END),
    COALESCE(NEW.raw_user_meta_data->>'angkatan', CASE WHEN v_role = 'santri' THEN '2026' ELSE NULL END),
    NEW.raw_user_meta_data->>'asrama_kamar',
    NEW.raw_user_meta_data->>'asrama_kamar',
    NEW.raw_user_meta_data->>'jabatan',
    NEW.raw_user_meta_data->>'phone',
    now(),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    last_login = now();

  BEGIN
    INSERT INTO public.admin_profiles (id, full_name, email, role, is_active)
    VALUES (NEW.id, v_name, NEW.email, v_role::public.user_role, true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 6. SECURITY DEFINER RPC: Admin Create / Update User & Reset Credential
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
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_uid uuid;
  v_email text;
  v_uname text;
BEGIN
  v_uid := COALESCE(p_id, gen_random_uuid());
  v_uname := COALESCE(NULLIF(p_username, ''), lower(regexp_replace(p_full_name, '[^a-zA-Z0-9]+', '.', 'g')));
  v_email := COALESCE(NULLIF(p_email, ''), v_uname || '@ppjauharulmaknuun.sch.id');

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
    jsonb_build_object('full_name', p_full_name, 'role', p_role),
    now(), now(), '', '', '', ''
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_app_meta_data = auth.users.raw_app_meta_data || jsonb_build_object('role', p_role),
    raw_user_meta_data = auth.users.raw_user_meta_data || jsonb_build_object('full_name', p_full_name, 'role', p_role),
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
    v_uid, p_full_name, v_email, v_uname, p_role,
    p_nis, p_nip, p_kelas, p_angkatan, p_asrama_kamar, p_asrama_kamar,
    COALESCE(p_mapel_ampu, '{}'::text[]), COALESCE(p_mapel_ampu, '{}'::text[]), COALESCE(p_kelas_ampu, '{}'::text[]), p_jabatan,
    COALESCE(p_status_aktif, true), p_foto_url,
    COALESCE(p_bio, jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', p_full_name || ' — Sivitas Akademika SMP Plus Jauharul Maknuun.')))))),
    p_alamat_lengkap, p_wa_number, p_wa_number,
    COALESCE(p_wali_info, '{"nama_ayah": "", "nama_ibu": "", "kontak_wali": "", "pekerjaan": ""}'::jsonb),
    p_wali_info->>'nama_ayah', p_wali_info->>'kontak_wali', COALESCE(p_hafalan_juz, 1),
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
    hafalan_juz = COALESCE(EXCLUDED.hafalan_juz, public.profiles.hafalan_juz),
    updated_at = now();

  RETURN v_uid;
END;
$$;

-- 7. Row Level Security Policies (Santri, Guru, Super Admin)
-- a) Santri: SELECT/UPDATE own profile, tugas_submission, performance where santri_id = auth.uid()
-- b) Guru: SELECT profiles where role='santri' and kelas in kelas_ampu, UPDATE/INSERT tugas where guru_id = auth.uid(), UPDATE tugas_submission where tugas_id in (select id from tugas where guru_id = auth.uid())
-- c) Super Admin: bypass all via public.is_role('super_admin')
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tugas_submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

