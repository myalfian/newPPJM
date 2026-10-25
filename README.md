# Web Platform & Zero-IT CMS Pondok Pesantren Jauharul Maknuun (PPJM)
### Lasem, Sidayu, Kabupaten Gresik, Jawa Timur
Domain Produksi: **https://ppjauharulmaknuun.sch.id/**  
Backend API: **https://gzijnybcmhectajfkdtd.supabase.co**

---

## 📌 Ringkasan Proyek
Web platform modern, ultra-responsif, aman, dan ringan untuk **Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**, dioptimalkan khusus untuk arsitektur hosting **Cloudflare Pages** dan backend **Supabase (PostgreSQL 17 + Row Level Security)**.

Dilengkapi dengan:
1. **Material Design 3 & Modern-Lux Aesthetics**:
   - Logo vektor resmi PPJM (kubah & menara hijau, Al-Qur'an emas terbuka, bintang kembar, teks melingkar).
   - Palet warna Islami terstandar: Islamic Emerald Green (`#0F5132`), Sunlit Gold (`#D4AF37`), Deep Titanium & Elevated Surface Cards.
   - Micro-interaction fluid springs (`active:scale-[0.98]`, ambient soft shadows, dynamic viewport `min-h-dvh`).
   - Mobile touch target minimal 44x44px dan iOS safe-area handling (`env(safe-area-inset-bottom)`).
2. **Navigasi & Fitur Lengkap**:
   - **JM Center**: Sambutan Pengasuh Mudir KH. M. Jauharul Maknuun, Sejarah Milestone Timeline, Visi & Misi, Badan Otonom & Lembaga.
   - **Program Unggulan**: Amaliyah & Wirid Rutin Santri (Jadwal 24 jam), Program Sekolah Formal Terpadu, Madrasah Diniyah Salafiyah (Jurumiyah, Imrithi, Alfiyah, Fathul Qorib).
   - **Smart JM (Fitur Interaktif)**:
     - **Hafidz Quran 30 Juz**: Mushaf digital online standar Kemenag RI, terjemahan Indonesia, pemutar audio murottal per ayat, dan bookmark ayat.
     - **Murojaah AI Santri**: Asisten hafalan mandiri berbasis Web Speech Recognition (`ar-SA`) dengan deteksi lafadz suara real-time, pencocokan teks otomatis, serta perekam suara & visualizer gelombang audio.
     - **STEM Area**: Silabus materi, lembar tugas praktikum PDF, form serah tugas online santri, dan showcase portofolio inovasi (IoT penyiram hidroponik ESP32, purifier air sumur nanofiltrasi).
     - **Mandarin Class**: Modul kosakata, naskah percakapan santri, audio pelafalan Pinyin Putonghua, dan kuis gamifikasi interaktif dengan skor instan serta efek confetti.
   - **Prestasi & Ekskul**: Filter prestasi per tahun & kategori, direktori Hadrah Banjari, Pagar Nusa, Robotika, Klub Bahasa Arab & Mandarin.
   - **Galeri Agenda**: Dokumentasi foto kegiatan dengan modal slider dan video profil sinematik YouTube.
   - **Agenda Santri**: Manajemen agenda bulanan terintegrasi dengan filter status *Historical*, *Current*, dan *Future*.

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
> Pada halaman login (`/admin/login` atau `/login`), tersedia tombol **Autofill 1-Klik** untuk masing-masing peran di atas guna mempermudah pengujian alur otentikasi. Seluruh akun telah diverifikasi aktif (**200 OK**) pada live Supabase Auth API.

> [!IMPORTANT]
> **Catatan Teknis Seeding Akun Supabase Auth (GoTrue Invariant)**:  
> Saat melakukan injeksi akun manual langsung ke tabel `auth.users` via SQL:
> 1. Field `instance_id` **wajib** disetel ke UUID `'00000000-0000-0000-0000-000000000000'`.
> 2. Seluruh kolom token (`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new`, `phone_change`, dll) **wajib** diinisialisasi dengan string kosong `''` dan **TIDAK BOLEH `NULL`**.  
> Engine GoTrue (Go backend) menggunakan tipe data `string` primitif pada struct scanner database. Nilai `NULL` akan memicu error `sql: Scan error on column confirmation_token: converting NULL to string is unsupported` dan menghasilkan respon palsu `Invalid login credentials`. Skrip `20261025_seed_credentials.sql` telah diamankan dengan aturan ini.

---

## 🌐 Daftar Endpoint & Rute Profile Pages

| Endpoint URL | Target Pengguna | Fitur & Aksesibilitas |
| :--- | :--- | :--- |
| `/profil` atau `/profile` | Seluruh Pengguna (Santri, Pengurus, Wali Santri, Publik) | Halaman profil mandiri adaptif (Mobile-first, Tablet 2-kolom, Desktop 3-panel). Menampilkan metadata spesifik peran, capaian santri, kartu kesehatan akun, serta tombol aksi cepat. |
| `/admin/akun` | Pengurus & Guru Terautentikasi (`super_admin`, `pengurus_konten`, `guru_akademik`) | Terintegrasi langsung di dalam sidebar dan topbar Admin CMS Layout. Dilengkapi matriks wewenang keamanan dan pemantauan tabel database. |
| `/admin/login` atau `/login` | Pengurus Pondok & Santri | Portal masuk dengan proteksi Cloudflare Turnstile, peringatan status environment, dan autofill kredensial 4 peran. |

---

## 🛠️ Fitur Modul Profil & Navigasi Interaktif

1. **Perbarui Data Profil (Edit Profile Modal)**:
   - Formulir responsif: Nama Lengkap & Gelar, NIP/NIS, Departemen/Kelas, Nomor WhatsApp, dan Biografi Khidmah.
   - Pengecekan validasi sanitasi di sisi klien & server (`updateProfile`).
   - Ukuran font input 16px untuk mencegah *auto-zoom* otomatis di peramban iOS Safari.
   - Touch target minimal 44x44px dengan umpan balik mikro `active:scale-[0.98]`.
2. **Pemilih & Kompresor Avatar (Avatar Picker Modal)**:
   - 6 Pilihan Preset Resmi Resolusi Tinggi (Kiai/Pimpinan, Ustadz Humas, Guru Sains, Santriwan, Santriwati, Logo PPJM).
   - Fitur unggah foto kustom dengan **Auto-WebP Compression** di browser (mengurangi ukuran file hingga 85% sebelum tersimpan).
3. **Ganti Kata Sandi (Change Password Modal)**:
   - Modal terisolasi dengan verifikasi kata sandi lama, baru, dan konfirmasi.
   - **Password Strength Meter**: Pengukur entropi real-time dengan 4 indikator visual (*Lemah*, *Sedang*, *Kuat*, *Sangat Kuat*).
   - Eksekusi aman melalui Supabase Auth API (`supabase.auth.updateUser`).
4. **Indikator Kesehatan Akun & Keamanan (Security Health Card)**:
   - Status otentikasi sesi JWT aktif.
   - Pemantauan status Row Level Security (RLS) PostgreSQL.
   - Rekomendasi keamanan dan audit log.
5. **Interactive Quick Role Switcher**:
   - Menguji tampilan dan hak akses keempat peran secara langsung dalam satu klik tanpa perlu keluar-masuk manual.
6. **Mobile Bottom Navigation & Agenda Santri**:
   - Tab "Agenda" menggantikan navigasi statis pada mobile viewport dengan filter dinamis: *Historical*, *Current*, dan *Future*.
   - Standarisasi lebar kontainer konten pada seluruh halaman (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) untuk konsistensi visual 100%.
   - Penyelarasan animasi tab pill & glassmorphic highlight antara halaman SMART JM dan Prestasi.

---

## 🗄️ Panduan Eksekusi Seed Database (Supabase / PostgreSQL)

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
