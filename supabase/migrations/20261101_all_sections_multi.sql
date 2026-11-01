-- ==============================================================================
-- ALL SECTIONS MULTI-ITEM MIGRATION
-- PP. Jauharul Maknuun Lasem
-- ==============================================================================

-- 1. Tabel Master Universal Sub Items (Kategori, Level, Album, Pillars, Nav, dll)
CREATE TABLE IF NOT EXISTS public.sub_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_module TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_items_parent_active_order 
ON public.sub_items (parent_module, is_active, order_index);

ALTER TABLE public.sub_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read active sub_items" ON public.sub_items;
    DROP POLICY IF EXISTS "Admin manage sub_items" ON public.sub_items;
END $$;

CREATE POLICY "Public read active sub_items"
ON public.sub_items FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin manage sub_items"
ON public.sub_items FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sub_items;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

-- 2. Pastikan kolom multi-item & order di tabel-tabel utama
-- facilities
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'jm-center'];
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- prestasi
ALTER TABLE public.prestasi ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.prestasi ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.prestasi ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.prestasi ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'prestasi'];
ALTER TABLE public.prestasi ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ekskul
ALTER TABLE public.ekskul ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.ekskul ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.ekskul ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'ekskul'];
ALTER TABLE public.ekskul ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- osis_structure
ALTER TABLE public.osis_structure ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.osis_structure ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.osis_structure ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.osis_structure ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- osis_programs
ALTER TABLE public.osis_programs ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.osis_programs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.osis_programs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.osis_programs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- osis_events
ALTER TABLE public.osis_events ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.osis_events ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.osis_events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.osis_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- berita
ALTER TABLE public.berita ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.berita ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.berita ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.berita ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'berita'];

-- galeri_foto
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS album_id TEXT;
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'galeri'];
ALTER TABLE public.galeri_foto ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- galeri_videos
ALTER TABLE public.galeri_videos ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.galeri_videos ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.galeri_videos ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.galeri_videos ADD COLUMN IF NOT EXISTS album_id TEXT;
ALTER TABLE public.galeri_videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- agendas
ALTER TABLE public.agendas ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.agendas ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.agendas ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.agendas ADD COLUMN IF NOT EXISTS location TEXT[] DEFAULT ARRAY['home', 'agenda'];

-- institutions
ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- kontak_medsos
ALTER TABLE public.kontak_medsos ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.kontak_medsos ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.kontak_medsos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- spmb_info
ALTER TABLE public.spmb_info ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.spmb_info ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.spmb_info ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 3. SEEDING AWAL MASTER SUB_ITEMS UNTUK SEMUA MODULE
INSERT INTO public.sub_items (parent_module, title, description, icon, color, order_index, is_active, data)
VALUES
-- Keunggulan (4 Pilar Utama)
('keunggulan_items', 'Tahfidzul Qur''an Mutqin', 'Program tahfidz terarah dengan sanad dan mutqin hingga 30 juz', 'BookOpen', 'emerald', 1, true, '{"stats": "30 Juz", "badge": "Unggulan"}'::jsonb),
('keunggulan_items', 'Integrasi Sains & STEM', 'Pengembangan nalar ilmiah berbasis teknologi, robotik, dan riset praktis', 'Cpu', 'blue', 2, true, '{"stats": "Modern Lab", "badge": "Inovasi"}'::jsonb),
('keunggulan_items', 'Bilingual & Mandarin', 'Penguasaan bahasa Arab, Inggris, dan Mandarin aktif percakapan & literatur', 'Languages', 'amber', 3, true, '{"stats": "3 Bahasa", "badge": "Internasional"}'::jsonb),
('keunggulan_items', 'Karakter & Akhlak Salaf', 'Pembentukan adab, akhlaqul karimah, dan keteladanan salafus sholih', 'ShieldCheck', 'indigo', 4, true, '{"stats": "24 Jam", "badge": "Karakter"}'::jsonb),

