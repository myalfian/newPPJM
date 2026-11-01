# Arsitektur Multi Pemberi Sambutan (Multi Manager)
**Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**
*Dokumen Spesifikasi Teknis & Panduan Implementasi*
*Tanggal: 1 November 2026*

---

## 1. Ringkasan Eksekutif

Seksi Sambutan di portal PP. Jauharul Maknuun telah direfaktor dari sistem *single form* statis menjadi sistem **Multi Pemberi Sambutan (Multi Manager)** yang dinamis dan terintegrasi penuh ke database PostgreSQL Supabase.

Kini sistem mendukung berbagai profil pimpinan pesantren dan dewan yayasan:
1. **Mudir & Pengasuh Pesantren**: KH. Muhammad Jauharul Maknuun, Lc., M.Pd.I. (Featured / Tokoh Utama)
2. **Kepala Sekolah SMP Plus**: Ust. H. Ahmad Fauzi, S.Pd., M.Pd.
3. **Kepala Madrasah Diniyah Takmiliyah**: Ust. M. Sholihin, S.Ag., M.S.I.
4. **Ketua Yayasan Jauharul Maknuun**: Drs. H. Syamsul Huda, M.M.

---

## 2. Struktur Skema Database (`sambutan_persons`)

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Unique Identifier otomatis via `gen_random_uuid()` |
| `name` | `text` | Nama lengkap tokoh beserta gelar |
| `title` | `text` | Jabatan / amanah resmi di pesantren |
| `role_type` | `text` | Kategori peran (`pengasuh`, `asatidz`, `pimpinan`, dll) |
| `type` | `text` | Tipe kepengurusan (`pimpinan`, `dewan`, `pengurus`, `tamu`) |
| `quote` | `text` | Kutipan mutiara / pesan singkat (maksimal 150 karakter) |
| `message_short` | `text` | Ringkasan kalam untuk preview kartu beranda |
| `message_full` | `text` | Naskah lengkap sambutan (mendukung rich text formatting) |
| `photo_url` | `text` | URL publik foto tokoh di storage bucket `avatars` |
| `video_url` | `text` | Tautan video sambutan resmi YouTube |
| `social_links` | `jsonb` | Tautan media sosial (`wa`, `ig`, `email`, dll) |
| `credentials` | `text[]` | Array gelar akademik/pesantren (`Lc.`, `M.Pd.I.`, dll) |
| `achievements` | `text[]` | Array rekam jejak pengabdian & prestasi |
| `start_date` / `end_date` | `date` | Periode masa khidmah / jabatan |
| `location` | `text[]` | Array lokasi tayang (`home`, `jm-center`, `smp-plus`, `madin`, `yayasan`) |
| `order_index` | `integer` | Nomor urut tampilan di antarmuka publik |
| `is_active` | `boolean` | Status tayang aktif / nonaktif |
| `is_featured` | `boolean` | Status tokoh utama beranda (hanya 1 untuk `home`) |
| `created_by` / `updated_by` | `uuid` | Audit trail user pengubah |
| `created_at` / `updated_at` | `timestamptz` | Stempel waktu pembuatan & revisi |

---

## 3. Fitur Utama Panel Admin (`KelolaSambutan.tsx`)

Akses Rute: **`/admin/sambutan`** dan terintegrasi di **`/admin/profil`** (Tab Sambutan Mudir).

1. **Header Metrik & Statistik Real-time**:
   - Total Tokoh Terdaftar
   - Jumlah Tokoh Aktif Tayang
   - Status Tokoh Utama (Featured)
   - Jumlah Tokoh di Beranda Publik
2. **Pencarian & Multi-Filter**:
   - Pencarian instan berdasarkan nama, jabatan, atau naskah kalam.
   - Filter lokasi tayang: *Semua*, *Home*, *JM-Center*, *SMP Plus*, *Madin*, *Yayasan*.
   - Filter status: *Semua*, *Aktif*, *Nonaktif*, *Featured*.
3. **Manajemen Tabel & Aksi**:
   - Foto avatar 56px dengan fallback inisial huruf gradient.
   - Badges gelar akademik dan lokasi tayang per tokoh.
   - Switch toggle `is_active` langsung tersimpan ke Supabase tanpa modal.
   - Star button toggle `is_featured` (otomatis mereset tokoh featured lain di beranda agar selalu tunggal).
   - Tombol geser urutan posisi (Naik / Turun).
   - Aksi Duplikasi tokoh dan Hapus permanen dengan pencatatan `audit_logs`.
   - Bulk action: Pilih banyak tokoh untuk aktivasi massal atau hapus massal.
