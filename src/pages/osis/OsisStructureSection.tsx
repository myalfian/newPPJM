import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Crown,
  Shield,
  BookOpen,
  Languages,
  Sparkles,
  Heart,
  ChevronDown,
  Quote,
  Maximize2,
  X,
  Target,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { OsisMember, OsisHierarchyLevel } from './types';
import { OSIS_METADATA_2026 } from './osisData';

export const OSIS_MEMBERS: OsisMember[] = [
  // --- LEVEL 1: PIMPINAN (Ketua & Wakil) ---
  {
    id: 'lead-1',
    name: 'Muhammad Faizur Rahman',
    role: 'Ketua OSIS Putra',
    hierarchy: 'pimpinan',
    department: 'Presidium Utama',
    classGrade: 'Kelas IX-A (SMP Plus JM)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    motto: 'Memimpin dengan keteladanan akhlaq, mengabdi untuk barokah kiai.',
    badgeLabel: 'Mandat Utama',
    badgeColor: 'gold'
  },
  {
    id: 'lead-2',
    name: 'Nabila Zahra Al-Munawwarah',
    role: 'Ketua OSIS Putri',
    hierarchy: 'pimpinan',
    department: 'Presidium Utama',
    classGrade: 'Kelas IX-B (SMP Plus JM)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    motto: 'Santriwati tangguh, berilmu amaliyah, dan berjiwa kepemimpinan islami.',
    badgeLabel: 'Mandat Utama',
    badgeColor: 'gold'
  },
  {
    id: 'lead-3',
    name: 'M. Raihan Al-Ghifari',
    role: 'Wakil Ketua OSIS',
    hierarchy: 'pimpinan',
    department: 'Presidium Utama',
    classGrade: 'Kelas VIII-A (SMP Plus JM)',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    motto: 'Sinergi langkah nyata mewujudkan santri unggul dan berprestasi.',
    badgeLabel: 'Wakil Pimpinan',
    badgeColor: 'sapphire'
  },

  // --- LEVEL 2: INTI (Sekretaris & Bendahara) ---
  {
    id: 'core-1',
    name: 'M. Rizqi Syaifullah',
    role: 'Sekretaris 1',
    hierarchy: 'inti',
    department: 'Sekretariat Jenderal',
    classGrade: 'Kelas IX-A',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    motto: 'Tertib administrasi wujud amanah dan akuntabilitas organisasi.',
    badgeLabel: 'Sekretaris',
    badgeColor: 'emerald'
  },
  {
    id: 'core-2',
    name: 'Aisyah Nur Fathimah',
    role: 'Sekretaris 2',
    hierarchy: 'inti',
    department: 'Sekretariat Jenderal',
    classGrade: 'Kelas VIII-B',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    motto: 'Ketelitian dalam dokumentasi, kerapian dalam arsip warta santri.',
    badgeLabel: 'Sekretaris',
    badgeColor: 'emerald'
  },
  {
    id: 'core-3',
    name: 'Fatimah Az-Zahra',
    role: 'Bendahara 1',
    hierarchy: 'inti',
    department: 'Kebendaharaan Umum',
    classGrade: 'Kelas IX-B',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    motto: 'Amanah, transparan, dan barokah dalam mengelola kas organisasi.',
    badgeLabel: 'Bendahara',
    badgeColor: 'sapphire'
  },
  {
    id: 'core-4',
    name: 'Ahmad Zidan Al-Farisi',
    role: 'Bendahara 2',
    hierarchy: 'inti',
    department: 'Kebendaharaan Umum',
    classGrade: 'Kelas VIII-A',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    motto: 'Disiplin pembukuan anggaran menjamin kelancaran setiap program.',
    badgeLabel: 'Bendahara',
    badgeColor: 'sapphire'
  },

  // --- LEVEL 3: KOORDINATOR DIVISI/SEKBID ---
  {
    id: 'sek-1',
    name: 'Hilmi Mubarok',
    role: 'Koordinator Sekbid Bahasa',
    hierarchy: 'sekbid',
    department: 'Divisi Bahasa Asing (Arab & Mandarin)',
    classGrade: 'Kelas VIII-A',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    motto: 'Lidah fasih berbahasa internasional, hati teguh berjiwa santri.',
    badgeLabel: 'Sekbid Bahasa',
    badgeColor: 'emerald'
  },
  {
    id: 'sek-2',
    name: 'Daniar Pratama',
    role: 'Koordinator Sekbid Pendidikan',
    hierarchy: 'sekbid',
    department: 'Divisi Pendidikan, Riset & STEM',
    classGrade: 'Kelas VIII-A',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    motto: 'Belajar tanpa henti, meneliti untuk kemaslahatan umat.',
    badgeLabel: 'Sekbid Pendidikan',
    badgeColor: 'sapphire'
  },
  {
    id: 'sek-3',
    name: 'Salman Al-Farisi',
    role: 'Koordinator Sekbid Kebersihan',
    hierarchy: 'sekbid',
    department: 'Divisi Kebersihan, Lingkungan & UKS',
    classGrade: 'Kelas VIII-B',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    motto: 'Kebersihan pesantren sebagian dari kesempurnaan iman.',
    badgeLabel: 'Sekbid Kebersihan',
    badgeColor: 'emerald'
  },
  {
    id: 'sek-4',
    name: 'Fikri Ramadhan',
    role: 'Koordinator Sekbid Keamanan',
    hierarchy: 'sekbid',
    department: 'Divisi Kedisiplinan & Tata Tertib',
    classGrade: 'Kelas IX-A',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    motto: 'Tegas dalam kedisiplinan, santun dalam mengayomi adik kelas.',
    badgeLabel: 'Sekbid Keamanan',
    badgeColor: 'purple'
  }
];

