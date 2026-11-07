-- Migration: 20261108_module_registry_and_overrides.sql
-- Description: Dynamic module registry, user permission overrides, RLS IDOR hardening, and Super Admin protection.

-- 1. Table: public.modules_registry
CREATE TABLE IF NOT EXISTS public.modules_registry (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Portal & Akademik', 'CMS Website', 'Manajemen', 'Pengaturan'
    target_table TEXT,
    route_path TEXT NOT NULL,
    can_guest_view BOOLEAN NOT NULL DEFAULT false,
    supported_actions TEXT[] NOT NULL DEFAULT ARRAY['view', 'create', 'edit', 'delete', 'publish'],
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.modules_registry ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone authenticated or guest can read module registry
CREATE POLICY "Anyone can view modules_registry"
ON public.modules_registry FOR SELECT
USING (true);

-- Manage policy: Super Admin can manage module registry
CREATE POLICY "Super admin can manage modules_registry"
ON public.modules_registry FOR ALL
USING (
  public.is_role('super_admin') OR 
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'))
)
WITH CHECK (
  public.is_role('super_admin') OR 
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'))
);

-- 2. Table: public.user_permission_overrides
CREATE TABLE IF NOT EXISTS public.user_permission_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    can_view BOOLEAN,
    can_create BOOLEAN,
    can_edit BOOLEAN,
    can_delete BOOLEAN,
    can_publish BOOLEAN,
    can_approve BOOLEAN,
    can_export BOOLEAN,
    reason TEXT,
    granted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_section UNIQUE (user_id, section)
);

ALTER TABLE public.user_permission_overrides ENABLE ROW LEVEL SECURITY;

-- Read policy: User can read their own overrides, Super Admin can read all
CREATE POLICY "Users can read own overrides or super_admin all"
ON public.user_permission_overrides FOR SELECT
USING (
  user_id = (SELECT auth.uid()) OR
  public.is_role('super_admin') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'))
);

-- Manage policy: Only Super Admin can insert/update/delete overrides
CREATE POLICY "Super admin can manage user_permission_overrides"
ON public.user_permission_overrides FOR ALL
USING (
  public.is_role('super_admin') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'))
)
WITH CHECK (
  public.is_role('super_admin') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'))
);

-- 3. Trigger for audit logging on user_permission_overrides
CREATE OR REPLACE FUNCTION public.log_permission_override_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        role,
        action,
        module,
        section_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        auth.uid(),
        'super_admin',
        TG_OP,
        'user_permission_overrides',
        COALESCE(NEW.section, OLD.section),
        to_jsonb(OLD),
        to_jsonb(NEW),
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_permission_overrides ON public.user_permission_overrides;
CREATE TRIGGER trg_audit_permission_overrides
AFTER INSERT OR UPDATE OR DELETE ON public.user_permission_overrides
FOR EACH ROW EXECUTE FUNCTION public.log_permission_override_change();

