-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM) LASEM SIDAYU GRESIK
-- SEED INITIAL DATA (AUTHENTIC DEMO & PRODUCTION DATASET)
-- ==============================================================================

-- 1. JM CENTER PAGES
INSERT INTO public.jm_center_pages (slug, title, subtitle, quotes, content, banner_image, extra_data) VALUES
(
    'sambutan',
    'Sambutan Pengasuh Pondok Pesantren',
    'Mudir / Pengasuh Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik',
    'Pesantren bukan hanya tempat menuntut ilmu fiqih dan nahwu, melainkan kawah candradimuka pembentukan akhlaqul karimah, ketajaman spiritual, serta ketangguhan menjawab kemajuan zaman.',
    'Bismillahirrohmanirrohim. Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSegala puji bagi Allah Subhanahu wa Ta’ala, yang telah melimpahkan rahmat, taufiq, serta inayah-Nya kepada kita sekalian. Shalawat beriring salam senantiasa tercurahkan ke haribaan junjungan kita, Baginda Nabi Agung Muhammad SAW, keluarga, serta para sahabat beliau.\n\nSelamat datang di portal resmi Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Kabupaten Gresik. Didirikan di atas landasan salafus sholih yang kokoh, pesantren kami berikhtiar menyatukan kemurnian turats (kitab kuning) dengan penguasaan sains modern (STEM) dan bahasa internasional, termasuk Bahasa Mandarin dan Bahasa Arab.\n\nKami berharap kehadiran media digital ini dapat menjadi jembatan silaturahim bagi para wali santri, alumni, muhibbin, serta masyarakat luas untuk mengenal lebih dekat dinamika pendidikan dan tarbiyah di Pondok Pesantren Jauharul Maknuun Lasem.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    '{"penceramah": "KH. M. Jauharul Maknuun", "jabatan": "Pengasuh Pondok Pesantren"}'::jsonb
),
(
    'sejarah',
    'Sejarah Berdirinya Pesantren',
    'Napak Tilas Perjuangan Dakwah di Bumi Lasem Sidayu',
    'Dari langgar sederhana hingga menjadi sentra kaderisasi ulama saintis masa depan.',
    'Pondok Pesantren Jauharul Maknuun bermula dari majelis pengajian al-Qur''an dan kitab kuning yang dirintis di Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik. Sidayu dikenal sebagai salah satu kawasan bersejarah di pesisir utara Jawa Timur dengan tradisi keilmuan Islam yang mengakar sejak era para waliyullah.\n\nNama "Jauharul Maknuun" (Permata yang Tersimpan Indah) terinspirasi dari kitab masyhur ilmu Balaghah karangan Syaikh Abdurrahman al-Akhdhari. Nama ini membawa doa dan cita-cita luhur agar santri yang dididik kelak menjadi pribadi unggul yang memancarkan cahaya ilmu, adab, dan manfaat di manapun berada.\n\nSeiring berjalannya waktu dan tingginya animo masyarakat, pesantren memperluas cakupan pendidikannya dengan mengintegrasikan sistem Madrasah Diniyah Salafiyah, Tahfidzul Qur''an 30 Juz, pendidikan formal sekolah, hingga terobosan modern laboratorium STEM (Science, Technology, Engineering, & Math) dan kelas Bahasa Mandarin.',
    'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80',
    '{"tahun_berdiri": "1998", "lokasi": "Desa Lasem, Kec. Sidayu, Kab. Gresik, Jawa Timur"}'::jsonb
),
(
    'visi-misi',
    'Visi, Misi & Falsafah Pesantren',
    'Arah Langkah Strategis Menuju Generasi Mutafaqqih Fiddin Berwawasan Global',
    'Mencetak generasi berakhlak mulia, hafidz al-Qur''an, mendalami kitab salaf, dan piawai dalam teknologi.',
    'VISI PESANTREN:\n"Menjadi pusat keunggulan pendidikan Islam salaf-modern yang melahirkan ulama amilin, cendekiawan berakhlak mulia, dan pelopor inovasi teknologi yang berdaya saing global."\n\nMISI PESANTREN:\n1. Menanamkan aqidah Ahlussunnah wal Jama''ah an-Nahdliyyah dan keluhuran akhlak karimah dalam setiap sendi kehidupan santri.\n2. Menyelenggarakan kajian kitab kuning (turats) secara komprehensif, bersanad, dan berjenjang.\n3. Membimbing santri menghafal Al-Qur''an 30 Juz dengan tajwid yang fasih dan pemahaman makna.\n4. Mengembangkan literasi sains dan teknologi (STEM) aplikatif yang solutif bagi kemaslahatan umat.\n5. Membekali santri kecakapan bahasa internasional (Arab, Inggris, dan Mandarin) untuk dakwah global.',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    '{}'::jsonb
),
(
    'lembaga',
    'Badan Otonom & Struktur Lembaga',
    'Unit Pendidikan dan Layanan Dakwah di Bawah Naungan PPJM',
    'Sinergi seluruh unit demi pelayanan pendidikan santri yang menyeluruh.',
    'Pondok Pesantren Jauharul Maknuun mengelola sejumlah badan otonom dan lembaga pelaksana pendidikan, antara lain:\n\n1. Madrasah Diniyah Salafiyah Jauharul Maknuun: Pusat kajian kitab kuning terstruktur dari tingkat Ula, Wustho, hingga Ulya.\n2. Markaz Tahfidz Al-Qur''an: Unit intensif tahfidz 30 juz ber sanad muttashil dengan metode ziyadah dan murojaah ketat.\n3. Laboratorium Inovasi STEM Santri: Wadah riset santri dalam bidang robotika, Internet of Things (IoT), dan kecerdasan buatan.\n4. Pusat Bahasa & Budaya Asing (Arab & Mandarin): Lembaga kursus dan sertifikasi bahasa penutur asli bagi santri.\n5. Lembaga Kesejahteraan & Kewirausahaan Santri: Membekali kemandirian ekonomi pesantren melalui unit usaha terpadu.',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    banner_image = EXCLUDED.banner_image;

-- 2. PROGRAM UNGGULAN
INSERT INTO public.programs (slug, category, title, schedule, target_audience, description, cover_image, curriculum) VALUES
(
    'amaliyah-pondok',
    'amaliyah',
    'Amaliyah & Wirid Rutin Santri',
    'Setiap Hari (Ba''da Shubuh & Maghrib, Malam Jum''at)',
    'Seluruh Santri Putra & Putri PPJM',
    'Pendidikan ruhaniyah harian santri melalui pembacaan Ratib Al-Haddad, Ratib Al-Attas, Wiridul Lathif, Maulid Simtudduror, serta Qiyamul Lail berjamaah untuk membentuk ketajaman bathin dan ikatan hati kepada Rasulullah SAW.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    '["Pembacaan Wiridul Lathif dan Ratib Al-Haddad setelah Shubuh dan Maghrib", "Qiyamul Lail dan Mujahadah Asmaul Husna setiap sepertiga malam", "Kajian Tafsir Jalalain dan Riyadhus Shalihin ba''da Isya", "Pembacaan Maulid Simtudduror & Burdah setiap malam Jumat"]'::jsonb
),
(
    'program-sekolah',
    'sekolah',
    'Pendidikan Formal Berkarakter Islami',
    'Senin - Sabtu (07.00 - 13.00 WIB)',
    'Santri Tingkat Menengah Pertama & Atas',
    'Kurikulum integrasi nasional dipadukan dengan nilai-nilai luhur pesantren. Mengembangkan kompetensi akademik tinggi, kepemimpinan, riset ilmiah sains terapan, serta kemampuan komunikasi bahasa global.',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    '["Kurikulum Nasional terakreditasi A", "Laboratorium Komputer & STEM modern", "Bimbingan intensif UTBK & beasiswa ke Timur Tengah/Tiongkok", "Ekstrakurikuler sains, jurnalistik, dan seni bela diri"]'::jsonb
),
(
    'program-madin',
    'madin',
    'Madrasah Diniyah Salafiyah (Madin)',
    'Sore & Malam Hari (15.30 - 21.00 WIB)',
    'Santri Reguler & Takhassus',
    'Jenjang pendidikan ilmu agama komprehensif mulai dari Matan Jurumiyah, Al-Imrithi, Alfiyah Ibnu Malik, Fathul Qorib, Fathul Mu''in, hingga Ihya Ulumiddin.',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    '["Tingkat Ula: Jurumiyah, Tijan Darori, Safinatun Najah, Aqidatul Awam", "Tingkat Wustho: Al-Imrithi, Fathul Qorib, Ta''limul Muta''allim, Waroqot", "Tingkat Ulya: Alfiyah Ibnu Malik, Fathul Mu''in, Al-Jauharul Maknuun, Ushul Fiqih"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    schedule = EXCLUDED.schedule,
    description = EXCLUDED.description;

-- 3. STEM PROJECTS (Materi & Portofolio Siswa)
INSERT INTO public.stem_projects (slug, title, category, description, specs, syllabus_url, assignment_doc_url, cover_image, is_portfolio, author_santri) VALUES
(
    'iot-smart-irrigation',
    'Sistem Otomasi Penyiram Tanaman Hidroponik Berbasis ESP32',
    'Internet of Things (IoT)',
    'Proyek sains santri yang memadukan sensor kelembaban tanah kapasitif, mikrokontroler ESP32, dan dashboard MQTT untuk otomatisasi penyiraman kebun hidroponik pesantren secara efisien.',
    '{"microcontroller": "ESP32 DevKit V1", "sensors": "Capacitive Soil Moisture V2.0", "cloud": "Adafruit IO / Local MQTT", "power": "Solar Panel 20W"}'::jsonb,
    '#syllabus-iot',
    '#tugas-iot',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    true,
    'Ahmad Zaki & Tim Robotika Santri PPJM'
),
(
    'smart-water-filtration',
    'Purifier Air Minum Higienis Berbasis Nanofiltrasi Karbon Aktif',
    'Sains Terapan & Lingkungan',
    'Penelitian santri dalam mengolah sumber air sumur lokal Lasem menjadi air siap minum dengan standar higienis melalui filtrasi zeolit, silika, dan karbon aktif kelapa sawit.',
    '{"metode": "Gravitational Nanofiltration", "kapasitas": "50 Liter/Jam", "pengujian": "TDS Meter & Bakteriologis"}'::jsonb,
    '#syllabus-filtrasi',
    '#tugas-filtrasi',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    true,
    'Farhan Maulana & Muhammad Iqbal'
),
(
    'silabus-robotika-dasar',
    'Modul Pembelajaran & Silabus Robotika Mikro Arduino Santri',
    'Materi & Penugasan STEM',
    'Panduan belajar terstruktur mulai dari pengenalan elektronika dasar, logika sensor ultrasonik, motor driver L298N, hingga pembuatan robot line follower berkarakter islami.',
    '{"tingkat": "Pemula - Menengah", "durasi": "12 Pertemuan", "alat": "Starter Kit Arduino Uno"}'::jsonb,
    'https://example.com/silabus-robotika-ppjm.pdf',
    'https://example.com/lembar-tugas-stem-01.pdf',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    false,
    'Ustadz Riski, S.T. (Guru Pembina STEM)'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- 4. MANDARIN LESSONS & QUIZZES
INSERT INTO public.mandarin_lessons (id, order_index, level, topic, hanzi, pinyin, meaning_id, audio_url, cover_image, dialog_script) VALUES
(
    'a1b2c3d4-0001-0000-0000-000000000001',
    1,
    'Dasar 1',
    'Salam & Sapaan Santri (问候 - Wènhòu)',
    '你好',
    'Nǐ hǎo',
    'Halo / Selamat Sejahtera',
    'https://actions.google.com/sounds/v1/speech/greeting_chinese.ogg',
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    '[{"speaker": "Santri A", "hanzi": "你好！", "pinyin": "Nǐ hǎo!", "arti": "Halo!"}, {"speaker": "Santri B", "hanzi": "你好！很高兴认识你。", "pinyin": "Nǐ hǎo! Hěn gāoxìng rènshí nǐ.", "arti": "Halo! Sangat senang mengenalmu."}]'::jsonb
),
(
    'a1b2c3d4-0002-0000-0000-000000000002',
    2,
    'Kosakata Harian',
    'Belajar & Mengaji di Pondok (学习 - Xuéxí)',
    '我们在伊斯兰寄宿学校学习',
    'Wǒmen zài yīsīlán jìsù xuéxiào xuéxí',
    'Kami belajar di pondok pesantren',
    'https://actions.google.com/sounds/v1/speech/school_chinese.ogg',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    '[{"speaker": "Ustadz", "hanzi": "你们在学什么？", "pinyin": "Nǐmen zài xué shénme?", "arti": "Kalian sedang belajar apa?"}, {"speaker": "Santri", "hanzi": "我们在读古兰经。", "pinyin": "Wǒmen zài dú gǔlánjīng.", "arti": "Kami sedang membaca Al-Qur''an."}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    topic = EXCLUDED.topic,
    hanzi = EXCLUDED.hanzi,
    pinyin = EXCLUDED.pinyin,
    meaning_id = EXCLUDED.meaning_id;

-- Insert quizzes if not exists
INSERT INTO public.mandarin_quizzes (lesson_id, question, question_type, options, correct_index, explanation)
SELECT 
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Apa arti dari sapaan "Nǐ hǎo" (你好) dalam Bahasa Indonesia?',
    'choice',
    '["Selamat tinggal", "Halo / Selamat Sejahtera", "Terima kasih banyak", "Sama-sama"]'::jsonb,
    1,
    '你好 (Nǐ hǎo) adalah sapaan paling umum dalam bahasa Mandarin yang berarti Halo atau Selamat Sejahtera.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.mandarin_quizzes WHERE lesson_id = 'a1b2c3d4-0001-0000-0000-000000000001' AND question LIKE '%Nǐ hǎo%'
);

INSERT INTO public.mandarin_quizzes (lesson_id, question, question_type, options, correct_index, explanation)
SELECT 
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Manakah pinyin yang benar untuk karakter "谢谢" (Terima kasih)?',
    'pinyin',
    '["Zàijiàn", "Duìbuqǐ", "Xièxiè", "Bùkèqì"]'::jsonb,
    2,
    '谢谢 dilafalkan sebagai Xièxiè (nada ke-4) yang berarti Terima kasih.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.mandarin_quizzes WHERE lesson_id = 'a1b2c3d4-0001-0000-0000-000000000001' AND question LIKE '%谢谢%'
);

INSERT INTO public.mandarin_quizzes (lesson_id, question, question_type, options, correct_index, explanation)
SELECT 
    'a1b2c3d4-0002-0000-0000-000000000002',
    'Karakter "古兰经" (Gǔlánjīng) memiliki makna apa dalam konteks pesantren?',
    'choice',
    '["Kitab Fiqih", "Al-Qur''anul Karim", "Kamus Bahasa", "Pena & Buku"]'::jsonb,
    1,
    '古兰经 (Gǔlánjīng) adalah terjemahan fonetik bahasa Mandarin untuk Al-Qur''an.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.mandarin_quizzes WHERE lesson_id = 'a1b2c3d4-0002-0000-0000-000000000002' AND question LIKE '%古兰经%'
);

-- 5. PRESTASI SANTRI
INSERT INTO public.achievements (title, category, year, winner_name, medal_type, certificate_url, description)
SELECT 
    'Juara 1 Musabaqah Qira''atil Kutub (MQK) Tingkat Provinsi Jawa Timur',
    'Kitab Kuning / MQK',
    2025,
    'Muhammad Hilman Syakir',
    'Emas / Juara 1',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    'Meraih medali emas dalam cabang Fathul Qorib wustho pada perhelatan akbar MQK se-Jawa Timur.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.achievements WHERE title LIKE '%Musabaqah Qira''atil Kutub%'
);

