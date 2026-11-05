-- Migration: 20261106_master_data_tables.sql
-- Master data tables for SuperAdmin (kelas, jabatan, mapel, kategori, sasaran, lokasi)
-- Plus user approvals, password requests, and Guru schedule tables
-- ============================================================================

-- Master Kelas
CREATE TABLE IF NOT EXISTS public.master_kelas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kelas text NOT NULL UNIQUE,
  tingkat text NOT NULL CHECK (tingkat IN ('7','8','9')),
  keterangan text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Master Jabatan
CREATE TABLE IF NOT EXISTS public.master_jabatan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_jabatan text NOT NULL UNIQUE,
  singkatan text,
  tingkat_kewenangan text NOT NULL CHECK (tingkat_kewenangan IN ('Tinggi','Sedang','Rendah')) DEFAULT 'Sedang',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Master Mata Pelajaran
CREATE TABLE IF NOT EXISTS public.master_mapel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_mapel text NOT NULL UNIQUE,
  kode_mapel text,
  jenjang text NOT NULL CHECK (jenjang IN ('SMP','SMA','Diniyah')) DEFAULT 'SMP',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Master Kategori
CREATE TABLE IF NOT EXISTS public.master_kategori (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kategori text NOT NULL UNIQUE,
  deskripsi text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Master Sasaran
CREATE TABLE IF NOT EXISTS public.master_sasaran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_sasaran text NOT NULL UNIQUE,
  deskripsi text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Master Lokasi
CREATE TABLE IF NOT EXISTS public.master_lokasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lokasi text NOT NULL UNIQUE,
  gedung text,
  kapasitas text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User Registrations (Approval New User) - already exists from earlier migration, ensure it exists
CREATE TABLE IF NOT EXISTS public.user_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  requested_role text NOT NULL DEFAULT 'santri',
  alamat text,
  alasan text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Password Reset Requests (Approval Ganti Password)
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  alasan text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Guru Schedule (jadwal mata pelajaran dan kegiatan)
CREATE TABLE IF NOT EXISTS public.guru_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mapel text NOT NULL,
  kelas text NOT NULL,
  hari text NOT NULL CHECK (hari IN ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu')),
  jam_mulai time NOT NULL,
  jam_selesai time NOT NULL,
  lokasi text,
  kegiatan text,
  keterangan text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for master data tables
ALTER TABLE public.master_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_jabatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_mapel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_sasaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_lokasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru_schedule ENABLE ROW LEVEL SECURITY;

-- Public read for all master data
DO $$
BEGIN
  FOR t IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN (
      'master_kelas','master_jabatan','master_mapel','master_kategori',
      'master_sasaran','master_lokasi','guru_schedule'
    )
  ) LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS rls_%s_public_read ON public.%s; ' ||
      'CREATE POLICY rls_%s_public_read ON public.%s ' ||
      'FOR SELECT TO anon, authenticated USING (is_active = true OR is_active IS NULL);',
      t.tablename, t.tablename, t.tablename, t.tablename
    );
  END LOOP;
END $$;

-- Admin write for master data tables
DO $$
BEGIN
  FOR t IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN (
      'master_kelas','master_jabatan','master_mapel','master_kategori',
      'master_sasaran','master_lokasi','guru_schedule'
    )
  ) LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS rls_%s_admin_write ON public.%s; ' ||
      'CREATE POLICY rls_%s_admin_write ON public.%s ' ||
      'FOR ALL TO authenticated ' ||
      'USING (public.is_staff_or_guru() OR public.is_role(''super_admin'') OR public.is_role(''kepsek'') OR public.is_role(''yayasan'')) ' ||
      'WITH CHECK (public.is_staff_or_guru() OR public.is_role(''super_admin'') OR public.is_role(''kepsek'') OR public.is_role(''yayasan''));',
      t.tablename, t.tablename, t.tablename, t.tablename
    );
  END LOOP;
END $$;

-- Guru can write their own schedule
DROP POLICY IF EXISTS rls_guru_schedule_own_write ON public.guru_schedule;
CREATE POLICY rls_guru_schedule_own_write ON public.guru_schedule
  FOR ALL TO authenticated
  USING (guru_id = auth.uid())
  WITH CHECK (guru_id = auth.uid());

-- Indexes for master data
CREATE INDEX IF NOT EXISTS idx_master_kelas_tingkat ON public.master_kelas(tingkat);
CREATE INDEX IF NOT EXISTS idx_master_kelas_active ON public.master_kelas(is_active);
CREATE INDEX IF NOT EXISTS idx_master_jabatan_active ON public.master_jabatan(is_active);
CREATE INDEX IF NOT EXISTS idx_master_mapel_jenjang ON public.master_mapel(jenjang);
CREATE INDEX IF NOT EXISTS idx_master_mapel_active ON public.master_mapel(is_active);
CREATE INDEX IF NOT EXISTS idx_master_kategori_active ON public.master_kategori(is_active);
CREATE INDEX IF NOT EXISTS idx_master_sasaran_active ON public.master_sasaran(is_active);
CREATE INDEX IF NOT EXISTS idx_master_lokasi_active ON public.master_lokasi(is_active);
CREATE INDEX IF NOT EXISTS idx_guru_schedule_guru_id ON public.guru_schedule(guru_id);
CREATE INDEX IF NOT EXISTS idx_guru_schedule_kelas ON public.guru_schedule(kelas);
CREATE INDEX IF NOT EXISTS idx_guru_schedule_hari ON public.guru_schedule(hari);
CREATE INDEX IF NOT EXISTS idx_guru_schedule_active ON public.guru_schedule(is_active);
