-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM) LASEM SIDAYU GRESIK
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS) & ROLE ISOLATION
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM ROLES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'pengurus_konten', 'guru_akademik');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Bound to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'pengurus_konten',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. JM CENTER PAGES (Sambutan, Sejarah, Visi Misi, Lembaga)
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

-- 6. PROGRAM UNGGULAN (Amaliyah Pondok, Program Sekolah, Program Madin)
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

-- 7. STEM AREA (Materi & Portofolio Siswa)
CREATE TABLE IF NOT EXISTS public.stem_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'Robotika & IoT', 'Sains Lingkungan', 'Agroteknologi Santri'
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

-- 8. MANDARIN CLASS (Lessons & Quizzes)
CREATE TABLE IF NOT EXISTS public.mandarin_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_index INT NOT NULL DEFAULT 1,
    level TEXT NOT NULL DEFAULT 'Dasar', -- e.g. 'Dasar 1', 'Percakapan Santri', 'Kosakata Harian'
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
    lesson_id UUID REFERENCES public.mandarin_lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type TEXT DEFAULT 'choice' CHECK (question_type IN ('choice', 'pinyin', 'match')),
    options JSONB NOT NULL, -- Array of string options
    correct_index INT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. PRESTASI SANTRI
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'Kitab Kuning / MQK', 'Tahfidz 30 Juz', 'Robotika / STEM', 'Olahraga & Silat'
    year INT NOT NULL,
    winner_name TEXT NOT NULL,
    medal_type TEXT NOT NULL, -- 'Emas / Juara 1', 'Perak / Juara 2', 'Perunggu / Juara 3', 'Favorit'
    certificate_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. EKSKUL SANTRI
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

-- 11. GALERI AGENDA (Foto & Video)
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('foto', 'video')),
    event_date DATE NOT NULL,
    description TEXT,
    cover_image TEXT,
    video_url TEXT, -- YouTube embed / Reels link if category = video
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. HELPER FUNCTION: CHECK USER ROLE
CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND (role = required_role OR role = 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
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

-- 14. POLICIES: PUBLIC READ ACCESS (ALL DATA IS OPEN TO READ)
CREATE POLICY "Public Read Profiles" ON public.admin_profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read JM Center" ON public.jm_center_pages FOR SELECT USING (true);
CREATE POLICY "Public Read Programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public Read STEM" ON public.stem_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Mandarin Lessons" ON public.mandarin_lessons FOR SELECT USING (true);
CREATE POLICY "Public Read Mandarin Quizzes" ON public.mandarin_quizzes FOR SELECT USING (true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public Read Extracurriculars" ON public.extracurriculars FOR SELECT USING (true);
CREATE POLICY "Public Read Galleries" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery Photos" ON public.gallery_photos FOR SELECT USING (true);

-- 15. POLICIES: WRITE ACCESS BASED ON ROLES
-- super_admin & pengurus_konten can write news, galleries, jm-center, programs, achievements
CREATE POLICY "Admin Write Settings" ON public.site_settings FOR ALL 
    USING (public.check_user_role('super_admin'));

CREATE POLICY "Admin Write Profiles" ON public.admin_profiles FOR ALL 
    USING (public.check_user_role('super_admin'));

CREATE POLICY "Pengurus Write JM Center" ON public.jm_center_pages FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

CREATE POLICY "Pengurus Write Programs" ON public.programs FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

CREATE POLICY "Pengurus Write Achievements" ON public.achievements FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

CREATE POLICY "Pengurus Write Extracurriculars" ON public.extracurriculars FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

CREATE POLICY "Pengurus Write Galleries" ON public.galleries FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

CREATE POLICY "Pengurus Write Gallery Photos" ON public.gallery_photos FOR ALL 
    USING (public.check_user_role('pengurus_konten'));

-- super_admin & guru_akademik can write STEM and Mandarin modules
CREATE POLICY "Akademik Write STEM" ON public.stem_projects FOR ALL 
    USING (public.check_user_role('guru_akademik'));

CREATE POLICY "Akademik Write Mandarin Lessons" ON public.mandarin_lessons FOR ALL 
    USING (public.check_user_role('guru_akademik'));

CREATE POLICY "Akademik Write Mandarin Quizzes" ON public.mandarin_quizzes FOR ALL 
    USING (public.check_user_role('guru_akademik'));

-- 16. TRIGGER AUTO-CREATE PROFILE ON AUTH SIGNUP
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