-- Fasilitas Kategori
('facilities_categories', 'Asrama Santri', 'Kamar santri representatif, sejuk dan kondusif', 'Home', 'emerald', 1, true, '{}'::jsonb),
('facilities_categories', 'Ruang Kelas & Belajar', 'Kelas ber-AC dilengkapi proyektor dan fasilitas multimedia', 'LayoutGrid', 'blue', 2, true, '{}'::jsonb),
('facilities_categories', 'Laboratorium & STEM', 'Lab komputer, IPA terpadu, dan lab robotik sains', 'Cpu', 'purple', 3, true, '{}'::jsonb),
('facilities_categories', 'Masjid & Pusat Ibadah', 'Masjid utama luas pusat kegiatan ibadah dan kajian kitab', 'Moon', 'amber', 4, true, '{}'::jsonb),
('facilities_categories', 'Sarana Olahraga', 'Lapangan futsal, voli, bulu tangkis, dan panahan santri', 'Activity', 'rose', 5, true, '{}'::jsonb),

-- Prestasi Kategori & Level
('prestasi_categories', 'Tahfidz & Keagamaan', 'Musabaqah Hifdzil Quran dan kajian kitab kuning', 'Award', 'emerald', 1, true, '{}'::jsonb),
('prestasi_categories', 'Akademik & Sains', 'Olimpiade Sains, Riset, dan Karya Ilmiah Remaja', 'GraduationCap', 'blue', 2, true, '{}'::jsonb),
('prestasi_categories', 'Olahraga & Beladiri', 'Turnamen futsal, silat Pagar Nusa, dan panahan', 'Trophy', 'rose', 3, true, '{}'::jsonb),
('prestasi_categories', 'Seni & Bahasa', 'Pidato 3 Bahasa, Kaligrafi, dan Hadroh', 'Palette', 'amber', 4, true, '{}'::jsonb),

('prestasi_levels', 'Internasional', 'Tingkat kompetisi antar negara / global', 'Globe', 'purple', 1, true, '{}'::jsonb),
('prestasi_levels', 'Nasional', 'Tingkat kompetisi se-Indonesia', 'Flag', 'rose', 2, true, '{}'::jsonb),
('prestasi_levels', 'Provinsi', 'Tingkat kompetisi se-Jawa Tengah / regional', 'MapPin', 'blue', 3, true, '{}'::jsonb),
('prestasi_levels', 'Kabupaten / Karesidenan', 'Tingkat kota, kabupaten, dan karesidenan Pati', 'Compass', 'emerald', 4, true, '{}'::jsonb),

-- Ekskul Kategori
('ekskul_categories', 'Sains & Robotika', 'Klub STEM, Coding, dan Riset', 'Cpu', 'blue', 1, true, '{}'::jsonb),
('ekskul_categories', 'Olahraga & Atletik', 'Futsal, Bulutangkis, Panahan', 'Activity', 'rose', 2, true, '{}'::jsonb),
('ekskul_categories', 'Seni & Budaya Islam', 'Hadroh, Kaligrafi, Qiroah', 'Sparkles', 'amber', 3, true, '{}'::jsonb),
('ekskul_categories', 'Bahasa & Public Speaking', 'Arabic & English Club, Mandarin Club', 'Languages', 'purple', 4, true, '{}'::jsonb),
('ekskul_categories', 'Kepanduan & Bela Negara', 'Pramuka, Paskibra, PMR', 'Shield', 'emerald', 5, true, '{}'::jsonb),

-- OSIS Departments & Levels
('osis_departments', 'Ketaqwaan & Ubudiyah', 'Mengawal ibadah dan kedisiplinan sholat berjamaah', 'HeartHandshake', 'emerald', 1, true, '{}'::jsonb),
('osis_departments', 'Kedisiplinan & Keamanan', 'Menjaga tata tertib dan ketertiban asrama/sekolah', 'ShieldCheck', 'rose', 2, true, '{}'::jsonb),
('osis_departments', 'Kreativitas & Multimedia', 'Dokumentasi, publikasi, dan siaran dakwah visual', 'Camera', 'purple', 3, true, '{}'::jsonb),
('osis_departments', 'Olahraga & Kesehatan', 'Menyelenggarakan kegiatan olahraga dan kebersihan lingkungan', 'Activity', 'blue', 4, true, '{}'::jsonb),
('osis_departments', 'Hubungan Masyarakat & Bahasa', 'Menjalin silaturahmi dan program bahasa harian', 'Users', 'amber', 5, true, '{}'::jsonb),