INSERT INTO public.achievements (title, category, year, winner_name, medal_type, certificate_url, description)
SELECT 
    'Juara 2 Lomba Tahfidzul Qur''an 30 Juz Golongan Remaja',
    'Tahfidz 30 Juz',
    2025,
    'Fatimah Azzahra',
    'Perak / Juara 2',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    'Prestasi membanggakan santriwati dalam melafalkan dan menguasai hafalan 30 juz mutqin.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.achievements WHERE title LIKE '%Tahfidzul Qur''an 30 Juz%'
);

INSERT INTO public.achievements (title, category, year, winner_name, medal_type, certificate_url, description)
SELECT 
    'Juara 1 Kontes Robotika & IoT Santri Nusantara',
    'Robotika / STEM',
    2024,
    'Tim Robotika Jauharul Maknuun',
    'Emas / Juara 1',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    'Inovasi robot pemilah sampah otomatis dan smart hydroponic garden di lingkungan pesantren.'
WHERE NOT EXISTS (
    SELECT 1 FROM public.achievements WHERE title LIKE '%Kontes Robotika%'
);

-- 6. EKSKUL SANTRI
INSERT INTO public.extracurriculars (name, icon_name, schedule, mentor_name, description, cover_image)
SELECT 'Hadrah Al-Banjari PPJM', 'Music', 'Malam Rabu & Malam Ahad', 'Ust. M. Ridlwan', 'Pelatihan seni tabuh terbang banjari, vokal sholawat, dan pembacaan kasidah.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.extracurriculars WHERE name = 'Hadrah Al-Banjari PPJM');

