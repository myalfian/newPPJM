import React, { useState } from 'react';
import {
  Cpu,
  FileCode2,
  Sparkles,
  CheckCircle2,
  Download,
  ExternalLink,
  Layers,
  ChevronRight,
  Maximize2,
  X,
  User,
  Clock,
  ArrowRight,
  Award,
  Zap,
  Gauge,
  Microscope,
  Info
} from 'lucide-react';
import {
  StemWorksheetItem,
  StemPortfolioItem,
  StemRubricItem
} from './types';

// ========================
// MOCK DATA: STEM WORKSHEETS
// ========================
const STEM_WORKSHEETS: StemWorksheetItem[] = [
  {
    id: 'ws-iot-irrigation',
    title: 'Sistem Otomasi Irigasi Hidroponik Berbasis ESP32 & IoT',
    category: 'Internet of Things (IoT)',
    targetLevel: 'Kelas IX SMP Plus JM',
    duration: '4 Pekan Eksperimen',
    objective:
      'Membekali santri kemampuan merancang sistem otomatisasi penyiraman tanaman dengan memanfaatkan sensor kelembaban tanah kapasitif, mikrokontroler ESP32, dan pemantauan real-time melalui protokol MQTT.',
    context:
      'Pondok Pesantren Jauharul Maknuun memiliki greenhouse hidroponik santri. Melalui proyek ini, santri memecahkan tantangan efisiensi penyiraman air secara otomatis saat kelembaban tanah berada di bawah ambang batas yang ditentukan.',
    setupPhoto:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    toolsAndMaterials: [
      'Mikrokontroler ESP32 NodeMCU 38-Pin',
      'Capacitive Soil Moisture Sensor V2.0',
      'Modul Relay 5V 1-Channel dengan Optocoupler',
      'Pompa Mini Submersible 5V DC & Selang Akuaponik',
      'Panel Surya Mini 20W + Modul TP4056 Charger Baterai 18650',
      'Papan Rangkaian Breadboard & Kabel Jumper Male-Female'
    ],
    rubric: [
      {
        id: 'r1',
        category: 'Inovasi & Desain',
        weight: '25%',
        criteria: 'Orisinalitas skema sirkuit dan integrasi dashboard pemantauan cloud.',
        scaleDescription: 'Sangat Baik (85-100): Rangkaian rapi, terenkripsi, hemat daya.'
      },
      {
        id: 'r2',
        category: 'Metodologi & Kalibrasi',
        weight: '30%',
        criteria: 'Ketepatan kalibrasi batas kering/basah sensor tanah pada media tanam.',
        scaleDescription: 'Sangat Baik (85-100): Margin error pembacaan sensor < 3%.'
      },
      {
        id: 'r3',
        category: 'Hasil Pengujian Alat',
        weight: '30%',
        criteria: 'Ketepatan pompa menyiram dan berhenti otomatis saat target kelembaban tercapai.',
        scaleDescription: 'Sangat Baik (85-100): Respon aktuator < 1.5 detik, nihil kebocoran.'
      },
      {
        id: 'r4',
        category: 'Dokumentasi & Presentasi',
        weight: '15%',
        criteria: 'Kerapian buku kerja proyek (worksheet) dan pemaparan di depan kelas.',
        scaleDescription: 'Sangat Baik (85-100): Sistematika runtut dan percaya diri.'
      }
    ]
  },
  {
    id: 'ws-water-filtration',
    title: 'Purifier Air Minum Nanofiltrasi Karbon Aktif & Pasir Silika',
    category: 'Sains Kimia Lingkungan',
    targetLevel: 'Kelas VIII SMP Plus JM',
    duration: '3 Pekan Laboratorium',
    objective:
      'Menguji efektivitas adsorpsi karbon aktif tempurung kelapa dan pasir silika dalam menurunkan nilai Total Dissolved Solids (TDS) serta menetralkan pH air sumur payau kawasan pesisir.',
    context:
      'Sumber air tanah di kawasan pesisir Sidayu memiliki kadar garam dan mineral tinggi. Santri mendesain filter tabung bertingkat untuk menghasilkan air bersih layak pakai bagi lingkungan asrama pesantren.',
    setupPhoto:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    toolsAndMaterials: [
      'Tabung Silinder Akrilik Transparan 4 Tingkat',
      'Karbon Aktif Granular Standar Food Grade',
      'Pasir Silika Bangka Berbagai Ukuran Mesh (Mesh 14-20)',
      'Zeolit Alam Teraktivasi Malang',
      'TDS Meter Digital & Kertas Indikator pH Universal',
      'Chamber Lampu Ultraviolet (UV) Sterilisasi Kuman'
    ],
    rubric: [
      {
        id: 'r5',
        category: 'Inovasi & Desain',
        weight: '25%',
        criteria: 'Susunan urutan media filtrasi dari partikel kasar ke halus.',
        scaleDescription: 'Sangat Baik (85-100): Aliran air tidak mampet dan laminer.'
      },
      {
        id: 'r6',
        category: 'Metodologi & Kalibrasi',
        weight: '30%',
        criteria: 'Ketelitian pencatatan laju debit air (liter/jam) dan sampling berkala.',
        scaleDescription: 'Sangat Baik (85-100): 5 kali pengujian data tercatat valid.'
      },
      {
        id: 'r7',
        category: 'Hasil Pengujian Air',
        weight: '30%',
        criteria: 'Penurunan angka TDS di bawah 50 ppm dan pH stabil di angka 6.8 - 7.4.',
        scaleDescription: 'Sangat Baik (85-100): Air jernih tanpa bau dan rasa.'
      },
      {
        id: 'r8',
        category: 'Dokumentasi & Presentasi',
        weight: '15%',
        criteria: 'Penyusunan laporan ilmiah sains sederhana dengan grafik komparasi.',
        scaleDescription: 'Sangat Baik (85-100): Analisis data komprehensif.'
      }
    ]
  },
  {
    id: 'ws-solar-tracker',
    title: 'Miniatur Solar Tracker Dual-Axis Otomatis Berbasis Sensor LDR',
    category: 'Rekayasa Mekatronika',
    targetLevel: 'Kelas IX SMP Plus JM',
    duration: '3 Pekan Perakitan',
    objective:
      'Merancang mekanisme dudukan panel surya yang mampu bergerak mengikuti arah pergerakan matahari menggunakan 4 sensor LDR dan 2 motor servo micro SG90.',
    context:
      'Panel surya statis memiliki efisiensi rendah di pagi dan sore hari. Melalui proyek mekatronika ini, santri memprogram algoritma logika perbandingan cahaya agar panel surya selalu tegak lurus dengan sudut datang cahaya matahari.',
    setupPhoto:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    toolsAndMaterials: [
      'Arduino Nano V3 Atmega328P',
      '2 Unit Micro Servo Motor SG90 9g',
      '4 Unit Sensor Light Dependent Resistor (LDR) 5mm',
      'Mini Panel Surya 6V 1W',
      'Struktur Rangka Cetak 3D PLA Dual-Axis Bracket',
      'Modul Step-Down DC-DC LM2596'
    ],
    rubric: [
      {
        id: 'r9',
        category: 'Inovasi & Mekanika',
        weight: '25%',
        criteria: 'Keseimbangan mekanis bracket cetak 3D dan kelancaran putaran servo.',
        scaleDescription: 'Sangat Baik (85-100): Gerakan mulus tanpa jitter getaran.'
      },
      {
        id: 'r10',
        category: 'Metodologi & Koding',
        weight: '30%',
        criteria: 'Koding algoritma deadband toleransi cahaya agar motor tidak boros baterai.',
        scaleDescription: 'Sangat Baik (85-100): Efisiensi koding bersih dan minim loop delay.'
      },
      {
        id: 'r11',
        category: 'Hasil Pengukuran Daya',
        weight: '30%',
        criteria: 'Peningkatan daya voltase dan arus keluaran dibanding panel statis.',
        scaleDescription: 'Sangat Baik (85-100): Kenaikan efisiensi daya terukur > 25%.'
      },
      {
        id: 'r12',
        category: 'Dokumentasi & Presentasi',
        weight: '15%',
        criteria: 'Kemampuan menjelaskan prinsip kerja fotolistrik dan kendali servo.',
        scaleDescription: 'Sangat Baik (85-100): Presentasi lugas disertai simulasi live.'
      }
    ]
  }
];

