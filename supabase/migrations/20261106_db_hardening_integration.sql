-- Migration: 20261106_db_hardening_integration.sql
-- Database hardening & integration for Public Web + Admin Web
-- Adds kelas (class), mapel (subject), category fields to all content tables
-- Hardens RLS policies: public read, authenticated/admin write
-- Adds performance indexes on category, kelas, mapel columns
-- ============================================================================

-- ============================================================================
-- PART 1: SCHEMA EXTENSIONS — add kelas, mapel, category to content tables
-- ============================================================================

-- programs_pondok — add kelas, mapel, category
ALTER TABLE public.programs_pondok
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text,
  ADD COLUMN IF NOT EXISTS category text;

-- programs_sekolah — add kelas, mapel, category
ALTER TABLE public.programs_sekolah
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text,
  ADD COLUMN IF NOT EXISTS category text;

-- stem_worksheets — add kelas, mapel (category already exists)
ALTER TABLE public.stem_worksheets
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- stem_projects — add kelas, mapel (category already exists)
ALTER TABLE public.stem_projects
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- berita — add kelas, mapel (category already exists)
ALTER TABLE public.berita
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- ekskul — add kelas, mapel (category already exists)
ALTER TABLE public.ekskul
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- agendas — add kelas, mapel (category already exists)
ALTER TABLE public.agendas
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- galeri_foto — add kelas, mapel (category already exists)
ALTER TABLE public.galeri_foto
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- galeri_videos — add kelas, mapel (category already exists)
ALTER TABLE public.galeri_videos
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- osis_events — add kelas, mapel (category already exists)
ALTER TABLE public.osis_events
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- osis_programs — add kelas, mapel (department already exists as category alias)
ALTER TABLE public.osis_programs
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- mandarin_lessons — add kelas, mapel (level already exists)
ALTER TABLE public.mandarin_lessons
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- mandarin_vocabularies — add kelas, mapel (category already exists)
ALTER TABLE public.mandarin_vocabularies
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- prestasi — add kelas, mapel (category already exists)
ALTER TABLE public.prestasi
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS mapel text;

-- ============================================================================
-- PART 2: COMMENTS — document each column for admin clarity
-- ============================================================================

COMMENT ON COLUMN public.programs_pondok.kelas IS 'Target kelas santri (7A, 7B, 8A, 8B, 9A, 9B, Semua)';
COMMENT ON COLUMN public.programs_pondok.mapel IS 'Mata pelajaran terkait (IPA, IPS, Bahasa, Agama, Olahraga, Seni, Umum)';
COMMENT ON COLUMN public.programs_pondok.category IS 'Kategori program pondok';

COMMENT ON COLUMN public.programs_sekolah.kelas IS 'Target kelas (7A, 7B, 8A, 8B, 9A, 9B, Semua)';
COMMENT ON COLUMN public.programs_sekolah.mapel IS 'Mata pelajaran terkait';
COMMENT ON COLUMN public.programs_sekolah.category IS 'Kategori program sekolah';

COMMENT ON COLUMN public.stem_worksheets.kelas IS 'Target kelas (7A, 7B, 8A, 8B, 9A, 9B, Semua)';
COMMENT ON COLUMN public.stem_worksheets.mapel IS 'Mata pelajaran STEM (IPA, Matematika, Teknologi, Rekayasa, Matematika)';

COMMENT ON COLUMN public.stem_projects.kelas IS 'Target kelas santri';
COMMENT ON COLUMN public.stem_projects.mapel IS 'Mata pelajaran terkait proyek';

COMMENT ON COLUMN public.berita.kelas IS 'Kelas target berita';
COMMENT ON COLUMN public.berita.mapel IS 'Mata pelajaran terkait berita';

COMMENT ON COLUMN public.ekskul.kelas IS 'Kelas target ekskul';
COMMENT ON COLUMN public.ekskul.mapel IS 'Mata pelajaran terkait ekskul';

