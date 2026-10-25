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
  Image as ImageIcon,
  CheckCircle2,
  Volume2,
  Activity,
  Palette
} from 'lucide-react';

export interface NavSubItem {
  title: string;
  href: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

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

// Single Source of Truth for Public Portal Navigation (Synchronized 1:1 with Official Hierarchy)
export const PUBLIC_NAV_TABS: NavTabItem[] = [
  {
    id: 'jm-center',
    label: 'JM Center',
    icon: Landmark,
    href: '/jm-center',
    isDropdown: false,
    color: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
      activeBadgeBg: 'bg-[#0f5132] text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/60',
      activeText: 'text-[#073b22]',
      activeDot: 'bg-[#0f5132]',
    },
    items: [
      { title: 'Sambutan', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
      { title: 'Sejarah', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
      { title: 'Visi Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
      { title: 'Lembaga', href: '/jm-center/lembaga', desc: 'Struktur kepengurusan & asrama', icon: Layers },
    ]
  },
  {
    id: 'programs',
    label: 'Program',
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
      { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah', icon: HeartHandshake },
      { title: 'Program Sekolah', href: '/program-unggulan/program-sekolah', desc: 'Kurikulum formal terakreditasi "A"', icon: GraduationCap },
      { title: 'Program Madin', href: '/program-unggulan/program-madin', desc: 'Madrasah Diniyah maknani gandul turats', icon: BookOpenCheck },
    ]
  },
  {
    id: 'smart-jm',
    label: 'SMART JM',
    icon: Cpu,
    href: '/smart-jm',
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
  },
  {
    id: 'ekskul',
    label: 'Ekskul',
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
      { title: 'Foto', href: '/galeri/foto', desc: 'Dokumentasi asrama & kegiatan santri', icon: Camera },
      { title: 'Video', href: '/galeri/video', desc: 'Dokumenter resmi & kegiatan pondok', icon: Video },
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
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/stem/materi',
    badge: 'IoT Ready',
  },
  {
    id: 'mandarin',
    title: 'Bahasa Mandarin Santri',
    shortLabel: 'Mandarin CMS',
    desc: 'Input bank soal, audio pinyin & kosa kata',
    href: '/admin/mandarin',
    icon: Globe,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/mandarin/materi',
    badge: 'Audio HSK',
  },
  {
    id: 'galeri',
    title: 'Media & Galeri Publik',
    shortLabel: 'Galeri Media',
    desc: 'Upload foto kegiatan, dokumenter & album video',
    href: '/admin/galeri',
    icon: ImageIcon,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'media',
    publicCategory: 'Galeri',
    publicHref: '/galeri/foto',
  },
  {
    id: 'slider',
    title: 'Banner & Pengumuman',
    shortLabel: 'Hero Slider',
    desc: 'Atur slide coverflow beranda & kecepatan transisi',
    href: '/admin/slider',
    icon: Gauge,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'Beranda',
    publicHref: '/',
    badge: 'Coverflow',
  },
  {
    id: 'hafidz',
    title: 'Dewan Tahfidz & Murojaah AI',
    shortLabel: 'Tahfidz CMS',
    desc: 'Evaluasi rekaman audio santri, nilai tajwid & target hafalan',
    href: '/admin/hafidz',
    icon: BookOpen,
    roles: ['super_admin', 'guru_akademik'],
    category: 'academic',
    publicCategory: 'SMART JM',
    publicHref: '/smart-jm/hafidz/read',
    badge: 'AI Audio',
  },
  {
    id: 'prestasi',
    title: 'Prestasi & Kejuaraan Santri',
    shortLabel: 'Prestasi',
    desc: 'Input piagam, juara olimpiade, MQK, dan medali kejuaraan',
    href: '/admin/prestasi',
    icon: Trophy,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'academic',
    publicCategory: 'Prestasi',
    publicHref: '/prestasi',
    badge: 'Juara',
  },
  {
    id: 'ekskul',
    title: 'Ekstrakurikuler Santri',
    shortLabel: 'Ekskul',
    desc: 'Atur jadwal latihan, pelatih, lokasi & dokumentasi kegiatan',
    href: '/admin/ekskul',
    icon: Sparkles,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'Ekskul',
    publicHref: '/ekskul',
  },
  {
    id: 'profil',
    title: 'Profil Lembaga & Program',
    shortLabel: 'JM Center',
    desc: 'Edit sambutan pimpinan, sejarah, visi misi & program madin',
    href: '/admin/profil',
    icon: Landmark,
    roles: ['super_admin', 'pengurus_konten'],
    category: 'core',
    publicCategory: 'JM Center',
    publicHref: '/jm-center/sambutan',
  },
];
