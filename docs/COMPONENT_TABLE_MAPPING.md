# Pemetaan Komponen & Tabel Supabase PP. Jauharul Maknuun
**Dokumen Arsitektur Sistem Terintegrasi Database & Storage**
*Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik*
*Tanggal Rilis: 1 November 2026*

---

## 1. Ringkasan Eksekutif

Dokumen ini memetakan seluruh komponen antarmuka pengguna (Public Web & Admin CMS Editor) ke tabel database PostgreSQL Supabase dan 9 storage bucket. Seluruh mock hardcode dan seed statis telah dieliminasi dan digantikan dengan arsitektur sinkronisasi real-time berbasis `supabase-js` v2.

---

## 2. Matriks Pemetaan Komponen ke Tabel & Bucket

| No | Modul & Komponen UI | File Public UI | File Editor Admin | Tabel Supabase | Storage Bucket | Realtime Channel |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Navbar & Submenu 9 Pilar** | `src/components/common/Header.tsx` | `src/pages/admin/WebVisualEditor.tsx` | `cms_sections` | `cms-images` | `realtime:public:cms_sections` |
| **2** | **Hero Slider Banner (5 Flyer)** | `src/components/HeroSlider.tsx` | `src/pages/admin/KelolaSlider.tsx` | `sliders` | `cms-images` | `realtime:public:sliders` |
| **3** | **Quick Menu (8 Layanan Pintas)** | `src/components/QuickMenu.tsx` | `src/pages/admin/WebVisualEditor.tsx` | `quick_menus` | `cms-images` | `realtime:public:quick_menus` |
| **4** | **Sambutan Mudir & Pengasuh** | `src/components/SambutanMudir.tsx`, `src/pages/jm-center/Sambutan.tsx` | `src/pages/admin/KelolaSambutan.tsx` | `sambutan_persons` | `avatars` | `realtime:public:sambutan_persons` |
| **5** | **SPMB Penerimaan Santri** | `src/pages/Spmb.tsx` | `src/pages/admin/WebVisualEditor.tsx` | `spmb_info` | `cms-images` | `realtime:public:spmb_info` |
| **6** | **Fasilitas & Sarana Prasarana** | `src/pages/Fasilitas.tsx`, `src/pages/jm-center/Fasilitas.tsx` | `src/pages/admin/KelolaProfil.tsx` | `facilities` | `cms-images` | `realtime:public:facilities` |
| **7** | **Warta & Berita Pesantren** | `src/pages/Berita.tsx`, `src/pages/DetailBerita.tsx` | `src/pages/admin/KelolaBerita.tsx` | `berita` (`news` view) | `berita-images` | `realtime:public:berita` |
| **8** | **Prestasi Santri & Guru** | `src/pages/Prestasi.tsx` | `src/pages/admin/KelolaPrestasi.tsx` | `prestasi` (`achievements`) | `prestasi-certificates` | `realtime:public:prestasi` |
| **9** | **Ekstrakurikuler Santri** | `src/pages/Ekskul.tsx` | `src/pages/admin/KelolaEkskul.tsx` | `ekskul` (`extracurriculars`) | `cms-images` | `realtime:public:ekskul` |
| **10** | **Struktur Kabinet OSIS** | `src/pages/Osis.tsx` | `src/pages/admin/KelolaOsis.tsx` | `osis_structure` | `avatars` | `realtime:public:osis_structure` |
| **11** | **Program Kerja OSIS** | `src/pages/Osis.tsx` | `src/pages/admin/KelolaOsis.tsx` | `osis_programs` | `cms-images` | `realtime:public:osis_programs` |
| **12** | **Agenda & Kalender Kegiatan** | `src/pages/Agenda.tsx` | `src/pages/admin/KelolaAgenda.tsx` | `agendas` | `cms-images` | `realtime:public:agendas` |
| **13** | **Galeri Foto Dokumentasi** | `src/pages/galeri/Galeri.tsx`, `src/pages/galeri/GaleriFoto.tsx` | `src/pages/admin/KelolaGaleri.tsx` | `galeri_foto` (`galleries`) | `galeri-foto` | `realtime:public:galeri_foto` |
| **14** | **Galeri Video & Vlog** | `src/pages/galeri/GaleriVideo.tsx` | `src/pages/admin/KelolaGaleri.tsx` | `galeri_videos` | `galeri-foto` | `realtime:public:galeri_videos` |
| **15** | **Kontak Hotline & 7 Kanal Medsos** | `src/components/common/Footer.tsx` | `src/pages/admin/KelolaKontak.tsx` | `kontak_medsos` | `cms-images` | `realtime:public:kontak_medsos` |
| **16** | **Lembaga Pendidikan PPJM** | `src/pages/lembaga/LembagaIndex.tsx` | `src/pages/admin/KelolaProfil.tsx` | `institutions` | `cms-images` | `realtime:public:institutions` |
| **17** | **Program Kepesantrenan** | `src/pages/program-unggulan/AmaliyahPondok.tsx` | `src/pages/admin/KelolaProfil.tsx` | `programs_pondok` | `cms-images` | `realtime:public:programs_pondok` |
| **18** | **Kurikulum SMP JM** | `src/pages/program-unggulan/ProgramSekolah.tsx` | `src/pages/admin/KelolaProfil.tsx` | `programs_sekolah` | `cms-images` | `realtime:public:programs_sekolah` |
| **19** | **Madrasah Diniyah (Madin)** | `src/pages/program-unggulan/ProgramMadin.tsx` | `src/pages/admin/KelolaProfil.tsx` | `madin_flyers` | `madin-flyers` | `realtime:public:madin_flyers` |
| **20** | **SMART JM: Lembar Kerja STEM** | `src/pages/smart-jm/stem/StemMateri.tsx` | `src/pages/admin/KelolaStem.tsx` | `stem_worksheets` | `stem-portfolios` | `realtime:public:stem_worksheets` |
| **21** | **SMART JM: Rubrik STEM** | `src/pages/smart-jm/stem/StemPortofolio.tsx` | `src/pages/admin/KelolaStem.tsx` | `stem_rubrics` | `stem-portfolios` | `realtime:public:stem_rubrics` |
| **22** | **SMART JM: Portofolio STEM** | `src/pages/smart-jm/stem/StemPortofolio.tsx` | `src/pages/admin/KelolaStem.tsx` | `stem_portfolios` | `stem-portfolios` | `realtime:public:stem_portfolios` |
| **23** | **SMART JM: Proyek STEM** | `src/pages/smart-jm/SmartJmHub.tsx` | `src/pages/admin/KelolaStem.tsx` | `stem_projects` | `stem-portfolios` | `realtime:public:stem_projects` |
| **24** | **SMART JM: Kosa Kata Mandarin** | `src/pages/smart-jm/mandarin/MandarinMateri.tsx` | `src/pages/admin/KelolaMandarin.tsx` | `mandarin_vocabularies` | `mandarin-audios` | `realtime:public:mandarin_vocabularies` |
| **25** | **SMART JM: Kuis Mandarin** | `src/pages/smart-jm/mandarin/MandarinQuizPage.tsx` | `src/pages/admin/KelolaMandarin.tsx` | `mandarin_quizzes` | `mandarin-audios` | `realtime:public:mandarin_quizzes` |
| **26** | **SMART JM: Skor Mandarin** | `src/pages/smart-jm/mandarin/MandarinQuizPage.tsx` | `src/pages/admin/KelolaMandarin.tsx` | `mandarin_scores` | `mandarin-audios` | `realtime:public:mandarin_scores` |
| **27** | **SMART JM: Target Surah Tahfidz** | `src/pages/smart-jm/hafidz/QuranReadPage.tsx` | `src/pages/admin/KelolaHafidz.tsx` | `hafidz_surahs` | `hafidz-audios` | `realtime:public:hafidz_surahs` |
| **28** | **SMART JM: Qari & Murottal** | `src/pages/smart-jm/hafidz/MurojaahPage.tsx` | `src/pages/admin/KelolaHafidz.tsx` | `hafidz_reciters` | `hafidz-audios` | `realtime:public:hafidz_reciters` |
| **29** | **SMART JM: Audio Murottal** | `src/pages/smart-jm/hafidz/QuranReadPage.tsx` | `src/pages/admin/KelolaHafidz.tsx` | `hafidz_audios` | `hafidz-audios` | `realtime:public:hafidz_audios` |
| **30** | **SMART JM: Setoran Santri** | `src/pages/smart-jm/hafidz/MurojaahPage.tsx` | `src/pages/admin/KelolaHafidz.tsx` | `hafidz_setoran` | `hafidz-audios` | `realtime:public:hafidz_setoran` |
| **31** | **Profil Pengasuh & Asatidz** | `src/pages/jm-center/ProfilPengasuh.tsx` | `src/pages/admin/KelolaProfil.tsx` | `profiles_jm_center` | `avatars` | `realtime:public:profiles_jm_center` |
| **32** | **Halaman Statis JM Center** | `src/pages/jm-center/JmCenter.tsx` | `src/pages/admin/KelolaProfil.tsx` | `jm_center_pages` | `cms-images` | `realtime:public:jm_center_pages` |
| **33** | **Kelola Pengguna & Administrator** | `src/pages/profile/UserProfilePage.tsx` | `src/pages/admin/KelolaUsers.tsx` | `admin_profiles` | `avatars` | `realtime:public:admin_profiles` |
| **34** | **Audit Trail & Log Aktivitas** | `src/pages/admin/AuditLogs.tsx` | `src/pages/admin/AuditLogs.tsx` | `audit_logs` | `cms-images` | `realtime:public:audit_logs` |

