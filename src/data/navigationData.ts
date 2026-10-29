import React from 'react';
import {
  Landmark,
  BookOpenCheck,
  Sparkles,
  Trophy,
  Award,
  Atom,
  Images,
  Compass,
  HeartHandshake,
  Layers,
  GraduationCap,
  BookOpen,
  Cpu,
  Camera,
  Video,
  LayoutDashboard,
  Newspaper,
  Globe,
  Gauge,
  Image as ImageIcon,
  CheckCircle2,
  Volume2,
  Activity,
  Palette,
  User,
  Users,
  CalendarDays,
  Clock,
  ShieldCheck,
  Monitor,
  Building2,
  School
} from 'lucide-react';

export interface NavSubItem {
  title: string;
  href: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Custom OSIS Badge Icon using official emblem image
export const OsisIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) =>
  React.createElement('img', {
    src: '/logo-osis.png',
    alt: 'Logo OSIS',
    className: `object-contain block shrink-0 select-none ${className}`,
    loading: 'eager'
  });

export interface NavSubSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  items: NavSubItem[];
}

export interface TabColorConfig {
  badgeBg: string;
  activeBadgeBg: string;
  activeText: string;
  activeDot: string;
}

export interface NavTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isDropdown: boolean;
  color: TabColorConfig;
  items?: NavSubItem[];
  sections?: NavSubSection[];
}

import { UserRole } from '../lib/supabase';

export interface AdminModuleItem {
  id: string;
  title: string;
  shortLabel: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  category: 'core' | 'academic' | 'media' | 'system';
  publicCategory?: string;
  publicHref?: string;
  badge?: string;
}

