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
  ChevronRight
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
  subItems: SubMenuItem[];
}

const SMART_GROUPS: SmartJmGroup[] = [
  {
    id: 'stem',
    title: 'STEM Area',
    subtitle: 'Sains, Robotika & IoT Santri',
    icon: Cpu,
    defaultHref: '/smart-jm/stem/materi',
    subItems: [
      {
        id: 'stem-materi',
        label: 'Materi dan Penugasan',
        shortLabel: 'Materi & Penugasan',
        icon: FileCode2,
        href: '/smart-jm/stem/materi',
        badge: 'Silabus'
      },
      {
        id: 'stem-portofolio',
        label: 'Portofolio Siswa',
        shortLabel: 'Portofolio Siswa',
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
    subItems: [
      {
        id: 'mandarin-materi',
        label: 'Materi',
        shortLabel: 'Materi & Pinyin',
        icon: Globe,
        href: '/smart-jm/mandarin/materi',
        badge: 'Putonghua'
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
    subtitle: 'Tahfidz & Tartil Digital Santri',
    icon: BookOpen,
    defaultHref: '/smart-jm/hafidz/read',
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
  const ActiveGroupIcon = activeGroup.icon;

  return (
    <nav
      aria-label="Navigasi Sub-Section SMART JM"
      className="w-full relative"
    >
      {/* Container Bar: Styled identical to BottomNavBarTabs in Prestasi (Emerald Gradient, soft shadow, borderless) */}
      <div className="w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-1.5 sm:p-2 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-3 overflow-hidden border border-emerald-800/50">
        
        {/* Left: Active Hub Badge Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-900/80 border border-emerald-700/60 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-gold-400 text-emerald-950 flex items-center justify-center font-bold shadow-xs">
            <ActiveGroupIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-extrabold text-white tracking-tight">{activeGroup.title}</span>
            <ChevronRight className="w-3 h-3 text-gold-400" />
            <span className="text-[11px] font-semibold text-emerald-200 hidden xs:inline">{activeGroup.subtitle}</span>
          </div>
        </div>

        {/* Right: Sub-Section Tabs with Animated Floating Pill (Identical spring physics as Prestasi) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-end p-0.5 bg-emerald-950/70 rounded-xl border border-emerald-800/40">
          {activeGroup.subItems.map((item) => {
            const SubIcon = item.icon;
            const isSubActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-colors select-none ${
                  isSubActive
                    ? 'text-emerald-950 font-black'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                {/* Framer Motion Spring Pill Indicator */}
                {isSubActive && (
                  <motion.div
                    layoutId="smartJmActiveSectionPill"
                    className="absolute inset-0 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-lg shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 28,
                      mass: 0.58
                    }}
                  />
                )}

                {/* Tab Content positioned above animated pill */}
                <span className="relative z-10 flex items-center gap-1.5">
                  <SubIcon
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isSubActive ? 'text-emerald-950 font-bold' : 'text-gold-300'
                    }`}
                  />
                  <span className="tracking-tight whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                        isSubActive
                          ? 'bg-emerald-950 text-gold-300'
                          : 'bg-emerald-900/90 text-emerald-200 border border-emerald-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