COMMENT ON COLUMN public.agendas.kelas IS 'Kelas target agenda';
COMMENT ON COLUMN public.agendas.mapel IS 'Mata pelajaran terkait agenda';

COMMENT ON COLUMN public.galeri_foto.kelas IS 'Kelas terkait foto';
COMMENT ON COLUMN public.galeri_foto.mapel IS 'Mata pelajaran terkait foto';

COMMENT ON COLUMN public.galeri_videos.kelas IS 'Kelas terkait video';
COMMENT ON COLUMN public.galeri_videos.mapel IS 'Mata pelajaran terkait video';

COMMENT ON COLUMN public.osis_events.kelas IS 'Kelas terkait event OSIS';
COMMENT ON COLUMN public.osis_events.mapel IS 'Mata pelajaran terkait event OSIS';

COMMENT ON COLUMN public.osis_programs.kelas IS 'Kelas terkait program OSIS';
COMMENT ON COLUMN public.osis_programs.mapel IS 'Mata pelajaran terkait program OSIS';

COMMENT ON COLUMN public.mandarin_lessons.kelas IS 'Kelas target pelajaran Mandarin';
COMMENT ON COLUMN public.mandarin_lessons.mapel IS 'Mata pelajaran (Mandarin)';

COMMENT ON COLUMN public.mandarin_vocabularies.kelas IS 'Kelas target kosakata';
COMMENT ON COLUMN public.mandarin_vocabularies.mapel IS 'Mata pelajaran (Mandarin)';

COMMENT ON COLUMN public.prestasi.kelas IS 'Kelas santri pencapaian';
COMMENT ON COLUMN public.prestasi.mapel IS 'Mata pelajaran pencapaian';

-- ============================================================================
-- PART 3: PERFORMANCE INDEXES — category, kelas, mapel on all content tables
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_programs_pondok_category ON public.programs_pondok(category);
CREATE INDEX IF NOT EXISTS idx_programs_pondok_kelas ON public.programs_pondok(kelas);
CREATE INDEX IF NOT EXISTS idx_programs_pondok_mapel ON public.programs_pondok(mapel);
CREATE INDEX IF NOT EXISTS idx_programs_pondok_is_active ON public.programs_pondok(is_active);

CREATE INDEX IF NOT EXISTS idx_programs_sekolah_category ON public.programs_sekolah(category);
CREATE INDEX IF NOT EXISTS idx_programs_sekolah_kelas ON public.programs_sekolah(kelas);
CREATE INDEX IF NOT EXISTS idx_programs_sekolah_mapel ON public.programs_sekolah(mapel);
CREATE INDEX IF NOT EXISTS idx_programs_sekolah_created_at ON public.programs_sekolah(created_at);

CREATE INDEX IF NOT EXISTS idx_stem_worksheets_category ON public.stem_worksheets(category);
CREATE INDEX IF NOT EXISTS idx_stem_worksheets_kelas ON public.stem_worksheets(kelas);
CREATE INDEX IF NOT EXISTS idx_stem_worksheets_mapel ON public.stem_worksheets(mapel);
CREATE INDEX IF NOT EXISTS idx_stem_worksheets_level ON public.stem_worksheets(level);
CREATE INDEX IF NOT EXISTS idx_stem_worksheets_created_by ON public.stem_worksheets(created_by);

CREATE INDEX IF NOT EXISTS idx_stem_projects_category ON public.stem_projects(category);
CREATE INDEX IF NOT EXISTS idx_stem_projects_kelas ON public.stem_projects(kelas);
CREATE INDEX IF NOT EXISTS idx_stem_projects_mapel ON public.stem_projects(mapel);
CREATE INDEX IF NOT EXISTS idx_stem_projects_is_portfolio ON public.stem_projects(is_portfolio);

