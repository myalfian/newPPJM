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
import { OsisHtmlOrganogram } from './OsisHtmlOrganogram';

export const OSIS_MEMBERS: OsisMember[] = [
  // --- LEVEL 1: PIMPINAN (Ketua & Wakil) ---
  {
    id: 'lead-1',
    name: 'Afif Ezza Alfath',
    role: 'Ketua OSIS',
    hierarchy: 'pimpinan',
    department: 'Presidium Utama',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    motto: 'Memimpin dengan keteladanan akhlaq, disiplin, dan amanah tholabul ilmi.',
    badgeLabel: 'Ketua OSIS',
    badgeColor: 'gold'
  },
  {
    id: 'lead-2',
    name: 'Yumma Salsabila',
    role: 'Wakil Ketua OSIS',
    hierarchy: 'pimpinan',
    department: 'Presidium Utama',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    motto: 'Santriwati tangguh, berilmu amaliyah, dan berjiwa kepemimpinan islami.',
    badgeLabel: 'Wakil Ketua',
    badgeColor: 'gold'
  },

  // --- LEVEL 2: INTI (Sekretaris & Bendahara) ---
  {
    id: 'core-1',
    name: 'Ofat Rozzan',
    role: 'Sekretaris OSIS',
    hierarchy: 'inti',
    department: 'Sekretariat Jenderal',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    motto: 'Tertib administrasi wujud amanah dan akuntabilitas organisasi.',
    badgeLabel: 'Sekretaris',
    badgeColor: 'emerald'
  },
  {
    id: 'core-2',
    name: 'Anandita Sasi Kirana',
    role: 'Bendahara 1',
    hierarchy: 'inti',
    department: 'Kebendaharaan Umum',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    motto: 'Amanah, transparan, dan barokah dalam mengelola kas organisasi.',
    badgeLabel: 'Bendahara 1',
    badgeColor: 'sapphire'
  },
  {
    id: 'core-3',
    name: 'Arytasha',
    role: 'Bendahara 2',
    hierarchy: 'inti',
    department: 'Kebendaharaan Umum',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    motto: 'Disiplin pembukuan anggaran menjamin kelancaran setiap program.',
    badgeLabel: 'Bendahara 2',
    badgeColor: 'sapphire'
  },

  // --- LEVEL 3: KOORDINATOR DIVISI/SEKBID ---
  {
    id: 'sek-1',
    name: 'Khalif Rama H',
    role: 'Koordinator Divisi Pendidikan',
    hierarchy: 'sekbid',
    department: 'Divisi Pendidikan, Riset & Literasi',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    motto: 'Belajar tanpa henti, berprestasi untuk kemaslahatan madrasah.',
    badgeLabel: 'Div. Pendidikan',
    badgeColor: 'emerald'
  },
  {
    id: 'sek-2',
    name: 'Ananda Desta Putra',
    role: 'Koordinator Divisi Bahasa',
    hierarchy: 'sekbid',
    department: 'Divisi Bahasa (Arab & Inggris)',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    motto: 'Lidah fasih berbahasa internasional, hati teguh berjiwa santri salaf.',
    badgeLabel: 'Div. Bahasa',
    badgeColor: 'sapphire'
  },
  {
    id: 'sek-3',
    name: 'Nanda Pratama',
    role: 'Koordinator Divisi Keamanan',
    hierarchy: 'sekbid',
    department: 'Divisi Kedisiplinan & Ketertiban',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    motto: 'Tegas dalam kedisiplinan shalat dan adab, santun dalam mengayomi.',
    badgeLabel: 'Div. Keamanan',
    badgeColor: 'purple'
  },
  {
    id: 'sek-4',
    name: 'Ghazy Mahardika H',
    role: 'Koordinator Divisi Kebersihan & Kesehatan',
    hierarchy: 'sekbid',
    department: 'Divisi Kebersihan, Lingkungan & UKS',
    classGrade: 'SMP Plus Jauharul Maknuun',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    motto: 'Kebersihan pesantren dan kebugaran fisik adalah cermin kesempurnaan iman.',
    badgeLabel: 'Div. Kesehatan',
    badgeColor: 'emerald'
  }
];

export const OsisStructureSection: React.FC = () => {
  const [members, setMembers] = useState<OsisMember[]>(OSIS_MEMBERS);
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>('all');

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

      {/* 3. Official Structure Organogram (Bagan Interaktif HTML) */}
      <section className="space-y-2">
        <OsisHtmlOrganogram />
      </section>

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
    </div>
  );
};