// ========================
// MOCK DATA: STEM PORTFOLIO
// ========================
const STEM_PORTFOLIO: StemPortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Sistem Otomasi Penyiram Tanaman Hidroponik Berbasis ESP32',
    category: 'Internet of Things (IoT)',
    studentName: 'Ahmad Zaki, M. Fikri & M. Rizky',
    studentClass: 'Kelas IX-A (Tim Robotika PPJM)',
    photoUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    description:
      'Karya inovasi tim robotika santri yang memadukan sensor kelembaban kapasitif anti-korosi dengan mikrokontroler ESP32 untuk memonitor kebun sayur pakcoy dan selada hidroponik pesantren. Dilengkapi modul notifikasi Telegram otomatis saat tangki air hampir kosong.',
    procedure: [
      'Merancang skema kelistrikan di aplikasi Fritzing dengan proteksi relay optocoupler.',
      'Mengkalibrasi nilai ADC sensor tanah kapasitif pada kondisi kering (kadar 0%) dan jenuh air (100%).',
      'Menulis kode firmware Arduino C++ dengan protokol deep-sleep untuk menghemat konsumsi daya baterai.',
      'Mengintegrasikan komunikasi Wi-Fi ESP32 ke broker MQTT lokal pesantren.',
      'Menguji ketahanan alat selama 14 hari berturut-turut di greenhouse santri.'
    ],
    results:
      'Sistem berhasil menghemat penggunaan air penyiraman hingga 42% dibanding penyiraman manual, dengan akurasi pemicuan pompa mencapai 98.4% sesuai jadwal kelembaban optimum tanaman.',
    stats: [
      { label: 'Efisiensi Air', value: '42%' },
      { label: 'Respon Pompa', value: '< 1.2 detik' },
      { label: 'Durasi Uji', value: '14 Hari' }
    ],
    completionDate: 'November 2025'
  },
  {
    id: 'port-2',
    title: 'Purifier Air Minum Nanofiltrasi Karbon Aktif Kelapa Sawit',
    category: 'Sains Kimia Terapan',
    studentName: 'Aisyah Nur F., Nabila Azzahra & Tim Riset Putri',
    studentClass: 'Kelas VIII-B (KIR Santriwati)',
    photoUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    description:
      'Riset eksperimental santriwati mengolah limbah cangkang kelapa sawit menjadi karbon aktif berpori nano guna menjernihkan air sumur payau di pesisir Gresik hingga memenuhi standar baku mutu air minum Kementerian Kesehatan.',
    procedure: [
      'Proses pirolisis cangkang sawit pada suhu 600°C di tungku pembakaran laboratorium.',
      'Aktivasi kimia menggunakan larutan asam sitrat pekat dan pencucian hingga pH netral.',
      'Penyusunan lapisan bertingkat: busa medis, pasir silika, zeolit, dan karbon aktif nano.',
      'Pengujian mikrobiologi dan uji Total Dissolved Solids (TDS) sebelum dan sesudah filtrasi.',
      'Penyinaran tahap akhir dengan tabung sinar Ultraviolet C (UVC) berdaya 11 Watt.'
    ],
    results:
      'Nilai TDS air baku sumur payau turun drastis dari 310 ppm menjadi 22 ppm (kategori sangat jernih & steril), serta angka kuman Escherichia coli tereliminasi hingga 100%.',
    stats: [
      { label: 'TDS Akhir', value: '22 ppm' },
      { label: 'Sterilisasi E.Coli', value: '100%' },
      { label: 'Debit Aliran', value: '45 L/Jam' }
    ],
    completionDate: 'Januari 2026'
  },
  {
    id: 'port-3',
    title: 'Miniatur Solar Tracker Dual-Axis Pelacak Sinar Surya',
    studentName: 'M. Hilman & Faris Ihsan',
    category: 'Rekayasa Mekatronika',
    studentClass: 'Kelas IX-B (Klub Sains Fisika)',
    photoUrl:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    description:
      'Prototipe pembangkit listrik tenaga surya cerdas yang secara otomatis mengarahkan sudut hadap panel mengikuti posisi matahari dari fajar hingga senja menggunakan motor servo mikro berakurasi tinggi.',
    procedure: [
      'Pencetakan komponen poros ganda menggunakan mesin 3D printer filamen PETG tahan panas.',
      'Penyusunan empat partisi sensor LDR dengan sekat silang untuk mendeteksi bayangan cahaya.',
      'Pemrograman logika diferensial pada chip ATmega328P untuk membandingkan intensitas cahaya kiri-kanan dan atas-bawah.',
      'Pemasangan voltmeter digital mini untuk membaca arus milliampere dan tegangan listrik.',
      'Perekaman data komparasi daya keluaran setiap 30 menit dari pukul 07.00 sampai 17.00 WIB.'
    ],
    results:
      'Panel surya pelacak matahari menghasilkan peningkatan total energi serapan sebesar 31.8% lebih tinggi per hari dibandingkan panel statis dengan sudut kemiringan tetap.',
    stats: [
      { label: 'Peningkatan Daya', value: '+31.8%' },
      { label: 'Akurasi Sudut', value: '± 2.5 Derajat' },
      { label: 'Konsumsi Servo', value: '< 45 mA' }
    ],
    completionDate: 'Februari 2026'
  },
  {
    id: 'port-4',
    title: 'Smart Trash Can Sensor Ultrasonik Pendeteksi Kapasitas Sampah',
    studentName: 'Zidan Al-Farisi & Tim IT Santri',
    category: 'Smart Pesantren',
    studentClass: 'Kelas VII-A (Pemula STEM)',
    photoUrl:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    description:
      'Tempat sampah higienis tanpa sentuhan tangan yang membuka penutup secara otomatis ketika santri mendekat, serta mengirimkan indikator lampu LED merah dan buzzer jika volume sampah telah mencapai 90%.',
    procedure: [
      'Memasang sensor ultrasonik HC-SR04 di bagian luar depan untuk mendeteksi gestur tangan.',
      'Memasang sensor ultrasonik kedua di bagian bawah tutup untuk mengukur ketinggian volume sampah.',
      'Menghubungkan servo micro ke engsel tutup tempat sampah dengan mekanisme kawat tuas.',
      'Merangkai modul baterai isi ulang 18650 dengan sirkuit pengaman short-circuit.',
      'Uji coba buka-tutup sebanyak 500 kali di area kantin dan koridor kelas.'
    ],
    results:
      'Meningkatkan kepatuhan santri dalam membuang sampah pada tempatnya hingga 95% dan mencegah tumpahan sampah dengan peringatan kapasitas tepat waktu.',
    stats: [
      { label: 'Jarak Deteksi', value: '15 cm' },
      { label: 'Kecepatan Buka', value: '0.4 Detik' },
      { label: 'Ketahanan Baterai', value: '7 Hari' }
    ],
    completionDate: 'Maret 2026'
  }
];

