# 📖 BUKU PANDUAN ADMINISTRATOR RESMI (ZERO-IT-SKILL)
**Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**  
**Portal Admin**: [https://ppjauharulmaknuun.sch.id/admin](https://ppjauharulmaknuun.sch.id/admin)

Buku panduan ini disusun khusus untuk para Asatidz, Pengurus Konten, dan Guru Akademik PP Jauharul Maknuun agar dapat mengelola seluruh informasi website secara mandiri tanpa memerlukan keahlian koding.

---

## 1. Hak Akses & Cara Masuk (4 Peran Resmi)

Sistem membagi hak akses ke dalam 4 tingkatan peran yang aman:

1. **Super Admin** (`super_admin`):
   - **Tugas**: Pengasuh Pondok & Pimpinan IT.
   - **Kewenangan**: Akses penuh ke seluruh modul, pengaturan hak akses, audit log, dan persetujuan go-live.
   - **Login**: `admin@ppjauharulmaknuun.sch.id`

2. **Pengurus Konten & Media** (`pengurus_konten`):
   - **Tugas**: Tim Media Santri & Humas.
   - **Kewenangan**: Mengelola Slider Flyer Beranda, Web Visual Editor, Berita, Galeri Foto/Video, Prestasi Santri, Ekstrakurikuler, OSIS, Agenda, dan Kontak Medsos.

3. **Guru Akademik & Pengampu** (`guru_akademik`):
   - **Tugas**: Asatidz Madin, Guru SMP Plus & Pembimbing Tahfidz/STEM.
   - **Kewenangan**: Mengelola Lembar Kerja STEM, Kosakata/Quiz Mandarin, dan Evaluasi Setoran Tahfidz 30 Juz.

4. **Santri & Pelajar** (`santri`):
   - **Tugas**: Santri PPJM.
   - **Kewenangan**: Mengakses materi belajar, melihat nilai dan riwayat hafalan pribadi di `/profil`. Tidak memiliki akses ke panel administrasi `/admin`.

---

## 2. Cara Menggunakan Web Visual Editor (WYSIWYG)

Web Visual Editor memungkinkan Anda mengubah tampilan website publik semudah mengedit dokumen:

1. Buka menu **Web Visual Editor** di sidebar admin (`/admin/editor`).
2. **Mengubah Teks**:
   - Klik langsung pada teks di layar preview website.
   - Sorot (blok) teks yang ingin diubah untuk memunculkan **Floating Toolbar** (Tebal, Miring, Warna Teks Hijau/Emas, Tautan Link, Perataan).
3. **Mengatur Urutan Bagian (Section)**:
   - Pada panel sebelah kiri, seret pegangan 6 titik (`:::`) ke atas atau ke bawah untuk menukar urutan section.
4. **Pratinjau Layar**:
   - Gunakan tombol switch di bagian atas: **Desktop**, **Tablet**, atau **Mobile (HP)** untuk memastikan tampilan rapi di layar smartphone santri/wali.
5. **Menyimpan & Publikasi**:
   - Editor memiliki fitur **Auto-Save Draft**.
   - Untuk menayangkan perubahan ke publik, klik tombol **"Publikasikan Sekarang"** di pojok kanan atas.

---

## 3. Panduan Pengelolaan Gambar (Otomatis Hemat Kuota)

Anda **tidak perlu** repot mencari tautan internet atau mengompres gambar sendiri:
- Seluruh formulir unggah gambar (Flyer, Berita, Pas Foto OSIS, Sertifikat Prestasi) langsung mengambil berkas dari komputer/laptop Anda (mendukung JPG, PNG, WebP).
- Sistem otomatis mengompresi gambar hingga **60-80% lebih ringan** dalam format WebP tanpa menurunkan kejernihan visual.
- Tersedia tombol **"Ganti Foto"** dan **"Hapus Foto"** pada setiap formulir.

---

## 4. Cara Mengelola Warta Berita & Pengumuman

1. Masuk ke menu **Kelola Warta Berita** (`/admin/berita`).
2. Klik tombol **"Rilis Pers Baru"**.
3. Pilih kategori warta (Berita Utama, Siaran Pers, Prestasi, Akademik, Pesantren).
4. Masukkan judul dan pilih foto kegiatan dari komputer.
5. Tulis isi berita menggunakan editor teks kaya.
6. Klik **"Simpan & Tayangkan"**.
7. *Tips Cepat*: Klik tombol **"Broadcast WhatsApp"** untuk menyebarkan ringkasan berita ke grup wali santri dalam 1-klik.

---

## 5. Pemantauan & Pemeriksaan Pra-Peluncuran (Go-Live)

Sebelum mengumumkan fitur baru ke publik:
1. Kunjungi menu **Go-Live Launch Check** (`/admin/go-live-check`).
2. Klik tombol **"Uji Ulang"** untuk menjalankan audit otomatis 10 fase (Keamanan, Database, Navigasi, SEO).
3. Pastikan indikator skor menunjukkan **95-100% SIAP DILUNCURKAN**.

---

## 6. Prosedur Pencadangan (Backup) Data Pesantren

Database Supabase terkonfigurasi melakukan pencadangan otomatis harian (PITR). Jika ingin melakukan ekspor cadangan mandiri:
1. Masuk ke menu **Audit & Uji Supabase** (`/admin/integration-test`).
2. Klik **"Ekspor Laporan Audit"** sebagai arsip dokumentasi.
3. Hubungi Super Admin untuk mengunduh snapshot basis data SQL bila diperlukan migrasi berkala.