INSERT INTO public.extracurriculars (name, icon_name, schedule, mentor_name, description, cover_image)
SELECT 'Pencak Silat Pagar Nusa', 'Shield', 'Jumat Pagi & Selasa Sore', 'Pendekar Syamsul Hadi', 'Penggemblengan fisik, bela diri tradisional pencak silat, dan penanaman budi pekerti luhur santri.', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.extracurriculars WHERE name = 'Pencak Silat Pagar Nusa');

INSERT INTO public.extracurriculars (name, icon_name, schedule, mentor_name, description, cover_image)
SELECT 'Klub Robotika & IoT', 'Cpu', 'Sabtu Siang (13.30 - 16.00)', 'Ustadz Riski, S.T.', 'Praktik mikrokontroler, pemrograman sensor, dan rancang bangun purwarupa teknologi santri.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.extracurriculars WHERE name = 'Klub Robotika & IoT');

INSERT INTO public.extracurriculars (name, icon_name, schedule, mentor_name, description, cover_image)
SELECT 'Klub Bahasa Arab & Mandarin', 'Globe', 'Senin & Kamis Malam', 'Lao Shi Chen & Ust. Fauzan', 'Percakapan harian interaktif, pidato (muhadharah), dan pengenalan kaligrafi.', 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.extracurriculars WHERE name = 'Klub Bahasa Arab & Mandarin');

