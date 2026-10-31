-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM)
-- MIGRATION: 20261025_storage_cms_images.sql
-- DESCRIPTION: Supabase Storage Bucket for CMS Images with Size, MIME & RBAC Policies
-- ==============================================================================
-- CARA MENJALANKAN DI SUPABASE SQL EDITOR:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard/project/<project-id>)
-- 2. Pilih menu "SQL Editor" di bilah navigasi kiri.
-- 3. Buat New Query, copy-paste seluruh isi file ini ke dalam editor.
-- 4. Klik tombol "Run" (atau tekan Ctrl+Enter).
-- 5. Periksa tab "Storage" -> "Buckets" untuk memastikan bucket 'cms-images' telah aktif.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. INSERT BUCKET: cms-images
-- Konfigurasi bucket privat, batas ukuran 5MB, format gambar JPG, PNG, & WebP
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
) VALUES (
    'cms-images',
    'cms-images',
    false,
    5242880, -- 5 MB (5 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON STORAGE.OBJECTS
-- ------------------------------------------------------------------------------
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. STORAGE RLS POLICY: SELECT (READ)
-- Pengunjung website (publik & authenticated) dapat melihat aset gambar CMS
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read CMS Images" ON storage.objects;
CREATE POLICY "Public Read CMS Images" ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'cms-images');

-- ------------------------------------------------------------------------------
-- 4. STORAGE RLS POLICY: INSERT (UPLOAD)
-- Hanya Super Admin dan Pengurus Konten yang diizinkan mengunggah gambar
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff Upload CMS Images" ON storage.objects;
CREATE POLICY "Staff Upload CMS Images" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'cms-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

-- ------------------------------------------------------------------------------
-- 5. STORAGE RLS POLICY: UPDATE
-- Hanya Super Admin dan Pengurus Konten yang diizinkan memperbarui metadata/file
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff Update CMS Images" ON storage.objects;
CREATE POLICY "Staff Update CMS Images" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'cms-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    )
    WITH CHECK (
        bucket_id = 'cms-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

-- ------------------------------------------------------------------------------
-- 6. STORAGE RLS POLICY: DELETE
-- Hanya Super Admin dan Pengurus Konten yang diizinkan menghapus gambar
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff Delete CMS Images" ON storage.objects;
CREATE POLICY "Staff Delete CMS Images" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'cms-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'pengurus_konten')
        )
    );