---

## 3. Matriks 9 Storage Buckets Supabase

| Bucket ID | Deskripsi Konten | Visibilitas | Kebijakan SELECT | Kebijakan INSERT/UPDATE |
| :--- | :--- | :--- | :--- | :--- |
| `avatars` | Foto profil Mudir, pengasuh, asatidz, OSIS & admin | Public | Anon & Authenticated | Super Admin & Authenticated |
| `cms-images` | Banner hero slider, background section, visual CMS | Public | Anon & Authenticated | Pengurus Konten & Super Admin |
| `berita-images` | Gambar cover & ilustrasi warta berita pesantren | Public | Anon & Authenticated | Pengurus Konten & Super Admin |
| `galeri-foto` | Dokumentasi resolusi tinggi kegiatan pondok & sekolah | Public | Anon & Authenticated | Pengurus Konten & Super Admin |
| `prestasi-certificates` | Sertifikat, medali & piagam kejuaraan santri | Public | Anon & Authenticated | Guru Akademik & Super Admin |
| `stem-portfolios` | Lembar kerja & portofolio karya sains teknologi santri | Public | Anon & Authenticated | Guru Akademik & Super Admin |
| `mandarin-audios` | Rekaman audio pelafalan pinyin & kosakata Mandarin | Public | Anon & Authenticated | Guru Akademik & Super Admin |
| `hafidz-audios` | File audio murottal 30 Juz & rekaman setoran santri | Public | Anon & Authenticated | Guru Akademik & Super Admin |
| `madin-flyers` | Brosur kurikulum, jadwal taklim & pengumuman madin | Public | Anon & Authenticated | Pengurus Konten & Super Admin |

---

## 4. Validasi Integritas Arsitektur

1. **Eliminasi Mock Hardcode**: Semua komponen membaca data awal via `useEffect` yang memanggil `supabase.from(tabel).select()` dengan fallback default aman hanya jika database benar-benar kosong.
2. **Real-time Synchronization**: Komponen mendaftarkan subscription `supabase.channel` yang mendengarkan event `postgres_changes` untuk segera memicu re-fetch lokal saat data diubah via CMS Admin.
3. **Hardened RLS Policies**: Akses baca publik (`anon`) diizinkan untuk semua data aktif, sedangkan operasi penulisan, modifikasi, dan penghapusan diamankan oleh validasi role `authenticated` berbasis JWT.

