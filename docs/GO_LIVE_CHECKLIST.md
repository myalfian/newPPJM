# 📋 GO-LIVE PRODUCTION CHECKLIST - PP JAUHARUL MAKNUUN
**Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik**  
**Target Domain**: [https://ppjauharulmaknuun.sch.id](https://ppjauharulmaknuun.sch.id)  
**Tanggal Evaluasi**: 2026-10-31  
**Versi Rilis**: `v1.0.0-production`  
**Status Akhir**: ✅ **READY TO GO-LIVE (100% PASS)**

---

## FASE 1: SECURITY HARDENING (KRITIS)
- [x] **XSS Prevention**: SafeRichContent.tsx dan seluruh contentEditable menggunakan DOMPurify sanitization.
- [x] **Safe Protocol Enforcement**: Skema berbahaya (`javascript:`, `vbscript:`, `data:text/html`) diblokir total pada tautan dan gambar.
- [x] **Noopener / Noreferrer**: Seluruh tautan eksternal otomatis menyertakan `rel="noopener noreferrer" target="_blank"`.
- [x] **Strict WebP Auto-Compressor**: Seluruh input gambar di seluruh modul admin telah beralih ke unggah berkas dari komputer dengan konversi WebP otomatis.
- [x] **Eliminasi Uji Coba Role di /profil**: Tombol "Uji Coba 4 Role", "Switch Role", dan "Autofill" telah dihilangkan 100% dari halaman `/profil` produksi.
- [x] **RBAC Component & Route Guard**: Rute `/admin/*` dan modul CMS diproteksi ketat menggunakan `RoleGuard` sesuai matriks peran.
- [x] **Anti-Bruteforce & IDOR Protection**: API dan mutasi profil santri dibatasi hanya untuk pemilik ID sesi yang sah (`auth.uid()`).
- [x] **Production Security Headers**: `vercel.json` dikonfigurasi dengan Content-Security-Policy (CSP), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, dan Permissions-Policy.

## FASE 2: SUPABASE INTEGRATION (100% FULL)
- [x] **Database 34 Tabel**: Skema terpadu PostgreSQL 17 telah dideploy di instance `gzijnybcmhectajfkdtd.supabase.co`.
- [x] **Storage 9 Buckets**: Seluruh ember penyimpanan (`avatars`, `cms-images`, `berita-images`, `galeri-foto`, `prestasi-certificates`, `stem-portfolios`, `mandarin-audios`, `hafidz-audios`, `madin-flyers`) terkonfigurasi.
- [x] **Row-Level Security (RLS)**: Diaktifkan di seluruh tabel dengan hak tulis terisolasi untuk `super_admin` dan `pengurus_konten`.
- [x] **Realtime Invalidation**: Sinkronisasi dinamis perubahan slider dan konten website seketika tanpa refresh.
- [x] **Audit Trail System**: Pencatatan histori modifikasi pada tabel `audit_logs`.

## FASE 3: FUNCTIONALITY & ROUTING
- [x] **Navbar 9 Pilar**: Tautan JM Center, Program Unggulan, SMART JM, Prestasi, Ekstrakurikuler, OSIS, JM News, Galeri, Agenda aktif tanpa 404.
- [x] **BottomNav 5 Hub Mobile**: Beranda, Berita, Kalender, SPMB, dan Emblem Pintasan 7 Kanal Medsos berfungsi responsif di mobile.
- [x] **Hero Slider Coverflow**: 5 flyer dengan auto-play, pause on hover, dan drag navigasi 3D.
- [x] **SMART JM Ecosystem**:
  - STEM Worksheet IoT ESP32 & Rubrik 4 Parameter.
  - Mandarin HSK Gamifikasi Kosakata, Audio Pinyin & Quiz.
  - Hafidz Quran 30 Juz Mushaf Utsmani, Audio Murottal & Murojaah Cloze Test.
- [x] **Portal Kesiswaan & OSIS**: Struktur 3 Level, Proker 5 Departemen, dan Press Release OSIS.
- [x] **Web Visual Editor (CMS)**: WYSIWYG in-context editing, floating toolbar formatting, responsive preview, dan auto-save.

## FASE 4: PERFORMANCE & CODE SPLITTING
- [x] **Build Sukses**: `npm run build` (`tsc -b && vite build`) lolos tanpa error kompilasi TypeScript.
- [x] **Route Code-Splitting**: Pemanfaatan `React.lazy` dan dynamic imports untuk memisahkan chunk halaman publik dan panel admin.
- [x] **Aset Terkompresi**: Format WebP digunakan pada seluruh flyer dan gambar, menghemat rata-rata 60-80% kuota santri.
- [x] **Static Caching Policy**: Cache-Control `max-age=31536000, immutable` pada folder `/assets/`.

## FASE 5: SEO & ACCESSIBILITY
- [x] **Sitemap Terpadu**: File `public/sitemap.xml` memuat 23 rute publik resmi pesantren.
- [x] **Robots.txt**: File `public/robots.txt` mengizinkan pengindeksan publik serta memblokir akses crawler ke `/admin/` dan `/profil/`.
- [x] **Heading Hierarchy**: Penataan tag semantic `<header>`, `<main>`, `<nav>`, `<footer>` serta struktur H1-H3 tertata.
- [x] **WCAG 2.1 AA Compliance**: Kontras teks warna Emerald (#0E7A4C) dan Gold (#C8A951) pada latar belakang terang dan gelap.

## FASE 6: LEGAL & PESANTREN IDENTITY
- [x] **Identitas Resmi**: © 2026 PP Jauharul Maknuun, Jl. Raya Dukun-Lasem RT 01 RW 01 Sidayu Gresik 61153.
- [x] **Kontak Resmi**: WhatsApp Hotline 0821-3160-6535, Email aljauharu.almaknuun.lasem.gsk@gmail.com.
- [x] **Data Santri Shielded**: Nilai, NIP, NIS, dan mutabaah tahfidz privat hanya dapat dilihat oleh santri bersangkutan atau asatidz berwenang.

## FASE 7: DEVOPS & INFRASTRUCTURE
- [x] **Environment Sanitized**: Kredensial produksi menggunakan public anonymous key (bukan service role).
- [x] **SPA Routing Rewrites**: `vercel.json` mengarahkan semua path ke `index.html` untuk menjamin navigasi client-side tanpa broken link.
- [x] **SSL / HTTPS Enforced**: Protokol terenkripsi aktif di seluruh endpoint.

## FASE 8: DOCUMENTATION & DISASTER RECOVERY
- [x] **Admin Guide**: Panduan operasional CMS untuk ustadz/pengurus konten disusun di `docs/ADMIN_GUIDE.md`.
- [x] **Schema Guide**: Kamus data 34 tabel terdokumentasi di `docs/SUPABASE_SCHEMA.md`.
- [x] **Rollback SOP**: Prosedur rollback Vercel 1-klik dan restore database harian (PITR) siap pakai.

## FASE 9: AUTOMATED TEST SUITE
- [x] **Diagnostic Engine**: Modul uji mandiri di `src/utils/goLiveFinalCheck.ts`.
- [x] **Cockpit Go-Live**: Dasbor eksekutif di `/admin/go-live-check` untuk pemantauan kesehatan sistem secara berkala.

## FASE 10: FINAL SIGN-OFF
- [x] **Persetujuan Go-Live**: Dokumen `docs/GO_LIVE_APPROVAL.md` telah disahkan.

