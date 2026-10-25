-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM) LASEM SIDAYU GRESIK
-- PRODUCTION POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY & SQL OPTIMIZATION PATTERNS
-- Target Supabase Project: https://gzijnybcmhectajfkdtd.supabase.co
-- ==============================================================================

-- 1. EXTENSIONS (Isolated in extensions schema according to Supabase best practices)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;

-- 2. SECURITY REMEDIATION (Revoke RPC access from public/anon for internal definer routines)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
        REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
        ALTER FUNCTION public.rls_auto_enable() SET search_path = public, pg_temp;
    END IF;
END $$;

-- 3. ENUM ROLES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'pengurus_konten', 'guru_akademik');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. PROFILES TABLE (Bound to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'pengurus_konten',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. JM CENTER PAGES (Sambutan, Sejarah, Visi Misi, Lembaga)
CREATE TABLE IF NOT EXISTS public.jm_center_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    quotes TEXT,
    banner_image TEXT,
    extra_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. PROGRAM UNGGULAN (Amaliyah Pondok, Program Sekolah, Program Madin)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('amaliyah', 'sekolah', 'madin')),
    title TEXT NOT NULL,
    schedule TEXT,
    target_audience TEXT,
    description TEXT NOT NULL,
    curriculum JSONB DEFAULT '[]'::jsonb,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. STEM AREA (Materi & Portofolio Siswa)
CREATE TABLE IF NOT EXISTS public.stem_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    specs JSONB DEFAULT '{}'::jsonb,
    syllabus_url TEXT,
    assignment_doc_url TEXT,
    cover_image TEXT,
    is_portfolio BOOLEAN DEFAULT FALSE,
    author_santri TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. MANDARIN CLASS (Lessons & Quizzes)
CREATE TABLE IF NOT EXISTS public.mandarin_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_index INT NOT NULL DEFAULT 1,
    level TEXT NOT NULL DEFAULT 'Dasar',
    topic TEXT NOT NULL,
    hanzi TEXT,
    pinyin TEXT NOT NULL,
    meaning_id TEXT NOT NULL,
    dialog_script JSONB DEFAULT '[]'::jsonb,
    audio_url TEXT,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mandarin_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES public.mandarin_lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type TEXT DEFAULT 'choice' CHECK (question_type IN ('choice', 'pinyin', 'match')),
    options JSONB NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. PRESTASI SANTRI
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year INT NOT NULL,
    winner_name TEXT NOT NULL,
    medal_type TEXT NOT NULL,
    certificate_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. EKSKUL SANTRI
CREATE TABLE IF NOT EXISTS public.extracurriculars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Activity',
    schedule TEXT NOT NULL,
    mentor_name TEXT,
    description TEXT NOT NULL,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. GALERI (Foto & Video)
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('foto', 'video')),
    event_date DATE NOT NULL,
    description TEXT,
    cover_image TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. AGENDA PROGRAM SANTRI (Historical, Current, Future)
CREATE TABLE IF NOT EXISTS public.agendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    timeline_status TEXT NOT NULL CHECK (timeline_status IN ('historical', 'current', 'future')),
    date_display TEXT NOT NULL,
    time_display TEXT NOT NULL,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    description TEXT NOT NULL,
    coordinator TEXT NOT NULL,
    badge TEXT,
    rundown JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- SQL OPTIMIZATION PATTERNS: COMPOSITE, FOREIGN KEY, GIN, & PARTIAL INDEXES
-- ==============================================================================

-- Foreign Key Indexes (Eliminate table scan locks during cascade deletes & optimize JOINs)
CREATE INDEX IF NOT EXISTS idx_mandarin_quizzes_lesson_fk ON public.mandarin_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_gallery_fk ON public.gallery_photos(gallery_id);