('osis_levels', 'Majelis Pembina OSIS (MPO)', 'Dewan guru dan asatidz pembina struktur', 'UserCheck', 'indigo', 1, true, '{}'::jsonb),
('osis_levels', 'Pengurus Inti', 'Ketua, Wakil, Sekretaris, dan Bendahara', 'Star', 'amber', 2, true, '{}'::jsonb),
('osis_levels', 'Koordinator Departemen', 'Kepala seksi dan departemen penggerak', 'Layers', 'blue', 3, true, '{}'::jsonb),
('osis_levels', 'Anggota Tim Kerja', 'Santri penggerak divisi', 'User', 'slate', 4, true, '{}'::jsonb),

-- Berita Categories
('berita_categories', 'Kabar Pesantren', 'Kabar terkini seputar kegiatan pondok pesantren', 'Newspaper', 'emerald', 1, true, '{}'::jsonb),
('berita_categories', 'SMP Plus', 'Prestasi dan agenda akademik sekolah formal', 'GraduationCap', 'blue', 2, true, '{}'::jsonb),
('berita_categories', 'Madrasah Diniyah', 'Kajian kitab, imtihan, dan aktivitas madin', 'BookOpen', 'amber', 3, true, '{}'::jsonb),
('berita_categories', 'Opini & Artikel Asatidz', 'Tulisan edukatif dan keislaman para asatidz', 'Feather', 'purple', 4, true, '{}'::jsonb),
('berita_categories', 'Pengumuman Resmi', 'Informasi resmi yayasan dan pondok', 'Megaphone', 'rose', 5, true, '{}'::jsonb),

-- Galeri Albums
('galeri_albums', 'Haflah & Wisuda Santri', 'Dokumentasi momen wisuda dan haflah akhir sanah', 'Camera', 'amber', 1, true, '{}'::jsonb),
('galeri_albums', 'Kegiatan Belajar & Riset STEM', 'Foto aktivitas lab sains dan inovasi santri', 'Cpu', 'blue', 2, true, '{}'::jsonb),
('galeri_albums', 'Rutinitas Ibadah & Halaqah', 'Suasana tahfidz dan sholat berjamaah', 'Moon', 'emerald', 3, true, '{}'::jsonb),
('galeri_albums', 'Kunjungan & Studi Lapangan', 'Study tour dan kunjungan tokoh/ulama', 'Map', 'purple', 4, true, '{}'::jsonb),

-- Agenda Categories & Routine Types
('agenda_categories', 'Akademik Sekolah', 'Ujian semester, asesmen, dan kalender pendidikan', 'Calendar', 'blue', 1, true, '{}'::jsonb),
('agenda_categories', 'Kegiatan Pondok', 'Khataman, pengajian pasaran, dan ziarah', 'Moon', 'emerald', 2, true, '{}'::jsonb),
('agenda_categories', 'Penerimaan Santri (SPMB)', 'Jadwal tes, wawancara, dan orientasi santri baru', 'UserPlus', 'amber', 3, true, '{}'::jsonb),
('agenda_categories', 'Peringatan Hari Besar Islam', 'Maulid Nabi, Isra Miraj, dan Hari Santri', 'Star', 'rose', 4, true, '{}'::jsonb),

('agenda_routine_types', 'Harian', 'Rutinitas sholat tahajud, subuh, dan halaqah', 'Clock', 'blue', 1, true, '{}'::jsonb),
('agenda_routine_types', 'Mingguan', 'Roan santri, khitobah 3 bahasa, dan mujahadah malam jumat', 'Repeat', 'emerald', 2, true, '{}'::jsonb),
('agenda_routine_types', 'Bulanan', 'Kajian walisantri dan evaluasi setoran tahfidz', 'CalendarRange', 'amber', 3, true, '{}'::jsonb),
('agenda_routine_types', 'Tahunan', 'Imtihan akhir, haflah, dan liburan maulid', 'CalendarCheck', 'purple', 4, true, '{}'::jsonb),