4. **Modal Form 2 Tab**:
   - **Tab 1: Informasi Tokoh & Media**:
     - Upload foto dengan validasi maksimal 2MB, format JPG/PNG/WebP, dan auto-kompresi WebP client-side.
     - Dropdown jabatan resmi PPJM + input manual fleksibel.
     - Tag input gelar (tekan Enter untuk menambah).
     - Checkbox multi lokasi tayang.
     - Toggle Featured dengan proteksi single-featured.
   - **Tab 2: Naskah Sambutan & Prestasi**:
     - Kutipan emas (max 150 karakter) dengan counter.
     - Editor naskah lengkap didukung toolbar Word (TipTap) dan sanitasi DOMPurify.
     - Tautan video YouTube dengan validasi.
     - Tag input rekam jejak prestasi tokoh.
     - Kontak resmi WhatsApp dan Email.

---

## 4. Tampilan Publik Beranda (`HomeSambutanMultiSection.tsx`)

Seksi sambutan pada Beranda (**`/`**) kini beroperasi dalam mode cerdas:

- **Featured Hero (Atas)**:
  - Menyajikan tokoh utama (Mudir Pengasuh) dengan foto ukuran besar rasio pas foto, lencana jabatan emas, gelar resmi, kutipan mutiara, dan ringkasan pesan.
  - Tombol interaktif *Baca Sambutan Lengkap* dan *Tonton Video* (membuka modal detail tanpa meninggalkan beranda).
- **Grid Pimpinan Unit (Bawah)**:
  - Kartu ringkas 2-3 kolom untuk pimpinan unit lainnya (Kepala SMP Plus, Kepala Madin, Ketua Yayasan).
  - Foto avatar lingkaran 80px, nama, jabatan, kutipan singkat, dan tombol *Lihat Sambutan*.
- **Modal Detail Sambutan**:
  - Modal interaktif yang menampilkan biografi lengkap, audio/video YouTube embed, naskah kalam penuh berformat rich-text, daftar rekam jejak dengan icon centang hijau, serta tombol *Bagikan ke WhatsApp* dan *Salin Tautan*.

---

## 5. Halaman Publik JM-Center (`SambutanSection.tsx`)

Akses Rute: **`/jm-center/sambutan`**.

- **Navigasi Filter Unit**: Tombol filter instan untuk menyaring sambutan berdasarkan unit: *Semua Unit*, *Pondok / Mudir*, *SMP Plus*, *Madrasah Diniyah*, *Yayasan*.
- **Kolom Pencarian Real-time**: Menemukan naskah atau tokoh secara cepat.
- **Tampilan Hero & Grid Komprehensif**: Menampilkan tokoh featured di bagian atas, disusul kartu pimpinan dengan opsi expand accordion atau membuka modal profil lengkap.

---

## 6. Kontrol Web Visual Editor (`WebVisualEditor.tsx`)

Blok Sambutan di Visual Editor Admin kini dilengkapi panel properti khusus:
1. **Mode Tampilan Beranda**: Pilihan antara *Featured Hero + Grid Pimpinan*, *Grid Semua Tokoh*, atau *Single Hero Tokoh Utama Saja*.
2. **Toggle Gelar & Kutipan**: Sakelar on/off untuk menampilkan atau menyembunyikan lencana gelar dan kutipan beraksen emas.
3. **Slider Batas Maksimal Tokoh**: Mengatur jumlah tokoh yang ditampilkan di beranda (1 sampai 8 tokoh).
4. **Tombol Pintas Manager**: Tombol *Buka Manager* yang langsung menavigasi ke `/admin/sambutan`.

---

## 7. Prosedur Pengujian & Verifikasi

1. **Uji Tambah Tokoh Baru**:
   - Buka `/admin/sambutan` -> Klik *Tambah Pemberi Sambutan*.
   - Masukkan nama, foto, jabatan, dan naskah sambutan.
   - Klik Simpan -> Notifikasi toast sukses muncul -> Tokoh baru langsung muncul di tabel dan live di web publik.
2. **Uji Toggle Featured**:
   - Klik ikon bintang (⭐) pada salah satu tokoh.
   - Sistem secara otomatis menonaktifkan status featured pada tokoh lain dan menetapkan tokoh terpilih sebagai pimpinan utama di beranda.
3. **Uji Sinkronisasi Real-time**:
   - Buka halaman beranda (`/`) pada tab penyamaran (incognito).
   - Ubah naskah atau status tokoh di panel admin.
   - Dalam 1-2 detik, tampilan di tab penyamaran otomatis terbarukan tanpa perlu menekan tombol F5 (refresh).
