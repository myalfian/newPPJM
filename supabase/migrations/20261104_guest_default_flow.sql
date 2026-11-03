-- =============================================================================
-- Guest Default Flow: user_role enum + guest_sessions + sections + RLS policies
-- =============================================================================

-- 1) Add 'guest' to public.user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'guest';

-- 2) Tighten RLS on academic & private tables so guests (anon) cannot read them
ALTER POLICY public_read_hafalan_preview ON public.hafalan_setoran
  TO authenticated
  USING (santri_id = (SELECT auth.uid()) OR is_staff_or_guru() OR is_role('super_admin'));

ALTER POLICY public_read_performance_preview ON public.performance
  TO authenticated
  USING (santri_id = (SELECT auth.uid()) OR is_staff_or_guru() OR is_role('super_admin'));

ALTER POLICY public_read_submissions_preview ON public.tugas_submission
  TO authenticated
  USING (santri_id = (SELECT auth.uid()) OR is_staff_or_guru() OR is_role('super_admin'));

ALTER POLICY santri_select_tugas ON public.tugas
  TO authenticated
  USING (true);

ALTER POLICY guru_select_all_profiles ON public.profiles
  TO authenticated
  USING (is_staff_or_guru() OR is_role('super_admin'));

ALTER POLICY "Public Read Profiles" ON public.admin_profiles
  TO authenticated
  USING (id = (SELECT auth.uid()) OR is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'));

ALTER POLICY allow_public_read_audit_logs ON public.audit_logs
  TO authenticated
  USING (is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'));

ALTER POLICY allow_admin_manage_audit_logs ON public.audit_logs
  TO authenticated
  USING (is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'))
  WITH CHECK (is_staff_or_guru() OR is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'));

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' AND policyname='guest_submit_spmb_registration') THEN
    CREATE POLICY guest_submit_spmb_registration ON public.audit_logs
      FOR INSERT TO anon
      WITH CHECK (action = 'SUBMIT_SPMB_REGISTRATION' AND module = 'spmb');
  END IF;
END $$;

REVOKE ALL ON public.tugas, public.tugas_submission, public.performance,
              public.hafalan_setoran, public.profiles, public.admin_profiles,
              public.role_permissions FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;
GRANT INSERT ON public.audit_logs TO anon;

-- 3) Allow guest (anon) to view ONLY public non-sensitive teacher/leadership info on profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'guest_can_view_public_guru_profiles'
  ) THEN
    CREATE POLICY guest_can_view_public_guru_profiles ON public.profiles
      FOR SELECT TO anon
      USING (status_aktif = true AND role IN ('guru', 'musyrif', 'kepsek', 'yayasan', 'super_admin'));
  END IF;
END $$;

GRANT SELECT (
  id, full_name, username, role, nip, mapel_ampu, mapel_diampu,
  kelas_ampu, pendidikan, jabatan, foto_url, bio, jadwal_mengajar,
  status_aktif, created_at
) ON public.profiles TO anon;

-- 4) Create public.sections (if not exists) and policy "guest can view public"
CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'sections' AND policyname = 'guest can view public'
  ) THEN
    CREATE POLICY "guest can view public" ON public.sections
      FOR SELECT TO anon, authenticated
      USING (status = 'published');
  END IF;
END $$;

GRANT SELECT ON public.sections TO anon, authenticated;

-- 5) Guest analytics table: guest_sessions (id, session_id, ip, last_page, created_at, updated_at)
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    text NOT NULL UNIQUE CHECK (char_length(session_id) BETWEEN 8 AND 64),
  ip            text,
  last_page     text CHECK (last_page IS NULL OR char_length(last_page) <= 200),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_sessions
  ADD COLUMN IF NOT EXISTS ip text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='guest_sessions' AND policyname='guest_insert_visit') THEN
    CREATE POLICY guest_insert_visit ON public.guest_sessions
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='guest_sessions' AND policyname='guest_update_visit') THEN
    CREATE POLICY guest_update_visit ON public.guest_sessions
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='guest_sessions' AND policyname='admin_read_guest_sessions') THEN
    CREATE POLICY admin_read_guest_sessions ON public.guest_sessions
      FOR SELECT TO authenticated
      USING (is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan') OR is_role('humas'));
  END IF;
END $$;

REVOKE ALL ON public.guest_sessions FROM anon, authenticated;
GRANT INSERT, UPDATE ON public.guest_sessions TO anon, authenticated;
GRANT SELECT ON public.guest_sessions TO authenticated;
CREATE INDEX IF NOT EXISTS idx_guest_sessions_created_at ON public.guest_sessions (created_at DESC);