// Single Source of Truth for Public Portal Navigation (Synchronized 1:1 with Official Hierarchy)
export const PUBLIC_NAV_TABS: NavTabItem[] = [
  {
    id: 'jm-center',
    label: 'JM Center',
    icon: Landmark,
    href: '/jm-center/sambutan',
    isDropdown: false,
    color: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
      activeBadgeBg: 'bg-[#0f5132] text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/60',
      activeText: 'text-[#073b22]',
      activeDot: 'bg-[#0f5132]',
    },
    sections: [
      {
        title: 'Profil',
        icon: Compass,
        color: 'emerald',
        items: [
          { title: 'Sambutan', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
          { title: 'Sejarah', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
          { title: 'Visi dan Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
        ]
      },
      {
        title: 'Fasilitas',
        icon: Building2,
        color: 'amber',
        items: [
          { title: 'Fasilitas', href: '/jm-center/fasilitas', desc: 'Sarana & prasarana santri dan sekolah', icon: Building2 },
        ]
      },
      {
        title: 'Lembaga',
        icon: Layers,
        color: 'blue',
        items: [
          { title: 'Lembaga', href: '/jm-center/lembaga', desc: 'Pondok pesantren, SMP Plus & Madin', icon: Layers },
        ]
      }
    ],
    items: [
      { title: 'Sambutan', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
      { title: 'Sejarah', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
      { title: 'Visi dan Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
      { title: 'Fasilitas', href: '/jm-center/fasilitas', desc: 'Sarana & prasarana santri dan sekolah', icon: Building2 },
      { title: 'Lembaga', href: '/jm-center/lembaga', desc: 'Pondok pesantren, SMP Plus & Madin', icon: Layers },
    ]
  },
  {
    id: 'programs',
    label: 'Program',
    icon: BookOpenCheck,
    href: '/program-unggulan/amaliyah-pondok',
    isDropdown: false,
    color: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80 group-hover:bg-blue-100 group-hover:text-blue-800',
      activeBadgeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/60',
      activeText: 'text-blue-800',
      activeDot: 'bg-blue-600',
    },
    items: [
      { title: 'Pondok Pesantren', href: '/program-unggulan/amaliyah-pondok', desc: 'Tahfidz, salaf & amaliyah 24 jam', icon: HeartHandshake },
      { title: 'Sekolah (SMP Plus)', href: '/program-unggulan/program-sekolah', desc: 'Kurikulum formal "A" & riset STEM', icon: GraduationCap },
      { title: 'Madrasah Diniyah', href: '/program-unggulan/program-madin', desc: 'Flyer kitab turats & panduan ubudiyah', icon: BookOpenCheck },
    ]
  },
  {
    id: 'smart-jm',
    label: 'SMART JM',
    icon: Cpu,
    href: '/smart-jm/stem/materi',
    isDropdown: false,
    color: {
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80 group-hover:bg-teal-100 group-hover:text-teal-800',
      activeBadgeBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400/60',
      activeText: 'text-teal-900',
      activeDot: 'bg-teal-600',
    },
    sections: [
      {
        title: 'STEM Area',
        icon: Cpu,
        color: 'teal',
        items: [
          { title: 'Materi dan Penugasan', href: '/smart-jm/stem/materi', desc: 'Silabus robotika, IoT & sains digital', icon: Cpu },
          { title: 'Portofolio Siswa', href: '/smart-jm/stem/portofolio', desc: 'Karya inovasi teknologi praktis santri', icon: Sparkles },
        ]
      },
      {
        title: 'Mandarin Class',
        icon: Globe,
        color: 'sky',
        items: [
          { title: 'Materi', href: '/smart-jm/mandarin/materi', desc: 'Pinyin audio & kosakata percakapan', icon: Globe },
          { title: 'Quiz', href: '/smart-jm/mandarin/quiz', desc: 'Kuis interaktif uji hafalan hanzi', icon: CheckCircle2 },
        ]
      },
      {
        title: "Hafidz Qur'an",
        icon: BookOpen,
        color: 'emerald',
        items: [
          { title: "Read Qur'an", href: '/smart-jm/hafidz/read', desc: 'Mushaf Al-Qur’an 30 juz bersanad', icon: BookOpen },
          { title: 'Murojaah', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi bacaan & hafalan santri', icon: Volume2 },
        ]
      }
    ]
  },
  {
    id: 'prestasi',
    label: 'Prestasi',
    icon: Trophy,
    href: '/prestasi',
    isDropdown: false,
    color: {
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80 group-hover:bg-amber-100 group-hover:text-amber-800',
      activeBadgeBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300/60',
      activeText: 'text-amber-900',
      activeDot: 'bg-amber-500',
    },
    items: [
      { title: 'Olimpiade & Sains', href: '/prestasi?kategori=Olimpiade', desc: 'Kompetisi sains & teknologi santri', icon: Award },
      { title: 'Olahraga & Silat', href: '/prestasi?kategori=Olahraga', desc: 'Pencak silat, futsal & kebugaran', icon: Activity },
      { title: 'Seni & Bahasa', href: '/prestasi?kategori=Seni', desc: 'Kaligrafi, hadrah & pidato santri', icon: Palette },
      { title: 'Keagamaan & MQK', href: '/prestasi?kategori=Keagamaan', desc: 'Musabaqah Qiraatil Kutub & Tahfidz', icon: BookOpen },
      { title: 'Umum & Riset', href: '/prestasi?kategori=Umum', desc: 'Karya inovatif & penghargaan umum', icon: Sparkles },
    ]
  },
  {
    id: 'ekskul',
    label: 'Ekskul',
    icon: Sparkles,
    href: '/ekstrakurikuler',
    isDropdown: false,
    color: {
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80 group-hover:bg-purple-100 group-hover:text-purple-800',
      activeBadgeBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/60',
      activeText: 'text-purple-800',
      activeDot: 'bg-purple-600',
    },
    items: [
      { title: 'Sains & Robotik', href: '/ekstrakurikuler?kategori=sains', desc: 'Robotika, IoT & coding sains', icon: Cpu },
      { title: 'Seni & Bahasa', href: '/ekstrakurikuler?kategori=seni', desc: 'Hadrah banjari, kaligrafi, English/Arabic', icon: Palette },
      { title: 'Olahraga & Silat', href: '/ekstrakurikuler?kategori=olahraga', desc: 'Pencak Silat Pagar Nusa & futsal', icon: Activity },
      { title: 'Kepanduan & Agama', href: '/ekstrakurikuler?kategori=kepanduan', desc: 'Pramuka santri & kajian tilawah', icon: Users },
    ]
  },
  {
    id: 'osis',
    label: 'OSIS',
    icon: OsisIcon,
    href: '/osis',
    isDropdown: false,
    color: {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80 group-hover:bg-amber-100 group-hover:text-amber-900',
      activeBadgeBg: 'bg-amber-500 text-white shadow-md shadow-amber-900/30 ring-2 ring-amber-300/80',
      activeText: 'text-amber-950',
      activeDot: 'bg-amber-500',
    },
    items: [
      { title: 'Struktur Pengurus', href: '/osis', desc: 'Bagan & hierarki kabinet santri', icon: Users },
      { title: 'Program Kerja', href: '/osis?tab=program', desc: '5 departemen & program kerja terpadu', icon: Sparkles },
      { title: 'Event & Berita', href: '/osis?tab=event', desc: 'Press release & warta kegiatan OSIS', icon: CalendarDays },
    ]
  },
  {
    id: 'jm-news',
    label: 'JM News',
    icon: Newspaper,
    href: '/jm-news/agenda-bulanan',
    isDropdown: false,
    color: {
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200/80 group-hover:bg-sky-100 group-hover:text-sky-800',
      activeBadgeBg: 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400/60',
      activeText: 'text-sky-900',
      activeDot: 'bg-sky-600',
    },
    items: [
      { title: 'Agenda Bulanan', href: '/jm-news/agenda-bulanan', desc: 'Kalender jadwal terpadu & agenda santri', icon: CalendarDays },
      { title: 'Press Release', href: '/jm-news/press-release', desc: 'Siaran pers resmi, foto dokumentasi & deskripsi', icon: Newspaper },
    ]
  },
  {
    id: 'galeri',
    label: 'Galeri',
    icon: Images,
    href: '/galeri/foto',
    isDropdown: false,
    color: {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80 group-hover:bg-rose-100 group-hover:text-rose-800',
      activeBadgeBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/60',
      activeText: 'text-rose-900',
      activeDot: 'bg-rose-600',
    },
    items: [
      { title: 'Foto', href: '/galeri/foto', desc: 'Dokumentasi asrama & kegiatan santri', icon: Camera },
      { title: 'Video', href: '/galeri/video', desc: 'Dokumenter resmi & kegiatan pondok', icon: Video },
    ]
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: CalendarDays,
    href: '/agenda',
    isDropdown: false,
    color: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
      activeBadgeBg: 'bg-[#0f5132] text-[#d4af37] shadow-md shadow-emerald-950/30 ring-2 ring-[#d4af37]/70',
      activeText: 'text-[#073b22]',
      activeDot: 'bg-[#d4af37]',
    },
    items: [
      { title: 'Kalender Akademik & Pesantren', href: '/agenda', desc: 'Jadwal terpadu kalender akademik & pondok', icon: CalendarDays },
      { title: 'Agenda Terdekat', href: '/agenda?tab=upcoming', desc: 'Hitung mundur kegiatan & event terdekat', icon: Clock },
      { title: 'Agenda Rutin', href: '/agenda?tab=rutin', desc: 'Rutinitas harian, mingguan & bulanan santri', icon: Sparkles },
    ]
  },
];

// Single Source of Truth for Admin CMS Modules (Hierarchically aligned with 10 Public Website Menus)
export const ADMIN_MODULES: AdminModuleItem[] = [
  {
    id: 'editor',
    title: 'Editor Visual Langsung (WYSIWYG)',
    shortLabel: 'Live Editor',
    desc: 'Pratinjau visual interaktif dengan pengeditan langsung per seksi & komponen',
    href: '/admin/editor',
    icon: Monitor,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'Beranda',
    publicHref: '/',
    badge: 'WYSIWYG',
  },
  {
    id: 'dashboard',
    title: 'Pusat Kendali & Statistik Ringkasan',
    shortLabel: 'Pusat Kendali',
    desc: 'Statistik real-time, aktivitas santri, berita & metrik performa',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'pengurus_konten', 'guru_akademik'],
    category: 'system',
    publicCategory: 'Beranda',
    publicHref: '/',
    badge: 'Live',
  },
  // 1. Hero Banner Slider (5 Flyer)
  {
    id: 'slider',
    title: '1. Poster Slider Utama (5 Flyer)',
    shortLabel: 'Poster Slider',
    desc: 'Atur 5 flyer resmi beranda, judul sambutan & tombol aksi jelajah',
    href: '/admin/slider',
    icon: Gauge,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'Beranda',
    publicHref: '/',
    badge: '5 Flyer',
  },
  // 2. JM Center (Profil, Fasilitas, Lembaga)
  {
    id: 'profil',
    title: '2. JM Center (Profil, Fasilitas, Lembaga)',
    shortLabel: 'JM Center',
    desc: 'Kelola sambutan pengasuh, sejarah, visi misi & fasilitas terpadu pondok/sekolah',
    href: '/admin/profil',
    icon: Landmark,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'JM Center',
    publicHref: '/jm-center/sambutan',
  },
  // 3. Program (Pondok, Sekolah, Madin)
  {
    id: 'program',
    title: '3. Program (Pondok, Sekolah, Madin)',
    shortLabel: 'Program Santri',
    desc: 'Kurikulum amaliyah salaf, madin kitab kuning & kurikulum sekolah formal',
    href: '/admin/program',
    icon: Layers,
    roles: ['super_admin', 'pengurus_konten', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'Program',
    publicHref: '/program/pondok',
    badge: 'Kurikulum',
  },
  // 4. Smart JM (STEM Area, Mandarin Class, Hafidz Quran)
  {
    id: 'stem',
    title: '4. Smart JM: Lab Riset STEM',
    shortLabel: 'STEM Area',
    desc: 'Silabus eksperimen sains, teknologi robotika, IoT & portofolio siswa',
    href: '/admin/stem',
    icon: Cpu,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/stem/materi',
    badge: 'Sains & Robotik',
  },
  {
    id: 'mandarin',
    title: '4. Smart JM: Kelas Mandarin',
    shortLabel: 'Mandarin Class',
    desc: 'Bank soal kuis interaktif, rekaman audio pinyin & kartu kosa kata HSK',
    href: '/admin/mandarin',
    icon: Globe,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/mandarin/materi',
    badge: 'Audio HSK',
  },
  {
    id: 'hafidz',
    title: '4. Smart JM: Dewan Tahfidz Qur\'an',
    shortLabel: 'Hafidz Quran',
    desc: 'Daftar 114 Surat 30 Juz, murojaah tajwid & rekam setoran hafalan',
    href: '/admin/hafidz',
    icon: BookOpen,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/hafidz/read',
    badge: '114 Surat',
  },
  // 5. Galeri (Foto & Video Kegiatan)
  {
    id: 'galeri',
    title: '5. Galeri (Foto & Video Kegiatan)',
    shortLabel: 'Galeri Santri',
    desc: 'Unggah dokumentasi foto kegiatan WebP & tautan video dokumenter',
    href: '/admin/galeri',
    icon: ImageIcon,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'Galeri',
    publicHref: '/galeri/foto',
    badge: 'Multi-Foto',
  },
  // 6. Prestasi Santri & Siswa
  {
    id: 'prestasi',
    title: '6. Prestasi Santri & Siswa',
    shortLabel: 'Prestasi Juara',
    desc: 'Input penghargaan, piagam kejuaraan MQK, olimpiade sains & tahfidz',
    href: '/admin/prestasi',
    icon: Trophy,
    roles: ['super_admin', 'pengurus_konten', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'Prestasi',
    publicHref: '/prestasi',
    badge: 'Juara',
  },
  // 7. Ekstrakurikuler
  {
    id: 'ekskul',
    title: '7. Ekstrakurikuler Santri',
    shortLabel: 'Ekstrakurikuler',
    desc: 'Katalog minat bakat: jadwal latihan, pelatih, lokasi & multi-foto ekskul',
    href: '/admin/ekskul',
    icon: Sparkles,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'academic',
    publicCategory: 'Ekstrakurikuler',
    publicHref: '/ekstrakurikuler',
  },
  // 8. OSIS (Struktur, Program, Warta Event)
  {
    id: 'osis',
    title: '8. OSIS (Struktur, Program, Warta Event)',
    shortLabel: 'Portal OSIS',
    desc: 'Bagan organisasi kepengurusan, departemen kabinet santri & dokumentasi event',
    href: '/admin/osis',
    icon: Users,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'OSIS',
    publicHref: '/osis',
    badge: 'Organisasi',
  },
  // 9. Agenda & Kalender
  {
    id: 'agenda',
    title: '9. Agenda & Kalender Kegiatan',
    shortLabel: 'Agenda Kegiatan',
    desc: 'Jadwal kalender akademik pondok, pengajian akbar & agenda santri terdekat',
    href: '/admin/agenda',
    icon: CalendarDays,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'Agenda',
    publicHref: '/agenda',
    badge: 'Kalender',
  },
  // 10. Kontak & Medsos Pop-up
  {
    id: 'kontak',
    title: '10. Kontak & Medsos Pop-up',
    shortLabel: 'Kontak & Medsos',
    desc: 'Hotline WhatsApp admin resmi, saluran info, serta tautan akun Instagram/TikTok/YouTube',
    href: '/admin/kontak',
    icon: HeartHandshake,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'system',
    publicCategory: 'Kontak',
    publicHref: '/',
    badge: 'Hotline',
  },
  // Siaran Pers & Berita
  {
    id: 'berita',
    title: 'Warta Pesantren (Press Release)',
    shortLabel: 'Press Release',
    desc: 'Publikasi siaran pers resmi, foto liputan kegiatan santri & artikel berita',
    href: '/admin/berita',
    icon: Newspaper,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'JM News',
    publicHref: '/jm-news/press-release',
    badge: 'Artikel',
  },
  // Profil Akun
  {
    id: 'akun',
    title: 'Pengaturan Akun & Keamanan',
    shortLabel: 'Profil Saya',
    desc: 'Data personal operator, ganti kata sandi & hak akses role pengguna',
    href: '/admin/akun',
    icon: User,
    roles: ['super_admin', 'pengurus_konten', 'guru_akademik'],
    category: 'system',
    publicCategory: 'Akun',
    publicHref: '/profil',
    badge: 'Keamanan',
  },
];