-- Kontak Types
('kontak_types', 'WhatsApp Layanan & Informasi', '0812-3456-7890', 'Phone', 'emerald', 1, true, '{"value": "https://wa.me/6281234567890"}'::jsonb),
('kontak_types', 'Instagram Resmi', '@ppjauharulmaknuun', 'Instagram', 'rose', 2, true, '{"value": "https://instagram.com/ppjauharulmaknuun"}'::jsonb),
('kontak_types', 'YouTube Channel', 'PP Jauharul Maknuun Official', 'Youtube', 'red', 3, true, '{"value": "https://youtube.com/@ppjauharulmaknuun"}'::jsonb),
('kontak_types', 'Email Resmi', 'sekretariat@ppjauharulmaknuun.sch.id', 'Mail', 'blue', 4, true, '{"value": "mailto:sekretariat@ppjauharulmaknuun.sch.id"}'::jsonb),
('kontak_types', 'Alamat Lengkap', 'Jl. KH. Jauharul Maknuun, Sidayu, Lasem, Rembang', 'MapPin', 'slate', 5, true, '{"value": "https://maps.google.com"}'::jsonb),

-- Navbar 9 Pilar Utama
('navbar_items', 'Beranda', 'Halaman Utama PPJM', 'Home', 'emerald', 1, true, '{"href": "/"}'::jsonb),
('navbar_items', 'JM Center', 'Profil, Sejarah, Pengasuh & Fasilitas', 'Building2', 'blue', 2, true, '{"href": "/jm-center"}'::jsonb),
('navbar_items', 'Program', 'Pondok, SMP Plus, & Madin', 'GraduationCap', 'indigo', 3, true, '{"href": "/program"}'::jsonb),
('navbar_items', 'Smart JM', 'Tahfidz, STEM & Mandarin', 'Sparkles', 'amber', 4, true, '{"href": "/smart-jm"}'::jsonb),
('navbar_items', 'Prestasi', 'Rekam Jejak Kejuaraan Santri', 'Trophy', 'yellow', 5, true, '{"href": "/prestasi"}'::jsonb),
('navbar_items', 'Ekskul', 'Pengembangan Minat & Bakat', 'Activity', 'rose', 6, true, '{"href": "/ekskul"}'::jsonb),
('navbar_items', 'OSIS', 'Organisasi Santri & Program Kerja', 'Users', 'teal', 7, true, '{"href": "/osis"}'::jsonb),
('navbar_items', 'Berita & Galeri', 'Warta & Dokumentasi Visual', 'Newspaper', 'cyan', 8, true, '{"href": "/berita"}'::jsonb),
('navbar_items', 'SPMB', 'Pendaftaran Santri Baru Online', 'UserPlus', 'emerald', 9, true, '{"href": "/spmb", "highlight": true}'::jsonb),

-- Bottom Navigation 5 Hub Utama
('bottom_nav_items', 'Beranda', 'Kembali ke Home', 'Home', 'emerald', 1, true, '{"href": "/"}'::jsonb),
('bottom_nav_items', 'Program', 'Program Pendidikan', 'GraduationCap', 'blue', 2, true, '{"href": "/program"}'::jsonb),
('bottom_nav_items', 'Smart JM', 'Lab & Tahfidz Smart', 'Sparkles', 'amber', 3, true, '{"href": "/smart-jm"}'::jsonb),
('bottom_nav_items', 'Berita', 'Informasi Terbaru', 'Newspaper', 'rose', 4, true, '{"href": "/berita"}'::jsonb),
('bottom_nav_items', 'SPMB', 'Daftar Sekarang', 'UserPlus', 'emerald', 5, true, '{"href": "/spmb"}'::jsonb)

ON CONFLICT DO NOTHING;

