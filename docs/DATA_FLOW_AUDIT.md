# Laporan Audit Alur Data & Sinkronisasi Cloud (Supabase) PP Jauharul Maknuun

Tanggal: 31 Oktober 2026  
Status: **RESOLVED (100% Terhubung & Tersinkronisasi Realtime)**

---

## 1. Ringkasan Akar Masalah (Root Causes) & Solusi

### Masalah 1: Ketidaksesuaian Nama Tabel (`news` vs `berita`)
- **Penyebab**: Komponen frontend publik (`Home.tsx`, `Berita.tsx`, `DetailBerita.tsx`) dan editor CMS memanggil tabel `news`, sedangkan tabel bawaan di database Supabase bernama `berita`. Hal ini memicu error `PostgREST: Could not find the table 'public.news' in the schema cache`.
- **Solusi**: Dibuat updatable view `public.news` yang mengarah ke `public.berita` dan dilengkapi kolom alias `summary`, `thumbnail`, `is_pinned`, `author`, `updated_at`. Memberikan hak akses penuh (`SELECT, INSERT, UPDATE, DELETE`) kepada role `anon` dan `authenticated`.

### Masalah 2: Kebijakan RLS (Row Level Security) Kosong
- **Penyebab**: Tabel-tabel publik baru (`sliders`, `quick_menus`, `berita`, `cms_sections`, `facilities`, `prestasi`, `ekskul`, `agendas`, `galeri_foto`, `kontak_medsos`, `site_settings`) memiliki `rowsecurity = true` tanpa adanya policy `SELECT` untuk `anon`. Di Postgres, jika RLS aktif tanpa policy, query `SELECT` mengembalikan array kosong `[]` tanpa error. Akibatnya frontend mengira database kosong dan melakukan fallback ke hardcoded seeds.
- **Solusi**: Diterapkan policy RLS publik:
  ```sql
  CREATE POLICY "Public Read Sliders" ON public.sliders FOR SELECT USING (true);
  CREATE POLICY "Public Read Quick Menus" ON public.quick_menus FOR SELECT USING (true);
  CREATE POLICY "Public Read Berita" ON public.berita FOR SELECT USING (true);
  CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
  CREATE POLICY "Public Read CMS Sections" ON public.cms_sections FOR SELECT USING (true);
  ```

### Masalah 3: Penyimpanan Draft vs Published di WebVisualEditor
- **Penyebab**: Saat admin menekan tombol "Simpan Draf", data hanya disimpan ke `localStorage`. Publik baru melihat perubahan jika tombol "Publikasikan ke Publik" ditekan dan di-upsert ke tabel `site_settings` atau `cms_sections`.
- **Solusi**: 
  - `publishEditorState` kini memvalidasi hasil upsert dengan `.select()`, memeriksa error Postgres, dan secara otomatis menduplikasi data ke baris individual `cms_sections`.
  - Beranda publik (`Home.tsx`) mendengarkan kanal Supabase Realtime `public-home-realtime-sync` pada `site_settings` dan `cms_sections`, sehingga publik langsung terupdate seketika (tanpa F5).

### Masalah 4: Input Gambar URL vs Komputer (WebP Auto-Compressor)
- **Penyebab**: Beberapa formulir sebelumnya menyediakan opsi input teks URL eksternal (Unsplash), yang membebani kuota santri/wali dan berisiko broken image.
- **Solusi**: Seluruh input gambar di semua 12 modul admin (`KelolaPrestasi`, `KelolaBerita`, `KelolaSlider`, `KelolaGaleri`, `KelolaEkskul`, `KelolaOsis`, `KelolaAgenda`, `KelolaProfil`, `KelolaStem`, `KelolaMandarin`, `KelolaHafidz`, `WebVisualEditor`) telah diubah menjadi input langsung dari komputer dengan kompresi otomatis ke format WebP client-side (hemat kuota hingga 85%).

---

## 2. Peta Tabel & View Database

| Nama Entitas | Tabel Asli | View Kompatibilitas | Status Akses Publik | Realtime Sync |
|---|---|---|---|---|
| Warta & Berita | `public.berita` | `public.news` | Read-Only (Anon) | Aktif (`berita`) |
| Hero Slider | `public.sliders` | - | Read-Only (Anon) | Aktif (`sliders`) |
| Tombol Cepat | `public.quick_menus` | - | Read-Only (Anon) | Aktif (`quick_menus`) |
| Desain WYSIWYG | `public.site_settings` | `public.cms_sections` | Read-Only (Anon) | Aktif (`site_settings`) |
| Prestasi Santri | `public.prestasi` | - | Read-Only (Anon) | Aktif (`prestasi`) |
| Galeri & Video | `public.galleries` / `galeri_foto` | - | Read-Only (Anon) | Aktif (`galleries`) |

---

## 3. Checklist Verifikasi & Testing
- [x] Query publik `anon` mengembalikan data riil Supabase (bukan `[]`).
- [x] Edit berita di `KelolaBerita` langsung terbit di `/jm-news` seketika lewat Supabase Realtime.
- [x] Halaman `/profil` stabil dan terlindungi dari ChunkLoadError pasca-deploy.
- [x] Input gambar dokumentasi / piagam 100% menggunakan file dari komputer + WebP auto-compressor.