-- 4. Seed initial modules into public.modules_registry
INSERT INTO public.modules_registry (key, label, category, target_table, route_path, can_guest_view, description, order_index)
VALUES
  -- Portal & Akademik
  ('santri_tugas', 'Portal Santri: Tugas & Pengumpulan', 'Portal & Akademik', 'tugas_submission', '/santri/tugas', false, 'Portal pengumpulan dan riwayat tugas santri', 1),
  ('guru_tugas', 'Portal Guru: Tugas & Penilaian', 'Portal & Akademik', 'tugas', '/guru/tugas', false, 'Portal pembuatan bank soal dan penilaian tugas santri', 2),
  ('performance', 'Evaluasi Hasil Belajar & Rapor', 'Portal & Akademik', 'performance', '/performance', false, 'Rekapitulasi nilai dan capaian akademik santri', 3),
  ('hafalan_setoran', 'Halaqah Tahfidz & Setoran Al-Quran', 'Portal & Akademik', 'hafalan_setoran', '/smart-jm/hafidz/read', false, 'Pencatatan setoran hafalan Quran santri', 4),
  ('profile', 'Dynamic User Profile', 'Portal & Akademik', 'profiles', '/profile', false, 'Halaman profil dinamis seluruh role', 5),

  -- Pengaturan & Keamanan
  ('users', 'Manajemen Seluruh Akun Pengguna', 'Pengaturan & Keamanan', 'profiles', '/admin/users', false, 'Kelola akun, generate kredensial, dan status aktif', 6),
  ('roles', 'Matriks Role & Dynamic Permissions', 'Pengaturan & Keamanan', 'role_permissions', '/admin/roles', false, 'Konfigurasi izin akses 10 role dan override user', 7),
  ('user_approvals', 'Persetujuan Registrasi Pengguna', 'Pengaturan & Keamanan', 'user_registrations', '/admin/s/user_approvals', false, 'Approval pendaftaran pengguna baru', 8),

  -- CMS & Informasi Publik
  ('sliders', 'Slider Beranda', 'CMS Website', 'sliders', '/', true, 'Banner gambar bergerak di beranda', 9),
  ('info_terkini', 'Info Terkini / Ticker Warta', 'CMS Website', 'info_terkini', '/', true, 'Baris warta berjalan di atas header', 10),
  ('berita', 'Warta & Berita Pondok', 'CMS Website', 'berita', '/berita', true, 'Portal berita dan publikasi artikel resmi', 11),
  ('agendas', 'Agenda & Kalender Kegiatan', 'CMS Website', 'agendas', '/agenda', true, 'Jadwal agenda kegiatan pesantren dan sekolah', 12),
  ('karya_siswa', 'Karya Santri & Inovasi', 'CMS Website', 'karya_siswa', '/karya-siswa', true, 'Portofolio inovasi, buku, batik, dan karya santri', 13),
  ('galeri_foto', 'Galeri Dokumentasi Foto', 'CMS Website', 'galeri_foto', '/galeri/foto', true, 'Dokumentasi album foto kegiatan pondok', 14),
  ('galeri_videos', 'Galeri Dokumentasi Video', 'CMS Website', 'galeri_videos', '/galeri/video', true, 'Dokumentasi video kegiatan pondok di YouTube', 15),
  ('prestasi', 'Prestasi Santri & Penghargaan', 'CMS Website', 'prestasi', '/prestasi', true, 'Capaian kejuaraan tingkat kabupaten hingga internasional', 16),
  ('spmb_info', 'Informasi SPMB / PPDB', 'CMS Website', 'spmb_info', '/spmb', true, 'Jadwal gelombang, syarat, dan rincian biaya pendaftaran', 17),
  ('programs_pondok', 'Program Kepesantrenan', 'CMS Website', 'programs_pondok', '/program', true, 'Kurikulum diniyah dan amaliyah pondok 24 jam', 18),
  ('programs_sekolah', 'Program Sekolah SMP Plus', 'CMS Website', 'programs_sekolah', '/program', true, 'Kurikulum nasional Merdeka dan sains terapan', 19),
  ('program_photos', 'Foto Dokumentasi Program', 'CMS Website', 'program_activity_photos', '/program', true, 'Foto kegiatan harian santri di pondok & sekolah', 20),
  ('stem_worksheets', 'Lembar Kerja Santri STEM', 'CMS Website', 'stem_worksheets', '/smart-jm/stem/materi', true, 'Modul dan lembar kerja praktikum STEM', 21),
  ('stem_projects', 'Proyek Sains & Robotika Santri', 'CMS Website', 'stem_projects', '/smart-jm/stem/portofolio', true, 'Portofolio proyek riset terapan santri', 22),
  ('mandarin_lessons', 'Materi Bahasa Mandarin', 'CMS Website', 'mandarin_lessons', '/smart-jm/mandarin/materi', true, 'Pelajaran bahasa Mandarin santri', 23),
  ('osis_events', 'Kegiatan & Acara OSIS', 'CMS Website', 'osis_events', '/osis', true, 'Agenda kegiatan organisasi santri intra sekolah', 24),
  ('osis_programs', 'Program Kerja OSIS', 'CMS Website', 'osis_programs', '/osis', true, 'Program kerja departemen pengurus OSIS', 25),
  ('osis_structure', 'Struktur Kabinet OSIS', 'CMS Website', 'osis_structure', '/osis', true, 'Organogram pengurus harian dan departemen OSIS', 26),
  ('visi_misi', 'Visi, Misi & Tujuan Lembaga', 'CMS Website', 'jm_center_pages', '/jm-center/visi-misi', true, 'Visi misi resmi Pesantren & SMP Plus JM', 27),
  ('sejarah', 'Sejarah Berdirinya Pesantren', 'CMS Website', 'jm_center_pages', '/jm-center/sejarah', true, 'Napak tilas dan rekam jejak perjuangan pesantren', 28),
  ('fasilitas', 'Fasilitas Pondok & Gedung', 'CMS Website', 'facilities', '/jm-center/fasilitas', true, 'Sarana prasarana asrama, masjid, dan lab', 29)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  category = EXCLUDED.category,
  target_table = EXCLUDED.target_table,
  route_path = EXCLUDED.route_path,
  can_guest_view = EXCLUDED.can_guest_view,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  updated_at = now();