CREATE INDEX IF NOT EXISTS idx_berita_category ON public.berita(category);
CREATE INDEX IF NOT EXISTS idx_berita_kelas ON public.berita(kelas);
CREATE INDEX IF NOT EXISTS idx_berita_mapel ON public.berita(mapel);
CREATE INDEX IF NOT EXISTS idx_berita_is_published ON public.berita(is_published);
CREATE INDEX IF NOT EXISTS idx_berita_created_at ON public.berita(created_at);

CREATE INDEX IF NOT EXISTS idx_ekskul_category ON public.ekskul(category);
CREATE INDEX IF NOT EXISTS idx_ekskul_kelas ON public.ekskul(kelas);
CREATE INDEX IF NOT EXISTS idx_ekskul_mapel ON public.ekskul(mapel);
CREATE INDEX IF NOT EXISTS idx_ekskul_is_active ON public.ekskul(is_active);

CREATE INDEX IF NOT EXISTS idx_agendas_category ON public.agendas(category);
CREATE INDEX IF NOT EXISTS idx_agendas_kelas ON public.agendas(kelas);
CREATE INDEX IF NOT EXISTS idx_agendas_mapel ON public.agendas(mapel);
CREATE INDEX IF NOT EXISTS idx_agendas_created_at ON public.agendas(created_at);

CREATE INDEX IF NOT EXISTS idx_galeri_foto_category ON public.galeri_foto(category);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_kelas ON public.galeri_foto(kelas);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_mapel ON public.galeri_foto(mapel);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_is_active ON public.galeri_foto(is_active);

CREATE INDEX IF NOT EXISTS idx_galeri_videos_category ON public.galeri_videos(category);
CREATE INDEX IF NOT EXISTS idx_galeri_videos_kelas ON public.galeri_videos(kelas);
CREATE INDEX IF NOT EXISTS idx_galeri_videos_mapel ON public.galeri_videos(mapel);
CREATE INDEX IF NOT EXISTS idx_galeri_videos_is_active ON public.galeri_videos(is_active);

CREATE INDEX IF NOT EXISTS idx_osis_events_category ON public.osis_events(category);
CREATE INDEX IF NOT EXISTS idx_osis_events_kelas ON public.osis_events(kelas);
CREATE INDEX IF NOT EXISTS idx_osis_events_mapel ON public.osis_events(mapel);
CREATE INDEX IF NOT EXISTS idx_osis_events_date ON public.osis_events(date);

CREATE INDEX IF NOT EXISTS idx_osis_programs_department ON public.osis_programs(department);
CREATE INDEX IF NOT EXISTS idx_osis_programs_kelas ON public.osis_programs(kelas);
CREATE INDEX IF NOT EXISTS idx_osis_programs_mapel ON public.osis_programs(mapel);
CREATE INDEX IF NOT EXISTS idx_osis_programs_is_active ON public.osis_programs(is_active);

CREATE INDEX IF NOT EXISTS idx_mandarin_lessons_kelas ON public.mandarin_lessons(kelas);
CREATE INDEX IF NOT EXISTS idx_mandarin_lessons_mapel ON public.mandarin_lessons(mapel);
CREATE INDEX IF NOT EXISTS idx_mandarin_lessons_level ON public.mandarin_lessons(level);

CREATE INDEX IF NOT EXISTS idx_mandarin_vocabularies_category ON public.mandarin_vocabularies(category);
CREATE INDEX IF NOT EXISTS idx_mandarin_vocabularies_kelas ON public.mandarin_vocabularies(kelas);
CREATE INDEX IF NOT EXISTS idx_mandarin_vocabularies_mapel ON public.mandarin_vocabularies(mapel);
CREATE INDEX IF NOT EXISTS idx_mandarin_vocabularies_hsk_level ON public.mandarin_vocabularies(hsk_level);

CREATE INDEX IF NOT EXISTS idx_prestasi_category ON public.prestasi(category);
CREATE INDEX IF NOT EXISTS idx_prestasi_kelas ON public.prestasi(kelas);
CREATE INDEX IF NOT EXISTS idx_prestasi_mapel ON public.prestasi(mapel);
CREATE INDEX IF NOT EXISTS idx_prestasi_level ON public.prestasi(level);
CREATE INDEX IF NOT EXISTS idx_prestasi_is_published ON public.prestasi(is_published);

