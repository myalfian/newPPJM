import React from 'react';
import {
  Landmark,
  BookOpenCheck,
  Sparkles,
  Trophy,
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
  Image as ImageIcon
} from 'lucide-react';

export interface NavSubItem {
  title: string;
  href: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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
}

export interface AdminModuleItem {
  id: string;
  title: string;
  shortLabel: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('super_admin' | 'pengurus_konten' | 'guru_akademik')[];
  category: 'core' | 'academic' | 'media' | 'system';
  publicCategory?: string;
  publicHref?: string;
  badge?: string;
}

// Single Source of Truth for Public Portal Navigation
export const PUBLIC_NAV_TABS: NavTabItem[] = [
  {
    id: 'jm-center',
    label: 'JM Center',
    icon: Landmark,
    href: '/',
    isDropdown: false,
    color: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
      activeBadgeBg: 'bg-[#0f5132] text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/60',
      activeText: 'text-[#073b22]',
      activeDot: 'bg-[#0f5132]',
    },
    items: [
      { title: 'Sambutan Pengasuh', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
      { title: 'Visi & Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
      { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
      { title: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga', desc: 'Struktur kepengurusan & asrama', icon: Layers },
    ]
  },
  {
    id: 'programs',
    label: 'Program Unggulan',
    icon: BookOpenCheck,
    href: '/program-unggulan',
    isDropdown: false,
    color: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80 group-hover:bg-blue-100 group-hover:text-blue-800',
      activeBadgeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/60',
      activeText: 'text-blue-800',
      activeDot: 'bg-blue-600',
    },
    items: [
      { title: 'Tahfidz 30 Juz Bersanad', href: '/smart-jm/hafidz/read', desc: "Mutaba'ah harian & sanad mutqin", icon: BookOpen },
      { title: 'Kurikulum Terpadu & Terakreditasi "A"', href: '/program-unggulan/program-sekolah', desc: 'Pendidikan formal unggulan', icon: GraduationCap },
      { title: 'Madrasah Diniyah Salafiyah', href: '/program-unggulan/program-madin', desc: 'Metode maknani gandul kitab turats', icon: BookOpenCheck },
      { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah', icon: HeartHandshake },
    ]
  },
  {
    id: 'ekskul',
    label: 'Ekstrakurikuler',
    icon: Sparkles,
    href: '/ekskul',
    isDropdown: false,
    color: {
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80 group-hover:bg-purple-100 group-hover:text-purple-800',
      activeBadgeBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/60',
      activeText: 'text-purple-800',
      activeDot: 'bg-purple-600',
    },
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
  },
  {
    id: 'stem',
    label: 'STEM',
    icon: Atom,
    href: '/stem',
    isDropdown: false,
    color: {
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80 group-hover:bg-teal-100 group-hover:text-teal-800',
      activeBadgeBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400/60',
      activeText: 'text-teal-900',
      activeDot: 'bg-teal-600',
    },
    items: [
      { title: 'Silabus STEM Santri', href: '/smart-jm/stem/materi', desc: 'Modul robotika, IoT & sains digital', icon: Cpu },
      { title: 'Portofolio Riset Santri', href: '/smart-jm/stem/portofolio', desc: 'Karya teknologi dan otomasi praktis', icon: Sparkles },
      { title: 'Murojaah AI Santri', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi lafadz suara AI', icon: BookOpen },
      { title: 'Mandarin Class', href: '/smart-jm/mandarin/materi', desc: 'Pinyin audio & percakapan interaktif', icon: GraduationCap },
    ]
  },
  {
    id: 'galeri',
    label: 'Galeri',
    icon: Images,
    href: '/galeri',
    isDropdown: false,
    color: {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80 group-hover:bg-rose-100 group-hover:text-rose-800',
      activeBadgeBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/60',
      activeText: 'text-rose-900',
      activeDot: 'bg-rose-600',
    },
    items: [
      { title: 'Galeri Foto Kegiatan', href: '/galeri/foto', desc: 'Dokumentasi asrama & halaqah santri', icon: Camera },
      { title: 'Galeri Video Profil', href: '/galeri/video', desc: 'Dokumenter resmi & kegiatan hadrah', icon: Video },
    ]
  },
];

// Single Source of Truth for Admin CMS Modules (Hierarchically aligned with Public Website)
export const ADMIN_MODULES: AdminModuleItem[] = [
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    shortLabel: 'Overview',
    desc: 'Statistik real-time, aktivitas & KPI santri',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'pengurus_konten', 'guru_akademik'],
    category: 'core',
    publicCategory: 'JM Center',
    publicHref: '/',
    badge: 'Live',
  },
  {
    id: 'berita',
    title: 'Kelola Warta & Berita',
    shortLabel: 'Warta Pondok',
    desc: 'Publikasi artikel & broadcast WhatsApp santri',
    href: '/admin/berita',
    icon: Newspaper,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'JM Center',
    publicHref: '/',
    badge: 'WA Ready',
  },
  {
    id: 'stem',
    title: 'Laboratorium Sains & STEM',
    shortLabel: 'Modul STEM',
    desc: 'Silabus kurikulum, IoT & evaluasi portofolio',
    href: '/admin/stem',
    icon: Cpu,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'STEM',
    publicHref: '/smart-jm/stem/materi',
  },
  {
    id: 'mandarin',
    title: 'Kelas Bahasa Mandarin',
    shortLabel: 'Mandarin Class',
    desc: 'Modul Pinyin Putonghua & bank soal kuis',
    href: '/admin/mandarin',
    icon: Globe,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'STEM',
    publicHref: '/smart-jm/mandarin/materi',
  },
  {
    id: 'galeri',
    title: 'Media Foto & Video Resmi',
    shortLabel: 'Galeri Media',
    desc: 'Katalog dokumentasi WebP & channel video',
    href: '/admin/galeri',
    icon: ImageIcon,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'Galeri',
    publicHref: '/galeri/foto',
    badge: 'WebP',
  },
  {
    id: 'slider',
    title: 'Konfigurasi Speed Slider',
    shortLabel: 'Banner Slider',
    desc: 'Kecepatan transisi & coverflow beranda',
    href: '/admin/slider',
    icon: Gauge,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'system',
    publicCategory: 'Beranda',
    publicHref: '/',
  },
];
