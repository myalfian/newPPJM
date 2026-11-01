-- Migration: 20261025_fix_rls_sambutan.sql
-- Description: Dynamic Multi-Person Sambutan Management & RLS Hardening for Public & Admin

-- 1. Create table sambutan_persons if not exists
CREATE TABLE IF NOT EXISTS public.sambutan_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  role_type text NOT NULL DEFAULT 'pengasuh',
  photo_url text,
  message_short text,
  message_full text,
  order_index int DEFAULT 0,
  is_active boolean DEFAULT true,
  location text[] DEFAULT ARRAY['home', 'jm-center'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 2. Insert initial seed person if empty
INSERT INTO public.sambutan_persons (
  name,
  title,
  role_type,
  photo_url,
  message_short,
  message_full,
  order_index,
  is_active,
  location
)
SELECT
  'KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I.',
  'Pengasuh & Pendiri Pondok Pesantren Jauharul Maknuun',
  'pengasuh',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'Pesantren bukan hanya tempat menuntut ilmu fiqih dan nahwu, melainkan kawah candradimuka pembentukan akhlaqul karimah, ketajaman spiritual, serta ketangguhan menjawab kemajuan zaman.',
  'Bismillahirrohmanirrohim. Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSegala puji bagi Allah Subhanahu wa Ta’ala, yang telah melimpahkan rahmat, taufiq, serta inayah-Nya kepada kita sekalian. Shalawat beriring salam senantiasa tercurahkan ke haribaan junjungan kita, Baginda Nabi Agung Muhammad SAW, keluarga, serta para sahabat beliau.\n\nSelamat datang di portal resmi Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Kabupaten Gresik. Didirikan di atas landasan salafus sholih yang kokoh, pesantren kami berikhtiar menyatukan kemurnian turats (kitab kuning) dengan penguasaan sains modern (STEM) dan bahasa internasional, termasuk Bahasa Mandarin dan Bahasa Arab.\n\nSemoga kehadiran media digital ini dapat menjadi jembatan silaturahim bagi para wali santri, alumni, muhibbin, serta masyarakat luas untuk mengenal lebih dekat dinamika pendidikan dan tarbiyah di Pondok Pesantren Jauharul Maknuun Lasem.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.',
  1,
  true,
  ARRAY['home', 'jm-center']
WHERE NOT EXISTS (SELECT 1 FROM public.sambutan_persons);

-- 3. Enable RLS
ALTER TABLE public.sambutan_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jm_center_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Idempotent Policy creation
DO $$
BEGIN
  -- sambutan_persons policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sambutan_persons' AND policyname = 'Public can read active sambutan') THEN
    CREATE POLICY "Public can read active sambutan" ON public.sambutan_persons FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sambutan_persons' AND policyname = 'Admin can manage sambutan') THEN
    CREATE POLICY "Admin can manage sambutan" ON public.sambutan_persons FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- jm_center_pages policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jm_center_pages' AND policyname = 'Public read jm_center_pages') THEN
    CREATE POLICY "Public read jm_center_pages" ON public.jm_center_pages FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jm_center_pages' AND policyname = 'Admin manage jm_center_pages') THEN
    CREATE POLICY "Admin manage jm_center_pages" ON public.jm_center_pages FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- cms_sections policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cms_sections' AND policyname = 'Public read cms_sections') THEN
    CREATE POLICY "Public read cms_sections" ON public.cms_sections FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cms_sections' AND policyname = 'Admin manage cms_sections') THEN
    CREATE POLICY "Admin manage cms_sections" ON public.cms_sections FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- site_settings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public Read Settings') THEN
    CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Admin manage site_settings') THEN
    CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. Grant permissions to anon & authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sambutan_persons TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jm_center_pages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_sections TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated;

