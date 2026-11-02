import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Cpu,
  FileCode2,
  Sparkles,
  CheckCircle2,
  Download,
  ExternalLink,
  Maximize2,
  X,
  User,
  ArrowRight,
  Microscope,
  PlayCircle,
  ShieldAlert,
  Wrench,
  BookOpen,
  Camera,
  FileText,
  Compass
} from 'lucide-react';
import { LiquidMercuryControl } from '../../components/common/LiquidMercuryControl';
import {
  StemWorksheetItem,
  StemPortfolioItem
} from './types';

// ============================================================================
// KURIKULUM RESMI STEM SMP PLUS JAUHARUL MAKNUUN
// Pengampu: Ustadzah Ria & Ustadzah Anggun
// ============================================================================
export const STEM_WORKSHEETS: StemWorksheetItem[] = [
  {
    id: 'ws-hydrolift-pascal',
    title: 'LKPD STEM • HYDROLIFT: Alat Pengangkat Berbasis Tekanan Hukum Pascal',
    category: 'Fisika Tekanan Fluida & Mekanika',
    targetLevel: 'IPA Kelas VIII • SMP Plus JM',
    teacherMentor: 'Ustadzah Ria & Ustadzah Anggun',
    learningModel: 'Project-Based Learning (PjBL) • Engineering Design Process (EDP)',
    duration: '2 Pertemuan (Praktikum & Iterasi Desain)',
    downloadDocUrl: '/docs/stem/LKPD_STEM_Hydrolift_Hukum_Pascal_Kelas_8.docx',
    objective:
      'Merancang, membuat, dan menguji alat pengangkat beban sederhana (Hydrolift) berbasis tekanan hidrolik Hukum Pascal menggunakan sistem spuit (syringe) berpasangan serta mengevaluasi peningkatan performa alat melalui iterasi desain berbasis data.',
    context:
      'Tantangan Rekayasa: Bagaimana merancang dan membuat alat pengangkat sederhana berbasis tekanan zat cair (hidrolik) yang mampu mengangkat beban secara stabil menggunakan bahan sederhana yang tersedia? Ketika spuit penggerak ditekan, tekanan diteruskan oleh air di dalam selang ke segala arah sama besar menuju spuit pengangkat sehingga mampu mendorong platform beban naik ke atas.',
    setupPhoto: '/images/stem/hydrolift_foto_display_topik.jpg',
    toolsAndMaterials: [
      '2–4 Unit Spuit (Syringe / Suntikan Tanpa Jarum)',
      'Selang Transparan Fleksibel (Penghubung Hidrolik)',
      'Air (Fluida Kerja Penyalur Tekanan Hukum Pascal)',
      'Kardus Tebal & Stik Es Krim / Kayu (Struktur Rangka & Platform)',
      'Selotip, Lem Tembak & Pengikat Sambungan',
      'Beban Uji Terukur (Kantong Batu Kerikil / Anak Timbangan gram)',
      'Penggaris / Mistar Ukur (Satuan cm)'
    ],
    edpSteps: [
      {
        step: 'A & B. ASK',
        title: 'Tantangan Rekayasa & Identifikasi Masalah',
        desc: 'Merumuskan masalah yang harus diselesaikan, target kemampuan angkat alat, batasan bahan dan desain, serta prinsip bagaimana tekanan air di dalam selang tertutup membantu mengangkat beban.'
      },
      {
        step: 'C. IMAGINE',
        title: 'Mengembangkan Ide Desain Awal',
        desc: 'Menggambar sketsa bebas ide awal Hydrolift kelompok (susunan rangka penyangga, posisi spuit penggerak, dan platform beban) beserta alasan pemilihan desain mekanis tersebut.'
      },
      {
        step: 'D. PLAN',
        title: 'Rencana Pembuatan & Spesifikasi Alat',
        desc: 'Menyiapkan bahan utama (2–4 spuit, selang, air, kardus/stik, selotip/lem) dan menyusun 5 langkah kerja terstruktur sebelum perakitan.'
      },
      {
        step: 'E. CREATE',
        title: 'Merakit Prototipe Hydrolift',
        desc: '(1) Siapkan spuit tanpa jarum dan selang; (2) Hubungkan kedua spuit dengan selang; (3) Isi sistem dengan air dan kurangi udara di dalam selang; (4) Pasang satu spuit sebagai penggerak dan satu sebagai pengangkat; (5) Buat platform sederhana untuk beban; (6) Pastikan sambungan kuat dan alat bergerak mulus.'
      },
      {
        step: 'F. TEST',
        title: 'Uji Coba Beban & Pengukuran Data (Minimal 3 Percobaan)',
        desc: 'Menguji prototipe dengan variasi massa beban (gram), mencatat jarak tekan spuit (cm), ketinggian angkat yang dicapai (cm), serta menganalisis percobaan paling berhasil dan pengaruh perbesaran massa beban.'
      },
      {
        step: 'G & H. IMPROVE',
        title: 'Perbaiki Desain & Uji Kedua (Hasil Perbaikan)',
        desc: 'Mengevaluasi kelebihan dan kekurangan desain pertama, memodifikasi parameter kritis (posisi spuit, ukuran platform, penyangga, selang, ukuran/jumlah spuit), membuat sketsa perbaikan, lalu melakukan 3 percobaan uji kedua.'
      },
      {
        step: 'I. REFLEKSI',
        title: 'Refleksi Konsep IPA & Evaluasi Kelompok',
        desc: 'Menyimpulkan konsep Hukum Pascal yang paling dipahami, strategi kelompok mengatasi kendala kebocoran/kemiringan, serta ide penyempurnaan jika membuat Hydrolift kembali.'
      }
    ],
    lkpdPages: [
      {
        url: '/images/stem/lkpd_hydrolift_hal_1.png',
        caption: 'LKPD Halaman 1: Tantangan Rekayasa, Ask, Imagine & Plan'
      },
      {
        url: '/images/stem/lkpd_hydrolift_hal_2.png',
        caption: 'LKPD Halaman 2: Create (6 Langkah Perakitan) & Tabel Test Uji Coba'
      },
      {
        url: '/images/stem/lkpd_hydrolift_hal_3.png',
        caption: 'LKPD Halaman 3: Improve Desain, Uji Kedua, Refleksi & Rubrik'
      }
    ],
    documentationPhotos: [
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan.jpg',
        caption: 'Tahap Ask, Imagine & Plan: Santriwati merumuskan masalah & menggambar sketsa ide awal Hydrolift pada lembar LKPD'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan3.jpg',
        caption: 'Tahap Create: Perakitan sistem dua spuit dengan selang air serta kalibrasi penghilangan gelembung udara'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan2.jpg',
        caption: 'Tahap Test (Uji Coba): Pengujian kekuatan angkat menara hidrolik menggunakan beban kantong batu kerikil'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan1.jpg',
        caption: 'Hasil Karya Prototipe: Demonstrasi Hydrolift rangka stik es krim karya santriwati yang berhasil mengangkat beban secara stabil'
      }
    ],
    videoRefs: [
      {
        title: 'Video Materi 1: Konsep Tekanan Hidrolik & Aplikasi Hukum Pascal',
        url: 'https://youtu.be/LjSuHty6xTg?si=qTXhw-jYnuxX87Iv',
        durationOrLabel: 'Referensi Konsep Fisika'
      },
      {
        title: 'Video Materi 2: Tutorial Rancang Bangun Mini Hydraulic Lift Syringe',
        url: 'https://youtu.be/31pxVTL7HwU?si=VCZA9-p34H2eYvMu',
        durationOrLabel: 'Panduan Perakitan Alat'
      },
      {
        title: 'Video Materi 3: Eksperimen Mekanisme Gunting & Pengangkat Hidrolik',
        url: 'https://youtu.be/jFTYrvonseM?si=HNsB1qhyFjJg8YyS',
        durationOrLabel: 'Studi Kasus Rekayasa'
      }
    ],
    rubric: [
      {
        id: 'r-hydro-1',
        category: 'Desain & Kreativitas',
        weight: '20%',
        criteria: 'Ketepatan sketsa rancangan awal, inovasi struktur penyangga, dan kesesuaian mekanisme kerja.',
        scaleDescription: 'Skor 4: Sangat Tepat | Skor 3: Tepat | Skor 2: Cukup | Skor 1: Belum Tepat'
      },
      {
        id: 'r-hydro-2',
        category: 'Produk & Fungsi Alat',
        weight: '25%',
        criteria: 'Kekuatan sambungan spuit-selang tanpa bocor dan kemampuan mengangkat beban secara stabil.',
        scaleDescription: 'Skor 4: Sangat Berfungsi | Skor 3: Berfungsi | Skor 2: Sebagian | Skor 1: Tidak Berfungsi'
      },
      {
        id: 'r-hydro-3',
        category: 'Data Pengujian',
        weight: '20%',
        criteria: 'Kelengkapan tabel 3 percobaan (massa beban, jarak tekan, ketinggian) beserta ketepatan analisis.',
        scaleDescription: 'Skor 4: Lengkap | Skor 3: Cukup | Skor 2: Kurang | Skor 1: Tidak Ada Data'
      },
      {
        id: 'r-hydro-4',
        category: 'Improvement (Perbaikan)',
        weight: '20%',
        criteria: 'Modifikasi desain kedua didasarkan pada evaluasi data uji pertama dan terbukti meningkatkan hasil.',
        scaleDescription: 'Skor 4: Berbasis Data | Skor 3: Ada Perbaikan | Skor 2: Sederhana | Skor 1: Tidak Ada'
      },
      {
        id: 'r-hydro-5',
        category: 'Kerja Sama & Presentasi',
        weight: '15%',
        criteria: 'Kekompakan kolaborasi anggota kelompok dan kejelasan presentasi konsep Hukum Pascal.',
        scaleDescription: 'Skor 4: Sangat Baik | Skor 3: Baik | Skor 2: Cukup | Skor 1: Kurang'
      }
    ]
  },
  {
    id: 'ws-roket-air-newton',
    title: 'LKPD STEM • Merancang Roket Air & Hukum III Newton (Aksi–Reaksi)',
    category: 'Fisika Gaya, Gerak & Aerodinamika',
    targetLevel: 'IPA Kelas VII • SMP Plus JM',
    teacherMentor: 'Ustadzah Ria & Ustadzah Anggun',
    learningModel: 'Project-Based Learning (PjBL) • Engineering Design Process (EDP)',
    duration: '2 Pertemuan (@ 2 × 40 Menit)',
    downloadDocUrl: '/docs/stem/LKPD_STEM_Roket_Air_Hukum_III_Newton_Kelas_7.docx',
    objective:
      'Menjelaskan pasangan gaya aksi–reaksi pada roket air berdasarkan Hukum III Newton, merancang serta menguji roket air mengikuti tahapan Engineering Design Process (EDP), dan menyimpulkan hasil pengujian berdasarkan data kuantitatif untuk memperbaiki rancangan.',
    context:
      'Tantangan Rekayasa: Rancanglah roket air dari satu botol plastik PET 1,5 L bekas yang dapat terbang setinggi atau sejauh mungkin dan meluncur dengan stabil. Batasan rekayasa: bahan tambahan hanya karton, selotip, dan gunting; volume air serta tekanan udara mengikuti arahan guru; setiap kondisi rancangan wajib diuji sebanyak 3 kali peluncuran untuk dihitung rata-ratanya.',
    safetyRules: [
      'Luncurkan roket hanya di lapangan terbuka dengan pengawasan langsung dari guru.',
      'Berdiri minimal 5 meter dari roket; dilarang berada di atas atau di depan roket saat dipompa.',
      'Pompa hanya sampai batas tekanan dari guru; hentikan segera jika botol menggembung berlebihan.',
      'Jangan arahkan roket ke orang, bangunan, atau kendaraan; hanya satu petugas yang memompa dan melepas peluncur.',
      'Pastikan menggunakan botol PET 1,5 L utuh; dilarang menggunakan botol yang retak atau penyok.'
    ],
    setupPhoto: '/images/stem/roket_air_foto_display_topik.webp',
    toolsAndMaterials: [
      '1 Unit Botol Plastik PET 1,5 Liter Utuh (Badan Tekanan Roket)',
      'Karton Tebal (Bahan Sirip / Fins & Kerucut Hidung / Nose Cone)',
      'Selotip / Lakban Kuat, Gunting & Penggaris (cm)',
      'Air Bersih (Variasi Volume Uji: ¼, ⅓, atau ½ Botol)',
      'Pompa Udara Bertekanan dengan Adaptor & Sumbat Peluncur (Disiapkan Guru)',
      'Meteran Lapangan & Stopwatch HP (Pengukur Jarak & Waktu)',
      'Kertas Millimeter Block (Pembuatan Grafik Batang Rata-rata)'
    ],
    edpSteps: [
      {
        step: 'Langkah 1: ASK',
        title: 'Mengidentifikasi Masalah & Kriteria Keberhasilan',
        desc: 'Menentukan masalah utama yang harus dipecahkan dan indikator keberhasilan roket air (ketinggian, jarak tempuh meter, dan kestabilan lintasan terbang).'
      },
      {
        step: 'Langkah 2: RESEARCH',
        title: 'Mengumpulkan Informasi Konsep Hukum III Newton',
        desc: 'Menganalisis pasangan gaya Aksi (udara bertekanan mendorong air menyembur ke bawah) dan Reaksi (air mendorong roket melesat ke atas), fungsi sirip penstabil, serta alasan bagian depan roket dibuat meruncing (aerodinamis).'
      },
      {
        step: 'Langkah 3: IMAGINE',
        title: 'Mengembangkan 3 Alternatif Ide Rancangan',
        desc: 'Menyusun 3 opsi desain (variasi bentuk kerucut hidung, jumlah sirip 2/3/4 buah, atau rasio volume air) beserta analisis kelebihan, kekurangan, dan alasan pemilihan ide terbaik.'
      },
      {
        step: 'Langkah 4: PLAN',
        title: 'Merencanakan Sketsa Berlabel & Variabel Eksperimen',
        desc: 'Menggambar sketsa tampak samping berlabel ukuran (cm), menetapkan variabel bebas (diubah), variabel terikat (diukur), variabel kontrol (dijaga tetap), dan membagi peran anggota (Ketua, Perancang, Penguji, Pencatat Data).'
      },
      {
        step: 'Langkah 5: CREATE',
        title: 'Membuat Prototipe Roket Air',
        desc: 'Memotong karton menjadi sirip sesuai rancangan, menempelkan sirip secara simetris di dekat leher botol, memasang kerucut hidung di dasar botol, dan memastikan roket dapat berdiri tegak seimbang.'
      },
      {
        step: 'Langkah 6: TEST',
        title: 'Menguji Prototipe & Grafik Millimeter Block',
        desc: 'Meluncurkan roket 3 kali untuk setiap kondisi variabel bebas, menghitung nilai rata-rata (m), mengamati stabilitas terbang (stabil/miring/berputar), dan menggambar grafik batang pada kertas millimeter block.'
      },
      {
        step: 'Langkah 7: IMPROVE',
        title: 'Mengevaluasi & Memperbaiki Rancangan Ke-2',
        desc: 'Menganalisis penyebab masalah pada rancangan pertama, melakukan modifikasi perbaikan pada Rancangan 2, menguji ulang 3 kali peluncuran, dan membuktikan peningkatan jarak/tinggi dengan data.'
      },
      {
        step: 'Langkah 8: COMMUNICATE',
        title: 'Presentasi Ilmiah Kelompok (3 Menit)',
        desc: 'Mempresentasikan (1) gambar rancangan & alasannya, (2) tabel data & grafik batang, (3) penjelasan Hukum III Newton pada roket kelompok, serta (4) bukti hasil perbaikan desain.'
      }
    ],
    videoRefs: [
      {
        title: 'Video Referensi 1: Hukum III Newton (Aksi–Reaksi) pada Peluncuran Roket Air',
        url: 'https://youtu.be/cY8cBMl_-94?si=EY7KhIj7EZG8XcoP',
        durationOrLabel: 'Eksperimen Gaya & Gerak'
      },
      {
        title: 'Video Referensi 2: Teknik Pembuatan Nose Cone, Sirip & Peluncuran Roket Air',
        url: 'https://youtu.be/6mFhWgisd0k?si=hixgDbKvI5sDMR7J',
        durationOrLabel: 'Panduan Engineering Design'
      }
    ],
    rubric: [
      {
        id: 'r-roket-1',
        category: 'Pemahaman Konsep',
        weight: '20%',
        criteria: 'Kemampuan menjelaskan pasangan gaya aksi–reaksi Hukum III Newton yang bekerja pada benda berbeda (air dan badan roket).',
        scaleDescription: 'Skor 4: Aksi–reaksi benar & lengkap dengan contoh roket | Skor 3: Benar, kurang lengkap | Skor 2: Sebagian benar | Skor 1: Belum tepat'
      },
      {
        id: 'r-roket-2',
        category: 'Perancangan & Prototipe',
        weight: '20%',
        criteria: 'Kelengkapan 3 ide desain, sketsa tampak samping berlabel ukuran (cm), serta kerapian dan keseimbangan prototipe.',
        scaleDescription: 'Skor 4: 3 ide, sketsa berlabel, prototipe rapi & sesuai | Skor 3: Cukup jelas & sesuai | Skor 2: Kurang jelas | Skor 1: Tidak lengkap'
      },
      {
        id: 'r-roket-3',
        category: 'Pengujian & Data',
        weight: '20%',
        criteria: 'Pelaksanaan 3 percobaan untuk tiap kondisi variabel, ketepatan hitung rata-rata (m), dan pembuatan grafik batang millimeter block.',
        scaleDescription: 'Skor 4: 3 percobaan, rata-rata & grafik benar | Skor 3: Lengkap, sedikit salah | Skor 2: Tidak lengkap | Skor 1: Tidak ada data'
      },
      {
        id: 'r-roket-4',
        category: 'Evaluasi & Perbaikan',
        weight: '20%',
        criteria: 'Perbaikan Rancangan 2 didasarkan pada evaluasi data Rancangan 1 dan menghasilkan peningkatan jarak/ketinggian terbang.',
        scaleDescription: 'Skor 4: Perbaikan berbasis data & hasil meningkat | Skor 3: Berbasis data | Skor 2: Tanpa alasan jelas | Skor 1: Tidak ada perbaikan'
      },
      {
        id: 'r-roket-5',
        category: 'Kerja Sama, K3 & Presentasi',
        weight: '20%',
        criteria: 'Keaktifan peran seluruh anggota, kepatuhan penuh pada prosedur keselamatan kerja (K3), dan kejelasan presentasi 3 menit.',
        scaleDescription: 'Skor 4: Semua aktif, aman & presentasi jelas | Skor 3: Sebagian besar aktif & jelas | Skor 2: Kurang aktif | Skor 1: Tidak bekerja sama'
      }
    ]
  }
];

