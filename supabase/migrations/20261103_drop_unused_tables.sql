-- =============================================================================
-- MIGRASI PEMBERSIHAN TABEL DUPLIKAT & TIDAK TERPAKAI (ADMIN V2 INTEGRATION)
-- Proyek Supabase: gzijnybcmhectajfkdtd (PP. Jauharul Maknuun)
-- =============================================================================

-- 1. Tambahkan izin default untuk section sub_items & mandarin_quizzes
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish)
VALUES
  ('admin_yayasan', 'sub_items', true, true, true, true, true),
  ('admin_yayasan', 'mandarin_quizzes', true, true, true, true, true),
  ('kepala_sekolah', 'sub_items', true, true, true, false, true),
  ('kepala_sekolah', 'mandarin_quizzes', true, true, true, false, true),
  ('guru', 'sub_items', true, false, false, false, false),
  ('guru', 'mandarin_quizzes', true, true, true, false, false),
  ('humas', 'sub_items', true, true, true, false, true),
  ('pengurus_konten', 'sub_items', true, true, true, false, true),
  ('pengurus_konten', 'mandarin_quizzes', true, true, true, false, true)
ON CONFLICT (role, section) DO NOTHING;

-- 2. Hapus 16 tabel duplikat & tidak terpakai
-- Catatan: Saat ini seluruh tabel di bawah sudah dikunci aksesnya (RLS USING (false)).
-- Jalankan blok DROP TABLE ini di Supabase Dashboard -> SQL Editor untuk menghapus fisik tabel.
DROP TABLE IF EXISTS public.gallery_photos CASCADE;
DROP TABLE IF EXISTS public.galleries CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.extracurriculars CASCADE;
DROP TABLE IF EXISTS public.cms_sections_versions CASCADE;
DROP TABLE IF EXISTS public.cms_sections CASCADE;
DROP TABLE IF EXISTS public.profiles_jm_center CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.stem_rubrics CASCADE;
DROP TABLE IF EXISTS public.stem_portfolios CASCADE;
DROP TABLE IF EXISTS public.mandarin_scores CASCADE;
DROP TABLE IF EXISTS public.hafidz_audios CASCADE;
DROP TABLE IF EXISTS public.hafidz_reciters CASCADE;
DROP TABLE IF EXISTS public.hafidz_setoran CASCADE;
DROP TABLE IF EXISTS public.hafidz_murojaah_questions CASCADE;
DROP TABLE IF EXISTS public.hafidz_surahs CASCADE;

