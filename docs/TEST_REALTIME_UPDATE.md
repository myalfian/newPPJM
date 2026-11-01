# Panduan Pengujian End-to-End Realtime & Verifikasi Supabase
## Pondok Pesantren Jauharul Maknuun (PPJM)

Dokumen ini merupakan panduan komprehensif bagi tim QA, Developer, dan Administrator untuk memvalidasi bahwa seluruh komponen CMS admin telah terhubung 100% ke database Supabase Cloud, tersinkronisasi via Supabase Realtime tanpa jeda, tidak kembali ke data seed saat browser di-refresh (F5), dan seluruh upload foto dikompresi otomatis ke format WebP hemat kuota.

---

### 1. Arsitektur Sinkronisasi Realtime

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│       ADMIN PANEL (EDITOR)           │       │          PUBLIC WEBSITE              │
│  - /admin/sambutan                   │       │  - / (Home: Sambutan & Slider)       │
│  - /admin/slider                     │       │  - /jm-center/sambutan               │
│  - /admin/berita                     │       │  - /jm-news                          │
│  - /admin/prestasi                   │       │  - /prestasi                         │
│  - /admin/galeri                     │       │  - /galeri                           │
│  - /admin/ekskul                     │       │  - /ekstrakurikuler                  │
│  - /admin/osis                       │       │  - /osis                             │
│  - /admin/agenda                     │       │  - /agenda                           │
│  - /admin/kontak                     │       │  - BottomNav MedsosModal (7 Kanal)   │
└──────────────────┬───────────────────┘       └──────────────────▲───────────────────┘
                   │                                              │
           1. UPSERT + SELECT                             3. POSTGRES_CHANGES
                   │                                      (Broadcast Event)
                   ▼                                              │
      ┌───────────────────────────────────────────────────────────┴┐
      │            SUPABASE CLOUD (gzijnybcmhectajfkdtd)          │
      │  - publication: supabase_realtime (REPLICA IDENTITY FULL)  │
      │  - tables: sambutan_persons, sliders, facilities, berita,  │
      │            prestasi, ekskul, osis_structure, agendas,      │
      │            kontak_medsos, site_settings, audit_logs        │
      │  - storage: 9 buckets publik                              │
      └────────────────────────────────────────────────────────────┘
```

---

### 2. Prosedur Uji Sambutan Mudir (Kasus Utama)

#### A. Langkah Uji di Admin:
1. Buka browser dan login ke admin: `https://ppjauharulmaknuun.sch.id/admin/sambutan`
2. Pada form **Identitas Tokoh & Amanah**:
   - Ganti Nama: Contoh `KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I. (Updated Live)`
   - Ganti Kutipan: Contoh `"Mencetak generasi rabbani berjiwa santri dan berwawasan teknologi modern."`
3. Pilih foto dari komputer: File JPG atau PNG akan otomatis dikompresi ke **WebP** dengan status badge hijau *(Hemat ~60-80% kuota)*.
4. Klik tombol **Simpan Sambutan Mudir**.
5. Amati toast sukses: *"Sambutan Mudir berhasil disimpan ke Supabase Cloud & tersinkronisasi publik!"*

#### B. Langkah Uji di Halaman Publik (Tanpa Refresh):
1. Buka tab browser kedua (atau perangkat lain) pada halaman beranda: `https://ppjauharulmaknuun.sch.id/`
2. Amati section **Kalam Pengasuh & Sambutan Mudir**: Data yang baru diubah di admin langsung berubah secara **realtime** tanpa perlu reload halaman.
3. Buka juga rute: `https://ppjauharulmaknuun.sch.id/jm-center/sambutan`
4. Lakukan **Hard Refresh (Ctrl + F5)** pada kedua halaman publik tersebut.
5. **Kriteria Sukses**: Data tetap menampilkan teks dan foto hasil editan admin, **TIDAK KEMBALI KE SEED AWAL**.

---

### 3. Prosedur Uji Modul Admin Lainnya