-- ============================================================================
-- PART 4: RLS HARDENING — Public Web (read-only) vs Admin Web (read/write)
-- ============================================================================

-- Ensure RLS is enabled on all content tables
ALTER TABLE public.programs_pondok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stem_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osis_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandarin_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandarin_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts, then recreate cleanly
DO $$
BEGIN
  -- programs_pondok
  DROP POLICY IF EXISTS rls_programs_pondok_public_read ON public.programs_pondok;
  DROP POLICY IF EXISTS rls_programs_pondok_admin_write ON public.programs_pondok;
  CREATE POLICY rls_programs_pondok_public_read ON public.programs_pondok
    FOR SELECT TO anon, authenticated
    USING (is_active = true);
  CREATE POLICY rls_programs_pondok_admin_write ON public.programs_pondok
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- programs_sekolah
  DROP POLICY IF EXISTS rls_programs_sekolah_public_read ON public.programs_sekolah;
  DROP POLICY IF EXISTS rls_programs_sekolah_admin_write ON public.programs_sekolah;
  CREATE POLICY rls_programs_sekolah_public_read ON public.programs_sekolah
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_programs_sekolah_admin_write ON public.programs_sekolah
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- stem_worksheets
  DROP POLICY IF EXISTS rls_stem_worksheets_public_read ON public.stem_worksheets;
  DROP POLICY IF EXISTS rls_stem_worksheets_admin_write ON public.stem_worksheets;
  CREATE POLICY rls_stem_worksheets_public_read ON public.stem_worksheets
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_stem_worksheets_admin_write ON public.stem_worksheets
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- stem_projects
  DROP POLICY IF EXISTS rls_stem_projects_public_read ON public.stem_projects;
  DROP POLICY IF EXISTS rls_stem_projects_admin_write ON public.stem_projects;
  CREATE POLICY rls_stem_projects_public_read ON public.stem_projects
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_stem_projects_admin_write ON public.stem_projects
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- berita
  DROP POLICY IF EXISTS rls_berita_public_read ON public.berita;
  DROP POLICY IF EXISTS rls_berita_admin_write ON public.berita;
  CREATE POLICY rls_berita_public_read ON public.berita
    FOR SELECT TO anon, authenticated
    USING (is_published = true);
  CREATE POLICY rls_berita_admin_write ON public.berita
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- ekskul
  DROP POLICY IF EXISTS rls_ekskul_public_read ON public.ekskul;
  DROP POLICY IF EXISTS rls_ekskul_admin_write ON public.ekskul;
  CREATE POLICY rls_ekskul_public_read ON public.ekskul
    FOR SELECT TO anon, authenticated
    USING (is_active = true);
  CREATE POLICY rls_ekskul_admin_write ON public.ekskul
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- agendas
  DROP POLICY IF EXISTS rls_agendas_public_read ON public.agendas;
  DROP POLICY IF EXISTS rls_agendas_admin_write ON public.agendas;
  CREATE POLICY rls_agendas_public_read ON public.agendas
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_agendas_admin_write ON public.agendas
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- galeri_foto
  DROP POLICY IF EXISTS rls_galeri_foto_public_read ON public.galeri_foto;
  DROP POLICY IF EXISTS rls_galeri_foto_admin_write ON public.galeri_foto;
  CREATE POLICY rls_galeri_foto_public_read ON public.galeri_foto
    FOR SELECT TO anon, authenticated
    USING (is_active = true);
  CREATE POLICY rls_galeri_foto_admin_write ON public.galeri_foto
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- galeri_videos
  DROP POLICY IF EXISTS rls_galeri_videos_public_read ON public.galeri_videos;
  DROP POLICY IF EXISTS rls_galeri_videos_admin_write ON public.galeri_videos;
  CREATE POLICY rls_galeri_videos_public_read ON public.galeri_videos
    FOR SELECT TO anon, authenticated
    USING (is_active = true);
  CREATE POLICY rls_galeri_videos_admin_write ON public.galeri_videos
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- osis_events
  DROP POLICY IF EXISTS rls_osis_events_public_read ON public.osis_events;
  DROP POLICY IF EXISTS rls_osis_events_admin_write ON public.osis_events;
  CREATE POLICY rls_osis_events_public_read ON public.osis_events
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_osis_events_admin_write ON public.osis_events
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- osis_programs
  DROP POLICY IF EXISTS rls_osis_programs_public_read ON public.osis_programs;
  DROP POLICY IF EXISTS rls_osis_programs_admin_write ON public.osis_programs;
  CREATE POLICY rls_osis_programs_public_read ON public.osis_programs
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_osis_programs_admin_write ON public.osis_programs
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- mandarin_lessons
  DROP POLICY IF EXISTS rls_mandarin_lessons_public_read ON public.mandarin_lessons;
  DROP POLICY IF EXISTS rls_mandarin_lessons_admin_write ON public.mandarin_lessons;
  CREATE POLICY rls_mandarin_lessons_public_read ON public.mandarin_lessons
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_mandarin_lessons_admin_write ON public.mandarin_lessons
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- mandarin_vocabularies
  DROP POLICY IF EXISTS rls_mandarin_vocabularies_public_read ON public.mandarin_vocabularies;
  DROP POLICY IF EXISTS rls_mandarin_vocabularies_admin_write ON public.mandarin_vocabularies;
  CREATE POLICY rls_mandarin_vocabularies_public_read ON public.mandarin_vocabularies
    FOR SELECT TO anon, authenticated
    USING (true);
  CREATE POLICY rls_mandarin_vocabularies_admin_write ON public.mandarin_vocabularies
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

  -- prestasi
  DROP POLICY IF EXISTS rls_prestasi_public_read ON public.prestasi;
  DROP POLICY IF EXISTS rls_prestasi_admin_write ON public.prestasi;
  CREATE POLICY rls_prestasi_public_read ON public.prestasi
    FOR SELECT TO anon, authenticated
    USING (is_published = true);
  CREATE POLICY rls_prestasi_admin_write ON public.prestasi
    FOR ALL TO authenticated
    USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
    WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));
