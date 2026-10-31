-- ============================================================================
-- FULL PRODUCTION SCHEMA MIGRATION FOR PONDOK PESANTREN JAUHARUL MAKNUUN
-- MIGRATION: 20261025_full_schema.sql
-- TARGET: 34 Mandatory Tables + RLS Policies + 9 Storage Buckets + Seed Data
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PILAR UTAMA: CMS & NAVIGASI SISTEM (Tables 1 - 4)
-- ============================================================================

-- 1. cms_sections - untuk WebVisualEditor
CREATE TABLE IF NOT EXISTS public.cms_sections (
  id text PRIMARY KEY,
  type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  visible boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. sliders - Hero Slider 3D Coverflow 5 flyer
CREATE TABLE IF NOT EXISTS public.sliders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  badge_tag text,
  image_url text NOT NULL,
  cta_text text DEFAULT 'Pelajari Selengkapnya',
  cta_link text DEFAULT '/program',
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. quick_menus - QuickMenu 8 tombol
CREATE TABLE IF NOT EXISTS public.quick_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL,
  link text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. profiles_jm_center - Sambutan, Sejarah, Visi Misi
CREATE TABLE IF NOT EXISTS public.profiles_jm_center (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'sambutan', 'sejarah', 'visi_misi'
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  author_name text,
  jabatan text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. PILAR KELENGKAPAN LEMBAGA & PROGRAM (Tables 5 - 9)
-- ============================================================================

-- 5. facilities - Fasilitas filter kategori
CREATE TABLE IF NOT EXISTS public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Semua', -- 'Semua', 'Asrama Santri', 'Sarana Ibadah', 'Ruang Akademik', 'Laboratorium STEM', 'Fasilitas Olahraga'
  description text,
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. institutions - Lembaga (Pondok, SMP Plus, Madin)
CREATE TABLE IF NOT EXISTS public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- 'pondok', 'smp_plus', 'madin'
  description text,
  curriculum jsonb DEFAULT '[]'::jsonb,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. programs_pondok - Kepesantrenan & Amaliyah
CREATE TABLE IF NOT EXISTS public.programs_pondok (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. programs_sekolah - SMP Plus
CREATE TABLE IF NOT EXISTS public.programs_sekolah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  visual_story jsonb DEFAULT '[]'::jsonb,
  curriculum text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. madin_flyers - Flyer kitab kuning
CREATE TABLE IF NOT EXISTS public.madin_flyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  pdf_url text,
  category text NOT NULL DEFAULT 'kitab', -- 'ubudiyah', 'kitab'
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. SMART JM: STEM (Tables 10 - 12)
-- ============================================================================

-- 10. stem_worksheets - Lab Riset STEM
CREATE TABLE IF NOT EXISTS public.stem_worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL, -- 'IoT', 'Filtrasi', 'Energi', 'Robotik'
  level text NOT NULL DEFAULT 'SMP',
  description text,
  goals text,
  tools jsonb DEFAULT '[]'::jsonb,
  steps jsonb DEFAULT '[]'::jsonb,
  image_url text,
  pdf_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. stem_rubrics - Rubrik Penilaian 4 Parameter
CREATE TABLE IF NOT EXISTS public.stem_rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id uuid REFERENCES public.stem_worksheets(id) ON DELETE CASCADE,
  parameter text NOT NULL, -- 'Inovasi & Desain', 'Metodologi', 'Hasil Pengujian', 'Presentasi'
  weight integer NOT NULL DEFAULT 25,
  criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. stem_portfolios - Portfolio karya santri
CREATE TABLE IF NOT EXISTS public.stem_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  worksheet_id uuid REFERENCES public.stem_worksheets(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  status text NOT NULL DEFAULT 'Proses', -- 'Lolos Uji', 'Proses', 'Revisi'
  score integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. SMART JM: MANDARIN (Tables 13 - 15)
-- ============================================================================

-- 13. mandarin_vocabularies - Kosakata HSK
CREATE TABLE IF NOT EXISTS public.mandarin_vocabularies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hanzi text NOT NULL,
  pinyin text NOT NULL,
  arti text NOT NULL,
  example_hanzi text,
  example_pinyin text,
  example_arti text,
  audio_url text,
  hsk_level text NOT NULL DEFAULT 'HSK 1',
  category text DEFAULT 'Umum',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. mandarin_quizzes - Kuis gamifikasi
CREATE TABLE IF NOT EXISTS public.mandarin_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  hsk_level text NOT NULL DEFAULT 'HSK 1',
  duration_minutes integer NOT NULL DEFAULT 15,
  points_per_question integer NOT NULL DEFAULT 10,
  passing_score integer NOT NULL DEFAULT 70,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 15. mandarin_scores - Nilai santri Mandarin
CREATE TABLE IF NOT EXISTS public.mandarin_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.mandarin_quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  time_spent integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Lulus',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. SMART JM: HAFIDZ QUR'AN DIGITAL (Tables 16 - 20)
-- ============================================================================

-- 16. hafidz_surahs - 114 Surat
CREATE TABLE IF NOT EXISTS public.hafidz_surahs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL UNIQUE,
  name_arab text NOT NULL,
  name_latin text NOT NULL,
  meaning text NOT NULL,
  ayah_count integer NOT NULL,
  place text NOT NULL, -- 'Makkiyah', 'Madaniyah'
  juz integer NOT NULL DEFAULT 1,
  content jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 17. hafidz_reciters - Murottal reciter
CREATE TABLE IF NOT EXISTS public.hafidz_reciters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  photo_url text,
  audio_quality text DEFAULT '128kbps',
  surah_count integer DEFAULT 114,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 18. hafidz_audios - Audio per ayat
CREATE TABLE IF NOT EXISTS public.hafidz_audios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reciter_id uuid REFERENCES public.hafidz_reciters(id) ON DELETE CASCADE,
  surah_id uuid REFERENCES public.hafidz_surahs(id) ON DELETE CASCADE,
  ayah_number integer NOT NULL,
  audio_url text NOT NULL,
  duration integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 19. hafidz_setoran - Evaluasi setoran hafalan
CREATE TABLE IF NOT EXISTS public.hafidz_setoran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_id uuid REFERENCES public.hafidz_surahs(id) ON DELETE SET NULL,
  ayah_from integer NOT NULL,
  ayah_to integer NOT NULL,
  kelancaran integer NOT NULL DEFAULT 90,
  tajwid integer NOT NULL DEFAULT 90,
  makhorijul integer NOT NULL DEFAULT 90,
  notes text,
  status text NOT NULL DEFAULT 'Lancar', -- 'Lancar', 'Perlu Murojaah', 'Tidak Lancar'
  pembimbing_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 20. hafidz_murojaah_questions - Cloze Test
CREATE TABLE IF NOT EXISTS public.hafidz_murojaah_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id uuid REFERENCES public.hafidz_surahs(id) ON DELETE CASCADE,
  ayah_number integer NOT NULL,
  hidden_words jsonb NOT NULL DEFAULT '[]'::jsonb,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  difficulty text NOT NULL DEFAULT 'Sedang',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. KONTEN PUBLIK: BERITA, GALERI, PRESTASI, EKSKUL, OSIS (Tables 21 - 28)
-- ============================================================================

-- 21. berita - JM News & Press Release
CREATE TABLE IF NOT EXISTS public.berita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Semua Warta',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 22. galeri_foto - Galeri Foto
CREATE TABLE IF NOT EXISTS public.galeri_foto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Umum',
  album_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 23. galeri_videos - Galeri Video YouTube
CREATE TABLE IF NOT EXISTS public.galeri_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_url text NOT NULL,
  thumbnail_url text,
  description text,
  category text NOT NULL DEFAULT 'Dokumentasi',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 24. prestasi - Prestasi Santri
CREATE TABLE IF NOT EXISTS public.prestasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_name text NOT NULL,
  pembina_name text,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Sains & Robotik',
  level text NOT NULL DEFAULT 'Nasional',
  year integer NOT NULL DEFAULT 2026,
  certificate_url text,
  photo_url text,
  organizer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 25. ekskul - Ekstrakurikuler
CREATE TABLE IF NOT EXISTS public.ekskul (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Sains',
  description text,
  instructor_name text,
  schedule text,
  location text,
  syllabus text,
  target text,
  images jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 26. osis_structure - Struktur Kabinet OSIS 3 Level
CREATE TABLE IF NOT EXISTS public.osis_structure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  level integer NOT NULL DEFAULT 1, -- 1 Presidium, 2 BPH, 3 Sekbid
  class text,
  photo_url text,
  motto text,
  period text DEFAULT '2026/2027',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 27. osis_programs - Proker 5 Departemen
CREATE TABLE IF NOT EXISTS public.osis_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department text NOT NULL,
  title text NOT NULL,
  target text,
  frequency text,
  output text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 28. osis_events - Event OSIS
CREATE TABLE IF NOT EXISTS public.osis_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  image_url text,
  category text DEFAULT 'Kesiswaan',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. SISTEM & ADMINISTRASI (Tables 29 - 34)
-- ============================================================================

-- 29. agendas - Kalender Akademik & Rutinitas
CREATE TABLE IF NOT EXISTS public.agendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  start_time time,
  end_time time,
  category text NOT NULL DEFAULT 'Pondok',
  type text NOT NULL DEFAULT 'event',
  is_closest boolean DEFAULT false,
  google_calendar_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 30. spmb_info - Info SPMB
CREATE TABLE IF NOT EXISTS public.spmb_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun_ajaran text NOT NULL DEFAULT '2026/2027',
  gelombang text NOT NULL DEFAULT 'Gelombang 1',
  alur jsonb DEFAULT '[]'::jsonb,
  persyaratan jsonb DEFAULT '[]'::jsonb,
  biaya jsonb DEFAULT '[]'::jsonb,
  kontak_wa text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 31. admin_profiles - Profil & RBAC 4 Role (Preserved & Hardened)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text NOT NULL,
  nip text,
  role text NOT NULL DEFAULT 'santri',
  avatar_url text,
  class text,
  motto text,
  bio text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

-- 32. audit_logs - Audit Log Sistem
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  role text,
  action text NOT NULL,
  module text NOT NULL,
  section_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 33. cms_sections_versions - Versioning WebVisualEditor
CREATE TABLE IF NOT EXISTS public.cms_sections_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 34. kontak_medsos - Kontak & Medsos 7 Kanal
CREATE TABLE IF NOT EXISTS public.kontak_medsos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- wa_admin, saluran_wa, instagram, tiktok, youtube, facebook, email
  label text NOT NULL,
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  bg_color text,
  icon_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. COMPATIBILITY VIEWS (Supports both legacy & new table nomenclature)
-- ============================================================================

CREATE OR REPLACE VIEW public.news AS SELECT id, slug, title, excerpt AS summary, content, image_url AS thumbnail, category, author_id AS author, is_published, created_at, created_at AS updated_at FROM public.berita;
CREATE OR REPLACE VIEW public.achievements AS SELECT id, title, santri_name AS winner_name, category, level AS medal_type, year, certificate_url, photo_url AS image_url, organizer AS description, created_at FROM public.prestasi;
CREATE OR REPLACE VIEW public.extracurriculars AS SELECT id, name, category, instructor_name AS coach, schedule, location, description, photo_url AS image_url, is_active, created_at FROM public.ekskul;

-- ============================================================================
-- 9. ENABLE ROW LEVEL SECURITY (RLS) FOR ALL 34 TABLES
-- ============================================================================

DO $$
DECLARE
  tbl_name text;
  tables text[] := ARRAY[
    'cms_sections', 'sliders', 'quick_menus', 'profiles_jm_center', 'facilities',
    'institutions', 'programs_pondok', 'programs_sekolah', 'madin_flyers',
    'stem_worksheets', 'stem_rubrics', 'stem_portfolios', 'mandarin_vocabularies',
    'mandarin_quizzes', 'mandarin_scores', 'hafidz_surahs', 'hafidz_reciters',
    'hafidz_audios', 'hafidz_setoran', 'hafidz_murojaah_questions', 'berita',
    'galeri_foto', 'galeri_videos', 'prestasi', 'ekskul', 'osis_structure',
    'osis_programs', 'osis_events', 'agendas', 'spmb_info', 'admin_profiles',
    'audit_logs', 'cms_sections_versions', 'kontak_medsos'
  ];
BEGIN
  FOREACH tbl_name IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name);
    
    -- Drop existing default policies if exist to ensure idempotency
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON public.%I;', tbl_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated Admin Write" ON public.%I;', tbl_name);

    -- 1. Public Read Policy
    EXECUTE format('CREATE POLICY "Public Read Access" ON public.%I FOR SELECT USING (true);', tbl_name);

    -- 2. Authenticated Insert/Update/Delete Policy
    EXECUTE format('CREATE POLICY "Authenticated Admin Write" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', tbl_name);
  END LOOP;
END $$;

-- ============================================================================
-- 10. STORAGE BUCKETS CONFIGURATION (9 BUCKETS)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('cms-images', 'cms-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('berita-images', 'berita-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('galeri-foto', 'galeri-foto', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('prestasi-certificates', 'prestasi-certificates', true, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('stem-portfolios', 'stem-portfolios', true, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('mandarin-audios', 'mandarin-audios', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']),
  ('hafidz-audios', 'hafidz-audios', true, 20971520, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']),
  ('madin-flyers', 'madin-flyers', true, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Storage Upload" ON storage.objects;
CREATE POLICY "Authenticated Storage Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated Storage Update" ON storage.objects;
CREATE POLICY "Authenticated Storage Update" ON storage.objects FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated Storage Delete" ON storage.objects;
CREATE POLICY "Authenticated Storage Delete" ON storage.objects FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- 11. PRODUCTION SEED DATA FOR KEY MODULES
-- ============================================================================

-- Sliders
INSERT INTO public.sliders (title, description, badge_tag, image_url, cta_text, cta_link, order_index)
VALUES
  ('SMP Plus Jauharul Maknuun', 'Integrasi Salafiyah Berkarakter dengan Sains Modern & Bahasa Global', 'Unggulan', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1600&q=80', 'Pelajari Kurikulum', '/program', 1),
  ('Markaz Tahfidzul Qur''an 30 Juz', 'Bimbingan Hifdzil Qur''an Bersanad Mutqin dengan 15 Reciter Digital', 'Tahfidz', 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1600&q=80', 'Simak Murottal', '/smart-jm', 2),
  ('Laboratorium Inovasi Riset STEM', 'Eksperimen Rekayasa IoT ESP32, Robotika & Otomasi Santri', 'Teknologi', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80', 'Lihat Karya Santri', '/smart-jm', 3),
  ('Mandarin Class Putonghua HSK', 'Kompetensi Bahasa Mandarin Komparatif Santri Berwawasan Internasional', 'Bahasa', 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1600&q=80', 'Mulai Belajar', '/smart-jm', 4),
  ('Madrasah Diniyah Salafiyah Turats', 'Kajian Mendalam Kitab Kuning Maknani Gandul & Metodologi Bahtsul Masail', 'Turats Salaf', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=80', 'Daftar SPMB', '/spmb', 5)
ON CONFLICT DO NOTHING;

-- Quick Menus (8 Tombol)
INSERT INTO public.quick_menus (label, icon, link, order_index)
VALUES
  ('Profil Lembaga', 'Building2', '/jm-center', 1),
  ('Tahfidz Qur''an', 'BookOpen', '/smart-jm', 2),
  ('Lab STEM Santri', 'Cpu', '/smart-jm', 3),
  ('Mandarin Class', 'Languages', '/smart-jm', 4),
  ('Prestasi Santri', 'Trophy', '/prestasi', 5),
  ('Ekstrakurikuler', 'Sparkles', '/ekskul', 6),
  ('Warta & Berita', 'Newspaper', '/berita', 7),
  ('Pendaftaran SPMB', 'GraduationCap', '/spmb', 8)
ON CONFLICT DO NOTHING;

-- Kontak Medsos (7 Kanal)
INSERT INTO public.kontak_medsos (type, label, url, order_index, bg_color)
VALUES
  ('wa_admin', 'WhatsApp Pelayanan Santri', 'https://wa.me/6281234567801', 1, '#25D366'),
  ('saluran_wa', 'Saluran Resmi PPJM', 'https://whatsapp.com/channel/0029VaPPJM', 2, '#128C7E'),
  ('instagram', 'Instagram @ppjauharulmaknuun', 'https://instagram.com/ppjauharulmaknuun', 3, '#E1306C'),
  ('tiktok', 'TikTok @ppjauharulmaknuun', 'https://tiktok.com/@ppjauharulmaknuun', 4, '#000000'),
  ('youtube', 'YouTube PPJM Official Media', 'https://youtube.com/@ppjauharulmaknuun', 5, '#FF0000'),
  ('facebook', 'Facebook Pondok Pesantren Jauharul Maknuun', 'https://facebook.com/ppjauharulmaknuun', 6, '#1877F2'),
  ('email', 'Email humas@ppjauharulmaknuun.sch.id', 'mailto:humas@ppjauharulmaknuun.sch.id', 7, '#0E7A4C')
ON CONFLICT DO NOTHING;
