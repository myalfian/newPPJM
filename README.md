# Web Platform & Zero-IT CMS Pondok Pesantren Jauharul Maknuun (PPJM)

### Lasem, Sidayu, Kabupaten Gresik, Jawa Timur
**Domain Produksi:** `https://ppjauharulmaknuun.sch.id/`  
**Backend API:** `https://gzijnybcmhectajfkdtd.supabase.co`  
**Status:** Production Ready | Build Status: ✅ Passing | TypeScript: ✅ Clean

---

## 📋 Daftar Isi (Table of Contents)

1. [Ringkasan Arsitektur & Identitas Platform](#ringkasan-arsitektur--identitas-platform)
2. [Stack Teknologi & Dependensi](#stack-teknologi--dependensi)
3. [Peta Lengkap Halaman, Rute & Komponen](#peta-lengkap-halaman-rute--komponen)
4. [Sistem Otentikasi & Otorisasi (9-Role RBAC)](#sistem-otentikasi--otorisasi-9-role-rbac)
5. [Modal Login & Daftar Akun (AuthModal)](#modal-login--daftar-akun-authmodal)
6. **Panel Admin Zero-IT CMS (Editor Visual)** (panel-admin-zero-it-cms--editor-visual)
7. **Skema Database & Tabel Supabase** (skema-database--tabel-supabase)
8. **Import Data Siswa Santri (129 Siswa)** (import-data-siswa-santri-129-siswa)
9. **Keamanan & Hardening (OWASP Top 10:2025)** (keamanan--hardening-owasp-top-10-2025)
10. **Panduan Migrasi Database (SQL)** (panduan-migrasi-database-sql)
11. **Panduan Instalasi & Menjalankan Secara Lokal** (panduan-instalasi--menjalankan-secara-lokal)
12. **Panduan Deployment Cloudflare Pages** (panduan-deployment-cloudflare-pages)
13. **Variabel Lingkungan (Environment Variables)** (variabel-lingkungan-environment-variables)
14. **Kredensial Default & Akun Bawaan** (kredensial-default--akun-bawaan)
15. **Contributing & Lisensi** (contributing--lisensi)

---

## 1. Ringkasan Arsitektur & Identitas Platform

Web platform modern, ultra-responsif, aman, dan berkinerja tinggi untuk **Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**, dioptimalkan untuk arsitektur hosting **Cloudflare Pages** dan backend **Supabase (PostgreSQL 17 + Row Level Security)**.

| Aspek | Detail |
|-------|--------|
| **Nama Lembaga** | Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Kabupaten Gresik, Jawa Timur |
| **Stack Frontend** | React 19 + TypeScript 5.8 + Vite 8 (Rolldown engine) + Tailwind CSS v4 + Framer Motion + Lucide React |
| **Backend / BaaS** | Supabase (PostgreSQL 17 + Row Level Security + Supabase Auth GoTrue) |
| **Standar Desain** | Material Design 3 berpadu estetika Islami Modern-Lux (Islamic Emerald Green `#0F5132`, Sunlit Gold `#D4AF37`, Deep Forest Slate `#02180b`, Elevated Glassmorphism Surface Cards) |
| **Aksesibilitas & UX** | Touch target minimal 44x44px; Mobile bottom drawer navigasi adaptive dengan floating notch curve dan iOS safe-area handling (`env(safe-area-inset-bottom)`); Kontainer halaman standar: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; Content font scaling proporsional (85% body scaling) dengan locking 100% pada elemen navigasi & menu header |
| **Hosting Produksi** | Cloudflare Pages (static site) + Vercel alternative |
| **Domain Produksi** | `https://ppjauharulmaknuun.sch.id/` |

---

## 2. Stack Teknologi & Dependensi

| Kategori | Teknologi | Versi | Fungsi |
|----------|-----------|-------|--------|
| **Frontend Framework** | React | 19 | UI library utama |
| **TypeScript** | 5.8 | Type safety & developer experience |
| **Build Tool** | Vite | 8 (Rolldown engine) | Build tool & dev server |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS framework |
| **Animasi** | Framer Motion | Latest | Animasi transisi & layout |
| **Iconografi** | Lucide React | Latest | SVG icon system |
| **Rich Text Editor** | TipTap (StarterKit) | Latest | Rich text editor untuk konten admin |
| **State Management** | React Context + Hooks | Built-in | State management ringan |
| **Database / Auth** | Supabase | PostgreSQL 17 | Backend-as-a-Service, Auth, Storage, RLS |
| **HTTP Client** | Supabase JS Client | Latest | Database client typed |

---

## 3. Peta Lengkap Halaman, Rute & Komponen

Situs web terbagi menjadi 3 pilar arsitektur utama:

### 1A. Grup Menu Navigasi Publik (Navbar 9 Pilar & Bottom Navigation)

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
   - **SPMB** (`/spmb`): Portal pendaftaran murid baru online.
   - **SPMB - Pendaftaran Online** (`/spmb`): Formulir pendaftaran calon santri baru.
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

### 2. Grup Halaman Publik & Item Konten Detail

#### A. Beranda Utama (`/`)
File: [`src/pages/Home.tsx`](file:///e:/NewPPPJM/src/pages/Home.tsx)
- **Komponen Hero Slider**: [`HeroSlider.tsx`](file:///e:/NewPPPJM/src/components/HeroSlider.tsx) - Slider 3D Coverflow responsif dengan 5 flyer unggulan resmi, auto-play cerdas, navigasi dot/arrow, serta badge tag kategori.
- **Komponen Menu Cepat (QuickMenu)**: [`QuickMenu.tsx`](file:///e:/NewPPPJM/src/components/QuickMenu.tsx) - 8 Tombol pintasan grid ikonik: *Tahfidz Qur'an, Madrasah Diniyah, SMP Plus, Riset STEM, Prestasi, Galeri, Kalender Agenda, Pendaftaran SPMB*.
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
  - Dokumentasi dinamis foto kegiatan santri harian dengan penampil modal lightbox.
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
- **Kartu Ekskul Interaktif** ([`EkskulCard.tsx`](file:///e:/NewPPPJM/src/pages/ekskul/EkskulCard.tsx)): Menampilkan badge kategori, instruktur/pelatih, jadwal latihan rutin mingguan, dan lokasi sarana.
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
- **Kalender Akademik Bulanan** ([`AcademicCalendarSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/AcademicCalendarSection.tsx)): Tampilan grid bulanan interaktif dengan titik penanda kategori warna (*Pondok, Sekolah, Diniyah, Event Akbar, Libur*). Pratinjau acara harian saat tanggal diklik.
- **Agenda Terdekat & Countdown** ([`UpcomingEventsSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/UpcomingEventsSection.tsx)): Timer hitung mundur (*Hari, Jam, Menit, Detik*) menuju waktu kegiatan. Integrasi 1-klik tombol **Simpan ke Google Calendar** dan tombol bagikan WhatsApp.
- **Agenda Rutin** ([`RoutineAgendaSection.tsx`](file:///e:/NewPPPJM/src/pages/agenda/RoutineAgendaSection.tsx)): Katalog rutinitas harian (wirid & KBM), mingguan (roan jumat & khitobah 3 bahasa), dan bulanan (khotmil qur'an & rapat pleno wali santri).

#### J. SPMB - Pendaftaran Murid Baru (`/spmb`)
File: [`src/pages/Spmb.tsx`](file:///e:/NewPPPJM/src/pages/Spmb.tsx)
- Banner informasi penerimaan santri baru tahun ajaran berjalan.
- Rangkuman gelombang pendaftaran, alur tes seleksi (baca kitab & tahfidz), dan berkas persyaratan.
- Tombol integrasi formulir online dan kontak hotline langsung WhatsApp panitia SPMB.

#### K. Profil Akun Pengguna / Santri (`/profil`)
File: [`src/pages/profile/UserProfilePage.tsx`](file:///e:/NewPPPJM/src/pages/profile/UserProfilePage.tsx)
- Kartu identitas pengguna adaptif (Super Admin, Pengurus, Guru, Santri, Tamu).
- Fitur Edit Profil Modal ([`EditProfileModal.tsx`](file:///e:/NewPPPJM/src/components/profile/EditProfileModal.tsx)).
- Pemilih avatar kustom & preset ([`AvatarPickerModal.tsx`](file:///e:/NewPPPJM/src/components/profile/AvatarPickerModal.tsx)) dengan WebP auto-compressor.
- Penggantian kata sandi dengan meter kekuatan sandi ([`ChangePasswordModal.tsx`](file:///e:/NewPPPJM/src/components/profile/ChangePasswordModal.tsx)).
- Kartu kesehatan keamanan (Security Health Card) dan ringkasan portofolio santri ([`SantriPortalHub.tsx`](file:///e:/NewPPPJM/src/components/profile/SantriPortalHub.tsx)).

#### L. Modern Clean Footer
File: [`src/components/common/Footer.tsx`](file:///e:/NewPPPJM/src/components/common/Footer.tsx)
- **Kolom 1**: Identitas lembaga, logo resmi, deskripsi singkat ma'had, dan deretan tombol medsos resmi.
- **Kolom 2**: Tautan cepat navigasi, SPMB, Kalender Akademik, FAQ, dan Kebijakan Privasi.
- **Kolom 3**: Alamat sekretariat fisik, nomor hotline WhatsApp admin aktif, dan alamat email resmi.
- **Sub-Footer**: Hak cipta terlindungi dan tautan modal interaktif (*Layanan Kontak, Kalender Akademik, Privasi, FAQ SPMB*).

#### M. Modal Autentikasi Global (Login & Daftar Akun)
Terletak pada komponen [`AuthModal.tsx`](file:///e:/NewPPPJM/src/components/auth/AuthModal.tsx), dipasang di [`RootLayout.tsx`](file:///e:/NewPPPJM/src/layouts/RootLayout.tsx) sebagai overlay global di seluruh halaman publik:
- **Masuk (Login)**: Modal `view: 'login'` dengan 4 tab peran (*Guest, Santri, Guru, Admin*), tombol "Lanjutkan sebagai Guest", serta autentikasi kata sandi melalui Supabase Auth (`signInWithPassword`). Pengguna yang sudah login dapat membuka dashboard atau keluar langsung dari modal.
- **Daftar Akun Baru (Register)**: Modal `view: 'register'` berisi formulir pendaftaran pengguna (*Nama Lengkap, No. WhatsApp, Email, Role yang diminta, Alamat, Alasan*) yang dikirim ke tabel `user_registrations` dengan status `pending`. Data ini akan ditinjau dan disetujui oleh **Super Admin** melalui panel manajemen pengguna (`/admin/users`) sebelum kredensial login aktif.
- **Pemicu Modal**: Tersedia melalui tombol "Daftar Pengguna Baru" & "Masuk ke Akun" di Footer, tombol "Login sebagai Santri/Guru/Admin" di GuestButton (Navbar & Mobile Drawer), dan rute `/login` yang diarahkan ke home dengan modal otomatis terbuka.
- **Alur Pembuatan Akun oleh Super Admin**: Registrasi yang diverifikasi diubah menjadi akun asli melalui fungsi RPC `admin_create_user` / `admin_upsert_user_account` di Supabase (`20261101_admin_user_management.sql`), dengan catatan audit log untuk setiap aksi pembuatan akun.

---

## 3. GRUP PANEL ADMIN ZERO-IT CMS & EDITOR VISUAL

Akses melalui rute `/admin` dengan proteksi hak akses berbasis RBAC ([`RoleGuard.tsx`](file:///e:/NewPPPJM/src/components/auth/RoleGuard.tsx)) dan layout terisolasi ([`AdminLayout.tsx`](file:///e:/NewPPPJM/src/layouts/AdminLayout.tsx)):

| Modul Admin CMS | File Halaman | Target Konten & Fungsi Operasional | Hak Akses Role |
|:---|:---|:---|:---|
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
| **Portal OSIS** | [`KelolaOsis.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsis.tsx) | Pembaruan susunan kabinet khidmah santri masa bakti, rincian proker 5 departemen, dan publikasi event organisasi. | `super_admin`, `pengurus_konten`, **pengurus_osis** |
| **Agenda & Kalender** | [`KelolaAgenda.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaAgenda.tsx) | Penjadwalan kalender pendidikan terpadu, penetapan agenda terdekat bertimer, dan pengaturan rutinitas kegiatan santri. | `super_admin`, `pengurus_konten` |
| **Kontak & Medsos Pop-up** | [`KelolaKontak.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaKontak.tsx) | Konfigurasi nomor resmi WhatsApp hotline admin, tautan saluran pengumuman, dan integrasi akun media sosial resmi. | `super_admin`, `pengurus_konten` |
| **Pengaturan Akun & RBAC** | [`UserProfilePage.tsx`](file:///e:/NewPPPJM/src/pages/profile/UserProfilePage.tsx) | Manajemen data personal dinamis untuk 9 role, audit peran akun pengguna, dan pembaruan kredensial keamanan kata sandi. | Semua Role Terautentikasi |
| **Data Tabel OSIS** | [`KelolaOsisData.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsisData.tsx) | Data tabel pengurus OSIS (Nama, Jabatan, Kelas, Tingkat, Periode, Motto, Foto). | `super_admin`, `pengurus_konten`, **osis_pengurus** |
| **Foto OSIS** | [`KelolaOsisFoto.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsisFoto.tsx) | Foto kegiatan OSIS (Judul, Kategori, Deskripsi, Foto WebP, Lokasi, Unggulan). | `super_admin`, `pengurus_konten`, **osis_pengurus** |
| **Video OSIS** | [`KelolaOsisVideo.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsisVideo.tsx) | Video kegiatan OSIS (Judul, Kategori, Deskripsi, YouTube URL, Thumbnail WebP, Unggulan). | `super_admin`, `pengurus_konten`, **osis_pengurus** |
| **Dokumen OSIS** | [`KelolaOsisDokumen.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsisDokumen.tsx) | Dokumen OSIS (PDF, Excel, Word) (Judul, Kategori, Deskripsi, Cover WebP, Isi Rich Text, Unggulan). | `super_admin`, `pengurus_konten`, **osis_pengurus** |
| **Naskah OSIS** | [`KelolaOsisNaskah.tsx`](file:///e:/NewPPPJM/src/pages/admin/KelolaOsisNaskah.tsx) | Naskah / Artikel OSIS (Judul, Kategori, Ringkasan, Sampul WebP, Isi Rich Text, Slug, Unggulan). | `super_admin`, `pengurus_konten`, **osis_pengurus** |

---

## 4. SISTEM OTENTIKASI & OTORIZASI (9-ROLE RBAC)

Selain CMS Publik & Backoffice, sistem kini memiliki ekosistem akademik terintegrasi bergaya **Schudio Power Editor** dengan isolasi Row-Level Security (RLS) ketat pada Supabase:

| Route | File Komponen | Fitur Utama | Role Akses |
|-------|:---|:---|:---|
| `/profile` | [`UserProfilePage.tsx`](file:///e:/NewPPPJM/src/pages/profile/UserProfilePage.tsx) | Ringkasan akun pengguna, pengeditan profil, & manajemen akun | Semua Role Terautentikasi |
| `/profile/:role/:id` | [`PublicProfileViewPage.tsx`](file:///e:/NewPPPJM/src/pages/profile/PublicProfileViewPage.tsx) | Melihat profil pengguna lain sesuai otorisasi RLS. Menyembunyikan nomor WhatsApp pribadi, alamat lengkap, dan kontak wali santri jika diakses oleh pengguna non-pemilik / non-admin. | Semua Role Terautentikasi |
| `/admin/users` | [`AdminUsersPage.tsx`](file:///e:/NewPPPJM/src/pages/admin/AdminUsersPage.tsx) | CRUD akun lintas 9 role dengan form dinamis (input NIS/Kelas/Kamar untuk Santri, NIP/Mapel untuk Guru), filter role, pencarian, toggle status aktif, dan modal generator kredensial password. | `super_admin`, `pengurus_konten`, `kepsek` |
| `/admin/roles` | [`AdminRolesPage.tsx`](file:///e:/NewPPPJM/src/pages/admin/AdminRolesPage.tsx) | Matriks izin akses interaktif untuk 9 role pada seluruh modul (`santri_tugas`, `guru_tugas`, `performance`, `profile`, `ppdb`, `keuangan`, `berita_cms`, `users_rbac`). | `super_admin`, `kepsek` |

### Daftar 9 Role Sistem

| Role | Badge | Keterangan Singkat |
|------|-------|-------------------|
| `super_admin` | Super Admin | Otoritas tertinggi: akses penuh seluruh halaman CMS, manajemen seluruh akun di `/admin/users`, pengaturan matriks izin `/admin/roles`, serta portal `/guru` dan `/santri`. |
| `yayasan` | Yayasan | Dewan Pembina & Pengurus Yayasan Al Jauharu Al Maknuun: memantau perkembangan akademik, profil guru & santri, capaian prestasi, serta kebijakan kelembagaan. |
| `kepsek` | Kepala Sekolah | Kepala SMP Plus Jauharul Maknuun: supervisi kegiatan belajar mengajar, evaluasi tugas guru, persetujuan rapor santri, serta manajemen kurikulum. |
| `guru` | Guru Pengampu | Guru Mata Pelajaran SMP Plus & Diniyah: hanya mengakses `/guru/*`, membuat & mengupdate tugas sendiri, menilai submission santri, serta melihat profil akademik santri di kelas ampunya. |
| `musyrif` | Musyrif / Pembina Asrama | Pembina Asrama & Penyimak Halaqah Tahfidz: mencatat setoran hafalan Al-Qur'an, mengevaluasi adab keseharian santri di kamar asrama, dan memantau perkembangan santri. |
| `santri` | Santri SMP Plus | Pelajar Muslim SMP Plus Jauharul Maknuun: hanya bisa mengakses `/santri/*` dan `/profile` milik sendiri, memperbarui biodata, mengumpulkan tugas, serta melihat grafik hasil belajar. |
| `ppdb` | Panitia SPMB / PPDB | Panitia Penerimaan Santri Baru: mengelola jadwal gelombang pendaftaran, syarat registrasi, kuota asrama, dan layanan konsultasi calon wali santri. |
| `keuangan` | Bendahara & Keuangan | Staf Administrasi Keuangan & Syahriyah: mengelola rincian biaya pendidikan, administrasi daftar ulang santri, dan program beasiswa prestasi. |
| `humas` | Humas & Publikasi | Tim Humas, Media & Dokumentasi: menerbitkan berita kegiatan pondok, press release prestasi nasional, agenda bulanan, dan galeri foto/video. |
| `osis_pengurus` | Pengurus OSIS | Pengurus Organisasi Siswa Intra Sekolah: mengelola kegiatan OSIS, program kerja, struktur pengurus, dokumen, foto, video, dan naskah kegiatan OSIS. |

---

## 5. MODAL LOGIN & DAFTAR AKUN (AUTHMODAL)

Terletak pada komponen [`AuthModal.tsx`](file:///e:/NewPPPJM/src/components/auth/AuthModal.tsx), dipasang di [`RootLayout.tsx`](file:///e:/NewPPPJM/src/layouts/RootLayout.tsx) sebagai overlay global di seluruh halaman publik:

| Tab | Fitur | Detail |
|-----|-------|--------|
| **Guest** | Masuk sebagai tamu | Akses publik tanpa login, fitur terbatas (baca only) |
| **Santri** | Login Santri | Akses portal pembelajaran, tugas, hafalan, nilai |
| **Guru** | Login Guru | Akses manajemen tugas, nilai siswa, materi kelas |
| **Admin** | Login Admin | Akses panel CMS, manajemen konten, dan RBAC |

### Formulir Pendaftaran (Register)
Formulir pendaftaran pengguna (*Nama Lengkap, No. WhatsApp, Email, Role yang diminta, Alamat, Alasan*) yang dikirim ke tabel `user_registrations` dengan status `pending`. Data ini akan ditinjau dan disetujui oleh **Super Admin** melalui panel manajemen pengguna (`/admin/users`) sebelum kredensial login aktif.

### Alur Pembuatan Akun oleh Super Admin
Registrasi yang diverifikasi diubah menjadi akun asli melalui fungsi RPC `admin_create_user` / `admin_upsert_user_account` di Supabase (`20261101_admin_user_management.sql`), dengan catatan audit log untuk setiap aksi pembuatan akun.

---

## 4. SKALA DATABASE & TABEL SUPABASE

Database dikembangkan menggunakan **Supabase (PostgreSQL 17)** dengan **Row Level Security (RLS)** aktif pada semua tabel publik. Berikut adalah struktur tabel utama:

| Tabel | Deskripsi | Kolom Utama |
|-------|-----------|-------------|
| `profiles` | Profil pengguna (santri, guru, admin) | id, full_name, nis, nip, email, phone, role, class, level, angkatan, status_aktif, photo_url, bio, created_at, updated_at |
| `user_registrations` | Pendaftaran pengguna baru | id, full_name, phone, email, requested_role, alamat, alasan, status, reviewed_by, reviewed_at, rejection_reason, created_at, updated_at |
| `password_reset_requests` | Permintaan ganti password | id, email, status, alasan, admin_notes, created_at, updated_at |
| `guru_schedule` | Jadwal guru | id, guru_id, mapel, kelas, hari, jam_mulai, jam_selesai, lokasi, kegiatan, keterangan, is_active, created_at, updated_at |
| `info_terkini` | Info terkini / berita internal | id, title, category, excerpt, content, image_url, is_published, is_featured, slug, author_id, author_name, created_at, updated_at |
| `master_kelas` | Data master kelas | id, nama_kelas, tingkat, keterangan, is_active, created_at, updated_at |
| `master_jabatan` | Data master jabatan | id, nama_jabatan, singkatan, tingkat_kewenangan, is_active, created_at, updated_at |
| `master_mapel` | Data master mata pelajaran | id, nama_mapel, kode_mapel, jenjang, is_active, created_at, updated_at |
| `master_kategori` | Data master kategori | id, nama_kategori, deskripsi, is_active, created_at, updated_at |
| `master_sasaran` | Data master sasaran | id, nama_sasaran, deskripsi, is_active, created_at, updated_at |
| `master_lokasi` | Data master lokasi | id, nama_lokasi, gedung, kapasitas, is_active, created_at, updated_at |
| `berita` | Berita & warta | id, title, category, excerpt, content, image_url, is_published, is_featured, slug, author_id, author_name, created_at, updated_at |
| `stem_projects` | Proyek STEM | id, title, category, level, summary, totalMateri, totalLKPD, status, materi, lkpd, rubrik, uploads, created_at, updated_at |
| `stem_worksheets` | Lembar Kerja STEM | id, title, category, level, description, image_url, pdf_url, specs, rubric, videoRefs, created_at, updated_at |
| `programs_pondok` | Program Pondok Pesantren | id, title, description, schedule, images, created_at, updated_at |
| `programs_sekolah` | Program Sekolah | id, title, description, schedule, images, created_at, updated_at |
| `madin_flyers` | Flyer Madrasah Diniyah | id, title, category, image_url, pdf_url, order_index |
| `ekskul` | Ekstrakurikuler | id, name, category, description, instructor_name, location, schedule, target, images, syllabus, is_active, created_at, updated_at |
| `institutions` | Lembaga | id, name, type, description, curriculum, image_url, created_at, updated_at |
| `mandarin_lessons` | Materi Mandarin | id, topic, level, hanzi, pinyin, meaning_id, cover_image, audio_url, dialog_script, order_index, created_at, updated_at |
| `mandarin_vocabularies` | Kosakata Mandarin | id, hanzi, pinyin, arti, category, hsk_level, example_hanzi, example_pinyin, example_arti, audio_url, dialog_script, created_at, updated_at |
| `mandarin_quizzes` | Kuis Mandarin | id, question, question_type, options, correct_index, explanation, created_at, updated_at |
| `galeri_foto` | Galeri Foto | id, title, category, description, image_url, photos, is_active, order_index, created_at, updated_at |
| `galeri_videos` | Galeri Video | id, title, category, description, youtube_url, thumbnail_url, is_active, order_index, created_at, updated_at |
| `prestasi` | Prestasi Santri | id, title, santri_name, category, level, location, organizer, pembina_name, year, photo_url, certificate_url, created_at, updated_at |
| `ekskul` | Ekstrakurikuler | id, name, category, description, instructor_name, location, schedule, target, images, syllabus, is_active, created_at, updated_at |
| `osis_events` | Kegiatan OSIS | id, title, category, excerpt, content, image_url, is_published, is_featured, slug, author_id, author_name, created_at, updated_at |
| `osis_programs` | Program OSIS | id, title, category, level, requested_role, alamat, alasan, status, reviewed_by, reviewed_at, rejection_reason, created_at, updated_at |
| `osis_structure` | Struktur OSIS | id, name, position, class, level, period, motto, photo_url, order_index, is_active, created_at, updated_at |
| `audit_logs` | Log audit admin | id, module, action, section_id, user_id, email, old_data, new_data, created_at |

---

## 5. IMPORT DATA SISWA SANTRI (129 SISWA)

Data siswa diimpor dari file `DATABASE SISWA.xlsx` ke dalam tabel `public.profiles` dengan role `santri`. File migrasi: `supabase/migrations/20261104_import_siswa_santri.sql`.

**Detail Data:**
| Kelas | Angkatan | Jumlah Siswa | Range NIS |
|-------|----------|--------------|-----------|
| 7A | 2026/2027 | 20 | 20260001 - 20260020 |
| 7B | 2026/2027 | 24 | 20260021 - 20260044 |
| 8A | 2025/2026 | 26 | 20250001 - 20250026 |
| 8B | 2025/2026 | 16 | 20250027 - 20250042 |
| 9A | 2024/2025 | 20 | 20240001 - 20240020 |
| 9B | 2024/2025 | 23 | 20240021 - 20240043 |
| **Total** | | **129** | |

Setiap data siswa dilengkapi dengan:
- `id` (UUID via `md5(NIS)` untuk deterministik)
- `full_name`
- `nis` (Nomor Induk Siswa)
- `kelas` (7A, 7B, 8A, 8B, 9A, 9B)
- `angkatan` (2024/2025, 2025/2026, 2026/2027)
- `role` = `'santri'`
- `status_aktif` = `true`
- `mapel_diampu` = `'{}'` (kosong)
- `jadwal_mengajar` = `'{}'` (kosong)
- `created_at` / `updated_at` = `now()`

---

## 6. KEAMANAN & HARDENING (OWASP TOP 10:2025)

Seluruh kode frontend, konfigurasi edge headers, dan skema database live Supabase (`gzijnybcmhectajfkdtd`) telah diaudit menggunakan standar **OWASP Top 10:2025** dan **Supabase Security Advisor**:

### A. Remediasi Linter Database Supabase (Zero Advisories pada Skema `public`)

| Masalah | Skema | Status | Tindakan |
|---------|-------|--------|----------|
| `0010_security_definer_view` | ERROR | ✅ FIXED | Mengubah view `public.news` menjadi `security_invoker = true` |
| `0011_function_search_path_mutable` | WARN | ✅ FIXED | Mengunci `SET search_path = public, pg_temp` pada seluruh fungsi trigger dan RPC |
| `0028_anon_security_definer_function_executable` | WARN | ✅ FIXED | Mencabut hak eksekusi pada seluruh fungsi `SECURITY DEFINER` |

### B. Penguatan Otorisasi RPC & Anti-Privilege Escalation (`profiles` & `role_permissions`)
- Memperketat fungsi RPC `public.admin_upsert_user_account` agar memverifikasi role pemanggil.
- Menghapus klausa permisif pada kebijakan RLS `rls_profiles_modify_all_roles` dan `rls_role_permissions_all`.
- Mengunci kolom `role` pada saat pengguna memperbarui profil pribadinya.

### 3. Hardening Frontend (Anti-XSS, Safe URL & Upload Validation)
- **DOM/Stored XSS Prevention**: Menambahkan fungsi `escapeHtml()` pada pencetakan Rapor Mini.
- **URL Protocol & Upload Validation**: Menambahkan `isSafeHttpUrl()` (hanya mengizinkan protokol `http:` dan `https:`, menolak `javascript:`/`data:`) serta validasi ketat tipe MIME (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) dan batas ukuran maksimum **5 MB** pada editor TipTap.

### 4. HTTP Security Headers (`vercel.json`)
- `Content-Security-Policy` (CSP)
- `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `Permissions-Policy`

---

## 6. PANDUAN MIGRASI DATABASE (SUPABASE)

Jika Anda melakukan setup ulang pada database lokal atau remote Supabase, jalankan script migrasi berikut secara berurutan pada **SQL Editor** (https://app.supabase.com → Project → SQL Editor):

| Urutan | File | Deskripsi |
|--------|------|-----------|
| 1 | `supabase/schema.sql` | Struktur skema dasar & tabel publik |
| 2 | `supabase/migrations/20261106_master_data_tables.sql` | Tabel master data (kelas, jabatan, mapel, kategori, sasaran, lokasi) + user_registrations, password_reset_requests, guru_schedule, info_terkini |
| 3 | `supabase/migrations/20261104_import_siswa_santri.sql` | Import data siswa santri dari DATABASE SISWA.xlsx |
| 4 | `supabase/migrations/20261025_rbac_hardening.sql` | Penguatan RBAC & Trigger Profil |
| 5 | `supabase/migrations/20261106_db_hardening_integration.sql` | Import data siswa santri dari DATABASE SISWA.xlsx |
| 6 | `supabase/migrations/20261106_info_terkini_table.sql` | Tabel Info Terkini untuk panel admin |
| 7 | `supabase/migrations/20261025_seed_credentials.sql` | Inisialisasi akun bawaan & kredensial 4 peran |
| 8 | `supabase/seed.sql` | Dataset otentik publik (JM Center, Program, STEM, Mandarin, Prestasi, Agenda) |
| 9 | `supabase/migrations/20261102_santri_portal.sql` | Skema Portal Santri |
| 10 | `supabase/migrations/20261102_guru_portal.sql` | Skema Portal Guru |
| 11 | `supabase/migrations/20261102_dynamic_profiles_rbac.sql` | Skema Portal Dinamis 9-Role |
| 12 | `supabase/migrations/20261103_security_hardening_audit.sql` | Security Hardening Audit |

---

## 7. PANDUAN INSTALASI & MENJALANKAN SECARA LOKAL

1. **Pastikan Node.js (v18+) telah terpasang.**
2. **Install Dependensi:**
   ```bash
   npm install
   ```
3. **Salin File Environment:**
   ```bash
   cp .env.example .env
   ```
4. **Isi Environment Variables** (lihat bagian berikutnya).
5. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Akses di peramban: `http://localhost:5173/`.
6. **Uji Build Produksi & Type-Check:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 8. PANDUAN DEPLOYMENT KE CLOUDFLARE PAGES

1. Hubungkan repositori GitHub ini ke **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages**.
2. Konfigurasi build setting:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Tambahkan **Environment Variables** (lihat bagian berikutnya).
4. Domain kustom: Masukkan `ppjauharulmaknuun.sch.id` pada tab **Custom domains**.

---

## 9. VARIABEL LINGKUNGAN (ENVIRONMENT VARIABLES)

Buat file `.env` di root project:

```env
# Supabase Configuration (Wajib)
VITE_SUPABASE_URL=https://gzijnybcmhectajfkdtd.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Analytics & Monitoring
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

**Penting:** Jangan pernah mengunggah file `.env` yang berisi nilai sebenarnya ke repositori Git. File `.env` sudah tercantum di `.gitignore`.

---

## 10. KREDENSIAL DEFAULT & AKUN BAWaan

Sistem telah dilengkapi akun bawaan terstandarisasi untuk 9 tingkatan hak akses (Role-Based Access Control / RBAC) yang tersimpan aman pada Supabase Auth (`auth.users`) dan tabel `public.admin_profiles`:

| Peran (Role) | Default Email / Username | Default Password | Nama Pengguna / NIP-NIS | Deskripsi Wewenang & Hak Akses |
|--------------|-------------------------|------------------|-------------------------|-------------------------------|
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
> 2. Seluruh kolom token (`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new`, `phone_change`, dll.) **wajib** diinisialisasi dengan string kosong `''` dan **TIDAK BOLEH `NULL`**.
> Engine GoTrue (Go backend) menggunakan tipe data `string` primitif pada struct scanner database. Nilai `NULL` akan memicu error `sql: Scan error on column confirmation_token: converting NULL to string is unsupported` dan menghasilkan respons palsu `Invalid login credentials`. Skrip `20261025_seed_credentials.sql` telah diamankan dengan aturan ini.

---

## 10. CONTRIBUTING & LISENSI

### Contributing
1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan Anda (`git commit -m 'feat: tambahkan fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

### Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 📞 Kontak

**Pondok Pesantren Jauharul Maknuun**  
Lasem, Sidayu, Kabupaten Gresik, Jawa Timur  
**Email:** admin@ppjauharulmaknuun.sch.id  
**WhatsApp Admin:** +62 812-3456-7890  
**Website:** https://ppjauharulmaknuun.sch.id/

---

> Terakhir diperbarui: 5 November 2026  
> Versi aplikasi: 1.0.0  
> Bahasa: Bahasa Indonesia  
> Stack: React 19 + TypeScript + Supabase + Tailwind CSS v4