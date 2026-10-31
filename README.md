# Web Platform & Zero-IT CMS Pondok Pesantren Jauharul Maknuun (PPJM)
### Lasem, Sidayu, Kabupaten Gresik, Jawa Timur
Domain Produksi: **https://ppjauharulmaknuun.sch.id/**  
Backend API: **https://gzijnybcmhectajfkdtd.supabase.co**

---

## 📌 Ringkasan Arsitektur & Identitas Platform
Web platform modern, ultra-responsif, aman, dan berkinerja tinggi untuk **Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**, dioptimalkan untuk arsitektur hosting **Cloudflare Pages** dan backend **Supabase (PostgreSQL 17 + Row Level Security)**.

- **Stack Teknologi**: React 19 + TypeScript 5.8 + Vite 8 (Rolldown engine) + Tailwind CSS v4 + Framer Motion + Lucide React.
- **Standar Desain**: Material Design 3 berpadu estetika Islami Modern-Lux (Islamic Emerald Green `#0F5132`, Sunlit Gold `#D4AF37`, Deep Forest Slate `#02180b`, Elevated Glassmorphism Surface Cards).
- **Aksesibilitas & UX**:
  - Touch target minimal 44x44px di perangkat layar sentuh (`active:scale-[0.98]`).
  - Mobile bottom navigation bar adaptif dengan floating notch curve dan iOS safe-area handling (`env(safe-area-inset-bottom)`).
  - Standarisasi kontainer halaman: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
  - Content font scaling proporsional (85% content body scaling) dengan locking 100% pada elemen navigasi & menu header.

---

## 🧭 Peta Lengkap Menu, Rute, Komponen & Item Konten

Situs web terbagi menjadi 3 pilar arsitektur utama:
1. **Grup Navigasi Publik (Navbar 9 Pilar & Bottom Navigation)**
2. **Grup Halaman Publik & Sub-Modul Interaktif**
3. **Grup Panel Zero-IT Admin CMS & Visual Web Editor**

---

### 1. GRUP MENU NAVIGASI PUBLIK

