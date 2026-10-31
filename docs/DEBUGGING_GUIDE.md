# Panduan Debugging & Pemecahan Kendala Data Flow PP Jauharul Maknuun

Panduan ini ditujukan bagi Administrator Sistem dan Tim IT PP Jauharul Maknuun untuk menginvestigasi dan menyelesaikan kendala pembaruan konten, sinkronisasi data Supabase, atau tampilan web.

---

## 1. Kendala: "Data diedit di Admin tetapi tidak muncul di Website Publik"

### Langkah 1: Buka Halaman Audit Otomatis
Buka dashboard admin pada rute:
`https://ppjauharulmaknuun.sch.id/admin/data-audit`

Di halaman ini, sistem akan menguji secara langsung:
1. **Koneksi Supabase**: status ping dan latensi database.
2. **RLS Public Read**: memastikan role `anon` dapat membaca baris tanpa blokir.
3. **Pemberian Hak Akses Tulis**: menguji token otentikasi admin.
4. **Supabase Realtime**: menguji penerimaan event `INSERT`, `UPDATE`, `DELETE`.

### Langkah 2: Periksa Status Publikasi
- Jika mengedit dari **WebVisualEditor**, pastikan telah mengklik tombol hijau **"Publikasikan ke Publik"** (bukan hanya "Simpan Draf").
  - "Simpan Draf" hanya menyimpan ke browser lokal pengurus.
  - "Publikasikan" mengunggah konfigurasi ke tabel `site_settings` & `cms_sections` Supabase.

### Langkah 3: Periksa Kebijakan RLS di SQL Editor Supabase
Jika ada tabel baru yang ditambahkan, jalankan migrasi `supabase/migrations/20261025_fix_rls_public.sql` atau eksekusi perintah:
```sql
ALTER TABLE public.nama_tabel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read All" ON public.nama_tabel FOR SELECT USING (true);
```

---

## 2. Kendala: "Terjadi Kendala Memuat Halaman (Error Boundary)"

### Langkah 1: Klik "Detail Diagnostik Kendala"
Pada layar peringatan, klik dropdown accordion bertuliskan **"Detail Diagnostik Kendala"**.
Di sana akan terlihat pesan error spesifik dan call stack komponen.

### Langkah 2: Pembaruan Versi / ChunkLoadError
Jika pesan bertuliskan `Failed to fetch dynamically imported module`:
- Hal ini terjadi jika pengguna sedang membuka website saat build rilis baru baru saja di-deploy ke Vercel (hash berkas JavaScript lama telah diganti dengan hash baru di CDN).
- Solusi: Klik tombol **"Bersihkan Cache"** atau **"Muat Ulang"**. Sistem kini telah dilengkapi auto-recovery yang otomatis me-refresh halaman 1 kali jika mendeteksi chunk error.

---

## 3. Kendala: "Input Foto / Gambar"

- Semua formulir input foto dan piagam telah dipindahkan dari input URL menjadi **input file dari komputer**.
- Sistem secara otomatis mendeteksi ukuran, mengonversi gambar ke format `.webp`, dan mengompresinya hingga hemat 70-85% kuota.
- Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`. Maksimal ukuran sebelum kompresi: 10 MB.