export const OsisStructureSection: React.FC = () => {
  const [members, setMembers] = useState<OsisMember[]>(OSIS_MEMBERS);
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>('all');
  const [showChartModal, setShowChartModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchStructure = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('osis_structure')
          .select('*')
          .order('level', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: OsisMember[] = data.map((row: any) => {
            const hierarchy: OsisHierarchyLevel =
              row.level === 1 ? 'pimpinan' : row.level === 2 ? 'inti' : 'sekbid';
            const badgeColor =
              row.level === 1 ? 'gold' : row.level === 2 ? 'sapphire' : 'emerald';

            return {
              id: row.id,
              name: row.name,
              role: row.position,
              hierarchy,
              department: hierarchy === 'pimpinan' ? 'Presidium Utama' : 'Departemen OSIS',
              classGrade: row.class || 'SMP Plus JM',
              photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
              motto: row.motto || 'Berkhidmat untuk santri dan pondok pesantren.',
              badgeLabel: row.position,
              badgeColor
            };
          });
          setMembers(mapped);
        }
      } catch (err) {
        console.warn('Failed to load osis_structure:', err);
      }
    };
    fetchStructure();

    const channel = supabase
      .channel('public-osis-structure-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'osis_structure' }, () => {
        fetchStructure();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const leaders = members.filter((m) => m.hierarchy === 'pimpinan');
  const coreOfficers = members.filter((m) => m.hierarchy === 'inti');
  const sekbidOfficers = members.filter((m) => m.hierarchy === 'sekbid');

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'gold':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300/70 dark:border-amber-700/60';
      case 'sapphire':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
    }
  };

  const renderMemberCard = (member: OsisMember, isPrimaryLeader = false) => {
    return (
      <article
        key={member.id}
        className={`group relative bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl active:scale-[0.98] select-none ${
          isPrimaryLeader
            ? 'border-amber-400/50 dark:border-amber-600/40 hover:border-amber-400'
            : 'border-zinc-200/70 dark:border-zinc-800/70 hover:border-emerald-500/40'
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div>
          {/* Photo Container (aspect-[3/4], rounded-2xl) */}
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={member.photoUrl}
              alt={member.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

            {/* Top Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md ${getBadgeStyle(
                  member.badgeColor
                )}`}
              >
                {member.badgeLabel}
              </span>
            </div>

            {/* Bottom Text Over Photo */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                {member.role}
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-md">
                {member.name}
              </h3>
            </div>
          </div>

          {/* Info & Motto Body */}
          <div className="p-3 sm:p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-500 pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {member.department}
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {member.classGrade}
              </span>
            </div>

            <div className="relative pl-2.5 border-l-2 border-emerald-500/40 text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
              &quot;{member.motto}&quot;
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* 1. Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Kabinet Khidmah Santri Masa Bakti 2026/2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Bagan &amp; Struktur Pengurus OSIS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Kepengurusan OSIS SMP Plus Jauharul Maknuun mengemban amanah penegakan kedisiplinan dan pengembangan potensi santri.
        </p>
      </div>

      {/* 2. Slogan & Semboyan Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E7A4C] via-emerald-800 to-[#09482c] text-white p-4 sm:p-6 shadow-md border border-[#C8A951]/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-[#C8A951]/40 text-[#C8A951] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Slogan &amp; Semboyan Resmi OSIS 2026/2027</span>
          </div>
          <blockquote className="text-base sm:text-xl font-bold text-white leading-relaxed italic border-l-4 border-[#C8A951] pl-3 sm:pl-4">
            &quot;{OSIS_METADATA_2026.slogan}&quot;
          </blockquote>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
            ✨ {OSIS_METADATA_2026.motto}
          </p>
          <div className="inline-block px-3 py-1 rounded-lg bg-emerald-950/60 text-[#C8A951] font-mono font-bold text-xs">
            {OSIS_METADATA_2026.mottoShort}
          </div>
        </div>
      </div>

      {/* 3. Official Structure Chart Preview (Lightbox Ready) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0E7A4C] dark:text-emerald-400" />
            <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
              Bagan Resmi Struktur Organisasi OSIS (Dokumen Resmi 2026/2027)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowChartModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0E7A4C] hover:bg-[#128a57] text-[#C8A951] font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Perbesar HD</span>
          </button>
        </div>
        <div 
          onClick={() => setShowChartModal(true)}
          className="relative group cursor-pointer aspect-[16/9] sm:aspect-[21/9] bg-zinc-900 overflow-hidden flex items-center justify-center"
        >
          <img
            src={OSIS_METADATA_2026.chartImageUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = OSIS_METADATA_2026.chartImageFallback;
            }}
            alt="Bagan Struktur OSIS SMP Plus JM 2026/2027"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold backdrop-blur-md flex items-center gap-2 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-[#C8A951]" />
              Klik untuk memperbesar bagan HD
            </span>
          </div>
        </div>
      </div>

      {/* 4. 7 Tujuan Utama OSIS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              7 Tujuan Utama OSIS SMP Plus Jauharul Maknuun
            </h3>
            <span className="text-xs text-zinc-500">Amanat pokok pembinaan karakter, adab, dan intelektual santri</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OSIS_METADATA_2026.goals.map((g) => (
            <div
              key={g.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-[#0E7A4C]/50 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0E7A4C]/10 dark:bg-[#0E7A4C]/30 text-[#0E7A4C] dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {g.id}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                  {g.title}
                </h4>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
                {g.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LEVEL 1: PRESIDIUM PIMPINAN (Ketua Putra, Putri & Wakil) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Presidium Pimpinan Utama
          </h3>
          <span className="text-xs text-zinc-400">• Mandat Kepengurusan Utama</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {leaders.map((m) => renderMemberCard(m, true))}
        </div>
      </section>

      {/* Organizational Divider Line (Hairline Connector) */}
      <div className="relative py-1 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <span className="relative px-3 py-0.5 rounded-full bg-white dark:bg-zinc-950 text-[11px] font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800">
          Jalur Koordinasi Inti
        </span>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 2: PENGURUS INTI (Sekretaris & Bendahara) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Badan Pengurus Harian (BPH) Inti
          </h3>
          <span className="text-xs text-zinc-400">• Sekretariat &amp; Kebendaharaan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {coreOfficers.map((m) => renderMemberCard(m, false))}
        </div>
      </section>

      {/* Organizational Divider Line (Hairline Connector) */}
      <div className="relative py-1 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <span className="relative px-3 py-0.5 rounded-full bg-white dark:bg-zinc-950 text-[11px] font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800">
          Koordinator Departemen Teknis
        </span>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 3: KOORDINATOR DIVISI/SEKBID */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Koordinator Seksi Bidang (Sekbid)
          </h3>
          <span className="text-xs text-zinc-400">• Pelaksana Program Kerja Teknis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {sekbidOfficers.map((m) => renderMemberCard(m, false))}
        </div>
      </section>

      {/* Lightbox Modal HD for Structure Chart */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 text-white border-b border-white/20">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#C8A951]">
                Bagan Resmi Struktur OSIS SMP Plus Jauharul Maknuun 2026/2027
              </h4>
              <p className="text-xs text-zinc-300">Dokumen Tata Kelola Organisasi Resmi Pesantren</p>
            </div>
            <button
              type="button"
              onClick={() => setShowChartModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <img
              src={OSIS_METADATA_2026.chartImageUrl}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = OSIS_METADATA_2026.chartImageFallback;
              }}
              alt="Bagan Struktur HD OSIS"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

