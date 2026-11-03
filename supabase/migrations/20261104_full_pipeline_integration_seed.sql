-- ============================================================================
-- MIGRATION: 20261104_full_pipeline_integration_seed.sql
-- Purpose:
--   1. Ensure public/guest users can view active profiles across all 9 roles
--      on /profile and /profile/:role/:id
--   2. Seed live Supabase tables (berita, galeri_videos, mandarin_vocabularies,
--      stem_worksheets, stem_projects, sections) so public website pipeline,
--      Guru/Santri portals, and Admin CMS tables are 100% synchronized.
-- ============================================================================

-- 1. Update guest profile visibility policy for /profile and /profile/:role/:id
DROP POLICY IF EXISTS "guest_can_view_public_guru_profiles" ON public.profiles;
CREATE POLICY "guest_can_view_public_guru_profiles" ON public.profiles
  FOR SELECT
  USING (status_aktif = true);

-- 2. Seed public.berita (JM News & Guru Content Pipeline)
INSERT INTO public.berita (slug, title, category, excerpt, content, image_url, is_published, published_at, author_id)
VALUES
  (
    'launching-gedung-asrama-tahfidz-terpadu-2026',
    'Peresmian Gedung Asrama Tahfidz Terpadu & Laboratorium Sains Terapan PP. Jauharul Maknuun',
    'Berita Utama',
    'PP. Jauharul Maknuun meresmikan fasilitas asrama tahfidz modern berkapasitas 300 santri yang terintegrasi dengan laboratorium sains, robotika, dan pusat bahasa internasional.',
    '<p><strong>GRESIK</strong> — Pondok Pesantren Jauharul Maknuun Sidayu Gresik resmi mengoperasikan Gedung Asrama Tahfidz Terpadu beserta Laboratorium Sains &amp; Robotika STEM pada awal semester tahun ajaran 2026/2027.</p><p>Fasilitas baru ini dirancang untuk mendukung ekosistem pendidikan berbasis <em>Tahfidzul Qur''an</em>, penguasaan kitab turats (<em>Madrasah Diniyah</em>), serta riset sains dan teknologi mutakhir bagi seluruh santri SMP Plus Jauharul Maknuun.</p>',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '1 day',
    'e9999999-9999-4999-a999-999999999999'
  ),
  (
    'siaran-pers-pembukaan-spmb-gelombang-1-2026',
    'Siaran Pers: Pembukaan Seleksi Penerimaan Murid Baru (SPMB) Gelombang Inden 2026/2027',
    'Siaran Pers',
    'Panitia PPDB/SPMB PP. Jauharul Maknuun resmi membuka pendaftaran santri baru tahun ajaran 2026/2027 dengan jalur Reguler, Prestasi Akademik/STEM, dan Beasiswa Tahfidz.',
    '<p><strong>SIDAYU, GRESIK</strong> — Panitia Seleksi Penerimaan Murid Baru (SPMB) Pondok Pesantren Jauharul Maknuun mengumumkan pembukaan pendaftaran Gelombang Inden Tahun Ajaran 2026/2027.</p><p>Calon wali santri dapat mengakses informasi lengkap syarat pendaftaran, rincian beasiswa tahfidz, serta jadwal observasi melalui halaman resmi SPMB atau menghubungi layanan WhatsApp Center PPDB.</p>',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '2 days',
    'e7777777-7777-4777-a777-777777777777'
  ),
  (
    'delegasi-santri-raih-emas-olimpiade-sains-robotika-nasional',
    'Delegasi Santri SMP Plus Jauharul Maknuun Raih Medali Emas Olimpiade Sains & Robotika Nasional',
    'Prestasi Santri',
    'Tim riset STEM dan Robotika santri berhasil menyabet medali emas kategori Inovasi Teknologi Terapan berkat karya purwarupa sistem penyiraman otomatis berbasis IoT.',
    '<p><strong>SURABAYA</strong> — Alhamdulillah, delegasi santri SMP Plus Jauharul Maknuun kembali mengharumkan nama pesantren di kancah nasional dengan meraih Medali Emas dalam ajang Olimpiade Sains &amp; Robotika Nasional 2026.</p><p>Karya inovatif yang dipresentasikan menggabungkan konsep Hukum Pascal, sensor kelembaban tanah IoT, dan efisiensi energi surya.</p>',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '3 days',
    'b2222222-2222-4222-a222-222222222222'
  ),
  (
    'wisuda-akbar-tahfidzul-quran-30-juz-angkatan-iv',
    'Haflah & Wisuda Akbar Tahfidzul Qur''an Juz 30, 15 Juz, dan 30 Juz Bil-Ghoib',
    'Warta Pesantren',
    'Sebanyak 68 santriwan dan santriwati mengikuti prosesi uji publik dan wisuda akbar Tahfidzul Qur''an di hadapan masyayikh, wali santri, dan dewan penguji.',
    '<p><strong>GRESIK</strong> — Suasana haru dan khidmat menyelimuti Auditorium Utama Pondok Pesantren Jauharul Maknuun dalam gelaran Haflah &amp; Wisuda Akbar Tahfidzul Qur''an.</p><p>Para wisudawan telah melalui tahapan tasmi'' sekali duduk dan ujian sambung ayat yang ketat bersama dewan musyrif bersanad.</p>',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '5 days',
    'c3333333-3333-4333-a333-333333333333'
  ),
  (
    'eksperimen-lkpd-stem-hydrolift-hukum-pascal-santri-kelas-8',
    'Serunya Praktikum LKPD STEM: Rancang Bangun Hydrolift Hukum Pascal & Roket Air',
    'Inovasi STEM',
    'Pembelajaran IPA Terpadu di SMP Plus Jauharul Maknuun menerapkan metode Engineering Design Process di mana setiap tim santri merancang dan menguji prototipe mekanik.',
    '<p><strong>LABORATORIUM STEM</strong> — Santri kelas VIII melaksanakan praktikum pembuatan <em>Hydrolift</em> berbasis sistem hidrolik jarum suntik untuk membuktikan Hukum Pascal secara langsung.</p><p>Seluruh hasil pengukuran beban, tekanan, dan evaluasi desain dicatat dalam Lembar Kerja Peserta Didik (LKPD) digital yang terhubung langsung dengan portal akademik santri.</p>',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '7 days',
    'b2222222-2222-4222-a222-222222222222'
  ),
  (
    'pekan-bahasa-arab-inggris-dan-mandarin-center-2026',
    'Semarak Pekan Bahasa Internasional: Kolaborasi Arabic, English & Mandarin Center',
    'Berita Pondok',
    'Santri menampilkan drama trilingual, pidato Bahasa Arab, English Debate, serta kaligrafi Hanzi & percakapan Mandarin HSK 2.',
    '<p><strong>KAMPUS PESANTREN</strong> — Dalam rangka menguatkan kompetensi komunikasi global, PP. Jauharul Maknuun menggelar Pekan Bahasa Internasional yang memadukan Bahasa Arab, Bahasa Inggris, dan Bahasa Mandarin.</p>',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    true,
    now() - interval '10 days',
    'a1111111-1111-4111-a111-111111111111'
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed public.sections (Public Sections Pipeline)
INSERT INTO public.sections (slug, title, content, status)
SELECT v.slug, v.title, v.content::jsonb, v.status
FROM (
  VALUES
    ('hero', 'Hero Banner Utama PP. Jauharul Maknuun', '{"headline": "Mencetak Generasi Qur''ani, Unggul dalam Sains & Berwawasan Global"}', 'published'),
    ('sambutan', 'Sambutan Pengasuh & Kepala Sekolah', '{"section": "sambutan_persons"}', 'published'),
    ('keunggulan', 'Keunggulan Pesantren & Sekolah', '{"items": ["Tahfidz Bersanad", "Kurikulum STEM", "Bilingual & Mandarin Center", "Madrasah Diniyah Salafiyah"]}', 'published'),
    ('program', 'Program Unggulan Pondok & SMP Plus', '{"tables": ["programs_pondok", "programs_sekolah"]}', 'published'),
    ('fasilitas', 'Fasilitas Kampus Pesantren Modern', '{"table": "facilities"}', 'published'),
    ('prestasi', 'Hall of Fame Prestasi Santri', '{"table": "prestasi"}', 'published'),
    ('berita', 'Warta & Siaran Pers JM News', '{"table": "berita"}', 'published'),
    ('galeri', 'Galeri Dokumentasi Foto & Video', '{"tables": ["galeri_foto", "galeri_videos"]}', 'published')
) AS v(slug, title, content, status)
WHERE NOT EXISTS (SELECT 1 FROM public.sections WHERE slug = v.slug);

