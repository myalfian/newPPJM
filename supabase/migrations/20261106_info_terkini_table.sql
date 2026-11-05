-- Migration: 20261106_info_terkini_table.sql
-- Tabel Info Terkini untuk halaman Admin (dikelola oleh Pengurus Konten / Humas)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.info_terkini (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Umum',
  excerpt text,
  content text NOT NULL,
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  slug text NOT NULL UNIQUE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: Public read published, Admin (authenticated) full CRUD
ALTER TABLE public.info_terkini ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_info_terkini_public_read ON public.info_terkini;
CREATE POLICY rls_info_terkini_public_read ON public.info_terkini
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS rls_info_terkini_admin_write ON public.info_terkini;
CREATE POLICY rls_info_terkini_admin_write ON public.info_terkini
  FOR ALL TO authenticated
  USING (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'))
  WITH CHECK (public.is_staff_or_guru() OR public.is_role('super_admin') OR public.is_role('kepsek') OR public.is_role('yayasan'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_info_terkini_slug ON public.info_terkini(slug);
CREATE INDEX IF NOT EXISTS idx_info_terkini_category ON public.info_terkini(category);
CREATE INDEX IF NOT EXISTS idx_info_terkini_published ON public.info_terkini(is_published);
CREATE INDEX IF NOT EXISTS idx_info_terkini_featured ON public.info_terkini(is_featured);
CREATE INDEX IF NOT EXISTS idx_info_terkini_created_at ON public.info_terkini(created_at DESC);

-- Audit trigger
DROP TRIGGER IF EXISTS trg_audit_info_terkini ON public.info_terkini;
CREATE TRIGGER trg_audit_info_terkini AFTER INSERT OR UPDATE OR DELETE ON public.info_terkini
  FOR EACH ROW EXECUTE FUNCTION public.audit_content_changes();