// ============================================================================
// PORTOFOLIO DOKUMENTASI HASIL PRAKTIKUM STEM SANTRI
// ============================================================================
export const STEM_PORTFOLIO: StemPortfolioItem[] = [
  {
    id: 'port-hydrolift-stik',
    title: 'Prototipe Hydrolift Rangka Stik Kayu Pengangkat Beban (Hukum Pascal)',
    category: 'Fisika Tekanan Fluida • Kelas VIII',
    studentName: 'Tim Riset Santriwati Kelas VIII-A & VIII-B',
    studentClass: 'Kelas VIII SMP Plus JM (Pembina: Us. Ria & Us. Anggun)',
    teacherMentor: 'Ustadzah Ria & Ustadzah Anggun',
    photoUrl: '/images/stem/hydrolift_dokumentasi_pelaksanaan1.jpg',
    downloadDocUrl: '/docs/stem/LKPD_STEM_Hydrolift_Hukum_Pascal_Kelas_8.docx',
    galleryPhotos: [
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan1.jpg',
        caption: 'Demonstrasi prototipe Hydrolift rangka stik kayu berhias dedaunan saat berhasil mengangkat beban batu uji'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan.jpg',
        caption: 'Perumusan identifikasi masalah (Ask) dan penggambaran sketsa awal (Imagine) pada lembar LKPD STEM'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan3.jpg',
        caption: 'Proses perakitan dan pengisian air pada dua spuit dengan selang tanpa gelembung udara'
      },
      {
        url: '/images/stem/hydrolift_foto_display_topik.jpg',
        caption: 'Referensi mekanisme gunting (scissor lift) pengangkat beban berbasis dua tabung spuit hidrolik'
      }
    ],
    videoRefs: [
      {
        title: 'Prinsip Kerja Hydraulic Lift & Hukum Pascal',
        url: 'https://youtu.be/LjSuHty6xTg?si=qTXhw-jYnuxX87Iv'
      },
      {
        title: 'Panduan Pembuatan Mini Hydraulic Elevator',
        url: 'https://youtu.be/31pxVTL7HwU?si=VCZA9-p34H2eYvMu'
      }
    ],
    description:
      'Karya rekayasa santriwati Kelas VIII dalam merancang dan merakit alat pengangkat hidrolik (Hydrolift) berbahan rangka stik kayu susun dan dua spuit suntikan tanpa jarum yang dihubungkan selang air untuk membuktikan prinsip penerusan tekanan Hukum Pascal.',
    procedure: [
      'Mengidentifikasi masalah dan menggambar sketsa ide awal Hydrolift pada lembar LKPD (Tahap Ask & Imagine).',
      'Menyiapkan 2–4 spuit tanpa jarum, selang transparan, air, stik kayu/kardus, dan lem perekat (Tahap Plan).',
      'Menghubungkan kedua spuit menggunakan selang dan mengisi sistem dengan air sambil mengeluarkan seluruh gelembung udara (Tahap Create).',
      'Merakit menara penyangga dari stik kayu dengan satu spuit dipasang vertikal di bagian tengah sebagai pengangkat platform beban.',
      'Melakukan 3 kali pengujian variasi massa beban batu uji serta mencatat jarak tekan spuit (cm) dan ketinggian angkat (cm) (Tahap Test & Improve).'
    ],
    results:
      'Prototipe Hydrolift berhasil mengangkat beban batu kerikil di atas platform dengan stabil tanpa kebocoran selang. Ketika udara di dalam selang dihilangkan sepenuhnya, dorongan pada spuit penggerak langsung diteruskan secara penuh ke spuit pengangkat sesuai Hukum Pascal.',
    stats: [
      { label: 'Prinsip Sains', value: 'Hukum Pascal' },
      { label: 'Uji Beban', value: '3 Percobaan' },
      { label: 'Status Alat', value: 'Sangat Berfungsi' }
    ],
    completionDate: 'Semester Ganjil 2025/2026'
  },
  {
    id: 'port-hydrolift-menara',
    title: 'Eksperimen Uji Beban Menara Hydrolift Berbasis Syringe Hidrolik',
    category: 'Eksperimen Mekanika Fluida • Kelas VIII',
    studentName: 'Kelompok Eksperimen Sains Putri Kelas VIII',
    studentClass: 'Kelas VIII SMP Plus JM (Pembina: Us. Ria & Us. Anggun)',
    teacherMentor: 'Ustadzah Ria & Ustadzah Anggun',
    photoUrl: '/images/stem/hydrolift_dokumentasi_pelaksanaan2.jpg',
    downloadDocUrl: '/docs/stem/LKPD_STEM_Hydrolift_Hukum_Pascal_Kelas_8.docx',
    galleryPhotos: [
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan2.jpg',
        caption: 'Pengujian daya angkat beban bertingkat menggunakan dua kantong batu kerikil pada menara hidrolik kardus biru'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan3.jpg',
        caption: 'Kalibrasi tekanan air antar spuit penggerak dan spuit pengangkat oleh anggota kelompok'
      },
      {
        url: '/images/stem/hydrolift_dokumentasi_pelaksanaan.jpg',
        caption: 'Pencatatan data jarak tekan (cm), ketinggian angkat (cm), dan evaluasi perbaikan desain pada LKPD'
      }
    ],
    videoRefs: [
      {
        title: 'Eksperimen Gaya Angkat Syringe Hidrolik',
        url: 'https://youtu.be/jFTYrvonseM?si=HNsB1qhyFjJg8YyS'
      }
    ],
    description:
      'Pengujian eksperimental kelompok santriwati Kelas VIII untuk mengukur pengaruh penambahan massa beban (kantong batu kerikil) terhadap jarak tekan spuit penggerak dan ketinggian angkat maksimum pada konstruksi menara hidrolik kardus diperkuat.',
    procedure: [
      'Membangun struktur kolom menara penyangga berbentuk balok vertikal dari kardus tebal berlapis kertas biru agar spuit pengangkat tidak miring.',
      'Memasang platform datar di ujung atas torak spuit pengangkat untuk menahan beban kantong batu kerikil.',
      'Melakukan Uji Coba Pertama dengan 1 hingga 2 kantong beban batu serta mengukur ketinggian angkat dalam satuan sentimeter.',
      'Mengevaluasi kendala kemiringan platform ketika beban diperbesar dan memperkuat dudukan penyangga spuit (Tahap Improve).',
      'Melakukan Uji Kedua (Hasil Perbaikan) sebanyak 3 percobaan dan membandingkan kestabilan angkat sebelum serta sesudah modifikasi.'
    ],
    results:
      'Setelah dilakukan perbaikan (Improvement) pada penyangga vertikal dan ukuran platform beban, menara Hydrolift mampu menahan beban ganda dua kantong batu kerikil tanpa mengalami kemiringan dan mencapai ketinggian angkat penuh.',
    stats: [
      { label: 'Variasi Beban', value: '3 Tingkat Massa' },
      { label: 'Iterasi EDP', value: 'Uji 1 & Uji 2' },
      { label: 'Kestabilan', value: '100% Tegak' }
    ],
    completionDate: 'Semester Ganjil 2025/2026'
  },
  {
    id: 'port-roket-air-newton',
    title: 'Rancang Bangun Roket Air Botol PET 1,5 L & Pengujian Hukum III Newton',
    category: 'Fisika Gaya & Gerak • Kelas VII',
    studentName: 'Tim Rekayasa Muda Kelas VII SMP Plus JM',
    studentClass: 'Kelas VII SMP Plus JM (Pembina: Us. Ria & Us. Anggun)',
    teacherMentor: 'Ustadzah Ria & Ustadzah Anggun',
    photoUrl: '/images/stem/roket_air_foto_display_topik.webp',
    downloadDocUrl: '/docs/stem/LKPD_STEM_Roket_Air_Hukum_III_Newton_Kelas_7.docx',
    galleryPhotos: [
      {
        url: '/images/stem/roket_air_foto_display_topik.webp',
        caption: 'Skema anatomi rekayasa Water Rocket: Kerucut Hidung (Cone), Ruang Udara Tekan, Volume Air, Sirip (Fins), dan Pompa Peluncur'
      }
    ],
    videoRefs: [
      {
        title: 'Konsep Hukum III Newton pada Peluncuran Roket Air',
        url: 'https://youtu.be/cY8cBMl_-94?si=EY7KhIj7EZG8XcoP'
      },
      {
        title: 'Desain Sirip Aerodinamis & Uji Peluncuran Roket Air',
        url: 'https://youtu.be/6mFhWgisd0k?si=hixgDbKvI5sDMR7J'
      }
    ],
    description:
      'Proyek rekayasa fisika santri Kelas VII mengaplikasikan Hukum III Newton (F aksi = -F reaksi) melalui pembuatan roket air berbahan botol PET 1,5 L dengan pengujian variabel volume air (¼, ⅓, dan ½ botol) serta kestabilan sirip karton.',
    procedure: [
      'Mengembangkan 3 ide rancangan variasi jumlah sirip (3 vs 4 sirip) dan proporsi volume air serta membuat sketsa tampak samping berlabel ukuran (cm).',
      'Memotong karton menjadi sirip aerodinamis dan menempelkannya secara simetris di dekat leher botol menggunakan selotip.',
      'Membuat kerucut hidung (nose cone) meruncing dari karton dan merekatkannya pada dasar botol untuk memecah hambatan udara.',
      'Melakukan pengujian peluncuran di lapangan terbuka dengan jarak aman minimal 5 meter sebanyak 3 percobaan untuk setiap kondisi variabel volume air.',
      'Menghitung rata-rata jarak tempuh (meter), menggambar grafik batang pada kertas millimeter block, dan menguji ulang Rancangan 2 hasil perbaikan.'
    ],
    results:
      'Data percobaan membuktikan bahwa pengisian volume air sebanyak ⅓ bagian botol menghasilkan kombinasi dorongan semburan air (gaya aksi) dan cadangan udara bertekanan paling optimal, menghasilkan jarak meluncur terjauh dan lintasan paling stabil.',
    stats: [
      { label: 'Volume Optimal', value: '⅓ Botol (500 mL)' },
      { label: 'Repetisi Uji', value: '3× per Variabel' },
      { label: 'Hukum Fisika', value: 'Newton III' }
    ],
    completionDate: 'Semester Ganjil 2025/2026'
  }
];