| Modul Admin | Rute Admin | Halaman Publik Terkait | Tabel Supabase | Channel Realtime |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Slider** | `/admin/slider` | `/` (Hero Carousel) | `sliders`, `site_settings` | `public-hero-slider-realtime` |
| **Profil & Fasilitas** | `/admin/profil` | `/jm-center/fasilitas` | `facilities`, `sub_items` | `realtime-facilities-sync` |
| **Warta & Berita** | `/admin/berita` | `/jm-news`, `/berita/:slug` | `berita`, `news` | `realtime-berita-news-sync` |
| **Prestasi Santri** | `/admin/prestasi` | `/prestasi` | `prestasi`, `achievements` | `realtime-prestasi-achievements-sync` |
| **Galeri Foto/Video** | `/admin/galeri` | `/galeri/foto`, `/galeri/video` | `galeri_foto`, `galeri_videos` | `realtime-galeri-sync` |
| **Ekstrakurikuler** | `/admin/ekskul` | `/ekstrakurikuler` | `ekskul`, `extracurriculars` | `realtime-ekskul-sync` |
| **Organisasi OSIS** | `/admin/osis` | `/osis` | `osis_structure`, `osis_programs` | `realtime-osis-sync` |
| **Agenda Pesantren** | `/admin/agenda` | `/agenda` | `agendas` | `realtime-agendas-sync` |
| **Kontak & Medsos** | `/admin/kontak` | `MedsosModal` (BottomNav) | `kontak_medsos`, `site_settings` | `realtime-medsos-modal-public` |

---

### 4. Verifikasi Otomatis WebP Image Compressor

Setiap komponen yang menyediakan tombol unggah gambar dari komputer (`SmartImageDropzone` atau `<input type="file" accept="image/*">`) terintegrasi dengan modul `src/lib/imageCompressor.ts`:

1. **Format Input**: Mendukung JPEG, JPG, PNG, GIF, BMP, TIFF, WebP.
2. **Keluaran**: Format WebP standar dengan parameter kompresi adaptif (max dimension 1200-1400px, quality 0.82-0.85).
3. **Pengecekan di DevTools**:
   - Buka DevTools > Tab Network > Filter `Img`.
   - Amati file yang dimuat berakhiran `.webp` atau berawalan `data:image/webp;base64,...`.
   - Ukuran payload berkurang drastis dari rata-rata 3MB menjadi 50KB - 180KB.
   - Tidak ada lagi input manual link URL Unsplash di formulir admin.

---

### 5. Audit Log Keamanan & RLS

Setiap operasi penyimpanan data (`INSERT`, `UPDATE`, `DELETE`) secara otomatis dicatat ke tabel `audit_logs` dengan struktur:
- `user_id`: UUID pengguna Supabase Auth yang sedang login.
- `email`: Email admin operator (`admin@ppjauharulmaknuun.sch.id`).
- `role`: Role keamanan aktif (`super_admin`).
- `action`: Jenis aksi (`UPDATE` / `INSERT` / `DELETE`).
- `module`: Nama modul yang dimodifikasi.
- `section_id`: ID baris data yang diubah.
- `new_data`: JSON payload data baru.
- `created_at`: Timestamp standar ISO 8601 UTC.

Jika user non-admin atau anon mencoba melakukan modifikasi langsung ke Supabase tanpa credential yang sah, RLS Policy akan menolak dengan error code `42501` (permission denied).

---

### 6. Checklist Sebelum Go-Live Production

- [x] RLS diaktifkan pada seluruh tabel utama.
- [x] Kebijakan `Public Read` (SELECT) diizinkan untuk semua pengunjung publik.
- [x] Kebijakan `Admin Write` (INSERT, UPDATE, DELETE) dikunci hanya untuk `authenticated` role.
- [x] 23 Tabel terdaftar pada publikasi `supabase_realtime` dengan `REPLICA IDENTITY FULL`.
- [x] 9 Supabase Storage buckets berstatus `public = true`.
- [x] Pembersih cache usang (`clearOldCache.ts`) berjalan otomatis saat aplikasi dimuat.
- [x] Kompilasi TypeScript dan bundler Vite bersih tanpa error (`npm run build` sukses).
- [x] Konfirmasi: Edit di Admin ➔ Supabase Terupdate ➔ Publik Live Realtime ➔ Refresh F5 Tidak Balik Seed.
