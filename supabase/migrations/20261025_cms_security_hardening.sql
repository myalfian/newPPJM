-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM)
-- MIGRATION: 20261025_cms_security_hardening.sql
-- DESCRIPTION: CMS Schema, Versioning, Audit Logging, and RBAC Policies
-- ==============================================================================
-- CARA MENJALANKAN DI SUPABASE SQL EDITOR:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard/project/<project-id>)
-- 2. Pilih menu "SQL Editor" di bilah navigasi kiri.
-- 3. Buat New Query, copy-paste seluruh isi file ini ke dalam editor.
-- 4. Klik tombol "Run" (atau tekan Ctrl+Enter).
-- 5. Pastikan output menyatakan "Success. No rows returned" tanpa error.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABEL: cms_sections
-- Menyimpan state dan konfigurasi modular tiap seksi visual website
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_sections (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    visible BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indeks untuk performa query tata letak seksi
CREATE INDEX IF NOT EXISTS idx_cms_sections_visible ON public.cms_sections(visible);
CREATE INDEX IF NOT EXISTS idx_cms_sections_type ON public.cms_sections(type);
CREATE INDEX IF NOT EXISTS idx_cms_sections_updated_at ON public.cms_sections(updated_at DESC);

-- ------------------------------------------------------------------------------
-- 2. TABEL: cms_sections_versions
-- Menyimpan rekaman riwayat snapshot tiap mutasi konten untuk rollback
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_sections_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id TEXT NOT NULL REFERENCES public.cms_sections(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indeks untuk pencarian riwayat versi per seksi
CREATE INDEX IF NOT EXISTS idx_cms_versions_section ON public.cms_sections_versions(section_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_versions_created_by ON public.cms_sections_versions(created_by);

-- ------------------------------------------------------------------------------
-- 3. TABEL: audit_logs
-- Merekam seluruh jejak audit mutasi konten, user, aksi, dan metadata
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    role TEXT,
    action TEXT NOT NULL,
    module TEXT NOT NULL DEFAULT 'cms',
    section_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indeks untuk investigasi audit log
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON public.audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_logs_section_id ON public.audit_logs(section_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. FUNCTION & TRIGGER: log_cms_audit()
-- Otomatis mencatat perubahan cms_sections ke audit_logs & snapshot versi
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_cms_audit()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_user_email TEXT;
    v_user_role TEXT;
    v_action TEXT;
    v_section_id TEXT;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
BEGIN
    v_user_id := auth.uid();
    
    -- Ambil email pengguna dari auth.jwt() atau auth.users
    v_user_email := COALESCE(
        current_setting('request.jwt.claim.email', true),
        (SELECT email FROM auth.users WHERE id = v_user_id)
    );

    -- Ambil role pengguna dari public.admin_profiles
    SELECT role::text INTO v_user_role
    FROM public.admin_profiles
    WHERE id = v_user_id;

    IF TG_OP = 'INSERT' THEN
        v_action := 'INSERT';
        v_section_id := NEW.id;
        v_new_data := NEW.data;

        -- Simpan versi awal
        INSERT INTO public.cms_sections_versions (section_id, data, created_by, created_at)
        VALUES (NEW.id, NEW.data, v_user_id, TIMEZONE('utc'::text, NOW()));

    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'UPDATE';
        v_section_id := NEW.id;
        v_old_data := OLD.data;
        v_new_data := NEW.data;

        -- Otomatis update updated_at
        NEW.updated_at := TIMEZONE('utc'::text, NOW());

        -- Simpan snapshot riwayat versi baru jika data berubah
        IF OLD.data IS DISTINCT FROM NEW.data THEN
            INSERT INTO public.cms_sections_versions (section_id, data, created_by, created_at)
            VALUES (NEW.id, NEW.data, v_user_id, TIMEZONE('utc'::text, NOW()));
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'DELETE';
        v_section_id := OLD.id;
        v_old_data := OLD.data;
    END IF;

    -- Catat ke audit_logs
    INSERT INTO public.audit_logs (
        user_id,
        email,
        role,
        action,
        module,
        section_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        v_user_id,
        v_user_email,
        COALESCE(v_user_role, 'authenticated'),
        v_action,
        'cms',
        v_section_id,
        v_old_data,
        v_new_data,
        TIMEZONE('utc'::text, NOW())
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Pasang Trigger pada tabel cms_sections
DROP TRIGGER IF EXISTS trg_cms_sections_audit ON public.cms_sections;
CREATE TRIGGER trg_cms_sections_audit
    BEFORE INSERT OR UPDATE OR DELETE ON public.cms_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.log_cms_audit();

-- ------------------------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. RLS POLICIES: cms_sections
-- - Read: Publik dan pengguna terotentikasi dapat membaca konten seksi
-- - Write: Hanya super_admin dan pengurus_konten
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Sections" ON public.cms_sections;
CREATE POLICY "Public Read Sections" ON public.cms_sections
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Staff Write Sections" ON public.cms_sections;
CREATE POLICY "Staff Write Sections" ON public.cms_sections
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

-- ------------------------------------------------------------------------------
-- 7. RLS POLICIES: cms_sections_versions
-- - Read: Staf CMS (super_admin & pengurus_konten)
-- - Insert: Staf CMS atau Trigger sistem
-- - Delete: Hanya super_admin
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff Read Versions" ON public.cms_sections_versions;
CREATE POLICY "Staff Read Versions" ON public.cms_sections_versions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

DROP POLICY IF EXISTS "Staff Insert Versions" ON public.cms_sections_versions;
CREATE POLICY "Staff Insert Versions" ON public.cms_sections_versions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

DROP POLICY IF EXISTS "Super Admin Delete Versions" ON public.cms_sections_versions;
CREATE POLICY "Super Admin Delete Versions" ON public.cms_sections_versions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role = 'super_admin'
        )
    );

-- ------------------------------------------------------------------------------
-- 8. RLS POLICIES: audit_logs
-- - Read: Hanya super_admin
-- - Insert: Pengguna terotentikasi (mencatat aksi diri sendiri)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Super Admin Read Audit Logs" ON public.audit_logs;
CREATE POLICY "Super Admin Read Audit Logs" ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role = 'super_admin'
        )
    );

DROP POLICY IF EXISTS "Authenticated Insert Audit Logs" ON public.audit_logs;
CREATE POLICY "Authenticated Insert Audit Logs" ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() OR user_id IS NULL
    );

