# Web Platform & Zero-IT CMS Pondok Pesantren Jauharul Maknuun (PPJM)
### Lasem, Sidayu, Kabupaten Gresik, Jawa Timur
Domain Produksi: **https://ppjauharulmaknuun.sch.id/**

---

## 📌 Ringkasan Proyek
Web platform modern, ultra-responsif, aman, dan ringan untuk **Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**, dioptimalkan khusus untuk arsitektur hosting **Cloudflare Pages** dan backend **Supabase (PostgreSQL + RLS)**.

Dilengkapi dengan:
1. **Material Design 3 & Identitas Resmi**:
   - Logo vektor resmi PPJM (kubah & menara hijau, Al-Qur'an emas terbuka, bintang kembar, teks melingkar).
   - Palet warna Islami terstandar: Islamic Emerald Green (`#0F5132`), Sunlit Gold (`#D4AF37`), dan Elevated Surface Cards.
   - Micro-interaction berbasis pegas Android Material 3 (`damping: 28, stiffness: 300`).
   - Mobile touch target minimal 48x48px dan iOS safe-area handling (`env(safe-area-inset-bottom)`).
2. **Navigasi & Halaman Lengkap**:
   - **JM Center**: Sambutan Pengasuh Mudir KH. M. Jauharul Maknuun, Sejarah Milestone Timeline, Visi & Misi 3D, Badan Otonom & Lembaga.
   - **Program Unggulan**: Amaliyah & Wirid Rutin Santri (Jadwal 24 jam), Program Sekolah Terpadu, Madrasah Diniyah Salafiyah (Jurumiyah, Imrithi, Alfiyah, Fathul Qorib).
   - **Smart JM (Fitur Interaktif)**:
     - **Hafidz Quran 30 Juz**: Mushaf digital online standar Kemenag RI, terjemahan Indonesia, pemutar audio murottal per ayat (Misyari Rasyid Al-Afasy), dan bookmark ayat.
     - **Murojaah AI Santri**: Asisten hafalan mandiri berbasis Web Speech Recognition (`ar-SA`) dengan deteksi lafadz suara real-time, pencocokan teks otomatis, serta perekam suara & visualizer gelombang audio.
     - **STEM Area**: Silabus materi, lembar tugas praktikum PDF, form serah tugas online santri, dan showcase portofolio inovasi (IoT penyiram tanaman, purifier air sumur nanofiltrasi).
     - **Mandarin Class**: Modul kosakata, naskah percakapan santri, audio pelafalan Pinyin Putonghua, dan kuis gamifikasi interaktif dengan skor instan serta efek confetti.
   - **Prestasi & Ekskul**: Filter prestasi per tahun & kategori, direktori Hadrah Banjari, Pagar Nusa, Robotika, dll.
   - **Galeri Agenda**: Dokumentasi foto dengan modal slider dan video profil YouTube/Reels/TikTok.
3. **CMS "Ramah Gaptek" (`/admin`)**:
   - UI Bahasa Indonesia lugas ala Google Workspace.
   - Fitur otomatis: foto yang diseret/diunggah otomatis dikompres ke format **WebP** ringan di browser sebelum masuk storage (menghemat kuota & ruang simpan hingga 85%).
   - Editor teks mirip WhatsApp/Word (*tebal*, _miring_, poin).
   - Tombol publikasi 1-klik: "Kirim Info ke WhatsApp Wali Santri" (membuat format pesan WhatsApp tebal, rapi, dan tautan resmi secara instan).
4. **Keamanan & Isolasi Role (Supabase PostgreSQL + RLS)**:
   - ENUM Roles: `super_admin`, `pengurus_konten`, `guru_akademik`, `public`.
   - Kebijakan Row Level Security (RLS) ketat pada seluruh tabel.
   - Proteksi bot pada form login dengan Cloudflare Turnstile.

---

## 🚀 Panduan Menjalankan di Komputer Lokal

1. **Pastikan Node.js (v18+) telah terpasang.**
2. **Install Dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:5173/`.

4. **Uji Build Produksi:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🗄️ Panduan Konfigurasi Supabase Backend

1. Buka dashboard [Supabase](https://supabase.com/) dan buat proyek baru (misal: `ppjm-backend`).
2. Masuk ke menu **SQL Editor** pada dashboard Supabase Anda.
3. Salin dan jalankan isi file:
   - `supabase/schema.sql`: Membuat tabel, tipe ENUM `user_role`, fungsi pengecekan hak akses, dan kebijakan RLS.
   - `supabase/seed.sql`: Memasukkan data autentik awal profil pesantren, santri, materi STEM, dan kuis Mandarin.
4. Buat Storage Bucket di menu **Storage** dengan nama: `ppjm-media` (set Public Bucket agar gambar dapat dibaca oleh publik).
5. Buka menu **Project Settings -> API**, salin `Project URL` dan `anon / public key`.
6. Buat file `.env` di folder proyek ini (berdasarkan `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

---

## ☁️ Panduan Deployment ke Cloudflare Pages

Proyek ini telah dilengkapi file `public/_headers` dan `public/_redirects` untuk menjamin performa Edge CDN dan routing SPA yang sempurna di Cloudflare Pages.

### Metode 1: Hubungkan ke GitHub (Rekomendasi Otomatis)
1. Push repositori ini ke akun GitHub Anda.
2. Buka dashboard [Cloudflare](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Pilih repositori `NewPPPJM`.
4. Konfigurasi build setting:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Klik **Save and Deploy**. Situs Anda akan live dalam waktu < 1 menit!

### Hubungkan Domain Resmi Pesantren
1. Di dashboard Cloudflare Pages proyek Anda, klik tab **Custom domains**.
2. Masukkan domain `ppjauharulmaknuun.sch.id`.
3. Cloudflare akan secara otomatis mengaktifkan sertifikat SSL/TLS gratis, proteksi DDoS, dan HTTP/3.

---

## 👥 Penggunaan Portal Admin (`/admin`)

- Kunjungi `https://ppjauharulmaknuun.sch.id/admin`.
- Pada tahap awal/demo, Anda dapat menggunakan tombol **Masuk Cepat** berdasarkan tugas:
  - **Super Admin**: Hak akses menyeluruh.
  - **Pengurus Konten**: Khusus mengelola Warta, Agenda Foto, dan Video.
  - **Guru Akademik**: Khusus mengelola Modul Sains STEM dan Kelas Mandarin.
