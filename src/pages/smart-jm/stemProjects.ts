// ============================================================================
// STEM PROJECTS - Dummy Data untuk LKPD & Materi Proyek
// Smart JM - STEM & Robotika
// ============================================================================

export type DetailTab = 'materi' | 'lkpd' | 'rubrik' | 'unggah';

export interface StemMateriItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'link';
  duration: string;
  url: string;
}

export interface StemLKPDItem {
  id: string;
  title: string;
  pdfUrl: string;
}

export interface StemRubrikRow {
  id: string;
  aspek: string;
  kriteria: string;
  skor1: string;
  skor2: string;
  skor3: string;
  skor4: string;
}

export interface StemUploadItem {
  id: string;
  judul: string;
  deskripsi: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface StemProject {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  level: 'SD' | 'SMP' | 'SMA';
  summary: string;
  totalMateri: number;
  totalLKPD: number;
  status: 'Aktif' | 'Selesai' | 'Draft';
  materi: StemMateriItem[];
  lkpd: StemLKPDItem[];
  rubrik: StemRubrikRow[];
  uploads: StemUploadItem[];
}

export const STEM_PROJECTS: StemProject[] = [
  {
    id: 'proj-001',
    title: 'Hydrolift: Alat Pengangkat Berbasis Hukum Pascal',
    thumbnail: '/images/stem/hydrolift_foto_display_topik.jpg',
    category: 'Robotika',
    level: 'SMP',
    summary: 'Membuat alat pengangkat beban sederhana menggunakan sistem hidrolik dua spuit untuk membuktikan penerusan tekanan zat cair.',
    totalMateri: 4,
    totalLKPD: 3,
    status: 'Aktif',
    materi: [
      { id: 'm1-1', title: 'Konsep Dasar Tekanan Zat Cair', type: 'video', duration: '12:30', url: 'https://youtu.be/LjSuHty6xTg' },
      { id: 'm1-2', title: 'Hukum Pascal dalam Kehidupan Sehari-hari', type: 'pdf', duration: '15 menit', url: '/docs/stem/hukum-pascal-contoh.pdf' },
      { id: 'm1-3', title: 'Tutorial Perakitan Hydrolift', type: 'video', duration: '18:45', url: 'https://youtu.be/31pxVTL7HwU' },
      { id: 'm1-4', title: 'Referensi EDP Engineering Design', type: 'link', duration: 'Bebas', url: 'https://www.teachengineering.org' },
    ],
    lkpd: [
      { id: 'lkpd1-1', title: 'LKPD Halaman 1 - Ask & Imagine', pdfUrl: '/docs/stem/lkpd_hydrolift_hal1.pdf' },
      { id: 'lkpd1-2', title: 'LKPD Halaman 2 - Plan & Create', pdfUrl: '/docs/stem/lkpd_hydrolift_hal2.pdf' },
      { id: 'lkpd1-3', title: 'LKPD Halaman 3 - Test & Improve', pdfUrl: '/docs/stem/lkpd_hydrolift_hal3.pdf' },
    ],
    rubrik: [
      { id: 'r1-1', aspek: 'Desain & Kreativitas', kriteria: 'Ketepatan sketsa dan inovasi struktur penyangga', skor1: 'Belum Tepat', skor2: 'Cukup', skor3: 'Tepat', skor4: 'Sangat Tepat' },
      { id: 'r1-2', aspek: 'Fungsi Alat', kriteria: 'Sambungan spuit-selang tanpa bocor, mampu mengangkat beban', skor1: 'Tidak Berfungsi', skor2: 'Sebagian', skor3: 'Berfungsi', skor4: 'Sangat Berfungsi' },
      { id: 'r1-3', aspek: 'Data Pengujian', kriteria: 'Kelengkapan tabel 3 percobaan dan analisis data', skor1: 'Tidak Ada Data', skor2: 'Kurang', skor3: 'Lengkap', skor4: 'Sangat Lengkap' },
      { id: 'r1-4', aspek: 'Perbaikan Desain', kriteria: 'Modifikasi didasarkan evaluasi uji pertama', skor1: 'Tidak Ada', skor2: 'Sederhana', skor3: 'Ada Perbaikan', skor4: 'Berbasis Data' },
      { id: 'r1-5', aspek: 'Presentasi', kriteria: 'Kejelasan presentasi konsep Hukum Pascal', skor1: 'Kurang', skor2: 'Cukup', skor3: 'Baik', skor4: 'Sangat Baik' },
    ],
    uploads: [
      { id: 'up1-1', judul: 'Laporan Hydrolift Tim VIII-A', deskripsi: 'Laporan lengkap praktikum Hydrolift Hukum Pascal', fileName: 'laporan-hydrolift-viii-a.pdf', fileSize: '2.45 MB', uploadedAt: '02 Nov 2026' },
      { id: 'up1-2', judul: 'Foto Hasil Akhir Hydrolift', deskripsi: 'Dokumentasi foto prototipe hasil akhir', fileName: 'foto-hasil-hydrolift.jpg', fileSize:'1.80 MB', uploadedAt: '01 Nov 2026' },
    ],
  },
  {
    id: 'proj-002',
    title: 'Roket Air Botol PET & Hukum III Newton',
    thumbnail: '/images/stem/roket_air_foto_display_topik.webp',
    category: 'Fisika',
    level: 'SMP',
    summary: 'Merancang dan menguji roket air dari botol PET 1,5 L untuk menerapkan Hukum III Newton (aksi-reaksi).',
    totalMateri: 3,
    totalLKPD: 2,
    status: 'Aktif',
    materi: [
      { id: 'm2-1', title: 'Hukum III Newton: Aksi & Reaksi', type: 'video', duration: '10:15', url: 'https://youtu.be/cY8cBMl_-94' },
      { id: 'm2-2', title: 'Desain Sirip Aerodinamis Roket', type: 'pdf', duration: '12 menit', url: '/docs/stem/sirip-roket.pdf' },
      { id: 'm2-3', title: 'Panduan Peluncuran Roket Air', type: 'link', duration: 'Bebas', url: 'https://www.nasa.gov/rocket-guide' },
    ],
    lkpd: [
      { id: 'lkpd2-1', title: 'LKPD Roket Air - Perancangan', pdfUrl: '/docs/stem/lkpd-roket-perancangan.pdf' },
      { id: 'lkpd2-2', title: 'LKPD Roket Air - Tabel Data Peluncuran', pdfUrl: '/docs/stem/lkpd-roket-data.pdf' },
    ],
    rubrik: [
      { id: 'r2-1', aspek: 'Pemahaman Konsep', kriteria: 'Menjelaskan aksi-reaksi Hukum III Newton', skor1: 'Belum Tepat', skor2: 'Cukup', skor3: 'Tepat', skor4: 'Sangat Tepat' },
      { id: 'r2-2', aspek: 'Prototipe Roket', kriteria: 'Kerapian, keseimbangan, dan kelengkapan 3 ide desain', skor1: 'Tidak Lengkap', skor2: 'Kurang Jelas', skor3: 'Tepat', skor4: 'Sangat Tepat' },
      { id: 'r2-3', aspek: 'Pengujian Data', kriteria: '3 percobaan, rata-rata, dan grafik millimeter block', skor1: 'Tidak Ada', skor2: 'Kurang', skor3: 'Lengkap', skor4: 'Sangat Lengkap' },
      { id: 'r2-4', aspek: 'Evaluasi & Perbaikan', kriteria: 'Perbaikan Rancangan 2 berdasarkan data Rancangan 1', skor1: 'Tidak Ada', skor2: 'Tanpa Alasan', skor3: 'Berbasis Data', skor4: 'Hasil Meningkat' },
      { id: 'r2-5', aspek: 'K3 & Presentasi', kriteria: 'Kepatuhan prosedur keselamatan dan presentasi 3 menit', skor1: 'Kurang Aktif', skor2: 'Cukup Aktif', skor3: 'Aktif', skor4: 'Sangat Aktif' },
    ],
    uploads: [],
  },
  {
    id: 'proj-003',
    title: 'Lengan Robotik Arduino Menggerakkan Objek',
    thumbnail: '/images/stem/roket_air_foto_display_topik.webp',
    category: 'Otomasi',
    level: 'SMP',
    summary: 'Membuat lengan robotik sederhana berbasis Arduino dengan servo motor untuk menggerakkan objek kecil.',
    totalMateri: 5,
    totalLKPD: 4,
    status: 'Draft',
    materi: [
      { id: 'm3-1', title: 'Pengenalan Arduino & Servo Motor', type: 'video', duration: '15:20', url: 'https://youtu.be/arduino-servo' },
      { id: 'm3-2', title: 'Rangkaian Lengan Robotik', type: 'pdf', duration: '20 menit', url: '/docs/stem/rangkaian-robot.pdf' },
      { id: 'm3-3', title: 'Pemrograman Servo dengan Arduino', type: 'video', duration: '22:10', url: 'https://youtu.be/servo-program' },
      { id: 'm3-4', title: 'Kalibrasi Gerakan Lengan', type: 'pdf', duration: '15 menit', url: '/docs/stem/kalibrasi-robot.pdf' },
      { id: 'm3-5', title: 'Tugas Akhir: Gerakkan Objek', type: 'link', duration: 'Bebas', url: 'https://create.arduino.cc' },
    ],
    lkpd: [
      { id: 'lkpd3-1', title: 'LKPD Robotik - Rangkaian', pdfUrl: '/docs/stem/lkpd-robot-rangkaian.pdf' },
      { id: 'lkpd3-2', title: 'LKPD Robotik - Pemrograman', pdfUrl: '/docs/stem/lkpd-robot-kode.pdf' },
      { id: 'lkpd3-3', title: 'LKPD Robotik - Uji Gerak', pdfUrl: '/docs/stem/lkpd-robot-uji.pdf' },
      { id: 'lkpd3-4', title: 'LKPD Robotik - Laporan Akhir', pdfUrl: '/docs/stem/lkpd-robot-laporan.pdf' },
    ],
    rubrik: [
      { id: 'r3-1', aspek: 'Rangkaian Elektronika', kriteria: 'Koneksi servo, Arduino, dan daya yang benar', skor1: 'Salah', skor2: 'Sebagian', skor3: 'Benar', skor4: 'Sangat Benar' },
      { id: 'r3-2', aspek: 'Kode Program', kriteria: 'Fungsi servo berjalan sesuai logika program', skor1: 'Tidak Berjalan', skor2: 'Sebagian', skor3: 'Berjalan', skor4: 'Sangat Optimal' },
      { id: 'r3-3', aspek: 'Gerakan Lengan', kriteria: 'Lengan dapat menggerakkan objek ke target', skor1: 'Tidak Bergerak', skor2: 'Bergerak Kurang', skor3: 'Bergerak Baik', skor4: 'Sangat Presisi' },
      { id: 'r3-4', aspek: 'Dokumentasi', kriteria: 'Lengkapnya foto dan video dokumentasi kerja', skor1: 'Kosong', skor2: 'Sedikit', skor3: 'Cukup', skor4: 'Sangat Lengkap' },
    ],
    uploads: [],
  },
  {
    id: 'proj-004',
    title: 'Rumah Pintar IoT dengan Sensor Suhu',
    thumbnail: '/images/stem/hydrolift_foto_display_topik.jpg',
    category: 'IoT',
    level: 'SMP',
    summary: 'Sistem rumah pintar sederhana menggunakan sensor suhu dan relay untuk mengontrol kipas otomatis.',
    totalMateri: 3,
    totalLKPD: 2,
    status: 'Aktif',
    materi: [
      { id: 'm4-1', title: 'Pengenalan IoT & NodeMCU ESP8266', type: 'video', duration: '14:00', url: 'https://youtu.be/iot-esp8266' },
      { id: 'm4-2', title: 'Sensor Suhu DHT11 & Pemrograman', type: 'pdf', duration: '18 menit', url: '/docs/stem/dht11-sensor.pdf' },
      { id: 'm4-3', title: 'Koneksi WiFi & Blynk App', type: 'video', duration: '16:50', url: 'https://youtu.be/blynk-app' },
    ],
    lkpd: [
      { id: 'lkpd4-1', title: 'LKPD IoT - Rangkaian Sensor', pdfUrl: '/docs/stem/lkpd-iot-sensor.pdf' },
      { id: 'lkpd4-2', title: 'LKPD IoT - Konfigurasi Blynk', pdfUrl: '/docs/stem/lkpd-iot-blynk.pdf' },
    ],
    rubrik: [
      { id: 'r4-1', aspek: 'Rangkaian IoT', kriteria: 'Koneksi sensor dan relay yang benar', skor1: 'Salah', skor2: 'Sebagian', skor3: 'Benar', skor4: 'Sangat Benar' },
      { id: 'r4-2', aspek: 'Konektivitas WiFi', kriteria: 'Perangkat dapat terhubung ke jaringan', skor1: 'Tidak Terhubung', skor2: 'Tidak Stabil', skor3: 'Stabil', skor4: 'Sangat Stabil' },
      { id: 'r4-3', aspek: 'Otomatisasi', kriteria: 'Kipas menyala sesuai ambang batas suhu', skor1: 'Tidak Otomatis', skor2: 'Kurang Tepat', skor3: 'Tepat', skor4: 'Sangat Tepat' },
      { id: 'r4-4', aspek: 'Antarmuka Aplikasi', kriteria: 'Tampilan monitoring di aplikasi seluler', skor1: 'Kosong', skor2: 'Dasar', skor3: 'Cukup', skor4: 'Sangat Baik' },
    ],
    uploads: [],
  },
  {
    id: 'proj-005',
    title: 'Game Edukasi Matematika dengan Scratch',
    thumbnail: '/images/stem/roket_air_foto_display_topik.webp',
    category: 'Coding',
    level: 'SD',
    summary: 'Membuat game edukasi matematika sederhana menggunakan platform Scratch untuk pelajar SD.',
    totalMateri: 4,
    totalLKPD: 3,
    status: 'Aktif',
    materi: [
      { id: 'm5-1', title: 'Pengenalan Blok Scratch', type: 'video', duration: '11:40', url: 'https://youtu.be/scratch-basics' },
      { id: 'm5-2', title: 'Membuat Karakter & Latar Belakang', type: 'pdf', duration: '15 menit', url: '/docs/stem/scratch-sprite.pdf' },
      { id: 'm5-3', title: 'Logika Soal Matematika', type: 'video', duration: '20:30', url: 'https://youtu.be/scratch-math' },
      { id: 'm5-4', title: 'Skor & Level Game', type: 'link', duration: 'Bebas', url: 'https://scratch.mit.edu' },
    ],
    lkpd: [
      { id: 'lkpd5-1', title: 'LKPD Scratch - Desain Karakter', pdfUrl: '/docs/stem/lkpd-scratch-sprite.pdf' },
      { id: 'lkpd5-2', title: 'LKPD Scratch - Logika Game', pdfUrl: '/docs/stem/lkpd-scratch-logic.pdf' },
      { id: 'lkpd5-3', title: 'LKPD Scratch - Pengujian Game', pdfUrl: '/docs/stem/lkpd-scratch-test.pdf' },
    ],
    rubrik: [
      { id: 'r5-1', aspek: 'Kreativitas Game', kriteria: 'Karakter, latar, dan konsep game yang menarik', skor1: 'Kurang', skor2: 'Cukup', skor3: 'Baik', skor4: 'Sangat Baik' },
      { id: 'r5-2', aspek: 'Logika Kode', kriteria: 'Blok kode berfungsi sesuai alur game', skor1: 'Tidak Berfungsi', skor2: 'Sebagian', skor3: 'Berfungsi', skor4: 'Sangat Optimal' },
      { id: 'r5-3', aspek: 'Nilai Edukatif', kriteria: 'Soal matematika sesuai level SD', skor1: 'Tidak Sesuai', skor2: 'Cukup Sesuai', skor3: 'Sesuai', skor4: 'Sangat Sesuai' },
      { id: 'r5-4', aspek: 'Penggunaan', kriteria: 'Game mudah dimainkan dan dipahami', skor1: 'Sulit', skor2: 'Cukup Mudah', skor3: 'Mudah', skor4: 'Sangat Mudah' },
    ],
    uploads: [],
  },
  {
    id: 'proj-006',
    title: 'Komposter Otomatik Sampah Organik',
    thumbnail: '/images/stem/hydrolift_foto_display_topik.jpg',
    category: 'Sains',
    level: 'SMP',
    summary: 'Komposter sederhana dengan sensor kelembaban dan motor untuk mengolah sampah organik menjadi kompos.',
    totalMateri: 3,
    totalLKPD: 2,
    status: 'Selesai',
    materi: [
      { id: 'm6-1', title: 'Proses Kompos Sampah Organik', type: 'video', duration: '13:10', url: 'https://youtu.be/kompos-organik' },
      { id: 'm6-2', title: 'Rangkaian Sensor Kelembaban', type: 'pdf', duration: '17 menit', url: '/docs/stem/sensor-kelembaban.pdf' },
      { id: 'm6-3', title: 'Motor & Sistem Pengadukan', type: 'video', duration: '19:20', url: 'https://youtu.be/motor-pengaduk' },
    ],
    lkpd: [
      { id: 'lkpd6-1', title: 'LKPD Komposter - Desain', pdfUrl: '/docs/stem/lkpd-komposter-desain.pdf' },
      { id: 'lkpd6-2', title: 'LKPD Komposter - Uji Coba', pdfUrl: '/docs/stem/lkpd-komposter-uji.pdf' },
    ],
    rubrik: [
      { id: 'r6-1', aspek: 'Desain Komposter', kriteria: 'Struktur fisik dan tata letak komponen', skor1: 'Sederhana', skor2: 'Cukup', skor3: 'Baik', skor4: 'Sangat Baik' },
      { id: 'r6-2', aspek: 'Fungsi Sensor', kriteria: 'Sensor kelembaban membaca dengan akurat', skor1: 'Tidak Akurat', skor2: 'Kurang Akurat', skor3: 'Akurat', skor4: 'Sangat Akurat' },
      { id: 'r6-3', aspek: 'Sistem Pengadukan', kriteria: 'Motor mengaduk sampah secara teratur', skor1: 'Tidak Bergerak', skor2: 'Kurang Teratur', skor3: 'Teratur', skor4: 'Sangat Teratur' },
      { id: 'r6-4', aspek: 'Hasil Kompos', kriteria: 'Kualitas kompos yang dihasilkan', skor1: 'Buruk', skor2: 'Cukup', skor3: 'Baik', skor4: 'Sangat Baik' },
    ],
    uploads: [
      { id: 'up6-1', judul: 'Video Demo Komposter', deskripsi: 'Demonstrasi kerja komposter otomatis', fileName: 'demo-komposter.mp4', fileSize: '15.20 MB', uploadedAt: '25 Okt 2026' },
    ],
  },
];

export const STEM_PROJECT_CATEGORIES = [...new Set(STEM_PROJECTS.map(p => p.category))];
