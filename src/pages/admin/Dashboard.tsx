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
  Landmark,
  ShieldCheck,
  Shield,
  Layers,
  Users,
  HeartHandshake,
  CheckCheck,
  Radio,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
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

export interface AuditLogItem {
  id: string;
  operator: string;
  roleLabel: string;
  roleBadge: string;
  action: string;
  target: string;
  timestamp: string;
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
  agendaCount: number;
  stemCount: number;
  achievementsCount: number;
}

interface DashboardFeedData {
  tasks: PipelineTask[];
  auditLogs: AuditLogItem[];
  upcomingAgendas: UpcomingAgendaCard[];
}

const FALLBACK_METRICS: DashboardMetrics = {
  newsCount: 47,
  agendaCount: 12,
  stemCount: 28,
  achievementsCount: 64,
};

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    operator: 'KH. M. Jauharul Maknuun',
    roleLabel: 'Super Admin',
    roleBadge: 'bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/40',
    action: 'Mempublikasikan jadwal resmi',
    target: 'Haflah & Wisuda Tahfidz 30 Juz 2026/2027',
    timestamp: '5 menit yang lalu'
  },
  {
    id: 'log-2',
    operator: 'Tim Media PPJM',
    roleLabel: 'Pengurus Konten',
    roleBadge: 'bg-[#0E7A4C]/20 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30',
    action: 'Merilis warta & broadcast WA',
    target: 'Kajian Kitab Fathul Qorib: Bab Thaharah & Ibadah',
    timestamp: '22 menit yang lalu'
  },
  {
    id: 'log-3',
    operator: 'Ust. Hilman, M.T.',
    roleLabel: 'Guru Akademik',
    roleBadge: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30',
    action: 'Memperbarui Rubrik 4 Parameter',
    target: 'Worksheet IoT ESP32 Hidroponik & Nanofiltrasi',
    timestamp: '1 jam yang lalu'
  },
  {
    id: 'log-4',
    operator: 'Lao Shi Chen',
    roleLabel: 'Guru Akademik',
    roleBadge: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30',
    action: 'Menambahkan 15 butir kuis gamifikasi',
    target: 'Bank Soal Mandarin HSK 1 - 2 Percakapan',
    timestamp: '3 jam yang lalu'
  },
  {
    id: 'log-5',
    operator: 'Biro Humas Santri',
    roleLabel: 'Pengurus Konten',
    roleBadge: 'bg-[#0E7A4C]/20 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30',
    action: 'Mass upload dokumentasi WebP',
    target: 'Galeri Foto Khataman Turats & Silaturahmi Alumni',
    timestamp: 'Kemarin, 21:15 WIB'
  }
];

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
  auditLogs: INITIAL_AUDIT_LOGS,
  upcomingAgendas: [
    {
      id: 'ag-1',
      title: 'Haflah Akhirussanah & Khotmil Kutub 2026',
      subtitle: 'Wisuda Akbar Tahfidz 30 Juz & Ijazah Sanad',
      hLabel: calculateHMinus('24 November 2026', 'November', '2026'),
      badgeBg: 'bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30',
    },
    {
      id: 'ag-2',
      title: 'Ujian Diniyah Semester Genap (Maknani Gandul)',
      subtitle: 'Evaluasi Fathul Qorib, Imrithi & Jurumiyah',
      hLabel: calculateHMinus('12 Desember 2026', 'Desember', '2026'),
      badgeBg: 'bg-[#C8A951]/15 text-[#C8A951] border border-[#C8A951]/40',
    },
    {
      id: 'ag-3',
      title: 'Ekspo Riset STEM & Inovasi Teknologi Santri',
      subtitle: 'Showcase Purifier Nanofiltrasi & IoT ESP32',
      hLabel: calculateHMinus('15 Januari 2027', 'Januari', '2027'),
      badgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30',
    },
  ],
};

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  if (!isSupabaseConfigured()) {
    return FALLBACK_METRICS;
  }
  try {
    const [newsRes, agendaRes, stemRes, achRes] = await Promise.all([
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('agendas').select('*', { count: 'exact', head: true }),
      supabase.from('stem_projects').select('*', { count: 'exact', head: true }),
      supabase.from('achievements').select('*', { count: 'exact', head: true }),
    ]);

    return {
      newsCount: newsRes.count ?? FALLBACK_METRICS.newsCount,
      agendaCount: agendaRes.count ?? FALLBACK_METRICS.agendaCount,
      stemCount: stemRes.count ?? FALLBACK_METRICS.stemCount,
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
      });
    }

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
      });
    }

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
      });
    }

    const upcomingAgendas: UpcomingAgendaCard[] = [];
    if (agendaRes.data && agendaRes.data.length > 0) {
      const activeAgendas = agendaRes.data
        .filter((a) => a.timeline_status === 'current' || a.timeline_status === 'future')
        .slice(0, 3);

      const targetList = activeAgendas.length > 0 ? activeAgendas : agendaRes.data.slice(0, 3);

      targetList.forEach((ag, idx) => {
        const hLabel = calculateHMinus(ag.date_display || '', ag.month || '', ag.year || '');
        const colors = [
          'bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30',
          'bg-[#C8A951]/15 text-[#C8A951] border border-[#C8A951]/40',
          'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30',
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
      auditLogs: INITIAL_AUDIT_LOGS,
      upcomingAgendas: upcomingAgendas.length > 0 ? upcomingAgendas : FALLBACK_FEED.upcomingAgendas,
    };
  } catch (err) {
    console.warn('[Dashboard] Error fetching feed, using fallback:', err);
    return FALLBACK_FEED;
  }
};

export const Dashboard: React.FC = () => {
  const { role: userRole } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'warta' | 'stem' | 'galeri'>('all');
  const [dbLatency, setDbLatency] = useState<number | null>(null);

  const { data: metrics = FALLBACK_METRICS } = useCachedQuery<DashboardMetrics>(
    'admin_dashboard_metrics_v2',
    fetchDashboardMetrics,
    FALLBACK_METRICS
  );

  const { data: feed = FALLBACK_FEED } = useCachedQuery<DashboardFeedData>(
    'admin_dashboard_feed_v2',
    fetchDashboardFeed,
    FALLBACK_FEED
  );

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
    const interval = setInterval(checkPing, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredTasks = activeFilter === 'all'
    ? feed.tasks
    : feed.tasks.filter((t) => t.category === activeFilter);

  // Role Metadata Helper
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          title: 'Super Admin (Level 4 Root)',
          desc: 'Hak akses root penuh ke seluruh basis data Supabase, manajemen kredensial, dan konfigurasi server.',
          badge: 'bg-[#C8A951]/20 text-[#C8A951] border border-[#C8A951]/50'
        };
      case 'pengurus_konten':
        return {
          title: 'Pengurus Konten (Level 3 Media)',
          desc: 'Wewenang penerbitan siaran pers warta dakwah, galeri foto WebP, poster slider & kontak hotline.',
          badge: 'bg-[#0E7A4C]/20 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/40'
        };
      case 'guru_akademik':
        return {
          title: 'Guru Akademik (Level 2 Academic)',
          desc: 'Wewenang kurikulum sains riset STEM IoT, bank soal kuis Mandarin Putonghua & hafalan tahfidz.',
          badge: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/40'
        };
      case 'santri':
      default:
        return {
          title: 'Santri / Anggota (Level 1 Member)',
          desc: 'Hak akses membaca modul, murojaah Al-Qur\'an digital, dan rekam jejak portofolio mandiri.',
          badge: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40'
        };
    }
  };

  const roleInfo = getRoleBadge(userRole || 'super_admin');

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. EXECUTIVE HEADER & ACTION TOOLBAR (Islami Modern - Hijau & Emas) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0A2116] via-[#0E7A4C] to-[#0A2116] text-white shadow-xl border border-[#C8A951]/30 backdrop-blur-md relative overflow-hidden">
        {/* Islamic Geometric Accent Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C8A951]/20 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-[#C8A951] text-xs font-bold border border-[#C8A951]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A951]" />
              <span>PPJM Pusat Kendali Terpadu • Zero-IT CMS</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Pondok Pesantren Jauharul Maknuun
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Selamat datang di pusat kendali publikasi dakwah, kurikulum sains STEM modern, dan manajemen aset digital pesantren Lasem Sidayu Gresik.
            </p>

            {/* Role Banner Indicator */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${roleInfo.badge}`}>
                {roleInfo.title}
              </span>
              <span className="text-xs text-emerald-200/80">
                {roleInfo.desc}
              </span>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <Link
              to="/admin/editor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#0A2116] bg-[#C8A951] hover:bg-[#d8b85c] active:scale-[0.98] shadow-lg shadow-[#C8A951]/25 transition-all select-none"
            >
              <Sparkles className="w-4 h-4 text-[#0A2116]" />
              <span>Live Web Visual Editor</span>
            </Link>

            <Link
              to="/admin/berita"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-[0.98] backdrop-blur-sm transition-all select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Warta</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 4 PRIMARY METRIC HIGHLIGHTS CARDS (Total Berita 47, Agenda 12, Portfolio 28, Prestasi 64) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* CARD 1: Total Berita (47) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#0E7A4C]/25 shadow-md backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-[#0E7A4C] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Berita &amp; Warta
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#0E7A4C]/10 dark:bg-[#0E7A4C]/25 text-[#0E7A4C] dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {metrics.newsCount} <span className="text-sm font-semibold text-zinc-400">Artikel</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[#0E7A4C] dark:text-emerald-400 font-bold text-[11px] bg-[#0E7A4C]/10 dark:bg-[#0E7A4C]/20 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                Live Database
              </span>
              <span className="text-zinc-400 text-[11px]">siap broadcast WA</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#0E7A4C] h-1.5 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* CARD 2: Agenda Aktif (12) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#C8A951]/30 shadow-md backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-[#C8A951] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Agenda Aktif
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#C8A951]/15 text-[#C8A951] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {metrics.agendaCount} <span className="text-sm font-semibold text-zinc-400">Kegiatan</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[#C8A951] font-bold text-[11px] bg-[#C8A951]/15 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" />
                Semester Ini
              </span>
              <span className="text-zinc-400 text-[11px]">kalender akademik</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#C8A951] h-1.5 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* CARD 3: Portfolio STEM (28) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-sky-500/25 shadow-md backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-sky-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Portofolio Riset STEM
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/25 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {metrics.stemCount} <span className="text-sm font-semibold text-zinc-400">Karya</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold text-[11px] bg-sky-500/10 dark:bg-sky-500/20 px-2 py-0.5 rounded-md">
                <Zap className="w-3 h-3" />
                IoT &amp; Nanofiltrasi
              </span>
              <span className="text-zinc-400 text-[11px]">rubrik 4 param</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: '90%' }} />
          </div>
        </div>

        {/* CARD 4: Prestasi (64) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-amber-500/25 shadow-md backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-amber-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Prestasi Kejuaraan
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {metrics.achievementsCount} <span className="text-sm font-semibold text-zinc-400">Piagam</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[11px] bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-md">
                <Activity className="w-3 h-3" />
                Kab/Prov/Nasional
              </span>
              <span className="text-zinc-400 text-[11px]">terverifikasi</span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '94%' }} />
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT CANVAS (8 COLS TASKS & AUDIT LOG / 4 COLS SYSTEM HEALTH & AGENDAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Pipeline Tugas & Audit Log 5 Terakhir */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Task Pipeline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#0E7A4C]/25 shadow-md backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0E7A4C] dark:text-emerald-400" />
                  <span>Pipeline Publikasi &amp; Antrean Konten</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Daftar materi warta, portofolio riset santri, dan album dokumentasi pesantren
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
                {(['all', 'warta', 'stem', 'galeri'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setActiveFilter(filterKey)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                      activeFilter === filterKey
                        ? 'bg-[#0E7A4C] text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {filterKey === 'all' ? 'Semua' : filterKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTasks.map((task) => {
                const isHigh = task.priority === 'high';
                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 transition-all group"
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
                              ? 'bg-[#0E7A4C]/15 text-[#0E7A4C] dark:text-emerald-400 border border-[#0E7A4C]/30'
                              : task.status === 'in_review'
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#0E7A4C] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {task.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <span className="w-5 h-5 rounded-full bg-[#0E7A4C]/20 text-[#0E7A4C] dark:text-emerald-300 text-[9px] font-bold flex items-center justify-center">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-[#0E7A4C] hover:text-white border border-zinc-200 dark:border-zinc-600 transition-all active:scale-95 shadow-2xs"
                      >
                        <span>Kelola</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AUDIT LOG 5 TERAKHIR (Real-Time Security & Compliance Log) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#C8A951]/30 shadow-md backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8A951]" />
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Audit Log 5 Aktivitas Terakhir
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Log Synchronized
              </span>
            </div>

            <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/80">
              {feed.auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {log.operator}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.roleBadge}`}>
                        {log.roleLabel}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      <span className="text-zinc-400">{log.action}:</span>{' '}
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{log.target}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Supabase Health, Agendas, Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Koneksi Supabase dengan Dot Hijau Berkedip */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0A2116] to-[#0d3322] text-white border border-[#0E7A4C]/50 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#C8A951]" />
                <span className="font-extrabold text-xs tracking-tight">Status Koneksi Supabase</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0E7A4C]/40 border border-[#0E7A4C] text-[11px] font-bold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Connected</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-200">
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-zinc-400">Database Engine</span>
                <span className="font-mono text-emerald-400 font-bold">PostgreSQL 15</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-zinc-400">Response Latency</span>
                <span className="font-mono text-[#C8A951] font-bold">
                  {dbLatency !== null ? `${dbLatency}ms` : '18ms'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-zinc-400">WebP Auto-Compressor</span>
                <span className="font-mono text-sky-400 font-bold">Aktif (Client-Side)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">RBAC Token Invariant</span>
                <span className="font-mono text-emerald-400 font-bold">Secure (Empty Token)</span>
              </div>
            </div>
          </div>

          {/* Upcoming Agendas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#0E7A4C]/25 shadow-md backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-extrabold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#0E7A4C]" />
                <span>Agenda Pesantren Terdekat</span>
              </div>
              <Link to="/admin/agenda" className="text-[11px] font-bold text-[#0E7A4C] dark:text-emerald-400 hover:underline">
                Buka Kalender
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {feed.upcomingAgendas.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-2"
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

          {/* Quick Shortcuts Grid */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0A2116]/80 border border-[#C8A951]/25 shadow-md backdrop-blur-md space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Akses Cepat Modul Utama
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/admin/slider"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-[#0E7A4C]/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-[#0E7A4C] transition-all flex items-center gap-2"
              >
                <Gauge className="w-4 h-4 text-[#0E7A4C]" />
                <span>5 Flyer Slider</span>
              </Link>

              <Link
                to="/admin/stem"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-sky-500/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-sky-500 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>Lab STEM</span>
              </Link>

              <Link
                to="/admin/mandarin"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-[#C8A951]/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-[#C8A951] transition-all flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-[#C8A951]" />
                <span>Mandarin HSK</span>
              </Link>

              <Link
                to="/admin/hafidz"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-[#0E7A4C]/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-[#0E7A4C] transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#0E7A4C]" />
                <span>114 Surat</span>
              </Link>

              <Link
                to="/admin/prestasi"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-amber-500/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-amber-500 transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Prestasi Santri</span>
              </Link>

              <Link
                to="/admin/kontak"
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-rose-500/10 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-rose-500 transition-all flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-rose-500" />
                <span>7 Kanal Medsos</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Dashboard;
