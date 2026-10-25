import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu,
  Globe,
  BookOpen,
  Sparkles,
  FileCode2,
  CheckCircle2,
  Volume2,
  ChevronRight,
  Layers
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SmartJmGroup {
  id: 'stem' | 'mandarin' | 'hafidz';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultHref: string;
  accentColor: string;
  subItems: SubMenuItem[];
}

const SMART_GROUPS: SmartJmGroup[] = [
  {
    id: 'stem',
    title: 'STEM Area',
    subtitle: 'Sains, Robotika & IoT',
    icon: Cpu,
    defaultHref: '/smart-jm/stem/materi',
    accentColor: 'teal',
    subItems: [
      {
        id: 'stem-materi',
        label: 'Materi dan Penugasan',
        shortLabel: 'Materi & Tugas',
        icon: FileCode2,
        href: '/smart-jm/stem/materi',
        badge: 'Silabus'
      },
      {
        id: 'stem-portofolio',
        label: 'Portofolio Siswa',
        shortLabel: 'Portofolio',
        icon: Sparkles,
        href: '/smart-jm/stem/portofolio',
        badge: 'Karya'
      }
    ]
  },
  {
    id: 'mandarin',
    title: 'Mandarin Class',
    subtitle: 'Bahasa & Budaya Internasional',
    icon: Globe,
    defaultHref: '/smart-jm/mandarin/materi',
    accentColor: 'sky',
    subItems: [
      {
        id: 'mandarin-materi',
        label: 'Materi',
        shortLabel: 'Materi',
        icon: Globe,
        href: '/smart-jm/mandarin/materi',
        badge: 'Pinyin'
      },
      {
        id: 'mandarin-quiz',
        label: 'Quiz',
        shortLabel: 'Quiz Ujian',
        icon: CheckCircle2,
        href: '/smart-jm/mandarin/quiz',
        badge: 'Interaktif'
      }
    ]
  },
  {
    id: 'hafidz',
    title: "Hafidz Qur'an",
    subtitle: 'Tahfidz & Tartil Digital',
    icon: BookOpen,
    defaultHref: '/smart-jm/hafidz/read',
    accentColor: 'emerald',
    subItems: [
      {
        id: 'hafidz-read',
        label: "Read Qur'an",
        shortLabel: "Read Qur'an",
        icon: BookOpen,
        href: '/smart-jm/hafidz/read',
        badge: '30 Juz'
      },
      {
        id: 'hafidz-murojaah',
        label: 'Murojaah',
        shortLabel: 'Murojaah AI',
        icon: Volume2,
        href: '/smart-jm/hafidz/murojaah',
        badge: 'AI & Rekam'
      }
    ]
  }
];

export const SmartJmSubNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Tentukan group aktif berdasarkan URL
  let activeGroupId: 'stem' | 'mandarin' | 'hafidz' = 'stem';
  if (pathname.includes('/smart-jm/mandarin')) {
    activeGroupId = 'mandarin';
  } else if (pathname.includes('/smart-jm/hafidz')) {
    activeGroupId = 'hafidz';
  } else if (pathname.includes('/smart-jm/stem')) {
    activeGroupId = 'stem';
  }

  const activeGroup = SMART_GROUPS.find((g) => g.id === activeGroupId) || SMART_GROUPS[0];

  return (
    <nav
      aria-label="Navigasi Submenu SMART JM"
      className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all"
    >
      {/* Level 1: 3 Submenu Utama (STEM Area, Mandarin Class, Hafidz Qur'an) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        {SMART_GROUPS.map((group, index) => {
          const Icon = group.icon;
          const isGroupActive = group.id === activeGroupId;

          return (
            <Link
              key={group.id}
              to={group.defaultHref}
              className={`relative flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl transition-all select-none ${
                isGroupActive
                  ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white shadow-md shadow-emerald-950/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-900 dark:hover:text-white border border-slate-200/70 dark:border-slate-700/60'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                  isGroupActive
                    ? 'bg-[#d4af37] text-emerald-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline-block text-[10px] font-bold text-[#d4af37] uppercase">
                    {index + 1}.
                  </span>
                  <span
                    className={`block font-extrabold text-[11px] xs:text-xs sm:text-sm tracking-tight truncate leading-tight ${
                      isGroupActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {group.title}
                  </span>
                </div>
                <span
                  className={`hidden md:block text-[10px] truncate leading-tight mt-0.5 ${
                    isGroupActive ? 'text-emerald-200/90' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {group.subtitle}
                </span>
              </div>

              {isGroupActive && (
                <motion.div
                  layoutId="smart-group-active-dot"
                  className="hidden sm:block ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Level 2: Section Tabs Khusus Submenu yang Dipilih */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
          <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Section:</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
          {activeGroup.subItems.map((item) => {
            const SubIcon = item.icon;
            const isSubActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all select-none ${
                  isSubActive
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-emerald-50/70 dark:bg-slate-800 text-emerald-900 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-slate-700/80 border border-emerald-200/60 dark:border-slate-700'
                }`}
              >
                <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#d4af37]' : 'text-emerald-700 dark:text-emerald-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`hidden xs:inline-block px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold uppercase ${
                      isSubActive
                        ? 'bg-[#d4af37] text-emerald-950'
                        : 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