-- B-Tree Composite & Filter Indexes
CREATE INDEX IF NOT EXISTS idx_programs_category ON public.programs(category);
CREATE INDEX IF NOT EXISTS idx_stem_projects_portfolio_cat ON public.stem_projects(is_portfolio, category);
CREATE INDEX IF NOT EXISTS idx_mandarin_lessons_level_order ON public.mandarin_lessons(level, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_achievements_cat_year ON public.achievements(category, year DESC);
CREATE INDEX IF NOT EXISTS idx_galleries_cat_date ON public.galleries(category, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_order ON public.gallery_photos(gallery_id, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_agendas_status_month_year ON public.agendas(timeline_status, year, month);
CREATE INDEX IF NOT EXISTS idx_agendas_category ON public.agendas(category);

-- Partial Indexes (Index high-frequency query subsets with minimal storage footprint)
CREATE INDEX IF NOT EXISTS idx_stem_portfolio_active ON public.stem_projects(created_at DESC) WHERE is_portfolio = true;
CREATE INDEX IF NOT EXISTS idx_stem_materi_active ON public.stem_projects(created_at DESC) WHERE is_portfolio = false;
CREATE INDEX IF NOT EXISTS idx_agendas_current ON public.agendas(created_at DESC) WHERE timeline_status = 'current';
CREATE INDEX IF NOT EXISTS idx_agendas_future ON public.agendas(created_at DESC) WHERE timeline_status = 'future';

-- GIN Trigram Indexes for Lightning Fast Search Queries
CREATE INDEX IF NOT EXISTS idx_programs_title_trgm ON public.programs USING gin (title extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_stem_projects_title_trgm ON public.stem_projects USING gin (title extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_achievements_title_trgm ON public.achievements USING gin (title extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_galleries_title_trgm ON public.galleries USING gin (title extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_agendas_title_trgm ON public.agendas USING gin (title extensions.gin_trgm_ops);

-- GIN Indexes on JSONB Columns
CREATE INDEX IF NOT EXISTS idx_stem_projects_specs_gin ON public.stem_projects USING gin (specs);
CREATE INDEX IF NOT EXISTS idx_programs_curriculum_gin ON public.programs USING gin (curriculum);
CREATE INDEX IF NOT EXISTS idx_agendas_rundown_gin ON public.agendas USING gin (rundown);

-- ==============================================================================
-- HARDENED SECURITY DEFINER FUNCTIONS & ROW LEVEL SECURITY
-- ==============================================================================

-- Helper Function: Check User Role with search_path hardened and STABLE decorator
CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND (role = required_role OR role = 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.check_user_role(user_role) FROM PUBLIC, anon, authenticated;

-- Row Level Security (RLS) Enforcement
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jm_center_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandarin_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandarin_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Profiles' AND tablename = 'admin_profiles') THEN
        CREATE POLICY "Public Read Profiles" ON public.admin_profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Settings' AND tablename = 'site_settings') THEN
        CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read JM Center' AND tablename = 'jm_center_pages') THEN
        CREATE POLICY "Public Read JM Center" ON public.jm_center_pages FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Programs' AND tablename = 'programs') THEN
        CREATE POLICY "Public Read Programs" ON public.programs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read STEM' AND tablename = 'stem_projects') THEN
        CREATE POLICY "Public Read STEM" ON public.stem_projects FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Mandarin Lessons' AND tablename = 'mandarin_lessons') THEN
        CREATE POLICY "Public Read Mandarin Lessons" ON public.mandarin_lessons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Mandarin Quizzes' AND tablename = 'mandarin_quizzes') THEN
        CREATE POLICY "Public Read Mandarin Quizzes" ON public.mandarin_quizzes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Achievements' AND tablename = 'achievements') THEN
        CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Extracurriculars' AND tablename = 'extracurriculars') THEN
        CREATE POLICY "Public Read Extracurriculars" ON public.extracurriculars FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Galleries' AND tablename = 'galleries') THEN
        CREATE POLICY "Public Read Galleries" ON public.galleries FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Gallery Photos' AND tablename = 'gallery_photos') THEN
        CREATE POLICY "Public Read Gallery Photos" ON public.gallery_photos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Agendas' AND tablename = 'agendas') THEN
        CREATE POLICY "Public Read Agendas" ON public.agendas FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated Write Policies with Role-Based Access Control
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Settings' AND tablename = 'site_settings') THEN
        CREATE POLICY "Admin Write Settings" ON public.site_settings FOR ALL USING (public.check_user_role('super_admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Write Profiles' AND tablename = 'admin_profiles') THEN
        CREATE POLICY "Admin Write Profiles" ON public.admin_profiles FOR ALL USING (public.check_user_role('super_admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write JM Center' AND tablename = 'jm_center_pages') THEN
        CREATE POLICY "Pengurus Write JM Center" ON public.jm_center_pages FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Programs' AND tablename = 'programs') THEN
        CREATE POLICY "Pengurus Write Programs" ON public.programs FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Achievements' AND tablename = 'achievements') THEN
        CREATE POLICY "Pengurus Write Achievements" ON public.achievements FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Extracurriculars' AND tablename = 'extracurriculars') THEN
        CREATE POLICY "Pengurus Write Extracurriculars" ON public.extracurriculars FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Galleries' AND tablename = 'galleries') THEN
        CREATE POLICY "Pengurus Write Galleries" ON public.galleries FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Gallery Photos' AND tablename = 'gallery_photos') THEN
        CREATE POLICY "Pengurus Write Gallery Photos" ON public.gallery_photos FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pengurus Write Agendas' AND tablename = 'agendas') THEN
        CREATE POLICY "Pengurus Write Agendas" ON public.agendas FOR ALL USING (public.check_user_role('pengurus_konten'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Akademik Write STEM' AND tablename = 'stem_projects') THEN
        CREATE POLICY "Akademik Write STEM" ON public.stem_projects FOR ALL USING (public.check_user_role('guru_akademik'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Akademik Write Mandarin Lessons' AND tablename = 'mandarin_lessons') THEN
        CREATE POLICY "Akademik Write Mandarin Lessons" ON public.mandarin_lessons FOR ALL USING (public.check_user_role('guru_akademik'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Akademik Write Mandarin Quizzes' AND tablename = 'mandarin_quizzes') THEN
        CREATE POLICY "Akademik Write Mandarin Quizzes" ON public.mandarin_quizzes FOR ALL USING (public.check_user_role('guru_akademik'));
    END IF;
END $$;

-- Trigger auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pengurus_konten')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;
