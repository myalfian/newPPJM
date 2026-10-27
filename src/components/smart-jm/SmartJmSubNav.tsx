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
import '../common/BottomNavBarTabs.css';

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
        shortLabel: 'Materi STEM',
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

/**
 * SmartJmSubNav - Sub-section Navigation with Bottom Curved Notch & Floating Jewel Dot.
 * Styled and animated identical to BottomNavBarTabs (Signature Emerald Gradient,
 * C1 upward curved notch, radiant floating gold jewel indicator, and spring physics).
 */
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
      className="bottom-curved-navbar-wrapper w-full relative"
    >
      {/* 1. Mobile-Only Active Hub Indicator Pill: Top Row (< 640px) */}
      <div className="flex items-center justify-between w-full mb-1.5 px-0.5 sm:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs text-xs font-bold text-slate-800 dark:text-slate-100">
          <div className="w-5 h-5 rounded-lg bg-emerald-800 text-gold-300 flex items-center justify-center shadow-xs">
            <ActiveGroupIcon className="w-3 h-3" />
          </div>
          <span className="font-extrabold text-emerald-950 dark:text-white tracking-tight">{activeGroup.title}</span>
          <span className="text-[10.5px] text-slate-400 font-medium hidden xs:inline">• {activeGroup.subtitle}</span>
        </div>

        {/* Quick Hub Switcher Chips for Mobile */}
        <div className="flex items-center gap-1">
          {SMART_GROUPS.map((g) => {
            const isCurrentHub = g.id === activeGroupId;
            const GIcon = g.icon;
            return (
              <Link
                key={g.id}
                to={g.defaultHref}
                title={g.title}
                className={`p-1.5 rounded-lg transition-colors ${
                  isCurrentHub
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-gold-400 font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <GIcon className="w-3.5 h-3.5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Signature Borderless Emerald Bar with Curved Cutout Notch & Floating Jewel Dot */}
      <div className="bottom-curved-navbar-bar w-full flex items-center justify-between px-2 sm:px-3">
        
        {/* Left: Desktop Hub Identifier Chip (Seamlessly integrated inside bar) */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/15 dark:bg-black/35 border border-white/10 text-white shrink-0 mr-2 select-none">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#facc15] to-[#fde047] text-emerald-950 flex items-center justify-center font-bold shadow-xs">
            <ActiveGroupIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold leading-tight">
            <span className="font-extrabold text-white tracking-tight">{activeGroup.title}</span>
            <ChevronRight className="w-3 h-3 text-gold-300 opacity-80" />
            <span className="text-[11px] font-medium text-emerald-200/90 hidden md:inline">
              {activeGroup.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Sub-Item Tabs Track with Animated Sliding Notch Pointer & Radiant Gold Jewel */}
        <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-end h-full">
          <ul className="bottom-curved-tab-list flex items-center w-full sm:w-auto justify-stretch sm:justify-end gap-1.5 sm:gap-3">
            {activeGroup.subItems.map((item) => {
              const SubIcon = item.icon;
              const isSubActive = pathname === item.href;

              return (
                <li
                  key={item.id}
                  className="bottom-curved-tab-col flex-1 sm:flex-none h-full flex items-center justify-center min-w-0"
                >
                  <Link
                    to={item.href}
                    aria-current={isSubActive ? 'page' : undefined}
                    className={`bottom-curved-tab-btn w-full sm:w-auto px-2.5 sm:px-5 ${
                      isSubActive ? 'active' : ''
                    }`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isSubActive && (
                      <motion.div
                        layoutId="smartJmCurvedCutoutPointer"
                        layout="position"
                        className="bottom-curved-pointer"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                          mass: 0.58,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 22"
                          className="bottom-curved-notch-svg"
                          width="74"
                          height="22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <defs>
                            <radialGradient id="smartJmNotchDotGrad" cx="35%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#fffbeb" />
                              <stop offset="35%" stopColor="#fde047" />
                              <stop offset="75%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#92400e" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M 0 22 C 16 22, 22 4, 37 4 C 52 4, 58 22, 74 22 Z"
                            className="bottom-curved-notch-surface"
                            stroke="none"
                          />
                          {/* Radiant Jewel Gold Floating Indicator */}
                          <circle
                            cx="37"
                            cy="16"
                            r="4.8"
                            fill="url(#smartJmNotchDotGrad)"
                            className="bottom-curved-notch-dot"
                            stroke="none"
                          />
                          {/* Specular Gem Reflection */}
                          <circle
                            cx="35.5"
                            cy="14.5"
                            r="1.4"
                            fill="#ffffff"
                            opacity="0.85"
                            stroke="none"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Responsive Text & Icon matching BottomNavBarTabs */}
                    <span className="bottom-curved-tab-text w-full">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2">
                        <SubIcon
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
                            isSubActive ? 'text-[#facc15]' : 'text-emerald-200/90'
                          }`}
                        />
                        <span className="sm:hidden font-extrabold text-[12px] leading-tight tracking-tight whitespace-nowrap">
                          {item.shortLabel || item.label}
                        </span>
                        <span className="hidden sm:inline font-extrabold text-[13px] sm:text-[14px] leading-tight tracking-tight whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] sm:text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded-md transition-colors ${
                              isSubActive
                                ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40 shadow-xs'
                                : 'bg-black/25 text-emerald-200 border border-white/10'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
