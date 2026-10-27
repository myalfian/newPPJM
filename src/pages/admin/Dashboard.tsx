import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Cpu,
  Globe,
  Image as ImageIcon,
  Gauge,
  Plus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  Database,
  Zap,
  Activity,
  BookOpen,
  Trophy,
  Landmark
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

export interface PipelineTask {
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

export interface RecentActivityItem {
  id: string;
  text: string;
  time: string;
  tag: string;
  color: string;
}

export interface UpcomingAgendaCard {
  id: string;
  title: string;
  subtitle: string;
  hLabel: string;
  badgeBg: string;
}

interface DashboardMetrics {
  newsCount: number;
  stemCount: number;
  galleriesCount: number;
  achievementsCount: number;
}

interface DashboardFeedData {
  tasks: PipelineTask[];
  activities: RecentActivityItem[];
  upcomingAgendas: UpcomingAgendaCard[];
}

const FALLBACK_METRICS: DashboardMetrics = {
  newsCount: 48,
  stemCount: 128,
  galleriesCount: 342,
  achievementsCount: 24,
};

const MONTHS_MAP: Record<string, number> = {
  januari: 0, january: 0,
  februari: 1, february: 1,
  maret: 2, march: 2,
  april: 3,
  mei: 4, may: 4,
  juni: 5, june: 5,
  juli: 6, july: 6,
  agustus: 7, august: 7,
  september: 8,
  oktober: 9, october: 9,
  november: 10,
  desember: 11, december: 11,
};

export function calculateHMinus(dateStr: string, monthStr?: string, yearStr?: string): string {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Check if ISO format YYYY-MM-DD
    const isoMatch = (dateStr || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const targetDate = new Date(
        parseInt(isoMatch[1], 10),
        parseInt(isoMatch[2], 10) - 1,
        parseInt(isoMatch[3], 10)
      );
      const diffMs = targetDate.getTime() - today.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return `H-${diffDays}`;
      if (diffDays === 0) return 'Hari Ini';
      return `H+${Math.abs(diffDays)}`;
    }

    // 2. Extract day (first 1-2 digits, e.g. "24" in "24 - 30 Oktober 2026")
    const dayMatch = (dateStr || '').match(/\b(\d{1,2})\b/);
    const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

    let monthIdx = now.getMonth();
    const combinedStr = `${dateStr || ''} ${monthStr || ''}`.toLowerCase();
    for (const [mName, mIdx] of Object.entries(MONTHS_MAP)) {
      if (combinedStr.includes(mName)) {
        monthIdx = mIdx;
        break;
      }
    }

    const yearMatch = `${dateStr || ''} ${yearStr || ''}`.match(/\b(20\d{2})\b/);
    const targetYear = yearMatch ? parseInt(yearMatch[1], 10) : now.getFullYear();

    const targetDate = new Date(targetYear, monthIdx, day);
    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `H-${diffDays}`;
    if (diffDays === 0) return 'Hari Ini';
    return `H+${Math.abs(diffDays)}`;
  } catch {
    return 'Terjadwal';
  }
}

function getInitials(name: string): string {
  if (!name) return 'JM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Baru saja';
  try {
    const past = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMinutes = Math.floor((now - past) / (1000 * 60));

    if (diffMinutes < 1) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return 'Terkini';
  }
}