-- 7. GALERI AGENDA
INSERT INTO public.galleries (slug, title, category, event_date, description, cover_image, video_url) VALUES
(
    'haflah-akhirussanah-2025',
    'Haflah Akhirussanah & Wisuda Santri PPJM 2025',
    'foto',
    '2025-06-20',
    'Momen khidmat pelepasan santri purna studi dan wisuda khotmil qur''an 30 juz dihadiri para masyayikh dan ribuan wali santri di halaman utama pesantren.',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    NULL
),
(
    'jalsah-ilmiyah-kitab-turats',
    'Jalsah Ilmiyah dan Bedah Kitab Turats Ulama Nusantara',
    'foto',
    '2025-03-12',
    'Kajian mendalam mengupas manuskrip keilmuan para ulama pesisir utara Jawa bersama pakar filologi dan ulama senior.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
    NULL
),
(
    'video-profil-pesantren-2025',
    'Video Profil Resmi: Menyelami Kehidupan Santri PP Jauharul Maknuun',
    'video',
    '2025-01-10',
    'Dokumenter sinematik kehidupan harian santri, dari lantunan qiyamul lail, kajian kitab kuning, hingga riset modern di laboratorium STEM.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- 8. AGENDAS (Historical, Current & Future)
INSERT INTO public.agendas (title, timeline_status, date_display, time_display, month, year, category, location, target_audience, description, coordinator, badge, rundown, image)
SELECT 
    'Kajian Akbar & Peringatan Maulid Nabi SAW',
    'historical',
    '15 September 2024',
    '19.30 - 22.00 WIB',
    'September',
    '2024',
    'Peringatan Hari Besar Islam',
    'Masjid Utama PPJM Lasem',
    'Seluruh Santri, Alumni, dan Masyarakat Umum',
    'Pembacaan Maulid Simtudduror kolosal dan tausiyah kebangsaan oleh para habaib dan masyayikh.',
    'Ustadz Fauzan & Panitia PHBI',
    'Terlaksana',
    '[{"waktu": "19.30", "agenda": "Sholat Isya Berjamaah & Ratib Al-Haddad"}, {"waktu": "20.15", "agenda": "Pembacaan Maulid Simtudduror"}, {"waktu": "21.00", "agenda": "Mauidhoh Hasanah & Doa Penutup"}]'::jsonb,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (
    SELECT 1 FROM public.agendas WHERE title LIKE '%Peringatan Maulid Nabi%'
);

INSERT INTO public.agendas (title, timeline_status, date_display, time_display, month, year, category, location, target_audience, description, coordinator, badge, rundown, image)
SELECT 
    'Ujian Komprehensif Kitab Salaf & Tahfidz Triwulan',
    'current',
    '24 - 30 Oktober 2026',
    '08.00 - 16.00 WIB',
    'Oktober',
    '2026',
    'Evaluasi Akademik',
    'Aula Gedung Madrasah Diniyah',
    'Santri Tingkat Ula, Wustho, dan Takhassus Tahfidz',
    'Evaluasi hafalan matan kitab Fathul Qorib, Imrithi, Alfiyah, serta setoran kelancaran tahfidz 5-30 juz secara berhadapan di depan dewan penguji.',
    'Lembaga Madin & Markaz Tahfidz',
    'Sedang Berlangsung',
    '[{"waktu": "08.00 - 11.30", "agenda": "Sesi Ujian Lisan Kitab Fiqih & Nahwu"}, {"waktu": "13.00 - 16.00", "agenda": "Sesi Setoran Murojaah Tahfidz Mutqin"}]'::jsonb,
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (
    SELECT 1 FROM public.agendas WHERE title LIKE '%Ujian Komprehensif Kitab Salaf%'
);

INSERT INTO public.agendas (title, timeline_status, date_display, time_display, month, year, category, location, target_audience, description, coordinator, badge, rundown, image)
SELECT 
    'Pameran STEM Santri & Olimpiade Sains Antar Pesantren',
    'future',
    '18 November 2026',
    '08.30 - 15.00 WIB',
    'November',
    '2026',
    'Inovasi & Riset Santri',
    'Gedung Laboratorium STEM & Lapangan Utama',
    'Santri, Pelajar Se-Jawa Timur, dan Pengunjung Edukasi',
    'Eksibisi puluhan purwarupa Internet of Things (IoT), robotika pertanian hidroponik, dan kompetisi koding santri pemula tingkat Jawa Timur.',
    'Ustadz Riski & Tim Lab STEM',
    'Mendatang',
    '[{"waktu": "08.30", "agenda": "Opening Ceremony & Keynote Address"}, {"waktu": "09.30 - 13.00", "agenda": "Demonstrasi Proyek IoT Santri & Penjurian"}, {"waktu": "14.00", "agenda": "Penganugerahan Juara Inovasi"}]'::jsonb,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (
    SELECT 1 FROM public.agendas WHERE title LIKE '%Pameran STEM Santri%'
);
