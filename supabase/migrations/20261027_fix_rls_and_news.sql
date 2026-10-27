-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM)
-- MIGRATION: 20261027_fix_rls_and_news.sql
-- RESTORE FUNCTION EXECUTE PRIVILEGES, PROFILE UPDATE POLICY, & NEWS TABLE SCHEMA
-- ==============================================================================

-- 1. Ensure Helper Security Definer Functions Exist & Grant EXECUTE to authenticated
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

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_user_role') THEN
        BEGIN
            EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_user_role(user_role) TO authenticated;';
        EXCEPTION WHEN OTHERS THEN
            BEGIN
                EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_user_role(public.user_role) TO authenticated;';
            EXCEPTION WHEN OTHERS THEN NULL;
            END;
        END;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_my_role') THEN
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
        BEGIN
            EXECUTE 'GRANT EXECUTE ON FUNCTION public.has_role(VARIADIC user_role[]) TO authenticated;';
        EXCEPTION WHEN OTHERS THEN
            BEGIN
                EXECUTE 'GRANT EXECUTE ON FUNCTION public.has_role(user_role[]) TO authenticated;';
            EXCEPTION WHEN OTHERS THEN NULL;
            END;
        END;
    END IF;
END $$;

-- 2. Clean Policy for Self Profile Updates on admin_profiles
-- Drop recursive/superseded policy if exists, and ensure clean 'Users Update Own Profile'
DROP POLICY IF EXISTS "Self Update Profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON public.admin_profiles;

CREATE POLICY "Users Update Own Profile" ON public.admin_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Create News Table Schema
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'Warta Pondok',
    summary TEXT,
    content TEXT NOT NULL,
    thumbnail TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    author TEXT DEFAULT 'Humas & Media PPJM',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for news table
CREATE INDEX IF NOT EXISTS idx_news_published_created ON public.news(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);

-- Enable RLS on news table
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public read policy on news
DROP POLICY IF EXISTS "Public Read News" ON public.news;
CREATE POLICY "Public Read News" ON public.news
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- Authenticated write policy on news
DROP POLICY IF EXISTS "Authenticated Write News" ON public.news;
CREATE POLICY "Authenticated Write News" ON public.news
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Extend Mandarin Quizzes for Direct Question Bank Management
DO $$ BEGIN
    ALTER TABLE public.mandarin_quizzes ADD COLUMN IF NOT EXISTS topic_name TEXT;
    ALTER TABLE public.mandarin_quizzes ADD COLUMN IF NOT EXISTS hanzi TEXT;
    ALTER TABLE public.mandarin_quizzes ADD COLUMN IF NOT EXISTS pinyin TEXT;
    ALTER TABLE public.mandarin_quizzes ALTER COLUMN lesson_id DROP NOT NULL;
EXCEPTION
    WHEN others THEN null;
END $$;
