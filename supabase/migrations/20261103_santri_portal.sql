-- =============================================================================
-- MIGRASI PORTAL SANTRI SMP PLUS JAUHARUL MAKNUUN (/santri)
-- Mencakup: profiles, tugas, tugas_submission, performance, hafalan_setoran + RLS
-- =============================================================================

-- 1. Fungsi helper pengecekan Guru / Musyrif / Staff Admin
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
  );
$$;

-- 2. Tabel profiles (Data Profil Santri)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Santri SMP Plus Jauharul Maknuun',
  email text,
  nis text,
  kelas text DEFAULT 'VIII-A Tahfidz',
  angkatan text DEFAULT '2025',
  kamar_asrama text DEFAULT 'Al-Ghazali 03',
  wali_santri text DEFAULT '',
  no_wa_wali text DEFAULT '',
  hafalan_juz integer NOT NULL DEFAULT 3,
  foto_url text,
  bio jsonb DEFAULT '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Santri SMP Plus Jauharul Maknuun Islamic Boarding School. Sholeh, Cerdas, Terampil, Unggul."}]}]}'::jsonb,
  role text NOT NULL DEFAULT 'santri',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabel tugas (Daftar Tugas Harian, Pekanan, Project, Tahfidz)
CREATE TABLE IF NOT EXISTS public.tugas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi jsonb NOT NULL DEFAULT '{}'::jsonb,
  mapel text NOT NULL,
  guru_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  guru_nama text DEFAULT 'Dewan Asatidz SMP Plus JM',
  kelas_target text NOT NULL DEFAULT 'Semua Kelas',
  deadline timestamptz NOT NULL,
  attachment_url text[] NOT NULL DEFAULT '{}',
  tipe text NOT NULL DEFAULT 'harian' CHECK (tipe IN ('harian', 'pekanan', 'project', 'tahfidz')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Tabel tugas_submission (Pengumpulan Jawaban & Nilai Tugas Santri)
CREATE TABLE IF NOT EXISTS public.tugas_submission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tugas_id uuid NOT NULL REFERENCES public.tugas(id) ON DELETE CASCADE,
  santri_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jawaban_text jsonb NOT NULL DEFAULT '{}'::jsonb,
  file_url text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'dikumpulkan', 'dinilai', 'revisi')),
  nilai integer CHECK (nilai IS NULL OR (nilai >= 0 AND nilai <= 100)),
  feedback text,
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tugas_id, santri_id)
);

-- 5. Tabel performance (Rekam Jejak Nilai Akademik, Tahfidz & Adab)
CREATE TABLE IF NOT EXISTS public.performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mapel text NOT NULL,
  jenis text NOT NULL CHECK (jenis IN ('harian', 'uts', 'uas', 'tahfidz', 'adab')),
  nilai integer NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
  predikat text NOT NULL DEFAULT 'A',
  semester text NOT NULL DEFAULT 'Ganjil 2026/2027',
  catatan_musyrif text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Tabel hafalan_setoran (Riwayat Setoran Tahfidz & Murojaah)
