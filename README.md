# Platform Web & Sistem Manajemen Terpadu PPJM
### Pondok Pesantren Jauharul Maknuun & SMP Plus Jauharul Maknuun
**Lasem, Sidayu, Kabupaten Gresik, Jawa Timur**  
**Domain Resmi:** `https://ppjauharulmaknuun.sch.id/`  
**Status Proyek:** Production Ready | TypeScript: Strict Mode Clean | Build: Passing  

---

## 📋 Daftar Isi

1. [Ringkasan Arsitektur & Identitas Sistem](#1-ringkasan-arsitektur--identitas-sistem)
2. [Stack Teknologi & Library Inti](#2-stack-teknologi--library-inti)
3. [Struktur Folder & Kode Sumber](#3-struktur-folder--kode-sumber)
4. [Sistem Hak Akses 10 Role (RBAC Tiga Lapis)](#4-sistem-hak-akses-10-role-rbac-tiga-lapis)
5. [Struktur Sidebar & Navigasi Admin (6 Kelompok)](#5-struktur-sidebar--navigasi-admin-6-kelompok)
6. [Fitur Media & Pipeline Optimasi WebP](#6-fitur-media--pipeline-optimasi-webp)
7. [Skrip Pengembangan & Pembuatan Build](#7-skrip-pengembangan--pembuatan-build)
8. [Variabel Lingkungan (Environment Variables)](#8-variabel-lingkungan-environment-variables)
9. [Panduan Deployment (Cloudflare Pages / Vercel)](#9-panduan-deployment-cloudflare-pages--vercel)
10. [Kebijakan Keamanan & Kontribusi](#10-kebijakan-keamanan--kontribusi)

---

## 1. Ringkasan Arsitektur & Identitas Sistem

Platform web resmi terintegrasi yang melayani portal informasi publik, pendaftaran murid baru (SPMB), galeri multimedia beranimasi, modul pembelajaran STEM & Bahasa Mandarin, serta Content Management System (CMS) Zero-IT berbasis peran (RBAC).

| Parameter | Spesifikasi |
|---|---|
| **Lembaga** | Yayasan Pondok Pesantren Jauharul Maknuun (SMP Plus Jauharul Maknuun) |
| **Lokasi** | Lasem, Sidayu, Gresik, Jawa Timur |
| **Frontend Framework** | React 19 + TypeScript 5.8 (Strict Type Checking) |
| **Build & Bundler** | Vite 8 (Rolldown engine) |
| **Styling & Design Token** | Tailwind CSS v4, Lucide React, Framer Motion |
| **Rich Text Editor** | TipTap StarterKit |
| **BaaS & Basis Data** | Supabase (PostgreSQL 17 + GoTrue Auth + Row Level Security + Storage) |
| **Kontainer Tampilan** | Full Responsive (Mobile 375px, Tablet 768px, Desktop 1440px) |
| **Target Touch & A11y** | WCAG 2.1 AA Compliant, Touch targets ≥ 44×44 px, ARIA describedby |

---

## 2. Stack Teknologi & Library Inti

- **React 19 & React Router 7**: Komponen berbasis fungsi dengan hook modern, routing bersarang (`/`, `/admin/*`, `/guru/*`, `/santri/*`).
- **Tailwind CSS v4**: Utility-first CSS dengan palet warna resmi pesantren:
  - Deep Islamic Emerald: `#115E59` / `#0F5132`
  - Accent Luster Gold: `#D4AF37` / `#C8A951`
  - Canvas Neutral: `#FAF7F0` & Dark Canvas `#09090b`
- **Framer Motion**: Transisi halus, coverflow slider, dan lightbox modal interaktif.
- **Dnd Kit**: Drag-and-drop urutan konten admin tanpa reload.
- **Supabase JS**: Akses real-time ke tabel PostgreSQL dengan perlindungan Row Level Security (RLS) di lapisan database.

---

## 3. Struktur Folder & Kode Sumber

```
NewPPPJM/
├── public/                 # Aset statis publik (favicon, logo SVG, manifest)
├── src/
│   ├── admin/              # Panel Admin CMS & Editor CRUD Visual
│   │   ├── AdminLayout.tsx       # Sidebar 6 grup & top bar terpadu
│   │   ├── CrudEditor.tsx        # Editor generik + preview multi-device + WebP upload
│   │   ├── SliderSettingsPage.tsx# Pengaturan slider global (Super Admin)
│   │   ├── adminFieldGuides.ts   # Kamus panduan pengisian & tooltip aksesibel
│   │   ├── sections.tsx          # Konfigurasi metadata 30+ seksi/tabel
│   │   └── permissions.ts       # Matriks hak akses & guard izin
│   ├── components/         # Komponen reusable
│   │   ├── common/         # Navbar, BottomNav, CardImageSlider, UniversalLightboxModal, UserMenu
│   │   └── profile/        # Komponen profil pengguna dinamis
│   ├── hooks/              # Custom hooks (useAuth, useSliderSettings, useAdminSession)
│   ├── layouts/            # Layout utama (RootLayout)
│   ├── lib/                # Client Supabase, WebP converter, cache invalidation
│   ├── pages/              # Halaman web publik & portal role
│   │   ├── agenda/         # Kalender akademik & kegiatan terdekat
│   │   ├── ekskul/         # Direktori ekstrakurikuler
│   │   ├── jm-center/      # Profil, sambutan, visi-misi, sarana prasarana
│   │   ├── osis/           # Kabinet khidmah & program kerja OSIS
│   │   ├── prestasi/       # Katalog prestasi santri & piagam
│   │   ├── program/        # Program kepesantrenan & SMP Plus
│   │   ├── guru/           # Portal kerja & penilaian guru pengampu
│   │   ├── santri/         # Portal akademik & tugas santri
│   │   ├── Home.tsx        # Halaman utama beranda
│   │   └── KaryaSiswa.tsx  # Showroom buku, batik, dan karya santri
│   └── types/              # Deklarasi tipe TypeScript terpadu
├── supabase/
│   └── migrations/         # File migrasi SQL deklaratif PostgreSQL
├── package.json            # Daftar pustaka & dependensi
├── tsconfig.json           # Konfigurasi TypeScript compiler
└── vite.config.ts          # Konfigurasi build Vite & optimasi chunk
```

---

## 4. Sistem Hak Akses 10 Role (RBAC Tiga Lapis)

Hak akses ditegakkan secara menyeluruh pada 3 lapisan pertahanan (*defense-in-depth*):
1. **Lapisan UI**: Tombol aksi (tambah, edit, hapus, terbitkan) dan menu disaring sesuai kewenangan.
2. **Lapisan Aplikasi**: Router middleware memeriksa role pengguna sebelum merender halaman.
3. **Lapisan Basis Data**: PostgreSQL Row Level Security (RLS) menolak manipulasi data yang tidak sah secara langsung di level server.

### 10 Role Resmi Sistem:
1. `super_admin`: Akses penuh semua modul CMS, pengaturan slider global, manajemen akun user, dan matriks hak akses.
2. `yayasan`: Dewan Pembina & Pengawas Yayasan; supervisi laporan perkembangan akademik, profil santri, dan kelembagaan.
3. `kepsek`: Kepala SMP Plus Jauharul Maknuun; supervisi kurikulum sekolah, evaluasi guru, dan persetujuan nilai.
4. `guru`: Guru Pengampu Mata Pelajaran; mengelola tugas kelas, input materi kurikulum, dan penilaian portofolio.
5. `musyrif`: Pembina Asrama & Halaqah; pengawasan amaliyah santri, kedisiplinan diniyah, dan rekam hafalan Qur'an.
6. `santri`: Santriwati/Santriwan; portal penugasan mandiri, materi belajar, dan catatan prestasi pribadi.
7. `ppdb`: Panitia Penerimaan Murid Baru; verifikasi berkas pendaftaran calon santri dan kontak wali santri.
8. `keuangan`: Tim Administrasi & Kasir; pengelolaan biaya pendidikan, verifikasi infak/SPP, dan rekap keuangan.
9. `humas`: Hubungan Masyarakat; publikasi berita resmi, kalender agenda pesantren, dan media sosial.
10. `osis_pengurus`: Pengurus Organisasi Santri; dokumentasi kegiatan, struktur kabinet, dan program khidmah santri.

---

## 5. Struktur Sidebar & Navigasi Admin (6 Kelompok)

Sidebar admin dirancang secara ergonomis dengan navigasi yang dapat diciutkan (*collapsible*) dan otomatis menyembunyikan grup yang tidak memiliki akses untuk role yang sedang masuk:

1. **Pusat Kendali & Beranda**: Ringkasan Dashboard, Bulk Upload Media, Slider Beranda, Menu Cepat, Kontak Medsos, Sambutan Pimpinan, Profil Saya.
2. **Profil & Kelembagaan**: Data Lembaga, Visi Misi & Tujuan, Sejarah & Biografi, Pilar Keunggulan, Sarana & Fasilitas.
3. **Akademik, Diniyah & STEM**: Program Pondok, Program Sekolah, Foto Kegiatan Program, Flyer Madin, Ekstrakurikuler, Materi Mandarin, Kosakata Mandarin, Kuis Mandarin, LKPD STEM, Proyek STEM.
4. **Kesiswaan, Prestasi & OSIS**: Prestasi Santri, Kegiatan OSIS, Program OSIS, Struktur OSIS, Foto OSIS, Video OSIS, Dokumen OSIS, Naskah OSIS.
5. **Publikasi & Media Santri**: Warta Berita, Info Terkini (Ticker Bar), Kalender Agenda, Showroom Karya Siswa, Galeri Foto, Galeri Video.
6. **Pengaturan & Hak Akses**: Pengaturan Slider Global, Persetujuan User Baru, Permintaan Ganti Password, Info SPMB/PPDB, Master Data (Kelas, Jabatan, Mapel, Kategori, Sasaran, Lokasi), Kelola Akun Pengguna, Matriks Hak Akses.

---

## 6. Fitur Media & Pipeline Optimasi WebP

- **Tampilan Penuh Tanpa Terpotong**: Semua card foto, carousel, dan galeri menggunakan rasio kontainer tetap dengan `object-fit: contain` dan latar belakang netral (*letterbox*) sehingga foto vertikal maupun horizontal tampil utuh tanpa terpotong (*zero crop*).
- **Universal Lightbox Modal**: Klik foto manapun pada website membuka modal resolusi tinggi dengan navigasi multi-foto, tombol zoom (1x / 1.5x / 2x), touch swipe di layar sentuh, dan kontrol keyboard aksesibel.
- **Kompresi Otomatis WebP**: File foto kamera resolusi tinggi otomatis dikompresi di browser ke format `.webp` dengan resolusi maksimal 1600 px dan target ukuran file $\le 320\text{ KB}$ (menghemat ruang penyimpanan hingga 85%).
- **Sanitasi Metadata EXIF**: Proses konversi canvas otomatis membersihkan data lokasi kamera dan data sensitif perangkat.
- **Pembersihan File Orphan**: Penghapusan baris data atau foto slider secara otomatis memicu penghapusan berkas terkait di Supabase Storage (`cms-images`).

---

## 7. Skrip Pengembangan & Pembuatan Build

Jalankan perintah berikut di terminal:

```bash
# 1. Menjalankan server pengembangan lokal (HMR)
npm run dev

# 2. Melakukan pemeriksaan tipe TypeScript dan build produksi
npm run build

# 3. Menjalankan linter kode sumber
npm run lint

# 4. Melakukan pratinjau lokal hasil build produksi
npm run preview
```

---

## 8. Variabel Lingkungan (Environment Variables)

Buat file `.env` pada direktori root proyek:

```env
# URL Instance Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Kunci Anonim / Public API Key
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> [!WARNING]
> **Kebijakan Keamanan Kredensial**:
> Jangan pernah mencantumkan Service Role Key, kata sandi akun, atau rahasia database di dalam file `.env` frontend atau repositori publik. Seluruh akun pengguna harus dibuat melalui panel admin terverifikasi atau antarmuka otentikasi resmi.

---

## 9. Panduan Deployment (Cloudflare Pages / Vercel)

### Konfigurasi Cloudflare Pages
1. Hubungkan repositori GitHub ke **Cloudflare Dashboard** → **Compute (Workers & Pages)** → **Create Application** → **Pages**.
2. Pengaturan build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. Masukkan variabel lingkungan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` pada tab **Settings** → **Environment variables**.
4. Domain Kustom: Konfigurasikan CNAME `ppjauharulmaknuun.sch.id` pada tab **Custom domains**.

---

## 10. Kebijakan Keamanan & Kontribusi

- **Validasi Input**: Seluruh input teks dan form dibersihkan (*sanitized*) dari injeksi HTML/XSS menggunakan library DOMPurify dan TipTap Schema.
- **Kontribusi Kode**: Sebelum mengajukan Pull Request, pastikan menjalankan `npm run build` dan `npm run lint` untuk memastikan kelulusan *type checking* tanpa peringatan error.
- **Lisensi**: Hak cipta © 2026 Yayasan Pondok Pesantren Jauharul Maknuun. Dilindungi undang-undang.
