-- Migration: 20261107_dynamic_cms_content_fix.sql
-- Description: Create karya_siswa & program_activity_photos tables, relax agendas constraints,
-- sync programs_pondok & programs_sekolah columns, configure RLS, permissions, and seed initial data.

-- 1. Table: public.karya_siswa
CREATE TABLE IF NOT EXISTS public.karya_siswa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL, -- 'buku' | 'batik' | 'video-lagu-batik' | 'video-lagu-ustad' | 'showroom'
  author text DEFAULT 'Santri PP. Jauharul Maknuun',
  author_role text DEFAULT 'Santri',
  year text DEFAULT '2026',
  description text DEFAULT '',
  image_url text,
  video_url text,
  pdf_url text,
  specs jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}'::text[],
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 2. Table: public.program_activity_photos
CREATE TABLE IF NOT EXISTS public.program_activity_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type text NOT NULL, -- 'pondok' | 'sekolah'
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  time_tag text DEFAULT '',
  location text DEFAULT '',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 3. Relax constraints on agendas table
ALTER TABLE public.agendas ALTER COLUMN timeline_status SET DEFAULT 'upcoming';
ALTER TABLE public.agendas ALTER COLUMN month SET DEFAULT 'Januari';
ALTER TABLE public.agendas ALTER COLUMN year SET DEFAULT '2026';
ALTER TABLE public.agendas ALTER COLUMN location SET DEFAULT 'Kampus PP. Jauharul Maknuun';
ALTER TABLE public.agendas ALTER COLUMN target_audience SET DEFAULT 'Santri & Umum';
ALTER TABLE public.agendas ALTER COLUMN coordinator SET DEFAULT 'Panitia Agenda';
ALTER TABLE public.agendas ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.agendas ALTER COLUMN time_display SET DEFAULT '08:00 - Selesai';
ALTER TABLE public.agendas ALTER COLUMN date_display SET DEFAULT 'Segera Diumumkan';
ALTER TABLE public.agendas ALTER COLUMN category SET DEFAULT 'Umum';

-- 4. Sync columns on programs_pondok & programs_sekolah
ALTER TABLE public.programs_pondok ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.programs_pondok ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.programs_pondok ADD COLUMN IF NOT EXISTS key_features text[];
ALTER TABLE public.programs_pondok ALTER COLUMN schedule DROP NOT NULL;
ALTER TABLE public.programs_pondok ALTER COLUMN schedule SET DEFAULT '[]'::jsonb;

ALTER TABLE public.programs_sekolah ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.programs_sekolah ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.programs_sekolah ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.programs_sekolah ADD COLUMN IF NOT EXISTS highlights text[];
ALTER TABLE public.programs_sekolah ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 5. Enable RLS
ALTER TABLE public.karya_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_activity_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'karya_siswa' AND policyname = 'Public Read karya_siswa'
  ) THEN
    CREATE POLICY "Public Read karya_siswa" ON public.karya_siswa FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'karya_siswa' AND policyname = 'Auth CRUD karya_siswa'
  ) THEN
    CREATE POLICY "Auth CRUD karya_siswa" ON public.karya_siswa FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'program_activity_photos' AND policyname = 'Public Read program_activity_photos'
  ) THEN
    CREATE POLICY "Public Read program_activity_photos" ON public.program_activity_photos FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'program_activity_photos' AND policyname = 'Auth CRUD program_activity_photos'
  ) THEN
    CREATE POLICY "Auth CRUD program_activity_photos" ON public.program_activity_photos FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. Register role_permissions
INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish, updated_at)
VALUES
  ('super_admin', 'karya_siswa', true, true, true, true, true, now()),
  ('yayasan', 'karya_siswa', true, true, true, true, true, now()),
  ('admin_yayasan', 'karya_siswa', true, true, true, true, true, now()),
  ('kepsek', 'karya_siswa', true, true, true, true, true, now()),
  ('humas', 'karya_siswa', true, true, true, true, true, now()),
  ('pengurus_konten', 'karya_siswa', true, true, true, true, true, now()),

  ('super_admin', 'program_photos', true, true, true, true, true, now()),
  ('yayasan', 'program_photos', true, true, true, true, true, now()),
  ('admin_yayasan', 'program_photos', true, true, true, true, true, now()),
  ('kepsek', 'program_photos', true, true, true, true, true, now()),
  ('humas', 'program_photos', true, true, true, true, true, now()),
  ('pengurus_konten', 'program_photos', true, true, true, true, true, now())
ON CONFLICT (role, section) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete,
  can_publish = EXCLUDED.can_publish,
  updated_at = now();

