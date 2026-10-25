import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Clock3,
  CalendarCheck2,
  Filter,
  Search,
  Share2,
  ChevronRight,
  Download,
  Sparkles,
  Info,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NavBarTabs } from '../components/common/NavBarTabs';

export type AgendaTimelineStatus = 'all' | 'current' | 'future' | 'historical';

export interface AgendaItem {
  id: string;
  title: string;
  timelineStatus: 'historical' | 'current' | 'future';
  date: string;
  time: string;
  month: string;
  year: string;
  category: 'Tahfidz' | 'Salafiyah & Turats' | 'Sains & STEM' | 'Bahasa Asing' | 'Ujian & PSB' | 'Sosial & Dakwah';
  location: string;
  targetAudience: string;
  description: string;
  coordinator: string;
  badge?: string;
  rundown?: { time: string; activity: string }[];
  image?: string;
}

const AGENDA_DATA: AgendaItem[] = [
  // --- CURRENT AGENDA (Bulan Ini / Sedang Berlangsung) ---
  {
    id: 'cur-1',
    title: 'Karantina Ziyadah Murojaah Hafalan Al-Qur\'an Juz 1 - 30',
    timelineStatus: 'current',
    date: '24 - 30 Oktober 2026',
    time: '04:30 - 21:00 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Tahfidz',
    location: 'Masjid Utama Pondok Pesantren Jauharul Maknuun',
    targetAudience: 'Seluruh Santri Program Takhassus Tahfidz',
    coordinator: 'Ustadz Muhammad Syukron, M.Pd. (Koord. Tahfidz)',
    badge: 'Sedang Berlangsung',
    description: 'Program penguatan mutqin hafalan dengan pembagian halaqoh intensif 5 juz per hari. Santri didampingi musyrif bersanad dan dipantau menggunakan asisten suara Murojaah AI mandiri untuk ketepatan makharijul huruf.',
    rundown: [
      { time: '04:30 - 06:00', activity: 'Ziyadah setor hafalan baru ba\'da Shubuh' },
      { time: '08:30 - 11:00', activity: 'Murojaah mandiri audio lab santri' },
      { time: '13:30 - 15:00', activity: 'Tasmi\' hafalan antar pasangan santri (Tadarus Pasangan)' },
      { time: '19:30 - 21:00', activity: 'Simaan akbar di hadapan Asatidz Pengasuh' }
    ],
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur-2',
    title: 'Praktikum STEM: Otomasi Penyiram Hidroponik Mikrokontroler ESP32',
    timelineStatus: 'current',
    date: '28 Oktober 2026',
    time: '08:00 - 11:30 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Sains & STEM',
    location: 'Laboratorium Robotika & Rekayasa Sains PPJM',
    targetAudience: 'Santri Putra & Putri Jenjang Wustho (Kelas VIII & IX)',
    coordinator: 'Ir. Ahmad Zulkarnain & Tim Lab STEM PPJM',
    badge: 'Pekan Ini',
    description: 'Sesi perakitan sensor capacitive soil moisture, integrasi modul relay 4-channel, dan kalibrasi sistem irigasi otomatis hemat air 40% untuk kebun hidroponik pesantren.',
    rundown: [
      { time: '08:00 - 08:45', activity: 'Pemaparan teori sirkuit elektronika & pemrograman C++' },
      { time: '08:45 - 10:30', activity: 'Perakitan hardware, soldering aman, & pengujian sensor' },
      { time: '10:30 - 11:30', activity: 'Uji coba penyemprotan air otomatis di greenhouse' }
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur-3',
    title: 'Kajian Akbar Kitab Kuning Balaghah Al-Jauharul Maknuun',
    timelineStatus: 'current',
    date: 'Setiap Malam Jum\'at (Bulan Oktober)',
    time: 'Ba\'da Maghrib - 20:30 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Salafiyah & Turats',
    location: 'Serambi Ndalem Pengasuh PPJM',
    targetAudience: 'Santri Ulya, Alumni, dan Masyarakat Umum',
    coordinator: 'Majelis Ta\'lim & Mudir Madrasah Diniyah',
    badge: 'Rutin Mingguan',
    description: 'Pengajian bandongan mendalam membedah bait-bait kaidah ilmu Ma\'ani, Bayan, dan Badi\' dalam matan Jauharul Maknuun karya Syaikh Abdurrahman al-Akhdhari bersanad muttashil.',
    rundown: [
      { time: '18:15 - 19:00', activity: 'Sholat Maghrib berjamaah & dzikir ratibul haddad' },
      { time: '19:00 - 20:15', activity: 'Mau\'izhah & kajian teks kitab kuning oleh Pengasuh' },
      { time: '20:15 - 20:30', activity: 'Tanya jawab santri & penutupan doa barokah' }
    ],
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80'
  },

  // --- FUTURE AGENDA (Mendatang / Rencana Bulan-Bulan Berikutnya) ---
  {
    id: 'fut-1',
    title: 'Simulasi Try Out Ujian Sertifikasi Mandarin HSK 1 & 2',
    timelineStatus: 'future',
    date: '12 November 2026',
    time: '08:30 - 12:00 WIB',
    month: 'November',
    year: '2026',
    category: 'Bahasa Asing',
    location: 'Ruang Multimedia Bahasa PPJM',
    targetAudience: 'Santri Peminatan Bahasa Internasional',
    coordinator: 'Laoshi Chen Wei & Ustadzah Nur Laila, M.Pd.',
    badge: 'Mendatang',
    description: 'Try Out terstandarisasi untuk mengukur kemahiran mendengar (tingli), membaca (yuedu), dan percakapan adab kesantrian dalam dialek standar Putonghua.',
    rundown: [
      { time: '08:30 - 09:30', activity: 'Sesi 1: Ujian Listening Audio Pinyin (Tingli)' },
      { time: '09:45 - 11:00', activity: 'Sesi 2: Ujian Reading & Tata Bahasa Hanzi' },
      { time: '11:00 - 12:00', activity: 'Evaluasi langsung & pembahasan kunci jawaban' }
    ],
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-2',
    title: 'Ujian Akhir Semester Gasal Madrasah Diniyah Salafiyah (Imtihan)',
    timelineStatus: 'future',
    date: '05 - 15 Desember 2026',
    time: '07:30 - 13:00 WIB',
    month: 'Desember',
    year: '2026',
    category: 'Salafiyah & Turats',
    location: 'Gedung Madrasah Salafiyah PPJM Lasem',
    targetAudience: 'Seluruh Santri Jenjang Ula, Wustho, dan Ulya',
    coordinator: 'Dewan Penguji Imtihan Madrasah Diniyah',
    badge: 'Terjadwal',
    description: 'Evaluasi tertulis dan lisan membaca kitab kuning tanpa harakat (fathul kutub) meliputi Fan Nahwu, Sharaf, Fiqih Fathul Qorib, Hadits Arba\'in, dan Akhlaq Lil Banin.',
    rundown: [
      { time: '07:30 - 09:30', activity: 'Ujian Tulis Materi Fan Fiqih & Ushul' },
      { time: '10:00 - 13:00', activity: 'Ujian Lisan Sorogan / Baca Kitab di hadapan Asatidz' }
    ],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-3',
    title: 'Ekspo Gelar Karya Inovasi Robotika Santri & Bazar Kewirausahaan',
    timelineStatus: 'future',
    date: '24 - 25 Desember 2026',
    time: '08:00 - 16:00 WIB',
    month: 'Desember',
    year: '2026',
    category: 'Sains & STEM',
    location: 'Halaman Utama & Lapangan Olahraga Pesantren',
    targetAudience: 'Santri, Wali Santri, Pelajar Se-Kabupaten Gresik',
    coordinator: 'Organisasi Santri PPJM (OSPPJM) & Lab STEM',
    badge: 'Terjadwal',
    description: 'Pameran terbuka karya sains santri (robot line follower, sensor cuaca mikro, filtrasi air) dipadukan dengan bazar produk mandiri santri dan seminar digital entrepreneurship.',
    rundown: [
      { time: '08:00 - 09:00', activity: 'Pembukaan resmi oleh Mudir Pengasuh & Pimpinan Dinas' },
      { time: '09:00 - 12:00', activity: 'Demonstrasi robotika & uji tanding wahana STEM santri' },
      { time: '13:00 - 16:00', activity: 'Bazar kewirausahaan santri & panggung kreasi seni islami' }
    ],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fut-4',
    title: 'Pembukaan Pendaftaran Santri Baru (PSB) Gelombang I TA 2027/2028',
    timelineStatus: 'future',
    date: '02 Januari - 28 Februari 2027',
    time: 'Layanan Online 24 Jam & Offline 08:00 - 15:00 WIB',
    month: 'Januari',
    year: '2027',
    category: 'Ujian & PSB',
    location: 'Sekretariat Panitia PSB & Portal Online PPJM',
    targetAudience: 'Calon Santri Baru & Para Orang Tua Wali',
    coordinator: 'Panitia Penerimaan Santri Baru (PSB) PPJM',
    badge: 'Terjadwal',
    description: 'Penerimaan santri baru program Tahfidz Al-Qur\'an 30 Juz Bersanad, Madrasah Diniyah Salafiyah, dan Pendidikan Formal Terpadu Terakreditasi "A" BAN-PDM.',
    rundown: [
      { time: '08:00 - 12:00', activity: 'Pelayanan verifikasi berkas & konsultasi program wali santri' },
      { time: '13:00 - 15:00', activity: 'Tes observasi tilawah Al-Qur\'an & wawancara komitmen santri' }
    ],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },

  // --- HISTORICAL AGENDA (Arsip Kegiatan Lampau / Telah Terlaksana) ---
  {
    id: 'his-1',
    title: 'Wisuda Santri Tahfidz 30 Juz & Khotmil Qur\'an Bil Ghoib Angkatan XV',
    timelineStatus: 'historical',
    date: '18 Juli 2026',
    time: '07:30 - 12:30 WIB',
    month: 'Juli',
    year: '2026',
    category: 'Tahfidz',
    location: 'Gedung Serbaguna Pondok Pesantren Jauharul Maknuun',
    targetAudience: 'Para Hufadz, Orang Tua Wali Santri, & Tokoh Ulama',
    coordinator: 'Dewan Masyayikh & Lembaga Tahfidz PPJM',
    badge: 'Selesai Terlaksana',
    description: 'Sebanyak 42 santri putra dan putri resmi diwisuda dan menerima ijazah sanad muttashil 30 Juz Al-Qur\'an setelah menuntaskan ujian tasmi\' bil ghoib sekali duduk 30 Juz tanpa salah.',
    rundown: [
      { time: '07:30 - 09:00', activity: 'Khotmil Qur\'an pembacaan surat-surat pendek & doa khatam' },
      { time: '09:00 - 11:00', activity: 'Prosesi wisuda, penyerahan syahadah sanad, & sungkeman haru' },
      { time: '11:00 - 12:30', activity: 'Mau\'idhoh Hasanah oleh KH. Pengasuh & ramah tamah' }
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'his-2',
    title: 'Peringatan Hari Santri Nasional & Apel Akbar Khidmat Santri Lasem Sidayu',
    timelineStatus: 'historical',
    date: '22 Oktober 2026',
    time: '06:30 - 10:00 WIB',
    month: 'Oktober',
    year: '2026',
    category: 'Sosial & Dakwah',
    location: 'Lapangan Upacara Ponpes Jauharul Maknuun',
    targetAudience: 'Ribuan Santri, Alumni, Banom NU, & Masyarakat Sidayu',
    coordinator: 'Pengurus Pesantren & Ikatan Alumni PPJM',
    badge: 'Selesai Terlaksana',
    description: 'Peringatan Hari Santri Nasional bertema "Menyambung Juang Merengkuh Masa Depan", diisi dengan apel akbar seragam sarung putih, defile paskibra santri, dan pembagian beasiswa santri berprestasi.',
    rundown: [
      { time: '06:30 - 08:00', activity: 'Apel akbar & amanat inspektur upacara Pengasuh Pesantren' },
      { time: '08:00 - 09:00', activity: 'Atraksi seni bela diri santri & hadrah sholawat kolosal' },
      { time: '09:00 - 10:00', activity: 'Tumpengan barokah bersama para sesepuh & masyarakat desa' }
    ],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'his-3',
    title: 'Riset Lapangan Sains Mangrove & Ekologi Pesisir Ujungpangkah',
    timelineStatus: 'historical',
    date: '15 September 2026',
    time: '07:00 - 15:00 WIB',
    month: 'September',
    year: '2026',
    category: 'Sains & STEM',
    location: 'Kawasan Konservasi Mangrove Pesisir Ujungpangkah Gresik',
    targetAudience: 'Santri Riset Sains & Kader Pecinta Alam PPJM',
    coordinator: 'Laboratorium Biologi Terapan PPJM',
    badge: 'Selesai Terlaksana',
    description: 'Santri menguji salinitas air payau, meneliti sistem perakaran pohon bakau penahan abrasi, serta menanam 500 bibit mangrove sebagai implementasi fiqih bi\'ah (pelestarian lingkungan hidup).',
    rundown: [
      { time: '07:00 - 08:30', activity: 'Pemberangkatan rombongan armada bus pesantren' },
      { time: '09:00 - 12:00', activity: 'Eksplorasi sensor water quality & pencatatan data keanekaragaman' },
      { time: '13:00 - 15:00', activity: 'Aksi penanaman bibit pohon bakau bersama nelayan lokal' }
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  }
];

const MONTHS_LIST = [
  'Semua Bulan',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const CATEGORIES_LIST = [
  'Semua Kategori',
  'Tahfidz',
  'Salafiyah & Turats',
  'Sains & STEM',
  'Bahasa Asing',
  'Ujian & PSB',
  'Sosial & Dakwah'
];

export const Agenda: React.FC = () => {
  const [timelineFilter, setTimelineFilter] = useState<AgendaTimelineStatus>('current');
  const [selectedMonth, setSelectedMonth] = useState<string>('Semua Bulan');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailModal, setSelectedDetailModal] = useState<AgendaItem | null>(null);

  // Filter Logic
  const filteredAgendas = useMemo(() => {
    return AGENDA_DATA.filter((item) => {
      // Timeline filter
      if (timelineFilter !== 'all' && item.timelineStatus !== timelineFilter) {
        return false;
      }
      // Month filter
      if (selectedMonth !== 'Semua Bulan' && item.month !== selectedMonth) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'Semua Kategori' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchCoord = item.coordinator.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc || matchCoord;
      }
      return true;
    });
  }, [timelineFilter, selectedMonth, selectedCategory, searchQuery]);

  // Status counts for badge indicators
  const currentCount = useMemo(() => AGENDA_DATA.filter(a => a.timelineStatus === 'current').length, []);
  const futureCount = useMemo(() => AGENDA_DATA.filter(a => a.timelineStatus === 'future').length, []);
  const historicalCount = useMemo(() => AGENDA_DATA.filter(a => a.timelineStatus === 'historical').length, []);

  // 1-Click WhatsApp Reminder for Senior / Wali Santri
  const handleShareWA = (item: AgendaItem) => {
    const text = `*PENGUMUMAN AGENDA PP. JAUHARUL MAKNUUN LASEM SIDAYU*\n\n` +
      `📅 *Kegiatan:* ${item.title}\n` +
      `⏰ *Waktu:* ${item.date} (${item.time})\n` +
      `📍 *Tempat:* ${item.location}\n` +
      `👥 *Sasaran:* ${item.targetAudience}\n` +
      `👤 *Penanggung Jawab:* ${item.coordinator}\n\n` +
      `📝 *Rincian:* ${item.description}\n\n` +
      `_Disampaikan resmi melalui Portal Informasi PP Jauharul Maknuun:_\n` +
      `${window.location.origin}/agenda`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-4 space-y-3 sm:space-y-4">
      {/* 1. Folder Breadcrumb Navigation */}
      <NavBarTabs />

      {/* 2. Hero Banner: Kalender Agenda Program Bulanan Pesantren */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-4 sm:p-6 lg:p-7 text-white shadow-m3-2 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
            <CalendarCheck2 className="w-4 h-4 text-emerald-950" />
            <span>Kalender Akademik & Agenda Program</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Agenda Kegiatan Santri Tiap Bulan
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed sm:leading-loose">
            Jadwal terpadu program tahfidz, kajian madrasah diniyah salafiyah, riset laboratorium STEM, ujian penutur bahasa, dan agenda sosial kemasyarakatan Pondok Pesantren Jauharul Maknuun.
          </p>
        </div>

        {/* Action Button: Download Kalender */}
        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="#unduh-kalender"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-glow-gold transition-all cursor-pointer"
            title="Cetak atau simpan jadwal agenda bulanan"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Cetak Jadwal Agenda</span>
          </a>
        </div>
      </div>

      {/* 3. Segmented Timeline Buttons (Current, Future, Historical, All) */}
      <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
          {/* CURRENT TAB */}
          <button
            type="button"
            onClick={() => setTimelineFilter('current')}
            className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              timelineFilter === 'current'
                ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                timelineFilter === 'current' ? 'bg-gold-400' : 'bg-emerald-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                timelineFilter === 'current' ? 'bg-gold-400' : 'bg-emerald-600'
              }`} />
            </span>
            <span>Bulan Ini (Current)</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              timelineFilter === 'current' ? 'bg-gold-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {currentCount}
            </span>
          </button>

          {/* FUTURE TAB */}
          <button
            type="button"
            onClick={() => setTimelineFilter('future')}
            className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              timelineFilter === 'future'
                ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900'
            }`}
          >
            <Clock3 className="w-4 h-4 text-amber-500" />
            <span>Mendatang (Future)</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              timelineFilter === 'future' ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {futureCount}
            </span>
          </button>

          {/* HISTORICAL TAB */}
          <button
            type="button"
            onClick={() => setTimelineFilter('historical')}
            className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              timelineFilter === 'historical'
                ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Arsip (Historical)</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              timelineFilter === 'historical' ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {historicalCount}
            </span>
          </button>

          {/* ALL TAB */}
          <button
            type="button"
            onClick={() => setTimelineFilter('all')}
            className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
              timelineFilter === 'all'
                ? 'bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semua Agenda</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
              timelineFilter === 'all' ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {AGENDA_DATA.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Controls Bar: Search & Dropdowns (Bulan & Kategori) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama agenda, kegiatan, atau penanggung jawab..."
            className="w-full pl-10.5 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Month Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Agenda Cards Feed */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAgendas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg sm:text-xl font-black text-slate-700">
              Tidak Ada Agenda Ditemukan
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Tidak ada agenda program yang sesuai dengan kombinasi filter atau kata kunci pencarian Anda. Silakan ubah opsi filter atau hapus kata pencarian.
            </p>
            <button
              onClick={() => {
                setTimelineFilter('all');
                setSelectedMonth('Semua Bulan');
                setSelectedCategory('Semua Kategori');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
            >
              <span>Reset Semua Filter</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5">
            {filteredAgendas.map((item) => {
              const isCurrent = item.timelineStatus === 'current';
              const isFuture = item.timelineStatus === 'future';
              const isHistorical = item.timelineStatus === 'historical';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-m3-2 transition-all flex flex-col justify-between group ${
                    isCurrent
                      ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                      : isFuture
                      ? 'border-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Image / Header Graphic */}
                    {item.image && (
                      <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                            isCurrent
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : isFuture
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-700 text-slate-100'
                          }`}>
                            {item.badge || (isCurrent ? 'Aktif' : isFuture ? 'Mendatang' : 'Arsip')}
                          </span>

                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-gold-300 text-xs font-bold border border-gold-400/20">
                            {item.category}
                          </span>
                        </div>

                        {/* Bottom Date Pill */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs sm:text-sm font-bold">
                          <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                            <CalendarDays className="w-3.5 h-3.5 text-gold-400" />
                            <span>{item.date}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <h3
                        onClick={() => setSelectedDetailModal(item)}
                        className="font-black text-base sm:text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </h3>

                      {/* Meta List: Time, Location, Target */}
                      <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-semibold text-slate-800">{item.time}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1">{item.targetAudience}</span>
                        </div>
                      </div>

                      {/* Paragraph Excerpt */}
                      <p className="text-sm text-slate-700 font-normal leading-relaxed line-clamp-3 pt-1 border-t border-slate-100">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar Bottom */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailModal(item)}
                      className="text-xs sm:text-sm font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>Lihat Rundown</span>
                      <ChevronRight className="w-4 h-4 text-gold-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWA(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                      title="Ingatkan / Bagikan Rincian Agenda ke WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ke WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Detail Modal Dialog (Rundown & Catatan Pelaksanaan) */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => setSelectedDetailModal(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 p-5 sm:p-7 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    selectedDetailModal.timelineStatus === 'current'
                      ? 'bg-emerald-600 text-white'
                      : selectedDetailModal.timelineStatus === 'future'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-100'
                  }`}>
                    {selectedDetailModal.badge || selectedDetailModal.timelineStatus}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gold-700 uppercase tracking-wider">
                    {selectedDetailModal.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 leading-snug">
                  {selectedDetailModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailModal(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                <span><strong>Tanggal:</strong> {selectedDetailModal.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                <span><strong>Waktu:</strong> {selectedDetailModal.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                <span><strong>Lokasi:</strong> {selectedDetailModal.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                <span><strong>Peserta:</strong> {selectedDetailModal.targetAudience}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider">
                Uraian & Sasaran Program:
              </h4>
              <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed sm:leading-loose">
                {selectedDetailModal.description}
              </p>
            </div>

            {/* Rundown Timeline Table */}
            {selectedDetailModal.rundown && selectedDetailModal.rundown.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider">
                  Susunan Rundown / Sesi Kegiatan:
                </h4>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  {selectedDetailModal.rundown.map((r, i) => (
                    <div key={i} className="p-3 flex items-center justify-between text-xs sm:text-sm gap-3">
                      <span className="font-mono font-bold text-emerald-800 shrink-0 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                        {r.time}
                      </span>
                      <span className="font-semibold text-slate-800 text-right">
                        {r.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinator Info */}
            <div className="p-3 rounded-xl bg-slate-100 text-xs sm:text-sm text-slate-700 flex items-center justify-between">
              <span><strong>Koordinator:</strong> {selectedDetailModal.coordinator}</span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => handleShareWA(selectedDetailModal)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Rincian ke WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDetailModal(null)}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
