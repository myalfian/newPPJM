# Arsitektur Multi-Item CMS & Public Pages PP. Jauharul Maknuun

> **Sistem Arsitektur Universal Multi-Item untuk 24 Section PPJM**  
> Dibuat: 1 November 2026  
> Standar: Senior Enterprise Architecture, Security & Hardening, UI/UX Pro Max

---

## 1. Latar Belakang & Masalah Sebelumnya
Sebelum refactor ini:
1. Banyak komponen admin dan publik mengandalkan state lokal (`useState`) yang kembali ke seed statis saat browser di-refresh.
2. Beberapa section dibatasi hanya 1 item tunggal (single form) atau jumlah tetap (fixed cards).
3. Pengurus atau asatidz tidak bisa menambah kategori dinamis baru secara fleksibel tanpa mengubah kode sumber.

---

## 2. Universal Schema & Sub Items Master

Tabel `public.sub_items` di Supabase telah diimplementasikan sebagai master universal dengan skema:

```sql
CREATE TABLE public.sub_items (
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
```

### Seeding Master Sub-Items:
- `keunggulan_items`: 4 Pilar Keunggulan Utama (Tahfidz, Sains & STEM, Bilingual Mandarin & Arab, Karakter Salaf).
- `facilities_categories`: Kategori fasilitas santri (Asrama, Ruang Kelas, Laboratorium, Masjid, Olahraga).
- `prestasi_categories`: Tahfidz & Keagamaan, Akademik & Sains, Olahraga, Seni & Bahasa.
- `prestasi_levels`: Internasional, Nasional, Provinsi, Kabupaten/Karesidenan.
- `ekskul_categories`: Sains & Robotika, Olahraga, Seni & Budaya Islam, Bahasa & Public Speaking, Kepanduan.
- `osis_departments`: Ketaqwaan, Kedisiplinan, Kreativitas, Olahraga, Humas.
- `osis_levels`: Majelis Pembina OSIS (MPO), Pengurus Inti, Koordinator Departemen, Anggota.
- `berita_categories`: Kabar Pesantren, SMP Plus, Madrasah Diniyah, Opini Asatidz, Pengumuman Resmi.
- `galeri_albums`: Haflah & Wisuda, Kegiatan Sains & STEM, Rutinitas Ibadah, Kunjungan Lapangan.
- `agenda_categories`: Akademik Sekolah, Kegiatan Pondok, SPMB, Hari Besar Islam.
- `agenda_routine_types`: Harian, Mingguan, Bulanan, Tahunan.
- `navbar_items`: 9 Pilar Navigasi Utama.
- `bottom_nav_items`: 5 Hub Navigasi Mobile.

---

## 3. Komponen `MultiSectionBuilder.tsx`
Komponen generic cerdas dengan kemampuan:
1. **DND Reorder**: Integrasi `@dnd-kit/core` & `@dnd-kit/sortable` untuk drag and drop urutan item secara visual, langsung meng-update `order_index` di Supabase.
2. **Kategori Dinamis**: Dukungan filter kategori dan modal instan "Tambah Kategori Baru" langsung ke tabel `sub_items`.
3. **Editor Word TipTap Terintegrasi**: Menggunakan `SectionWordEditor` untuk teks kaya (bold, italic, list, headings, quotes).
4. **Unggah Foto WebP Otomatis**: Gambar dikompresi langsung di browser menjadi WebP berukuran ringan sebelum diunggah ke Supabase Storage.
5. **Realtime Postgres Subscription**: Sinkronisasi instan antar tab admin dan tampilan publik tanpa perlu refresh halaman (F5).
6. **Audit Trail**: Mencatat setiap aksi `CREATE`, `UPDATE`, dan `DELETE` ke tabel `audit_logs`.
7. **Single-Featured Enforcer**: Memastikan flag unggulan utama hanya berlaku tunggal untuk scope beranda.

---

## 4. Section yang Telah Dimigrasi ke Multi-Item

| Modul Section | Tabel Supabase | Parent Module / Kategori | Fitur Reorder / Featured |
| :--- | :--- | :--- | :--- |
| **Sambutan Pimpinan** | `sambutan_persons` | Multiple Leaders | Order Up/Down, Featured Hero + Grid |
| **Pilar Keunggulan** | `sub_items` | `keunggulan_items` | Drag & Drop Reorder, Dynamic 1-4 Grid |
| **Fasilitas Santri** | `facilities` | `facilities_categories` | Reorder, Kategori Dinamis |
| **Menu Akses Cepat** | `quick_menus` | - | Reorder, Realtime |
| **Navigasi Navbar** | `sub_items` | `navbar_items` | Reorder, Dynamic Badges |
| **Navigasi BottomBar**| `sub_items` | `bottom_nav_items` | Reorder, Dynamic Icons |
| **Lembaga Pendidikan** | `institutions` | Unit Categories | Reorder, Featured |
| **Gelombang SPMB** | `spmb_info` | - | Reorder, Active / Inactive |
| **Prestasi Santri** | `prestasi` | `prestasi_categories` & `levels` | Reorder, Level & Kategori Chips |
| **Ekstrakurikuler** | `ekskul` | `ekskul_categories` | Reorder, Dynamic Category Filter |
| **OSIS Santri** | `osis_structure` | `osis_departments` & `levels` | Multi Tab, Reorder, Realtime |
| **Warta & Berita** | `berita` | `berita_categories` | Pinned, Categories, Realtime |
| **Galeri Foto/Video** | `galeri_foto` | `galeri_albums` | Album Filter, WebP Compression |
| **Kalender Agenda** | `agendas` | `agenda_categories` & `routines` | Routine Types, Reorder |

---

## 5. Integrasi WebVisualEditor
Di `src/pages/admin/WebVisualEditor.tsx`:
- Tambahan kontrol section **Multi Pemberi Sambutan** (displayMode, toggle gelar, toggle kutipan, slider jumlah maksimal di beranda).
- Tambahan kontrol section **Multi Pilar Keunggulan** (mode grid kolom otomatis, shortcut kelola pilar).
- Tambahan kontrol section **Multi Quick Menu** (shortcut kelola menu cepat).
- Semua kontrol tersimpan secara persisten ke Supabase draft/published state.

