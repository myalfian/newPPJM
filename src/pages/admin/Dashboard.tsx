import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Globe,
  Image as ImageIcon,
  Gauge,
  Share2,
  Plus,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Layers,
  Database,
  CloudCheck,
  Zap,
  Activity,
  Flame,
  UserCheck
} from 'lucide-react';

interface PipelineTask {
  id: string;
  title: string;
  category: 'warta' | 'stem' | 'galeri' | 'mandarin';
  categoryLabel: string;
  status: 'published' | 'in_review' | 'draft' | 'scheduled';
  priority: 'high' | 'normal' | 'low';
  author: string;
  authorInitials: string;
  date: string;
  href: string;
}

const PIPELINE_TASKS: PipelineTask[] = [
  {
    id: 't1',
    title: 'Persiapan Liputan & Dokumentasi Haflah Akhirussanah 2026',
    category: 'galeri',
    categoryLabel: 'Galeri Media',
    status: 'scheduled',
    priority: 'high',
    author: 'Tim Media PPJM',
    authorInitials: 'TM',
    date: 'Hari ini, 15:30',
    href: '/admin/galeri',
  },
  {
    id: 't2',
    title: 'Rilis Warta Kajian Fathul Qorib: Bab Ibadah dan Bersuci Santri Baru',
    category: 'warta',
    categoryLabel: 'Warta Pondok',
    status: 'published',
    priority: 'normal',
    author: 'Ust. Zaki M.',
    authorInitials: 'ZM',
    date: 'Hari ini, 11:20',
    href: '/admin/berita',
  },
  {
    id: 't3',
    title: 'Unggah Modul Praktikum Sensor ESP32 & IoT Green-House Santri',
    category: 'stem',
    categoryLabel: 'Lab STEM',
    status: 'in_review',
    priority: 'high',
    author: 'Ust. Hilman (Lab STEM)',
    authorInitials: 'HL',
    date: 'Kemarin, 20:15',
    href: '/admin/stem',
  },
  {
    id: 't4',
    title: 'Pembaruan Audio Putonghua Percakapan Bab 4: Adab di Masjid',
    category: 'mandarin',
    categoryLabel: 'Mandarin Class',
    status: 'published',
    priority: 'normal',
    author: 'Lao Shi Chen',
    authorInitials: 'LC',
    date: '24 Okt 2026',
    href: '/admin/mandarin',
  },
  {
    id: 't5',
    title: 'Penyesuaian Durasi Autoplay Hero Slider Beranda ke 4.5 Detik',
    category: 'warta',
    categoryLabel: 'Konfigurasi Slider',
    status: 'published',
    priority: 'low',
    author: 'Admin Super',
    authorInitials: 'AS',
    date: '23 Okt 2026',
    href: '/admin/slider',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 'a1',
    text: 'Ust. Hilman menambahkan portofolio inovasi robotika line-follower santri kelas IX.',
    time: '8 menit yang lalu',
    tag: 'STEM',
    color: 'bg-teal-500',
  },
  {
    id: 'a2',
    text: 'Broadcast WhatsApp pengumuman libur Maulid telah diteruskan ke 18 grup wali santri.',
    time: '34 menit yang lalu',
    tag: 'Warta',
    color: 'bg-emerald-500',
  },
  {
    id: 'a3',
    text: '12 foto resolusi tinggi wisuda juziyah berhasil dikompresi otomatis ke WebP hemat daya.',
    time: '2 jam yang lalu',
    tag: 'Galeri',
    color: 'bg-rose-500',
  },
  {
    id: 'a4',
    text: 'Speed slider beranda dikonfigurasi ulang menjadi 4500ms dengan transisi smooth 3D.',
    time: 'Kemarin, 19:40',
    tag: 'Slider',
    color: 'bg-amber-500',
  },
];