CREATE TABLE IF NOT EXISTS public.hafalan_setoran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  santri_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah text NOT NULL,
  ayat_dari integer NOT NULL DEFAULT 1,
  ayat_sampai integer NOT NULL DEFAULT 10,
  juz integer NOT NULL DEFAULT 30 CHECK (juz >= 1 AND juz <= 30),
  status text NOT NULL DEFAULT 'lancar' CHECK (status IN ('lancar', 'kurang', 'ulang')),
  penyimak uuid,
  penyimak_nama text DEFAULT 'Ustadz Fadly, S.Pd.',
  catatan text,
  tanggal timestamptz NOT NULL DEFAULT now()
);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_tugas_kelas_deadline ON public.tugas(kelas_target, deadline DESC);
CREATE INDEX IF NOT EXISTS idx_tugas_submission_santri ON public.tugas_submission(santri_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tugas_submission_tugas ON public.tugas_submission(tugas_id);
CREATE INDEX IF NOT EXISTS idx_performance_santri ON public.performance(santri_id, semester);
CREATE INDEX IF NOT EXISTS idx_hafalan_setoran_santri ON public.hafalan_setoran(santri_id, tanggal DESC);

-- 8. Row Level Security (WAJIB: auth.uid() = santri_id / id)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tugas_submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hafalan_setoran ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- profiles: santri hanya bisa lihat & edit profil miliknya sendiri
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='santri_select_own_profile') THEN
    CREATE POLICY santri_select_own_profile ON public.profiles
      FOR SELECT USING (auth.uid() = id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='santri_insert_own_profile') THEN
    CREATE POLICY santri_insert_own_profile ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='santri_update_own_profile') THEN
    CREATE POLICY santri_update_own_profile ON public.profiles
      FOR UPDATE USING (auth.uid() = id OR public.is_staff_or_guru())
      WITH CHECK (auth.uid() = id OR public.is_staff_or_guru());
  END IF;

  -- tugas: semua santri bisa membaca daftar tugas; guru/staff bisa mengelola
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas' AND policyname='santri_select_tugas') THEN
    CREATE POLICY santri_select_tugas ON public.tugas
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas' AND policyname='staff_manage_tugas') THEN
    CREATE POLICY staff_manage_tugas ON public.tugas
      FOR ALL USING (public.is_staff_or_guru())
      WITH CHECK (public.is_staff_or_guru());
  END IF;

  -- tugas_submission: santri hanya bisa lihat/tambah/update miliknya sendiri (selama belum dinilai)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas_submission' AND policyname='santri_select_own_submission') THEN
    CREATE POLICY santri_select_own_submission ON public.tugas_submission
      FOR SELECT USING (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas_submission' AND policyname='santri_insert_own_submission') THEN
    CREATE POLICY santri_insert_own_submission ON public.tugas_submission
      FOR INSERT WITH CHECK (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tugas_submission' AND policyname='santri_update_own_submission') THEN
    CREATE POLICY santri_update_own_submission ON public.tugas_submission
      FOR UPDATE USING (
        (auth.uid() = santri_id AND status IN ('draft', 'revisi', 'dikumpulkan'))
        OR public.is_staff_or_guru()
      )
      WITH CHECK (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  -- performance: santri hanya bisa melihat hasil belajar miliknya sendiri
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance' AND policyname='santri_select_own_performance') THEN
    CREATE POLICY santri_select_own_performance ON public.performance
      FOR SELECT USING (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='performance' AND policyname='staff_manage_performance') THEN
    CREATE POLICY staff_manage_performance ON public.performance
      FOR ALL USING (public.is_staff_or_guru())
      WITH CHECK (public.is_staff_or_guru());
  END IF;

  -- hafalan_setoran: santri hanya bisa melihat & menambah setoran miliknya sendiri
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hafalan_setoran' AND policyname='santri_select_own_hafalan') THEN
    CREATE POLICY santri_select_own_hafalan ON public.hafalan_setoran
      FOR SELECT USING (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hafalan_setoran' AND policyname='santri_insert_own_hafalan') THEN
    CREATE POLICY santri_insert_own_hafalan ON public.hafalan_setoran
      FOR INSERT WITH CHECK (auth.uid() = santri_id OR public.is_staff_or_guru());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hafalan_setoran' AND policyname='staff_manage_hafalan') THEN
    CREATE POLICY staff_manage_hafalan ON public.hafalan_setoran
      FOR ALL USING (public.is_staff_or_guru())
      WITH CHECK (public.is_staff_or_guru());
  END IF;
END $$;

-- 9. Storage Bucket untuk Upload Tugas & Foto Profil Santri
INSERT INTO storage.buckets (id, name, public)
VALUES ('santri-uploads', 'santri-uploads', true)
ON CONFLICT (id) DO NOTHING;