export const StemAreaSection: React.FC = () => {
  const location = useLocation();
  const [worksheets] = useState<StemWorksheetItem[]>(STEM_WORKSHEETS);
  const [portfolios] = useState<StemPortfolioItem[]>(STEM_PORTFOLIO);
  const [activeSubTab, setActiveSubTab] = useState<'worksheet' | 'portfolio'>(() =>
    location.pathname.includes('/portofolio') ? 'portfolio' : 'worksheet'
  );
  const [selectedWorksheet, setSelectedWorksheet] = useState<StemWorksheetItem>(STEM_WORKSHEETS[0]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<StemPortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  // Sync sub-tab when route changes between /smart-jm/stem/materi and /smart-jm/stem/portofolio
  useEffect(() => {
    if (location.pathname.includes('/portofolio')) {
      setActiveSubTab('portfolio');
    } else if (location.pathname.includes('/materi')) {
      setActiveSubTab('worksheet');
    }
  }, [location.pathname]);

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* ========================================================= */}
      {/* SUB-SECTION TOGGLER: WORKSHEET vs PORTOFOLIO */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-1.5 sm:pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-bold uppercase tracking-wider mb-0.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kurikulum PjBL &amp; Engineering Design Process (EDP)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            STEM &amp; Robotika Terapan SMP Plus JM
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pengampu: <strong className="text-zinc-700 dark:text-zinc-300">Ustadzah Ria &amp; Ustadzah Anggun</strong> • Integrasi Sains IPA, Rekayasa Mekanika &amp; Eksperimen Laboratorium
          </p>
        </div>

        {/* Liquid Mercury Sub-Navigation Switcher */}
        <div className="shrink-0">
          <LiquidMercuryControl<'worksheet' | 'portfolio'>
            size="md"
            options={[
              { id: 'worksheet', label: 'LKPD & Materi Proyek', icon: FileCode2 },
              { id: 'portfolio', label: 'Dokumentasi & Portofolio', icon: Sparkles }
            ]}
            value={activeSubTab}
            onChange={setActiveSubTab}
            ariaLabel="Sub-Navigasi STEM"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* KONTEN 1: WORKSHEET PROYEK STEM (LKPD EDP) & RUBRIK */}
      {/* ========================================================= */}
      {activeSubTab === 'worksheet' && (
        <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-300">
          {/* Selector Proyek Worksheet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {worksheets.map((ws) => {
              const isSelected = selectedWorksheet.id === ws.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setSelectedWorksheet(ws)}
                  className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600/80 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white/85 dark:bg-zinc-900/80 border-zinc-200/70 dark:border-zinc-800/70 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                        {ws.category}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {ws.targetLevel}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mt-1.5 line-clamp-2">
                      {ws.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Pembina: {ws.teacherMentor}</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ws.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Worksheet yang Dipilih */}
          <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-3 sm:p-4 lg:p-4.5 shadow-xs space-y-3 sm:space-y-3.5">
            {/* Header Proyek + Tombol Unduh LKPD */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {selectedWorksheet.category}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">• {selectedWorksheet.targetLevel}</span>
                  <span className="text-xs font-medium text-zinc-500">• {selectedWorksheet.duration}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
                  {selectedWorksheet.title}
                </h3>
                {selectedWorksheet.learningModel && (
                  <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400">
                    Model Pembelajaran: <strong className="text-zinc-700 dark:text-zinc-200">{selectedWorksheet.learningModel}</strong> — Pengampu: <strong className="text-emerald-700 dark:text-emerald-400">{selectedWorksheet.teacherMentor}</strong>
                  </p>
                )}
              </div>

              {selectedWorksheet.downloadDocUrl && (
                <a
                  href={selectedWorksheet.downloadDocUrl}
                  download
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen LKPD (.docx)</span>
                </a>
              )}
            </div>

            {/* Split Grid: Foto Display Topik & Narasi Konteks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
              {/* Foto Display Topik */}
              <div className="lg:col-span-5 space-y-2">
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs cursor-pointer group"
                  onClick={() =>
                    setLightboxImage({
                      url: selectedWorksheet.setupPhoto,
                      caption: selectedWorksheet.title
                    })
                  }
                  title="Klik untuk memperbesar gambar topik proyek"
                >
                  <img
                    src={selectedWorksheet.setupPhoto}
                    alt={selectedWorksheet.title}
                    className="w-full h-full object-contain bg-white dark:bg-zinc-900 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9.5px] font-semibold text-emerald-300 uppercase tracking-wider block">
                      Visualisasi &amp; Display Topik Proyek
                    </span>
                    <span className="text-xs font-bold drop-shadow-sm line-clamp-1">
                      {selectedWorksheet.title}
                    </span>
                  </div>
                </div>

                {/* Video Materi & Referensi Pembelajaran */}
                {selectedWorksheet.videoRefs && selectedWorksheet.videoRefs.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                      <PlayCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      <span>Video Materi &amp; Referensi Praktikum:</span>
                    </div>
                    <div className="space-y-1">
                      {selectedWorksheet.videoRefs.map((vid, idx) => (
                        <a
                          key={idx}
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-zinc-200/60 dark:border-zinc-800 transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 block truncate">
                                {vid.title}
                              </span>
                              {vid.durationOrLabel && (
                                <span className="text-[9.5px] text-zinc-400 block">
                                  {vid.durationOrLabel}
                                </span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-emerald-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Narasi Konteks, Tujuan, K3, & Alat Bahan */}
              <div className="lg:col-span-7 space-y-2.5 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                    <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tujuan Pembelajaran Proyek:</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedWorksheet.objective}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tantangan Rekayasa &amp; Konteks Sains:</span>
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedWorksheet.context}
                  </p>
                </div>

                {/* Keselamatan Kerja (Jika Ada, seperti pada Roket Air) */}
                {selectedWorksheet.safetyRules && selectedWorksheet.safetyRules.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Prosedur Keselamatan Kerja (K3 Praktikum):</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-amber-900/90 dark:text-amber-200/90 list-disc list-inside">
                      {selectedWorksheet.safetyRules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Alat & Bahan */}
                <div className="pt-0.5">
                  <h4 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Daftar Alat &amp; Bahan Praktikum:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {selectedWorksheet.toolsAndMaterials.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 p-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* ALUR ENGINEERING DESIGN PROCESS (EDP) SESUAI LKPD */}
            {/* ========================================================= */}
            {selectedWorksheet.edpSteps && selectedWorksheet.edpSteps.length > 0 && (
              <div className="space-y-2 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Tahapan Engineering Design Process (EDP) pada LKPD</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Alur kerja ilmiah santri mulai dari perumusan masalah, perancangan prototipe, pengujian data, hingga iterasi perbaikan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {selectedWorksheet.edpSteps.map((edp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-50/90 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 flex flex-col justify-between space-y-1"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                          {edp.step}
                        </span>
                        <h5 className="text-xs font-bold text-zinc-900 dark:text-white leading-snug">
                          {edp.title}
                        </h5>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {edp.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* PRATINJAU LEMBAR KERJA (LKPD SCAN) & DOKUMENTASI PELAKSANAAN */}
            {/* ========================================================= */}
            {(selectedWorksheet.lkpdPages || selectedWorksheet.documentationPhotos) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
                {/* Pratinjau Lembar LKPD */}
                {selectedWorksheet.lkpdPages && selectedWorksheet.lkpdPages.length > 0 && (
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Lembar Kerja Peserta Didik (LKPD)</span>
                      </h4>
                      <span className="text-[10px] text-zinc-400">Klik untuk perbesar</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {selectedWorksheet.lkpdPages.map((pg, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxImage(pg)}
                          className="group cursor-pointer rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-emerald-500 transition-all"
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={pg.url}
                              alt={pg.caption}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-1 text-center bg-zinc-50 dark:bg-zinc-800/80">
                            <span className="text-[9.5px] font-bold text-zinc-700 dark:text-zinc-300 block truncate">
                              Halaman {idx + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Galeri Dokumentasi Pelaksanaan Praktikum */}
                {selectedWorksheet.documentationPhotos && selectedWorksheet.documentationPhotos.length > 0 && (
                  <div className={`${selectedWorksheet.lkpdPages ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>Dokumentasi Pelaksanaan Praktikum Santri</span>
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        {selectedWorksheet.documentationPhotos.length} Foto Kegiatan
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {selectedWorksheet.documentationPhotos.map((doc, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxImage(doc)}
                          className="group cursor-pointer rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-2xs hover:border-emerald-500 transition-all flex flex-col"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                            <img
                              src={doc.url}
                              alt={doc.caption}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="p-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                            {doc.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* RUBRIK PENILAIAN RESMI (SESUAI LKPD US. RIA & US. ANGGUN) */}
            {/* ========================================================= */}
            <div className="space-y-2 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-tight">
                    Rubrik &amp; Standar Penilaian LKPD STEM
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Pedoman evaluasi autentik proyek STEM santri (Skala Skor 4 – 1 • Nilai Akhir = (Total Skor ÷ 20) × 100).
                  </p>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                  Total Bobot: 100%
                </span>
              </div>

              {/* Tampilan Desktop: Clean Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-700 uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="py-2 px-3">Aspek Penilaian</th>
                      <th className="py-2 px-2.5 text-center">Bobot</th>
                      <th className="py-2 px-3">Indikator Capaian</th>
                      <th className="py-2 px-3">Deskriptor Skala Skor (4 – 1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                    {selectedWorksheet.rubric.map((r) => (
                      <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-zinc-900 dark:text-white">
                          {r.category}
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10.5px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                            {r.weight}
                          </span>
                        </td>
                        <td className="py-2 px-3">{r.criteria}</td>
                        <td className="py-2 px-3 text-emerald-800 dark:text-emerald-300 font-medium">
                          {r.scaleDescription}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tampilan Mobile: Adaptif Card List */}
              <div className="md:hidden space-y-2">
                {selectedWorksheet.rubric.map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {r.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                        Bobot {r.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {r.criteria}
                    </p>
                    <div className="text-[10.5px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      {r.scaleDescription}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* KONTEN 2: PORTOFOLIO & DOKUMENTASI KARYA SISWA STEM */}
      {/* ========================================================= */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                Galeri Dokumentasi &amp; Portofolio Proyek STEM Santri
              </h3>
              <p className="text-xs text-zinc-500">
                Dokumentasi pelaksanaan praktikum Engineering Design Process (EDP) santri Kelas VII &amp; VIII SMP Plus Jauharul Maknuun.
              </p>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              Menampilkan {portfolios.length} Dokumentasi Proyek Utama
            </span>
          </div>

          {/* Cards Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
            {portfolios.map((item) => (
              <article
                key={item.id}
                className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    onClick={() => setSelectedPortfolio(item)}
                    title="Klik untuk melihat detail prosedur, galeri foto, dan hasil pengujian"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-white bg-emerald-800/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10.5px] text-emerald-300 font-semibold block">
                        {item.studentClass}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold leading-snug drop-shadow-md line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.studentName}</span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-3 gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      {item.stats.map((st, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-50 dark:bg-zinc-800/60 p-1 rounded-lg text-center border border-zinc-200/50 dark:border-zinc-800/50"
                        >
                          <span className="text-[8.5px] text-zinc-400 block truncate">
                            {st.label}
                          </span>
                          <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 block truncate">
                            {st.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-2.5 sm:p-3 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPortfolio(item)}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200/70 dark:border-emerald-800/60 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span>Lihat Dokumentasi &amp; Hasil Uji</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL PORTOFOLIO: GALERI, PROSEDUR & HASIL UJI */}
      {/* ========================================================= */}
      {selectedPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
          onClick={() => setSelectedPortfolio(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  {selectedPortfolio.category}
                </span>
                <h3 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  {selectedPortfolio.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPortfolio(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {/* Info Kreator & Unduh LKPD */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      {selectedPortfolio.studentName}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {selectedPortfolio.studentClass} • {selectedPortfolio.completionDate}
                    </span>
                  </div>
                </div>
                {selectedPortfolio.downloadDocUrl && (
                  <a
                    href={selectedPortfolio.downloadDocUrl}
                    download
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh LKPD</span>
                  </a>
                )}
              </div>

              {/* Galeri Foto Dokumentasi */}
              {selectedPortfolio.galleryPhotos && selectedPortfolio.galleryPhotos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">
                    Dokumentasi Pelaksanaan Praktikum
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedPortfolio.galleryPhotos.map((ph, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(ph)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                          <img
                            src={ph.url}
                            alt={ph.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="p-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                          {ph.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1">
                  Deskripsi Proyek &amp; Konsep Sains
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {selectedPortfolio.description}
                </p>
              </div>

              {/* Prosedur Pengerjaan (Step-by-step Numbered List) */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">
                  Prosedur Engineering Design Process (EDP)
                </h4>
                <ol className="space-y-1.5">
                  {selectedPortfolio.procedure.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10.5px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Hasil & Kesimpulan Terukur */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hasil Pengujian &amp; Kesimpulan Terukur:</span>
                </div>
                <p className="text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
                  {selectedPortfolio.results}
                </p>
              </div>

              {/* Video Referensi Terkait */}
              {selectedPortfolio.videoRefs && selectedPortfolio.videoRefs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1.5">
                    Video Materi &amp; Referensi Terkait
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedPortfolio.videoRefs.map((vid, idx) => (
                      <a
                        key={idx}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 hover:bg-emerald-50 dark:bg-zinc-900 dark:hover:bg-emerald-950/40 border border-zinc-200/70 dark:border-zinc-800 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <PlayCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                            {vid.title}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative max-h-[80vh] w-full bg-black flex items-center justify-center p-2">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.caption || 'Pratinjau Dokumentasi STEM'}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
            {lightboxImage.caption && (
              <div className="p-3 bg-zinc-900 text-center border-t border-white/10">
                <p className="text-xs sm:text-sm font-medium text-zinc-200">
                  {lightboxImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
