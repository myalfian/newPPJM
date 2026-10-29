import React, { useState } from 'react';
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
  Quote
} from 'lucide-react';
import { OsisMember, OsisHierarchyLevel } from './types';

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
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>('all');

  const leaders = OSIS_MEMBERS.filter((m) => m.hierarchy === 'pimpinan');
  const coreOfficers = OSIS_MEMBERS.filter((m) => m.hierarchy === 'inti');
  const sekbidOfficers = OSIS_MEMBERS.filter((m) => m.hierarchy === 'sekbid');

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
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
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

      {/* ========================================================= */}
      {/* LEVEL 1: PRESIDIUM PIMPINAN (Ketua Putra, Putri & Wakil) */}
      {/* ========================================================= */}
      <section className="space-y-2.5 sm:space-y-3">
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