-- 5. Updated public.has_perm: Level 2 (User Override) > Level 1 (Role Perm) > Level 3 (Guest View)
CREATE OR REPLACE FUNCTION public.has_perm(p_section text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_raw_role text;
  v_canonical_role text;
  v_user_override boolean;
BEGIN
  -- 1. Evaluasi jika pengguna terautentikasi (Sesi Aktif)
  IF v_uid IS NOT NULL THEN
    -- A. Cek User-Level Override (Prioritas Tertinggi)
    SELECT 
      CASE p_action
        WHEN 'view'    THEN can_view
        WHEN 'create'  THEN can_create
        WHEN 'edit'    THEN can_edit
        WHEN 'delete'  THEN can_delete
        WHEN 'publish' THEN can_publish
        WHEN 'approve' THEN can_approve
        WHEN 'export'  THEN can_export
        ELSE false
      END INTO v_user_override
    FROM public.user_permission_overrides
    WHERE user_id = v_uid AND section = p_section;

    IF v_user_override IS NOT NULL THEN
      RETURN v_user_override;
    END IF;

    -- B. Ambil role pengguna
    SELECT COALESCE(
      (SELECT p.role::text FROM public.profiles p WHERE p.id = v_uid AND COALESCE(p.status_aktif, true) = true LIMIT 1),
      (SELECT ap.role::text FROM public.admin_profiles ap WHERE ap.id = v_uid AND ap.is_active IS DISTINCT FROM false LIMIT 1)
    ) INTO v_raw_role;

    IF v_raw_role IS NULL THEN
      RETURN false;
    END IF;

    v_canonical_role := lower(btrim(v_raw_role));
    -- Super Admin bypass penuh
    IF v_canonical_role IN ('super_admin', 'superadmin', 'admin') THEN
      RETURN true;
    ELSIF v_canonical_role IN ('yayasan', 'admin_yayasan') THEN
      v_canonical_role := 'yayasan';
    ELSIF v_canonical_role IN ('kepsek', 'kepala_sekolah') THEN
      v_canonical_role := 'kepsek';
    ELSIF v_canonical_role IN ('humas', 'pengurus_konten', 'media') THEN
      v_canonical_role := 'humas';
    ELSIF v_canonical_role IN ('guru', 'guru_akademik', 'ustadz') THEN
      v_canonical_role := 'guru';
    ELSIF v_canonical_role IN ('musyrif', 'musyrifah') THEN
      v_canonical_role := 'musyrif';
    ELSIF v_canonical_role IN ('ppdb', 'staff_ppdb') THEN
      v_canonical_role := 'ppdb';
    ELSIF v_canonical_role IN ('osis_pengurus', 'pengurus_osis', 'osis', 'ketua_osis') THEN
      v_canonical_role := 'osis_pengurus';
    END IF;

    -- C. Cek Role Permissions (Level 1)
    RETURN EXISTS (
      SELECT 1
      FROM public.role_permissions rp
      WHERE (lower(rp.role) = v_canonical_role OR lower(rp.role) = lower(v_raw_role))
        AND rp.section = p_section
        AND CASE p_action
              WHEN 'view'    THEN rp.can_view
              WHEN 'create'  THEN rp.can_create
              WHEN 'edit'    THEN rp.can_edit
              WHEN 'delete'  THEN rp.can_delete
              WHEN 'publish' THEN rp.can_publish
              ELSE false
            END
    );
  END IF;

  -- 2. Evaluasi Sesi Tamu / Guest (Tanpa Sesi)
  IF p_action = 'view' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.modules_registry mr
      WHERE mr.key = p_section AND mr.can_guest_view = true
    );
  END IF;

  RETURN false;
