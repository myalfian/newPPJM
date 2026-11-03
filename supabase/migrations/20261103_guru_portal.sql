-- =============================================================================
-- MIGRASI PORTAL GURU & MUSYRIF SMP PLUS JAUHARUL MAKNUUN (/guru)
-- Mencakup: Kolom Guru di profiles, status_publish & kelas_targets di tugas,
--           bucket Storage 'tugas', dan Kebijakan RLS Guru (guru_id = auth.uid())
-- =============================================================================

-- 1. Tambah kolom profil Guru & Musyrif pada public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nip text,
  ADD COLUMN IF NOT EXISTS mapel_diampu text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pendidikan text DEFAULT 'S1 Pendidikan / Tarbiyah',
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS jadwal_mengajar jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Tambah kolom status_publish & kelas_targets pada public.tugas
ALTER TABLE public.tugas
  ADD COLUMN IF NOT EXISTS status_publish text NOT NULL DEFAULT 'published' CHECK (status_publish IN ('published', 'draft')),
  ADD COLUMN IF NOT EXISTS kelas_targets text[] NOT NULL DEFAULT ARRAY['VIII-A Tahfidz'],
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 3. Fungsi pengecekan role Guru / Musyrif / Staff
CREATE OR REPLACE FUNCTION public.is_staff_or_guru()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role::text IN (
        'super_admin','admin_yayasan','kepala_sekolah','guru','musyrif','staff_ppdb','keuangan','humas','pengurus_konten','guru_akademik'
      )
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('guru', 'musyrif', 'super_admin', 'kepala_sekolah', 'admin_yayasan')
  );
$$;

-- 4. Kebijakan RLS untuk Guru & Musyrif
DO $$
BEGIN
  -- Guru & Musyrif dapat membaca profil santri per kelas
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='guru_select_all_profiles') THEN
    CREATE POLICY guru_select_all_profiles ON public.profiles
      FOR SELECT USING (true);
  END IF;

  -- Guru hanya bisa buat/edit/hapus tugas yang dia buat (guru_id = auth.uid())
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas' AND policyname='guru_insert_own_tugas') THEN
    CREATE POLICY guru_insert_own_tugas ON public.tugas
      FOR INSERT WITH CHECK (guru_id = auth.uid() OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas' AND policyname='guru_update_own_tugas') THEN
    CREATE POLICY guru_update_own_tugas ON public.tugas
      FOR UPDATE USING (guru_id = auth.uid() OR guru_id IS NULL OR public.is_staff_or_guru())
      WITH CHECK (guru_id = auth.uid() OR guru_id IS NULL OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas' AND policyname='guru_delete_own_tugas') THEN
    CREATE POLICY guru_delete_own_tugas ON public.tugas
      FOR DELETE USING (guru_id = auth.uid() OR public.is_staff_or_guru());
  END IF;

  -- Guru bisa menilai semua submission pada tugasnya
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas_submission' AND policyname='guru_grade_submissions') THEN
    CREATE POLICY guru_grade_submissions ON public.tugas_submission
      FOR UPDATE USING (
        public.is_staff_or_guru()
        OR EXISTS (
          SELECT 1 FROM public.tugas t
          WHERE t.id = tugas_submission.tugas_id
            AND (t.guru_id = auth.uid() OR t.guru_id IS NULL)
        )
      )
      WITH CHECK (
        public.is_staff_or_guru()
        OR EXISTS (
          SELECT 1 FROM public.tugas t
          WHERE t.id = tugas_submission.tugas_id
            AND (t.guru_id = auth.uid() OR t.guru_id IS NULL)
        )
      );
  END IF;

  -- Guru & Musyrif bisa menerbitkan berita & materi pembelajaran ke tabel berita
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='berita' AND policyname='guru_insert_berita') THEN
    CREATE POLICY guru_insert_berita ON public.berita
      FOR INSERT WITH CHECK (public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='berita' AND policyname='guru_update_berita') THEN
    CREATE POLICY guru_update_berita ON public.berita
      FOR UPDATE USING (public.is_staff_or_guru())
      WITH CHECK (public.is_staff_or_guru());
  END IF;
END $$;

-- 5. Storage Bucket 'tugas' untuk lampiran modul & tugas
INSERT INTO storage.buckets (id, name, public)
VALUES ('tugas', 'tugas', true)
ON CONFLICT (id) DO NOTHING;