#### A. Top Header & Navbar Desktop (9 Pilar Utama)
Terletak pada komponen [`Navbar.tsx`](file:///e:/NewPPPJM/src/components/common/Navbar.tsx) dan [`NavBarTabs.tsx`](file:///e:/NewPPPJM/src/components/common/NavBarTabs.tsx):
1. **Info Terkini Ticker**: Baris warta berjalan di atas header dengan badge info animasi.
2. **Brand Crest & Title**: Logo lingkaran resmi PPJM dengan efek *halo aura* & *border glow*, terhubung langsung ke Beranda Utama (`/`).
3. **9 Pilar Navigasi Utama**:
   - **JM Center** (`/jm-center/sambutan`): Profil Pimpinan, Sejarah, Visi Misi, Fasilitas, dan Struktur Lembaga.
   - **Program** (`/program-unggulan/amaliyah-pondok`): Kepesantrenan Salafiyah, SMP Plus Formal Terpadu, dan Madrasah Diniyah.
   - **SMART JM** (`/smart-jm/stem/materi`): Laboratorium Riset STEM, Kelas Bahasa Mandarin, dan Mushaf Digital Hafidz Qur'an.
   - **Prestasi** (`/prestasi`): Katalog capaian santri bidang Olimpiade, Olahraga, Seni, Keagamaan, dan Riset.
   - **Ekskul** (`/ekstrakurikuler`): Direktori ekstrakurikuler Sains, Seni & Bahasa, Olahraga, Agama, dan Pramuka.
   - **OSIS** (`/osis`): Portal Kabinet Khidmah Santri, struktur presidium, proker departemen, dan warta liputan event.
   - **JM News** (`/jm-news`): Portal warta resmi, siaran pers, dan dokumentasi artikel pesantren.
   - **Galeri** (`/galeri/foto`): Dokumentasi foto resolusi tinggi dan video dokumenter YouTube resmi.
   - **Agenda** (`/agenda`): Kalender akademik terpadu, countdown agenda terdekat, dan jadwal rutinitas santri.
4. **Pill Profil Akun / Guest**: Menampilkan nama akun aktif, role badge (Super Admin, Pengurus, Guru, Santri, atau Guest), avatar dinamis, serta navigasi 1-klik ke halaman profil pengguna (`/profil`).

#### B. Floating Mobile Bottom Navigation Bar (5 Hub Menu)
Terletak pada komponen [`BottomNav.tsx`](file:///e:/NewPPPJM/src/components/common/BottomNav.tsx) dengan adaptasi kurva SVG dinamis:
1. **Beranda**: Akses cepat ke halaman utama (`/`).
2. **Berita**: Mengarah langsung ke warta berita & press release (`/jm-news`).
3. **Center Button (Logo Emblem PPJM)**: Tombol melayang di tengah (*floating circular action button*) yang memicu **Medsos Pop-up Modal** ([`MedsosModal.tsx`](file:///e:/NewPPPJM/src/components/common/MedsosModal.tsx)) berisi 7 kanal komunikasi resmi (WhatsApp Admin, Saluran WA, Instagram, TikTok, YouTube, Facebook, Email).
4. **Agenda**: Kalender akademik & rutinitas harian santri (`/agenda`).
5. **SPMB**: Akses kilat ke portal pendaftaran murid baru online (`/spmb`).

#### C. Mobile Drawer Navigation
Komponen [`MobileDrawer.tsx`](file:///e:/NewPPPJM/src/components/common/MobileDrawer.tsx) untuk layar kecil yang menampilkan menu bertingkat lengkap dengan dropdown sub-menu, status login, dan pintasan admin.

---

### 2. GRUP HALAMAN PUBLIK & ITEM KONTEN DETAIL

#### A. Beranda Utama (`/`)
File: [`src/pages/Home.tsx`](file:///e:/NewPPPJM/src/pages/Home.tsx)
- **Komponen Hero Slider**: [`HeroSlider.tsx`](file:///e:/NewPPPJM/src/components/HeroSlider.tsx)
  - Slider 3D Coverflow responsif dengan 5 flyer unggulan resmi, auto-play cerdas, navigasi dot/arrow, serta badge tag kategori.
- **Komponen Menu Cepat (QuickMenu)**: [`QuickMenu.tsx`](file:///e:/NewPPPJM/src/components/QuickMenu.tsx)
  - 8 Tombol pintasan grid ikonik: *Tahfidz Qur'an, Madrasah Diniyah, SMP Plus, Riset STEM, Prestasi, Galeri, Kalender Agenda, Pendaftaran SPMB*.
- **Seksi Sambutan Pengasuh**: Kutipan resmi Mudir KH. M. Jauharul Maknuun, M.Pd. dengan foto resmi dan tautan menuju profil lengkap.
- **Seksi 4 Pilar Keunggulan**: Kartu ringkasan *Qur'ani Bersanad, Salaf Modern, Karakter Mandiri, Berwawasan Global*.
- **Seksi Warta Terkini (JM News Preview)**: Grid artikel berita terbaru dengan tanggal publikasi, badge kategori, dan ringkasan isi.
- **Seksi CTA Pendaftaran**: Banner ajakan bergabung santri baru dengan tombol 1-klik menuju form SPMB online dan chat WhatsApp Panitia.

#### B. JM Center (`/jm-center/*`)
File: [`src/pages/jm-center/JmCenter.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/JmCenter.tsx)
- **Sub-Tab Profil**:
  - **Sambutan Pengasuh** ([`SambutanSection.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/SambutanSection.tsx)): Arahan taujih pimpinan ma'had, biografi ringkas, dan fokus tarbiyah.
  - **Sejarah & Napak Tilas** ([`SejarahSection.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/SejarahSection.tsx)): Timeline kronologis berdirinya pesantren di Lasem, Sidayu, Gresik.
  - **Visi & Misi** ([`VisiMisiSection.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/VisiMisiSection.tsx)): Statement visi lembaga berwawasan global serta 5 pilar misi pendidikan Islam.
- **Sub-Tab Fasilitas** ([`FacilitiesSection.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/FacilitiesSection.tsx)):
  - Filter kategori: *Semua, Asrama Santri, Sarana Ibadah, Ruang Akademik, Laboratorium STEM, Fasilitas Olahraga*.
  - Kartu galeri sarana-prasarana higienis & modern dengan modal lightbox resolusi penuh.
- **Sub-Tab Lembaga** ([`InstitutionsSection.tsx`](file:///e:/NewPPPJM/src/pages/jm-center/InstitutionsSection.tsx)):
  - **Pondok Pesantren Jauharul Maknuun**: Program tahfidz Al-Qur'an dan pengajian kitab kuning salafiyah.
  - **SMP Plus Jauharul Maknuun**: Sekolah formal kurikulum nasional berakreditasi "A" BAN-PDM plus pembinaan sains & bahasa.
  - **Madrasah Diniyah Salafiyah**: Jenjang Ula, Wustho, dan Ulya dengan kurikulum matan klasik Nusantara.

#### C. Program Unggulan (`/program-unggulan/*`)
File: [`src/pages/program/ProgramHub.tsx`](file:///e:/NewPPPJM/src/pages/program/ProgramHub.tsx)
- **Kepesantrenan & Amaliyah Pondok** ([`PondokProgramSection.tsx`](file:///e:/NewPPPJM/src/pages/program/PondokProgramSection.tsx)):
  - 4 Program Inti: *Tahfidzul Qur'an 30 Juz Bersanad, Kajian Kitab Turats Salafiyah, Pembinaan Karakter Santri Mandiri, dan Bahasa Asing Aktif*.
  - Dokumentasi dinamis foto kegiatan santri harian dengan penampil modal.
  - Jadwal amaliyah 24 jam terpadu santri (*Shubuh, KBM Sekolah, Diniyah Ashar, Ratibul Haddad Maghrib, Mudzakarah Malam*).
- **Sekolah SMP Plus** ([`SekolahProgramSection.tsx`](file:///e:/NewPPPJM/src/pages/program/SekolahProgramSection.tsx)):
  - Harmoni kurikulum Kemendikbudristek dengan muatan kepesantrenan.
  - Portofolio cerita visual siswa (*Visual Story Cards*) dengan tata letak bergantian.
- **Madrasah Diniyah** ([`MadinFlyerSection.tsx`](file:///e:/NewPPPJM/src/pages/program/MadinFlyerSection.tsx)):
  - Galeri flyer poster kurikulum kitab kuning berjenjang (*Al-Ajurumiyah, Safinatun Najah, Imrithi, Fathul Qorib, Alfiyah Ibnu Malik, Fathul Mu'in*).
  - Poster panduan ubudiyah santri (*Wudhu sempurna, shalat sunnah rawatib, doa harian santri, wirid dzikir pagi-petang*).
  - Fitur perbesar poster, unduh dokumen, dan bagikan tautan flyer.

#### D. SMART JM (`/smart-jm/*`)
File: [`src/pages/smart-jm/SmartJmHub.tsx`](file:///e:/NewPPPJM/src/pages/smart-jm/SmartJmHub.tsx)
- **Laboratorium STEM Area** ([`StemAreaSection.tsx`](file:///e:/NewPPPJM/src/pages/smart-jm/StemAreaSection.tsx)):
  - **Worksheet Proyek**: Lembar kerja tugas praktikum sains & IoT (*Otomasi Irigasi Hidroponik ESP32, Nanofiltrasi Karbon Aktif Air Payau*).
  - **Rubrik Penilaian Terstandar**: 4 Parameter penilaian proyek sains (*Inovasi & Desain, Metodologi, Hasil Pengujian, Presentasi*).
  - **Galeri Portofolio Santri**: Etalase karya orisinal santri yang lolos uji coba laboratorium.
- **Mandarin Class** ([`MandarinClassSection.tsx`](file:///e:/NewPPPJM/src/pages/smart-jm/MandarinClassSection.tsx)):
  - Modul kosakata tematik HSK dengan audio pelafalan Pinyin Putonghua resmi.
  - Game kuis gamifikasi interaktif: sistem poin instan, timer, evaluasi jawaban benar/salah, dan perayaan efek confetti.
- **Hafidz Quran Digital** ([`HafidzQuranSection.tsx`](file:///e:/NewPPPJM/src/pages/smart-jm/HafidzQuranSection.tsx)):
  - **Read Qur'an**: Mushaf 30 Juz lengkap 114 Surat standar Kemenag RI, font kaligrafi Utsmani, terjemahan bahasa Indonesia, dan audio murottal per ayat ([`ReadQuran.tsx`](file:///e:/NewPPPJM/src/components/smart-jm/hafidz/ReadQuran.tsx)).
  - **Latihan Murojaah AI Santri**: Fitur uji hafalan rumpang (*Cloze test*) dengan opsi klik kata tersembunyi, pemutar audio loop berulang, serta speech evaluation.

#### E. Prestasi Santri & Siswa (`/prestasi`)
File: [`src/pages/prestasi/PrestasiPage.tsx`](file:///e:/NewPPPJM/src/pages/prestasi/PrestasiPage.tsx)
- **Filter Kategori Dinamis**: *Semua Kategori, Sains & Robotik, Olahraga & Silat, Seni & Bahasa, Keagamaan & MQK, Umum & Riset*.
- **Filter Tahun Prestasi**: Pilah penghargaan berdasarkan tahun perolehan juara.
- **Statistik Rekap Prestasi**: Total kejuaraan, medali emas/juara 1, tingkat regional, provinsi, dan nasional.
- **Kartu Prestasi Lux** ([`PrestasiCard.tsx`](file:///e:/NewPPPJM/src/pages/prestasi/PrestasiCard.tsx)): Foto dokumentasi piala/piagam, nama santri/pembina, tingkat kejuaraan, dan penyelenggara.
- **Lightbox Pratinjau**: Modal resolusi tinggi untuk memverifikasi sertifikat & foto penyerahan penghargaan.

#### F. Ekstrakurikuler (`/ekstrakurikuler`)
File: [`src/pages/ekskul/EkskulPage.tsx`](file:///e:/NewPPPJM/src/pages/ekskul/EkskulPage.tsx)
- **Filter Kategori Ekskul**: *Semua Ekskul, Sains, Olahraga, Seni, Agama, Pramuka*.
- **Kartu Ekskul Interaktif** ([`EkskulCard.tsx`](file:///e:/NewPPPJM/src/pages/ekskul/EkskulCard.tsx)):
  - Menampilkan badge kategori, instruktur/pelatih, jadwal latihan rutin mingguan, dan lokasi sarana.
  - Galeri multi-foto kegiatan per cabang ekskul.
- **Modal Detail Ekskul** ([`EkskulDetailModal.tsx`](file:///e:/NewPPPJM/src/pages/ekskul/EkskulDetailModal.tsx)): Silabus latihan, target capaian kejuaraan, dan panduan pendaftaran anggota ekskul.

#### G. Organisasi Siswa Intra Sekolah / OSIS (`/osis`)
File: [`src/pages/osis/OsisHub.tsx`](file:///e:/NewPPPJM/src/pages/osis/OsisHub.tsx)
- **Struktur Pengurus Kabinet** ([`OsisStructureSection.tsx`](file:///e:/NewPPPJM/src/pages/osis/OsisStructureSection.tsx)):
  - Level 1: Presidium Pimpinan Utama (Ketua OSIS Putra, Ketua OSIS Putri, Wakil Ketua).
  - Level 2: Badan Pengurus Harian (Sekretaris & Bendahara).
  - Level 3: Koordinator Seksi Bidang (Sekbid Pendidikan, Kebersihan, Keamanan, Bahasa, dll).
  - Foto resmi pengurus, kelas, dan motto khidmah santri.
- **Program Kerja 5 Departemen** ([`OsisProgramsSection.tsx`](file:///e:/NewPPPJM/src/pages/osis/OsisProgramsSection.tsx)):
  - BPH, Departemen Bahasa Asing, Departemen Riset STEM, Departemen Kebersihan, dan Departemen Kedisiplinan.
  - Detail sasaran target, frekuensi rutinitas, dan ekspektasi output program.
- **Dokumentasi & Event Warta OSIS** ([`OsisEventsSection.tsx`](file:///e:/NewPPPJM/src/pages/osis/OsisEventsSection.tsx)):
  - Press release pelantikan kabinet, LDKS di alam terbuka, aksi hijau penanaman mangrove, dan pekan gebyar bulan bahasa.

#### H. JM News (`/jm-news` & `/jm-news/press-release/:slug`)
File: [`src/pages/Berita.tsx`](file:///e:/NewPPPJM/src/pages/Berita.tsx) dan [`src/pages/DetailBerita.tsx`](file:///e:/NewPPPJM/src/pages/DetailBerita.tsx)
- Pencarian cerdas artikel warta berdasarkan judul dan kata kunci.
- Filter kategori: *Semua Warta, Berita Utama, Siaran Pers, Prestasi, Akademik, Pesantren*.
- Tampilan detail artikel: Banner foto resolusi tinggi, tanggal terbit, nama penulis/editor, format teks kaya aman ([`SafeRichContent.tsx`](file:///e:/NewPPPJM/src/components/common/SafeRichContent.tsx)), tombol bagikan ke media sosial (WhatsApp, Facebook, Salin Tautan), dan rekomendasi artikel terkait.

#### I. Galeri Pesantren (`/galeri/*`)
File: [`src/pages/galeri/Galeri.tsx`](file:///e:/NewPPPJM/src/pages/galeri/Galeri.tsx)
- **Galeri Foto** ([`GaleriFoto.tsx`](file:///e:/NewPPPJM/src/pages/galeri/GaleriFoto.tsx)): Album dokumentasi kegiatan asrama santri, pembelajaran kelas, dan wisuda tahfidz dengan modal zoom lightbox.
- **Galeri Video** ([`GaleriVideo.tsx`](file:///e:/NewPPPJM/src/pages/galeri/GaleriVideo.tsx)): Pemutar video profil dan dokumenter resmi yang terhubung langsung dengan kanal YouTube PPJM.

#### J. Agenda & Kalender Santri (`/agenda`)
File: [`src/pages/agenda/AgendaHub.tsx`](file:///e:/NewPPPJM/src/pages/agenda/AgendaHub.tsx)
- **Kalender Akademik Bulanan** ([`AcademicCalendarSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/AcademicCalendarSection.tsx)):
  - Tampilan grid bulanan interaktif dengan titik penanda kategori warna (*Pondok, Sekolah, Diniyah, Event Akbar, Libur*).
  - Pratinjau acara harian saat tanggal diklik.
- **Agenda Terdekat & Countdown** ([`UpcomingEventsSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/UpcomingEventsSection.tsx)):
  - Timer hitung mundur (*Hari, Jam, Menit, Detik*) menuju waktu kegiatan.
  - Integrasi 1-klik tombol **Simpan ke Google Calendar** dan tombol bagikan WhatsApp.
- **Agenda Rutin** ([`RoutineAgendaSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/RoutineAgendaSection.tsx)):
  - Katalog rutinitas harian (wirid & KBM), mingguan (roan jumat & khitobah 3 bahasa), dan bulanan (khotmil qur'an & rapat pleno wali santri).

#### K. SPMB - Pendaftaran Murid Baru (`/spmb`)
File: [`src/pages/Spmb.tsx`](file:///e:/NewPPPJM/src/pages/Spmb.tsx)
- Banner informasi penerimaan santri baru tahun ajaran berjalan.
- Rangkuman gelombang pendaftaran, alur tes seleksi (baca kitab & tahfidz), dan berkas persyaratan.
- Tombol integrasi formulir online dan kontak hotline langsung WhatsApp panitia SPMB.

#### L. Profil Akun Pengguna / Santri (`/profil`)
File: [`src/pages/profile/UserProfilePage.tsx`](file:///e:/NewPPPJM/src/pages/profile/UserProfilePage.tsx)
- Kartu identitas pengguna adaptif (Super Admin, Pengurus, Guru, Santri, Tamu).
- Fitur Edit Profil Modal ([`EditProfileModal.tsx`](file:///e:/NewPPPJM/src/components/profile/EditProfileModal.tsx)).
- Pemilih avatar kustom & preset ([`AvatarPickerModal.tsx`](file:///e:/NewPPPJM/src/components/profile/AvatarPickerModal.tsx)) dengan WebP auto-compressor.
- Penggantian kata sandi dengan meter kekuatan sandi ([`ChangePasswordModal.tsx`](file:///e:/NewPPPJM/src/components/profile/ChangePasswordModal.tsx)).
- Kartu kesehatan keamanan (Security Health Card) dan ringkasan portofolio santri ([`SantriPortalHub.tsx`](file:///e:/NewPPPJM/src/components/profile/SantriPortalHub.tsx)).

#### M. Modern Clean Footer
File: [`src/components/common/Footer.tsx`](file:///e:/NewPPPJM/src/components/common/Footer.tsx)
- **Kolom 1**: Identitas lembaga, logo resmi, deskripsi singkat ma'had, dan deretan tombol medsos resmi.
- **Kolom 2**: Tautan cepat navigasi, SPMB, Kalender Akademik, FAQ, dan Kebijakan Privasi.
- **Kolom 3**: Alamat sekretariat fisik, nomor hotline WhatsApp admin aktif, dan alamat email resmi.
- **Sub-Footer**: Hak cipta terlindungi dan tautan modal interaktif (*Layanan Kontak, Kalender Akademik, Privasi, FAQ SPMB*).

---

### 3. GRUP PANEL ADMIN ZERO-IT CMS & EDITOR VISUAL

Akses melalui rute `/admin` dengan proteksi hak akses berbasis RBAC ([`RoleGuard.tsx`](file:///e:/NewPPPJM/src/components/auth/RoleGuard.tsx)) dan layout terisolasi ([`AdminLayout.tsx`](file:///e:/NewPPPJM/src/layouts/AdminLayout.tsx)):

| Modul Admin CMS | File Halaman | Target Konten & Fungsi Operasional | Hak Akses Role |
| :--- | :--- | :--- | :--- |
| **Live WYSIWYG Editor** | [`WebVisualEditor.tsx`](file:///e:/NewPPPJM/src/pages/admin/WebVisualEditor.tsx) | Pratinjau visual interaktif langsung di atas kanvas website dengan kemampuan klik-dan-ubah teks, seksi, serta gambar seketika. | `super_admin`, `pengurus_konten` |
| **Pusat Kendali (Dashboard)** | [`Dashboard.tsx`](file:///e:/NewPPPJM/src/pages/admin/Dashboard.tsx) | Metrik real-time jumlah berita, agenda aktif, portofolio sains santri, status koneksi Supabase, dan audit log sistem. | `super_admin`, `pengurus_konten`, `guru_akademik` |
| **Poster Slider Utama** | [`KelolaSlider.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaSlider.tsx) | Manajemen 5 flyer utama beranda: judul, deskripsi sambutan, badge tag, urutan slide, dan link aksi jelajah. | `super_admin`, `pengurus_konten` |
| **JM Center & Profil** | [`KelolaProfil.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaProfil.tsx) | Modul kelola teks sambutan mudir, kronologi linimasa sejarah, rumusan visi misi, dan katalog fasilitas pondok/sekolah. | `super_admin`, `pengurus_konten` |
| **Program Kurikulum** | [`KelolaProfil.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaProfil.tsx) | Pengelolaan kurikulum kepesantrenan, jadwal amaliyah 24 jam, program sekolah formal SMP Plus, dan flyer madrasah diniyah. | `super_admin`, `pengurus_konten`, `guru_akademik` |
| **Lab Riset STEM** | [`KelolaStem.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaStem.tsx) | Input silabus praktikum sains, lembar kerja siswa (worksheet), instrumen rubrik penilaian, dan kurasi portofolio teknologi santri. | `super_admin`, `guru_akademik` |
| **Kelas Mandarin** | [`KelolaMandarin.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaMandarin.tsx) | Bank soal kuis gamifikasi, data kosa kata Hanzi & Pinyin, serta unggah berkas audio rekaman pelafalan Putonghua. | `super_admin`, `guru_akademik` |
| **Dewan Tahfidz Qur'an** | [`KelolaHafidz.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaHafidz.tsx) | Pemantauan 114 surat Al-Qur'an, data audio murottal reciter, dan monitoring rekaman capaian evaluasi setoran hafalan santri. | `super_admin`, `guru_akademik` |
| **Warta & Press Release** | [`KelolaBerita.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaBerita.tsx) | Penyusunan siaran pers resmi, foto kegiatan santri dengan kompresi WebP, pengaturan kategori warta, dan broadcast WhatsApp wali santri. | `super_admin`, `pengurus_konten` |
| **Galeri Foto & Video** | [`KelolaGaleri.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaGaleri.tsx) | Pengunggahan massal dokumentasi foto resolusi tinggi, penataan kategori album, dan penyematan tautan video YouTube resmi. | `super_admin`, `pengurus_konten` |
| **Prestasi Juara** | [`KelolaPrestasi.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaPrestasi.tsx) | Pencatatan rekor prestasi juara santri: piagam lomba, tingkat kejuaraan (kabupaten/provinsi/nasional), tahun, dan nama pembina. | `super_admin`, `pengurus_konten`, `guru_akademik` |
| **Ekstrakurikuler** | [`KelolaEkskul.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaEkskul.tsx) | Manajemen katalog minat bakat: jadwal latihan, lokasi, profil pelatih, dan dokumentasi foto ekskul santri. | `super_admin`, `pengurus_konten` |
| **Portal OSIS** | [`KelolaOsis.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsis.tsx) | Pembaruan susunan kabinet khidmah santri masa bakti, rincian proker 5 departemen, dan publikasi event organisasi. | `super_admin`, `pengurus_konten` |
| **Agenda & Kalender** | [`KelolaAgenda.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaAgenda.tsx) | Penjadwalan kalender pendidikan terpadu, penetapan agenda terdekat bertimer, dan pengaturan rutinitas kegiatan santri. | `super_admin`, `pengurus_konten` |
| **Kontak & Medsos Pop-up** | [`KelolaKontak.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaKontak.tsx) | Konfigurasi nomor resmi WhatsApp hotline admin, tautan saluran pengumuman, dan integrasi akun media sosial resmi. | `super_admin`, `pengurus_konten` |
| **Pengaturan Akun & RBAC** | [`UserProfilePage.tsx`](file:///e:/NewPPPJM/src/pages/profile/UserProfilePage.tsx) | Manajemen data personal admin/operator, audit peran akun pengguna, dan pembaruan kredensial keamanan kata sandi. | `super_admin`, `pengurus_konten`, `guru_akademik` |

---

## 🔐 Kredensial Akun Default per Role (Production Seed)

Sistem telah dilengkapi akun bawaan terstandarisasi untuk 4 tingkatan hak akses (Role-Based Access Control / RBAC) yang tersimpan aman pada Supabase Auth (`auth.users`) dan tabel `public.admin_profiles`:

| Peran (Role) | Default Email / Username | Default Password | Nama Pengguna / NIP-NIS | Deskripsi Wewenang & Hak Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@ppjauharulmaknuun.sch.id` | `PPJM_SuperAdmin2026!` | **KH. Jauharul Maknuun, M.Pd.**<br>`PPJM-ADM-001` | **Level 4 (Root Clearance)**: Akses total database Supabase, manajemen pengguna & hak akses RBAC, eksekusi migrasi data, audit log keamanan, serta rilis kebijakan sistem. |
| **Pengurus Konten** | `konten@ppjauharulmaknuun.sch.id` | `PPJM_KontenMedia2026!` | **Ustadz M. Ridlwan, S.Kom.**<br>`PPJM-KNT-002` | **Level 3 (Media Manager)**: Pengelolaan Warta & Berita, broadcast WhatsApp wali santri, Hero Slider (Coverflow), Galeri Dokumentasi Foto/Video, dan Kalender Agenda Bulanan. |
| **Guru Akademik** | `akademik@ppjauharulmaknuun.sch.id` | `PPJM_GuruAkademik2026!` | **Ustadz Riski, S.T.**<br>`PPJM-GUR-003` | **Level 2 (Academic Lead)**: Pengelolaan silabus Lab STEM & penugasan IoT, kurasi portofolio sains santri, bank soal kuis Mandarin Class, dan evaluasi capaian Tahfidz Qur'an. |
| **Santri / User** | `santri@ppjauharulmaknuun.sch.id` | `PPJM_SantriMaju2026!` | **Ahmad Zaki Al-Maknuuni**<br>`SAN-2024-089` | **Level 1 (Member Portal)**: Portal personal santri, pengerjaan kuis gamifikasi Mandarin, riwayat hafalan Al-Qur'an 30 Juz, pengiriman penugasan STEM, dan akses informasi agenda. |

> [!TIP]
> Pada portal login (`/login` atau `/admin/login`), disediakan tombol **Autofill 1-Klik** untuk masing-masing peran di atas guna mempermudah pengujian alur otentikasi. Seluruh akun telah diverifikasi aktif (**200 OK**) pada live Supabase Auth API.

> [!IMPORTANT]
> **Catatan Teknis Seeding Akun Supabase Auth (GoTrue Invariant)**:  
> Saat melakukan injeksi akun manual langsung ke tabel `auth.users` via SQL:
> 1. Field `instance_id` **wajib** disetel ke UUID `'00000000-0000-0000-0000-000000000000'`.
> 2. Seluruh kolom token (`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new`, `phone_change`, dll) **wajib** diinisialisasi dengan string kosong `''` dan **TIDAK BOLEH `NULL`**.  
> Engine GoTrue (Go backend) menggunakan tipe data `string` primitif pada struct scanner database. Nilai `NULL` akan memicu error `sql: Scan error on column confirmation_token: converting NULL to string is unsupported` dan menghasilkan respon palsu `Invalid login credentials`. Skrip `20261025_seed_credentials.sql` telah diamankan dengan aturan ini.

---

## 🗄️ Panduan Eksekusi Database (Supabase / PostgreSQL)

Jika Anda melakukan setup ulang pada database lokal atau remote Supabase, jalankan script migrasi berikut secara berurutan pada **SQL Editor**:

1. **Struktur Skema Dasar & Tabel Publik**:
   ```sql
   -- Jalankan: supabase/schema.sql
   ```
2. **Penguatan RBAC & Trigger Profil**:
   ```sql
   -- Jalankan: supabase/migrations/20261025_rbac_hardening.sql
   ```
3. **Inisialisasi Akun Bawaan & Kredensial 4 Peran (Hardened GoTrue Compliant)**:
   ```sql
   -- Jalankan: supabase/migrations/20261025_seed_credentials.sql
   ```
4. **Dataset Otentik Publik (JM Center, Program, STEM, Mandarin, Prestasi, Agenda)**:
   ```sql
   -- Jalankan: supabase/seed.sql
   ```

---

## 🚀 Panduan Menjalankan di Komputer Lokal

1. **Pastikan Node.js (v18+) telah terpasang.**
2. **Install Dependensi:**
   ```bash
   npm install
   ```
3. **Salin File Environment:**
   ```bash
   cp .env.example .env
   ```
4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Akses di peramban: `http://localhost:5173/`.

5. **Uji Build Produksi & Type-Check:**
   ```bash
   npm run build
   npm run preview
   ```

---

## ☁️ Panduan Deployment ke Cloudflare Pages

1. Hubungkan repositori GitHub ini ke **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages**.
2. Konfigurasi build setting:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Domain kustom: Masukkan `ppjauharulmaknuun.sch.id` pada tab **Custom domains**.