export const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'warta' | 'stem' | 'galeri'>('all');

  const filteredTasks = activeFilter === 'all'
    ? PIPELINE_TASKS
    : PIPELINE_TASKS.filter(t => t.category === activeFilter);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* 1. EXECUTIVE HEADER & ACTION TOOLBAR (Modern Lux PM Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#007acc] text-[11px] font-bold border border-blue-200/80 dark:border-blue-900/60 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>PPJM Enterprise Workspace • Semester Genap 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Project Management Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Pusat kendali terpadu untuk publikasi warta dakwah, pemantauan kurikulum sains STEM, dan aset digital Pesantren Jauharul Maknuun.
          </p>
        </div>

        {/* Action Button Group with tactile micro-press */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Okt 2026</span>
          </div>

          <Link
            to="/admin/berita"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#007acc] hover:bg-[#006bb3] active:scale-[0.98] shadow-sm shadow-[#007acc]/25 transition-all select-none"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Warta Baru</span>
          </Link>

          <Link
            to="/admin/galeri"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 active:scale-[0.98] shadow-2xs transition-all select-none"
          >
            <ImageIcon className="w-4 h-4 text-zinc-500" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI / METRIC HIGHLIGHTS CARDS (Modern Lux 4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Warta & WhatsApp Publications */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-[#007acc]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Warta & Pengumuman
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#007acc] flex items-center justify-center">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              48 <span className="text-xs font-semibold text-zinc-400">Artikel</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                +14.2%
              </span>
              <span className="text-zinc-400 text-[11px]">vs bulan lalu</span>
            </div>
          </div>
          {/* Mini Sparkline Bar Visualization */}
          <div className="flex items-end gap-1.5 h-6 pt-1">
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[35%]" />
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[50%]" />
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[40%]" />
            <span className="w-full bg-blue-300 dark:bg-blue-900 rounded-sm h-[70%]" />
            <span className="w-full bg-[#007acc] rounded-sm h-[100%]" />
          </div>
        </div>

        {/* KPI 2: Riset & Modul STEM */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Proyek STEM & IoT
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              128 <span className="text-xs font-semibold text-zinc-400">Karya</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-teal-600 dark:text-teal-400 font-bold text-[11px] bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-md">
                <Zap className="w-3 h-3" />
                94% Velocity
              </span>
              <span className="text-zinc-400 text-[11px]">kurikulum aktif</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '94%' }} />
          </div>
        </div>

        {/* KPI 3: Media & Aset Terkompres (WebP) */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Aset Media WebP
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              342 <span className="text-xs font-semibold text-zinc-400">Aset</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold text-[11px] bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                100% WebP
              </span>
              <span className="text-zinc-400 text-[11px]">hemat kuota</span>
            </div>
          </div>
          {/* Multi-tier Storage Bar */}
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <span className="bg-rose-500 h-full rounded-full" style={{ width: '70%' }} />
            <span className="bg-amber-400 h-full rounded-full" style={{ width: '20%' }} />
            <span className="bg-blue-400 h-full rounded-full" style={{ width: '10%' }} />
          </div>
        </div>

        {/* KPI 4: Completion Rate & Santri Aktif */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Aktivitas Santri
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              520 <span className="text-xs font-semibold text-zinc-400">Santri</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md">
                <Activity className="w-3 h-3" />
                88.5% Retensi
              </span>
              <span className="text-zinc-400 text-[11px]">mutqin 30 juz</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '88.5%' }} />
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT CANVAS (8 Cols Main Pipeline / 4 Cols Side Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Content Pipeline & Task Management Board */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Task Board Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Pipeline Konten & Tugas Terkini
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Daftar antrean penerbitan warta, penugasan STEM, dan album media pesantren
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeFilter === 'all'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveFilter('warta')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeFilter === 'warta'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Warta
                </button>
                <button
                  onClick={() => setActiveFilter('stem')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeFilter === 'stem'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  STEM
                </button>
                <button
                  onClick={() => setActiveFilter('galeri')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeFilter === 'galeri'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Galeri
                </button>
              </div>
            </div>

            {/* Task List Items */}
            <div className="space-y-2.5">
              {filteredTasks.map((task) => {
                const isHigh = task.priority === 'high';
                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/40 transition-all group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Tag */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {task.categoryLabel}
                        </span>

                        {/* Priority Badge */}
                        {isHigh && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                            Prioritas
                          </span>
                        )}

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            task.status === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : task.status === 'in_review'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                              : task.status === 'scheduled'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors line-clamp-1">
                        {task.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <span className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[9px] font-bold flex items-center justify-center">
                            {task.authorInitials}
                          </span>
                          <span className="font-medium text-zinc-600 dark:text-zinc-300">{task.author}</span>
                        </span>
                        <span>•</span>
                        <span>{task.date}</span>
                      </div>
                    </div>

                    {/* Quick Task Action Link */}
                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to={task.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-zinc-50 border border-zinc-200 dark:border-zinc-600 shadow-2xs transition-all active:scale-95"
                      >
                        <span>Buka</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Launchpad Cards (Tactile Shortcuts) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
              Pintasan Aksi Cepat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/berita"
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#007acc] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Newspaper className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors">
                    Formulir Berita & Warta
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tulis warta & siapkan pesan broadcast WhatsApp wali santri.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/galeri"
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors">
                    Upload Foto & Video
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Otomatis dikonversi ke WebP tajam dan ringan.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/stem"
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors">
                    Modul Riset STEM
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Silabus teknologi praktis & karya robotika santri.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/slider"
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors">
                    Kecepatan Banner Slider
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Kustomisasi interval putar coverflow beranda publik.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Activity Feed, System Health & Milestones */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Activity Feed */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#007acc]" />
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  Aktivitas Pengurus Terkini
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-4 pt-1">
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs relative">
                  <span className={`w-2.5 h-2.5 rounded-full ${act.color} mt-1 shrink-0 ring-4 ring-zinc-50 dark:ring-zinc-800`} />
                  <div className="space-y-0.5 flex-1">
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                      {act.text}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System & Cloud Storage Card (Modern Dark Lux) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-xs tracking-tight">Kesehatan Sistem & Server</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                Online 99.8%
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Database Supabase</span>
                <span className="font-mono text-emerald-400 font-bold">Terhubung (24ms)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">WebP Auto-Compressor</span>
                <span className="font-mono text-sky-400 font-bold">Aktif (Client-Side)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">CDN Edge Cache</span>
                <span className="font-mono text-emerald-400 font-bold">Normal</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Penyimpanan Terpakai</span>
                <span className="font-mono text-zinc-300 font-bold">1.2 GB / 50 GB</span>
              </div>
            </div>
          </div>

          {/* Upcoming Pesantren Milestones */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-extrabold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#007acc]" />
              <span>Agenda Pesantren Mendatang</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-white">Haflah Akhirussanah 2026</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Wisuda Tahfidz 30 Juz</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 dark:bg-blue-950 text-[#007acc]">
                  H-24
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-white">Ujian Diniyah Semester Genap</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Maknani Gandul Turats</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-50 dark:bg-amber-950 text-amber-600">
                  H-12
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-white">Pameran Robotika Santri</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Showcase Lab STEM</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-teal-50 dark:bg-teal-950 text-teal-600">
                  H-45
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
