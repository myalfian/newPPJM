-- ==============================================================================
-- Migration: fix_rls_all_tables.sql
-- PP. Jauharul Maknuun - Complete Database & Storage Hardening
-- Enable RLS on all 45 tables, grant public read, and secure authenticated write
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galeri_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galeri_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_murojaah_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_reciters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jm_center_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kontak_medsos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.madin_flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles_jm_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.programs_pondok ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.programs_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quick_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sambutan_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.spmb_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_worksheets ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DO $$
DECLARE
  tbl text;
  pol text;
BEGIN
  FOR tbl, pol IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol, tbl);
  END LOOP;
END $$;

-- 3. Create Public Read Policies for Public Tables
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read admin_profiles active" ON public.admin_profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read agendas" ON public.agendas FOR SELECT USING (true);
CREATE POLICY "Public read berita" ON public.berita FOR SELECT USING (true);
CREATE POLICY "Public read cms_sections" ON public.cms_sections FOR SELECT USING (true);
CREATE POLICY "Public read cms_sections_versions" ON public.cms_sections_versions FOR SELECT USING (true);
CREATE POLICY "Public read ekskul" ON public.ekskul FOR SELECT USING (true);
CREATE POLICY "Public read extracurriculars" ON public.extracurriculars FOR SELECT USING (true);
CREATE POLICY "Public read facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public read galeri_foto" ON public.galeri_foto FOR SELECT USING (true);
CREATE POLICY "Public read galeri_videos" ON public.galeri_videos FOR SELECT USING (true);
CREATE POLICY "Public read galleries" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Public read gallery_photos" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public read hafidz_audios" ON public.hafidz_audios FOR SELECT USING (true);
CREATE POLICY "Public read hafidz_murojaah_questions" ON public.hafidz_murojaah_questions FOR SELECT USING (true);
CREATE POLICY "Public read hafidz_reciters" ON public.hafidz_reciters FOR SELECT USING (true);
CREATE POLICY "Public read hafidz_setoran" ON public.hafidz_setoran FOR SELECT USING (true);
CREATE POLICY "Public read hafidz_surahs" ON public.hafidz_surahs FOR SELECT USING (true);
CREATE POLICY "Public read institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public read jm_center_pages" ON public.jm_center_pages FOR SELECT USING (true);
CREATE POLICY "Public read kontak_medsos" ON public.kontak_medsos FOR SELECT USING (true);
CREATE POLICY "Public read madin_flyers" ON public.madin_flyers FOR SELECT USING (true);
CREATE POLICY "Public read mandarin_lessons" ON public.mandarin_lessons FOR SELECT USING (true);
CREATE POLICY "Public read mandarin_quizzes" ON public.mandarin_quizzes FOR SELECT USING (true);
CREATE POLICY "Public read mandarin_scores" ON public.mandarin_scores FOR SELECT USING (true);
CREATE POLICY "Public read mandarin_vocabularies" ON public.mandarin_vocabularies FOR SELECT USING (true);
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read osis_events" ON public.osis_events FOR SELECT USING (true);
CREATE POLICY "Public read osis_programs" ON public.osis_programs FOR SELECT USING (true);
CREATE POLICY "Public read osis_structure" ON public.osis_structure FOR SELECT USING (true);
CREATE POLICY "Public read prestasi" ON public.prestasi FOR SELECT USING (true);
CREATE POLICY "Public read profiles_jm_center" ON public.profiles_jm_center FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public read programs_pondok" ON public.programs_pondok FOR SELECT USING (true);
CREATE POLICY "Public read programs_sekolah" ON public.programs_sekolah FOR SELECT USING (true);
CREATE POLICY "Public read quick_menus" ON public.quick_menus FOR SELECT USING (is_active = true);
CREATE POLICY "Public read sambutan_persons" ON public.sambutan_persons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read sliders" ON public.sliders FOR SELECT USING (is_active = true);
CREATE POLICY "Public read spmb_info" ON public.spmb_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read stem_portfolios" ON public.stem_portfolios FOR SELECT USING (true);
CREATE POLICY "Public read stem_projects" ON public.stem_projects FOR SELECT USING (true);
CREATE POLICY "Public read stem_rubrics" ON public.stem_rubrics FOR SELECT USING (true);
CREATE POLICY "Public read stem_worksheets" ON public.stem_worksheets FOR SELECT USING (true);

-- 4. Create Authenticated Admin Full Management Policies
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'achievements', 'admin_profiles', 'agendas', 'audit_logs', 'berita',
    'cms_sections', 'cms_sections_versions', 'ekskul', 'extracurriculars',
    'facilities', 'galeri_foto', 'galeri_videos', 'galleries', 'gallery_photos',
    'hafidz_audios', 'hafidz_murojaah_questions', 'hafidz_reciters', 'hafidz_setoran',
    'hafidz_surahs', 'institutions', 'jm_center_pages', 'kontak_medsos',
    'madin_flyers', 'mandarin_lessons', 'mandarin_quizzes', 'mandarin_scores',
    'mandarin_vocabularies', 'news', 'osis_events', 'osis_programs', 'osis_structure',
    'prestasi', 'profiles_jm_center', 'programs', 'programs_pondok', 'programs_sekolah',
    'quick_menus', 'sambutan_persons', 'site_settings', 'sliders', 'spmb_info',
    'stem_portfolios', 'stem_projects', 'stem_rubrics', 'stem_worksheets'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format(
      'CREATE POLICY "Admin manage %s" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t, t
    );
  END LOOP;
END $$;

-- 5. Storage Buckets RLS Policies (9 Buckets PPJM)
-- Public read for all 9 buckets
DROP POLICY IF EXISTS "Public can view bucket objects" ON storage.objects;
CREATE POLICY "Public can view bucket objects" ON storage.objects
  FOR SELECT USING (bucket_id IN (
    'avatars', 'cms-images', 'berita-images', 'galeri-foto',
    'prestasi-certificates', 'stem-portfolios', 'mandarin-audios',
    'hafidz-audios', 'madin-flyers'
  ));

-- Authenticated upload for all 9 buckets
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