END;
$$;

-- 6. IDOR Hardening on public.tugas
-- Guru hanya boleh mengubah atau menghapus tugas yang dibuat sendiri (guru_id = auth.uid())
-- Super Admin dan Kepsek tetap memiliki wewenang supervisi
DROP POLICY IF EXISTS "guru_update_own_tugas" ON public.tugas;
CREATE POLICY "guru_update_own_tugas"
ON public.tugas FOR UPDATE
USING (
  guru_id = (SELECT auth.uid()) OR
  public.is_role('super_admin') OR
  public.is_role('kepsek') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'kepsek')))
)
WITH CHECK (
  guru_id = (SELECT auth.uid()) OR
  public.is_role('super_admin') OR
  public.is_role('kepsek') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'kepsek')))
);

DROP POLICY IF EXISTS "guru_delete_own_tugas" ON public.tugas;
CREATE POLICY "guru_delete_own_tugas"
ON public.tugas FOR DELETE
USING (
  guru_id = (SELECT auth.uid()) OR
  public.is_role('super_admin') OR
  public.is_role('kepsek') OR
  (SELECT auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'kepsek')))
);

-- 7. Hardening: Anti-Tampering on public.tugas_submission
-- Mencegah santri mengubah kolom 'nilai', 'predikat', atau 'feedback'
CREATE OR REPLACE FUNCTION public.protect_submission_grading()
RETURNS TRIGGER AS $$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_is_staff boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN NEW;
  END IF;

  -- Cek apakah pemanggil adalah staf penguji / guru / super_admin
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = v_uid AND role IN ('guru', 'super_admin', 'kepsek', 'musyrif')
  ) INTO v_is_staff;

  -- Jika bukan staf, kembalikan nilai, predikat, dan feedback ke data lama (OLD)
  IF NOT v_is_staff THEN
    NEW.nilai := OLD.nilai;
    NEW.predikat := OLD.predikat;
    NEW.feedback := OLD.feedback;
    NEW.santri_id := OLD.santri_id; -- Cegah santri mengganti santri_id
    NEW.tugas_id := OLD.tugas_id;   -- Cegah pemindahan tugas_id
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_submission_grading ON public.tugas_submission;
CREATE TRIGGER trg_protect_submission_grading
BEFORE UPDATE ON public.tugas_submission
FOR EACH ROW EXECUTE FUNCTION public.protect_submission_grading();

-- 8. Hardening: Proteksi Super Admin Terakhir
CREATE OR REPLACE FUNCTION public.prevent_last_super_admin_removal()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_count INT;
BEGIN
  -- Cek jika aksi berupa DELETE pada super_admin
  IF (TG_OP = 'DELETE') THEN
    IF (OLD.role = 'super_admin') THEN
      SELECT count(*) INTO v_admin_count FROM public.profiles WHERE role = 'super_admin';
      IF v_admin_count <= 1 THEN
        RAISE EXCEPTION 'Aksi ditolak: Sistem harus mempertahankan minimal 1 akun Super Admin aktif!';
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  -- Cek jika aksi berupa UPDATE pada super_admin (demosi role atau penonaktifan)
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.role = 'super_admin' AND (NEW.role != 'super_admin' OR NEW.status_aktif = false)) THEN
      SELECT count(*) INTO v_admin_count FROM public.profiles WHERE role = 'super_admin' AND status_aktif IS DISTINCT FROM false;
      IF v_admin_count <= 1 THEN
        RAISE EXCEPTION 'Aksi ditolak: Tidak dapat menonaktifkan atau mendemosi Super Admin terakhir!';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_last_super_admin_removal ON public.profiles;
CREATE TRIGGER trg_prevent_last_super_admin_removal
BEFORE DELETE OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_last_super_admin_removal();