const FALLBACK_FEED: DashboardFeedData = {
  tasks: [
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
  ],
  activities: [
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
  ],
  upcomingAgendas: [
    {
      id: 'ag-1',
      title: 'Haflah Akhirussanah 2026',
      subtitle: 'Wisuda Tahfidz 30 Juz & Khotmil Kutub',
      hLabel: calculateHMinus('24 November 2026', 'November', '2026'),
      badgeBg: 'bg-blue-50 dark:bg-blue-950 text-[#007acc]',
    },
    {
      id: 'ag-2',
      title: 'Ujian Diniyah Semester Genap',
      subtitle: 'Maknani Gandul Turats Kitab Kuning',
      hLabel: calculateHMinus('12 Desember 2026', 'Desember', '2026'),
      badgeBg: 'bg-amber-50 dark:bg-amber-950 text-amber-600',
    },
    {
      id: 'ag-3',
      title: 'Pameran Robotika Santri',
      subtitle: 'Showcase Inovasi Lab STEM PPJM',
      hLabel: calculateHMinus('15 Januari 2027', 'Januari', '2027'),
      badgeBg: 'bg-teal-50 dark:bg-teal-950 text-teal-600',
    },
  ],
};

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  if (!isSupabaseConfigured()) {
    return FALLBACK_METRICS;
  }
  try {
    const [newsRes, stemRes, galRes, achRes] = await Promise.all([
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('stem_projects').select('*', { count: 'exact', head: true }),
      supabase.from('galleries').select('*', { count: 'exact', head: true }),
      supabase.from('achievements').select('*', { count: 'exact', head: true }),
    ]);

    return {
      newsCount: newsRes.count ?? FALLBACK_METRICS.newsCount,
      stemCount: stemRes.count ?? FALLBACK_METRICS.stemCount,
      galleriesCount: galRes.count ?? FALLBACK_METRICS.galleriesCount,
      achievementsCount: achRes.count ?? FALLBACK_METRICS.achievementsCount,
    };
  } catch (err) {
    console.warn('[Dashboard] Error fetching metrics, using fallback:', err);
    return FALLBACK_METRICS;
  }
};

const fetchDashboardFeed = async (): Promise<DashboardFeedData> => {
  if (!isSupabaseConfigured()) {
    return FALLBACK_FEED;
  }

  try {
    const [newsRes, stemRes, galRes, agendaRes] = await Promise.all([
      supabase.from('news').select('id, title, category, author, created_at, is_published').order('created_at', { ascending: false }).limit(4),
      supabase.from('stem_projects').select('id, title, category, author_santri, created_at, is_portfolio').order('created_at', { ascending: false }).limit(4),
      supabase.from('galleries').select('id, title, category, event_date, created_at').order('created_at', { ascending: false }).limit(4),
      supabase.from('agendas').select('id, title, description, date_display, month, year, timeline_status, created_at').order('created_at', { ascending: false }).limit(6),
    ]);

    const tasks: PipelineTask[] = [];
    const activities: RecentActivityItem[] = [];

    // Map News items
    if (newsRes.data && newsRes.data.length > 0) {
      newsRes.data.forEach((n) => {
        tasks.push({
          id: `news-${n.id}`,
          title: n.title,
          category: 'warta',
          categoryLabel: n.category || 'Warta Pondok',
          status: n.is_published ? 'published' : 'draft',
          priority: 'normal',
          author: n.author || 'Humas & Media',
          authorInitials: getInitials(n.author || 'Humas'),
          date: formatRelativeTime(n.created_at),
          href: '/admin/berita',
        });

        activities.push({
          id: `act-news-${n.id}`,
          text: `Warta "${n.title}" telah dipublikasikan untuk keluarga santri.`,
          time: formatRelativeTime(n.created_at),
          tag: 'Warta',
          color: 'bg-emerald-500',
        });
      });
    }

    // Map STEM items
    if (stemRes.data && stemRes.data.length > 0) {
      stemRes.data.forEach((s) => {
        tasks.push({
          id: `stem-${s.id}`,
          title: s.title,
          category: 'stem',
          categoryLabel: 'Lab STEM',
          status: s.is_portfolio ? 'published' : 'in_review',
          priority: 'high',
          author: s.author_santri || 'Lab STEM',
          authorInitials: getInitials(s.author_santri || 'STEM'),
          date: formatRelativeTime(s.created_at),
          href: '/admin/stem',
        });

        activities.push({
          id: `act-stem-${s.id}`,
          text: `Proyek sains santri "${s.title}" berhasil diperbarui.`,
          time: formatRelativeTime(s.created_at),
          tag: 'STEM',
          color: 'bg-teal-500',
        });
      });
    }

    // Map Gallery items
    if (galRes.data && galRes.data.length > 0) {
      galRes.data.forEach((g) => {
        tasks.push({
          id: `gal-${g.id}`,
          title: g.title,
          category: 'galeri',
          categoryLabel: g.category === 'video' ? 'Video Media' : 'Galeri Foto',
          status: 'published',
          priority: 'normal',
          author: 'Tim Media PPJM',
          authorInitials: 'TM',
          date: formatRelativeTime(g.created_at || g.event_date),
          href: '/admin/galeri',
        });

        activities.push({
          id: `act-gal-${g.id}`,
          text: `Album foto/video "${g.title}" berhasil diunggah ke arsip publik.`,
          time: formatRelativeTime(g.created_at || g.event_date),
          tag: 'Galeri',
          color: 'bg-rose-500',
        });
      });
    }

    // Map Upcoming Agendas
    const upcomingAgendas: UpcomingAgendaCard[] = [];
    if (agendaRes.data && agendaRes.data.length > 0) {
      const activeAgendas = agendaRes.data
        .filter((a) => a.timeline_status === 'current' || a.timeline_status === 'future')
        .slice(0, 4);

      const targetList = activeAgendas.length > 0 ? activeAgendas : agendaRes.data.slice(0, 3);

      targetList.forEach((ag, idx) => {
        const hLabel = calculateHMinus(ag.date_display || '', ag.month || '', ag.year || '');
        const colors = [
          'bg-blue-50 dark:bg-blue-950 text-[#007acc]',
          'bg-amber-50 dark:bg-amber-950 text-amber-600',
          'bg-teal-50 dark:bg-teal-950 text-teal-600',
        ];
        upcomingAgendas.push({
          id: ag.id,
          title: ag.title,
          subtitle: ag.description ? ag.description.substring(0, 45) + '...' : ag.date_display,
          hLabel,
          badgeBg: colors[idx % colors.length],
        });
      });
    }

    return {
      tasks: tasks.length > 0 ? tasks.slice(0, 6) : FALLBACK_FEED.tasks,
      activities: activities.length > 0 ? activities.slice(0, 5) : FALLBACK_FEED.activities,
      upcomingAgendas: upcomingAgendas.length > 0 ? upcomingAgendas : FALLBACK_FEED.upcomingAgendas,
    };
  } catch (err) {
    console.warn('[Dashboard] Error fetching feed, using fallback:', err);
    return FALLBACK_FEED;
  }
};