export const StemAreaSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'worksheet' | 'portfolio'>('worksheet');
  const [selectedWorksheet, setSelectedWorksheet] = useState<StemWorksheetItem>(STEM_WORKSHEETS[0]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<StemPortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ========================================================= */}
      {/* SUB-SECTION TOGGLER: WORKSHEET vs PORTOFOLIO */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Laboratorium Sains & Robotika Santri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            STEM & Riset Terapan PPJM
          </h2>
        </div>

        {/* Pill Sub-Navigation Switcher */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('worksheet')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 active:scale-[0.98] ${
              activeSubTab === 'worksheet'
                ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Worksheet Proyek</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('portfolio')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 active:scale-[0.98] ${
              activeSubTab === 'portfolio'
                ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Portofolio Siswa</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KONTEN 1: WORKSHEET PROYEK STEM & RUBRIK PENILAIAN */}
      {/* ========================================================= */}
      {activeSubTab === 'worksheet' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Selector Proyek Worksheet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STEM_WORKSHEETS.map((ws) => {
              const isSelected = selectedWorksheet.id === ws.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setSelectedWorksheet(ws)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/70 shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-full">
                      {ws.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-2 line-clamp-2">
                      {ws.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span>{ws.targetLevel}</span>
                    <span>{ws.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Worksheet yang Dipilih */}
          <div className="bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
            {/* Header Proyek */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                  {selectedWorksheet.category}
                </span>
                <span className="text-xs text-zinc-400">• {selectedWorksheet.targetLevel}</span>
                <span className="text-xs text-zinc-400">• Durasi: {selectedWorksheet.duration}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {selectedWorksheet.title}
              </h3>
            </div>

            {/* Split Grid: Foto Dokumentasi Setup & Narasi Konteks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Foto Dokumentasi Setup (aspect-[16/10], rounded-xl) */}
              <div
                className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs cursor-pointer group"
                onClick={() => setLightboxImage(selectedWorksheet.setupPhoto)}
                title="Klik untuk perbesar dokumentasi setup alat"
              >
                <img
                  src={selectedWorksheet.setupPhoto}
                  alt={selectedWorksheet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider block">
                    Dokumentasi Setup Laboratorium
                  </span>
                  <span className="text-xs font-bold drop-shadow-sm">
                    {selectedWorksheet.title}
                  </span>
                </div>
              </div>

              {/* Narasi Konteks & Tujuan Proyek */}
              <div className="lg:col-span-7 space-y-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                    <Microscope className="w-4 h-4 text-blue-600" />
                    <span>Tujuan Pembelajaran Proyek:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {selectedWorksheet.objective}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1.5">
                    Latar Belakang & Konteks Eksperimen:
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedWorksheet.context}
                  </p>
                </div>

                {/* Alat & Bahan */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">
                    Daftar Alat & Bahan Praktikum:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedWorksheet.toolsAndMaterials.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rubrik Penilaian Interaktif (Mobile Card List, Desktop Clean Table) */}
            <div className="space-y-4 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/70">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    Rubrik & Standar Penilaian Proyek
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Pedoman evaluasi objektivitas hasil karya sains santri oleh guru pengampu STEM.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                  Total Bobot: 100%
                </span>
              </div>

              {/* Tampilan Desktop: Clean Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-700 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Kategori Kriteria</th>
                      <th className="py-3 px-3 text-center">Bobot</th>
                      <th className="py-3 px-4">Deskripsi Indikator</th>
                      <th className="py-3 px-4">Skala Penilaian Unggul</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                    {selectedWorksheet.rubric.map((r) => (
                      <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">
                          {r.category}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                            {r.weight}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{r.criteria}</td>
                        <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-400 font-medium">
                          {r.scaleDescription}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tampilan Mobile: Adaptif Card List */}
              <div className="md:hidden space-y-3">
                {selectedWorksheet.rubric.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {r.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                        Bobot {r.weight}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {r.criteria}
                    </p>
                    <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
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
      {/* KONTEN 2: PORTOFOLIO KARYA SISWA STEM */}
      {/* ========================================================= */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Galeri Portofolio Proyek Santri
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500">
                Karya orisinal santri SMP Plus Jauharul Maknuun yang telah lolos uji coba laboratorium.
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Menampilkan {STEM_PORTFOLIO.length} Karya Terpilih
            </span>
          </div>

          {/* Cards Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {STEM_PORTFOLIO.map((item) => (
              <article
                key={item.id}
                className="group bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    onClick={() => setSelectedPortfolio(item)}
                    title="Klik untuk detail proyek"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-blue-300 font-medium block">
                        {item.studentClass}
                      </span>
                      <h4 className="text-base font-bold leading-tight drop-shadow-md">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{item.studentName}</span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      {item.stats.map((st, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl text-center border border-zinc-200/50 dark:border-zinc-800/50"
                        >
                          <span className="text-[10px] text-zinc-400 block truncate">
                            {st.label}
                          </span>
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                            {st.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPortfolio(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200/60 dark:border-blue-800/60 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span>Lihat Prosedur & Hasil Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL PORTOFOLIO: STEP-BY-STEP & HASIL TERUKUR */}
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
            <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                  {selectedPortfolio.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  {selectedPortfolio.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPortfolio(null)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {/* Info Kreator & Waktu */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {selectedPortfolio.studentName}
                  </span>
                  <span className="text-zinc-400">({selectedPortfolio.studentClass})</span>
                </div>
                <span className="text-zinc-400">Selesai: {selectedPortfolio.completionDate}</span>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Deskripsi Proyek
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {selectedPortfolio.description}
                </p>
              </div>

              {/* Prosedur Pengerjaan (Step-by-step Numbered List) */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2.5">
                  Prosedur & Langkah Kerja Perakitan
                </h4>
                <ol className="space-y-2">
                  {selectedPortfolio.procedure.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Hasil & Kesimpulan Terukur */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hasil Pengujian & Kesimpulan Terukur:</span>
                </div>
                <p className="text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
                  {selectedPortfolio.results}
                </p>
              </div>
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
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[16/10] w-full bg-black">
              <img
                src={lightboxImage}
                alt="Setup preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