END $$;

-- ============================================================================
-- PART 5: AUDIT TRIGGER — log all admin changes to content tables
-- ============================================================================

CREATE OR REPLACE FUNCTION public.audit_content_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    module, action, section_id, user_id, email, old_data, new_data, created_at
  )
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    now()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach audit trigger to all content tables
DO $$
BEGIN
  FOR t IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN (
      'programs_pondok', 'programs_sekolah', 'stem_worksheets', 'stem_projects',
      'berita', 'ekskul', 'agendas', 'galeri_foto', 'galeri_videos',
      'osis_events', 'osis_programs', 'mandarin_lessons',
      'mandarin_vocabularies', 'prestasi'
    )
  ) LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I; ' ||
      'CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I ' ||
      'FOR EACH ROW EXECUTE FUNCTION public.audit_content_changes();',
      t.tablename, t.tablename, t.tablename, t.tablename
    );
  END LOOP;
END $$;

-- ============================================================================
-- PART 6: CONNECTION / INTEGRATION HARDENING NOTES
-- ============================================================================
-- Public Web (anon): Read-only SELECT on is_active/is_published=true rows only
-- Admin Web (authenticated): Full CRUD on all rows, requires staff/guru/super_admin/kepsek/yayasan role
-- Connection: Supabase client with anon key for public, service_role or authenticated JWT for admin
-- All file uploads (image, audio, pdf) go through CrudEditor auto-WebP compression before Storage upload
-- RLS policies use public.is_staff_or_guru() and public.is_role() helpers for centralized role checks
