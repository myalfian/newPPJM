-- ==============================================================================
-- MIGRATION: 20261025_fix_rls_public_realtime.sql
-- PP. JAUHARUL MAKNUUN - COMPLETE RLS & REALTIME ENABLER FOR 34 TABLES
-- Ensures public read access for visitors and full management for administrators,
-- plus Supabase Realtime publication registration for zero-lag live updates.
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
DO $$
DECLARE
  tbl text;
  public_tables text[] := ARRAY[
    'sambutan_persons', 'sliders', 'quick_menus', 'cms_sections',
    'facilities', 'berita', 'galeri_foto', 'galeri_videos',
    'prestasi', 'ekskul', 'osis_structure', 'osis_programs', 'osis_events',
    'agendas', 'kontak_medsos', 'site_settings', 'jm_center_pages',
    'programs_pondok', 'programs_sekolah', 'madin_flyers', 'institutions',
    'stem_worksheets', 'stem_projects', 'stem_rubrics', 'stem_portfolios',
    'mandarin_vocabularies', 'mandarin_lessons', 'mandarin_quizzes',
    'hafidz_surahs', 'hafidz_audios', 'hafidz_reciters', 'hafidz_murojaah_questions',
    'spmb_info', 'admin_profiles', 'audit_logs'
  ];
BEGIN
  -- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
  FOREACH tbl IN ARRAY public_tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END IF;
  END LOOP;
END $$;

-- 2. POLICIES UNTUK SAMBUTAN_PERSONS
DROP POLICY IF EXISTS "Public read active sambutan" ON public.sambutan_persons;
DROP POLICY IF EXISTS "Admin manage sambutan" ON public.sambutan_persons;

CREATE POLICY "Public read active sambutan"
ON public.sambutan_persons FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin manage sambutan"
ON public.sambutan_persons FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. POLICIES UNTUK SLIDERS & QUICK MENUS
DROP POLICY IF EXISTS "Public read active sliders" ON public.sliders;
DROP POLICY IF EXISTS "Admin manage sliders" ON public.sliders;
CREATE POLICY "Public read active sliders" ON public.sliders FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage sliders" ON public.sliders FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read active quick_menus" ON public.quick_menus;
DROP POLICY IF EXISTS "Admin manage quick_menus" ON public.quick_menus;
CREATE POLICY "Public read active quick_menus" ON public.quick_menus FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage quick_menus" ON public.quick_menus FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 4. POLICIES UNTUK BERITA & CMS SECTIONS
DROP POLICY IF EXISTS "Public read published berita" ON public.berita;
DROP POLICY IF EXISTS "Admin manage berita" ON public.berita;
CREATE POLICY "Public read published berita" ON public.berita FOR SELECT USING (is_published = true OR is_published IS NULL);
CREATE POLICY "Admin manage berita" ON public.berita FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read cms_sections" ON public.cms_sections;
DROP POLICY IF EXISTS "Admin manage cms_sections" ON public.cms_sections;
CREATE POLICY "Public read cms_sections" ON public.cms_sections FOR SELECT USING (visible = true OR visible IS NULL);
CREATE POLICY "Admin manage cms_sections" ON public.cms_sections FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 5. POLICIES UNTUK KONTEN PUBLIK LAINNYA
DO $$
DECLARE
  t text;
  open_read_tables text[] := ARRAY[
    'facilities', 'galeri_foto', 'galeri_videos', 'prestasi', 'ekskul',
    'osis_structure', 'osis_programs', 'osis_events', 'agendas',
    'kontak_medsos', 'site_settings', 'jm_center_pages', 'institutions',
    'programs_pondok', 'programs_sekolah', 'madin_flyers', 'spmb_info',
    'stem_worksheets', 'stem_projects', 'stem_rubrics', 'stem_portfolios',
    'mandarin_vocabularies', 'mandarin_lessons', 'mandarin_quizzes',
    'hafidz_surahs', 'hafidz_audios', 'hafidz_reciters', 'hafidz_murojaah_questions'
  ];
BEGIN
  FOREACH t IN ARRAY open_read_tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      BEGIN
        EXECUTE format('DROP POLICY IF EXISTS "Public read %I" ON public.%I;', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin manage %I" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "Public read %I" ON public.%I FOR SELECT USING (true);', t, t);
        EXECUTE format('CREATE POLICY "Admin manage %I" ON public.%I FOR ALL USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'');', t, t);
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END LOOP;
END $$;

-- 6. POLICIES UNTUK AUDIT LOGS (Admin only read/insert)
DROP POLICY IF EXISTS "Admin read audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin insert audit_logs" ON public.audit_logs;
CREATE POLICY "Admin read audit_logs" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 8. STORAGE POLICIES UNTUK 9 BUCKETS PPJM
DROP POLICY IF EXISTS "Public can view bucket objects" ON storage.objects;
CREATE POLICY "Public can view bucket objects" ON storage.objects
  FOR SELECT USING (bucket_id IN (
    'avatars', 'cms-images', 'berita-images', 'galeri-foto',
    'prestasi-certificates', 'stem-portfolios', 'mandarin-audios',
    'hafidz-audios', 'madin-flyers'
  ));

DROP POLICY IF EXISTS "Authenticated can upload bucket objects" ON storage.objects;
CREATE POLICY "Authenticated can upload bucket objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id IN (
    'avatars', 'cms-images', 'berita-images', 'galeri-foto',
    'prestasi-certificates', 'stem-portfolios', 'mandarin-audios',
    'hafidz-audios', 'madin-flyers'
  ));

DROP POLICY IF EXISTS "Authenticated can update bucket objects" ON storage.objects;
CREATE POLICY "Authenticated can update bucket objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id IN (
    'avatars', 'cms-images', 'berita-images', 'galeri-foto',
    'prestasi-certificates', 'stem-portfolios', 'mandarin-audios',
    'hafidz-audios', 'madin-flyers'
  ));

DROP POLICY IF EXISTS "Authenticated can delete bucket objects" ON storage.objects;
CREATE POLICY "Authenticated can delete bucket objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id IN (
    'avatars', 'cms-images', 'berita-images', 'galeri-foto',
    'prestasi-certificates', 'stem-portfolios', 'mandarin-audios',
    'hafidz-audios', 'madin-flyers'
  ));

-- 7. REPLICA IDENTITY FULL & SUPABASE_REALTIME PUBLICATION ENABLER
DO $$
DECLARE
  rt text;
  realtime_targets text[] := ARRAY[
    'sambutan_persons', 'sliders', 'quick_menus', 'cms_sections',
    'facilities', 'berita', 'galeri_foto', 'galeri_videos',
    'prestasi', 'ekskul', 'osis_structure', 'osis_programs', 'osis_events',
    'agendas', 'kontak_medsos', 'site_settings', 'jm_center_pages',
    'programs_pondok', 'programs_sekolah', 'madin_flyers',
    'stem_worksheets', 'stem_projects', 'mandarin_vocabularies',
    'hafidz_surahs', 'admin_profiles'
  ];
BEGIN
  FOREACH rt IN ARRAY realtime_targets LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = rt) THEN
      BEGIN
        EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL;', rt);
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', rt);
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END LOOP;
END $$;