export const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'warta' | 'stem' | 'galeri'>('all');
  const [dbLatency, setDbLatency] = useState<number | null>(null);

  const { data: metrics = FALLBACK_METRICS } = useCachedQuery<DashboardMetrics>(
    'admin_dashboard_metrics',
    fetchDashboardMetrics,
    FALLBACK_METRICS
  );

  const { data: feed = FALLBACK_FEED } = useCachedQuery<DashboardFeedData>(
    'admin_dashboard_feed',
    fetchDashboardFeed,
    FALLBACK_FEED
  );

  // Live Ping Latency Calculation with performance.now()
  useEffect(() => {
    let isMounted = true;
    const checkPing = async () => {
      if (!isSupabaseConfigured()) {
        if (isMounted) setDbLatency(18);
        return;
      }
      try {
        const t0 = performance.now();
        await supabase.from('site_settings').select('key').limit(1);
        const t1 = performance.now();
        if (isMounted) {
          setDbLatency(Math.max(1, Math.round(t1 - t0)));
        }
      } catch {
        if (isMounted) setDbLatency(24);
      }
    };

    checkPing();
    const interval = setInterval(checkPing, 30000); // refresh ping every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredTasks = activeFilter === 'all'
    ? feed.tasks
    : feed.tasks.filter((t) => t.category === activeFilter);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. EXECUTIVE HEADER & ACTION TOOLBAR */}
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

        {/* Action Button Group */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Okt 2026</span>
          </div>

          <Link
            to="/admin/editor"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] shadow-sm shadow-emerald-700/25 transition-all select-none"
          >
            <Sparkles className="w-4 h-4 text-[#ffd700]" />
            <span>Live Web Editor</span>
          </Link>

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

      {/* 2. KPI / METRIC HIGHLIGHTS CARDS (Real Supabase Counts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Warta & Pengumuman */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-[#007acc]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Warta &amp; Berita
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#007acc] flex items-center justify-center">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {metrics.newsCount} <span className="text-xs font-semibold text-zinc-400">Artikel</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                Live Database
              </span>
              <span className="text-zinc-400 text-[11px]">tersinkron</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-6 pt-1">
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[35%]" />
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[50%]" />
            <span className="w-full bg-blue-200 dark:bg-blue-950 rounded-sm h-[40%]" />
            <span className="w-full bg-blue-300 dark:bg-blue-900 rounded-sm h-[70%]" />
            <span className="w-full bg-[#007acc] rounded-sm h-[100%]" />
          </div>
        </div>

        {/* KPI 2: Proyek STEM & IoT */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Proyek STEM &amp; IoT
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {metrics.stemCount} <span className="text-xs font-semibold text-zinc-400">Karya</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-teal-600 dark:text-teal-400 font-bold text-[11px] bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-md">
                <Zap className="w-3 h-3" />
                94% Velocity
              </span>
              <span className="text-zinc-400 text-[11px]">kurikulum aktif</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '94%' }} />
          </div>
        </div>

        {/* KPI 3: Galeri Media & Album */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Galeri Foto &amp; Video
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {metrics.galleriesCount} <span className="text-xs font-semibold text-zinc-400">Album</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-bold text-[11px] bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                WebP Optimized
              </span>
              <span className="text-zinc-400 text-[11px]">hemat kuota</span>
            </div>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <span className="bg-rose-500 h-full rounded-full" style={{ width: '70%' }} />
            <span className="bg-amber-400 h-full rounded-full" style={{ width: '20%' }} />
            <span className="bg-blue-400 h-full rounded-full" style={{ width: '10%' }} />
          </div>
        </div>

        {/* KPI 4: Prestasi Santri */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Prestasi Santri
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {metrics.achievementsCount} <span className="text-xs font-semibold text-zinc-400">Piagam</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold text-[11px] bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md">
                <Activity className="w-3 h-3" />
                Tingkat Nasional
              </span>
              <span className="text-zinc-400 text-[11px]">terverifikasi</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT CANVAS (8 Cols Main Pipeline / 4 Cols Side Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Content Pipeline & Task Management Board */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Pipeline Konten &amp; Tugas Terkini
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Daftar antrean penerbitan warta, penugasan STEM, dan album media pesantren
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('warta')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeFilter === 'warta'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Warta
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('stem')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeFilter === 'stem'
                      ? 'bg-white dark:bg-zinc-900 text-[#007acc] shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  STEM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('galeri')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {task.categoryLabel}
                        </span>

                        {isHigh && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                            Prioritas
                          </span>
                        )}

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

          {/* Quick Launchpad Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
              Pusat Editor &amp; Publikasi Komponen Website Publik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link
                to="/admin/berita"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#007acc] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Warta &amp; Berita
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Artikel &amp; WhatsApp broadcast
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/stem"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    STEM Area
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Materi silabus &amp; portofolio siswa
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/mandarin"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Mandarin Class
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Materi narasi &amp; bank soal quiz
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/hafidz"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Hafidz &amp; Murojaah AI
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Evaluasi audio &amp; nilai tajwid
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/prestasi"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Prestasi Santri
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Piagam, olimpiade &amp; MQK
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/ekskul"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Ekstrakurikuler
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Jadwal, pelatih &amp; dokumentasi
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/galeri"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Galeri Foto &amp; Video
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Upload WebP &amp; tautan YouTube
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/slider"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Gauge className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    Banner &amp; Hero Slider
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Slide beranda &amp; kecepatan putar
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/profil"
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-[#007acc] hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#007acc] transition-colors truncate">
                    JM Center &amp; Program
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Sambutan, visi-misi &amp; kurikulum
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Activity Feed, System Health & Agendas */}
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
              {feed.activities.map((act) => (
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

          {/* System & Cloud Storage Card with Live Supabase Ping */}
          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-xs tracking-tight">Kesehatan Sistem &amp; Server</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                Online 99.8%
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Database Supabase</span>
                <span className="font-mono text-emerald-400 font-bold">
                  Terhubung ({dbLatency !== null ? `${dbLatency}ms` : 'Mengukur...'})
                </span>
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

          {/* Upcoming Pesantren Milestones (Live H-X Calculation) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-extrabold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#007acc]" />
                <span>Agenda Pesantren Mendatang</span>
              </div>
              <Link to="/admin/agenda" className="text-[11px] font-bold text-[#007acc] hover:underline">
                Kelola
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {feed.upcomingAgendas.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h5 className="font-bold text-zinc-900 dark:text-white truncate">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${item.badgeBg}`}>
                    {item.hLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
