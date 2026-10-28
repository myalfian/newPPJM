import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  HeartHandshake,
  Landmark,
  Layers,
  GraduationCap,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Video,
  Trophy,
  Activity,
  Volume2,
  Cpu,
  Globe,
  CheckCircle2,
  Layers3,
  CalendarDays,
  CalendarCheck2,
  Clock3,
  ShieldCheck,
  Users,
  Building2,
  School,
  Newspaper,
  Info,
  FileText
} from 'lucide-react';
import { OsisIcon } from '../../data/navigationData';
import './NavBarTabs.css';

export interface NavTabItem {
  id: string;
  label: string;
  shortLabel?: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface NavBarTabsProps {
  // Compatibility props
  homeLabel?: string;
  parentLabel?: string;
  parentHref?: string;
  currentLabel?: string;

  // Tabs
  tabs?: NavTabItem[];
  activeTabId?: string;
  className?: string;
  onChangeTab?: (tab: NavTabItem) => void;
}

// Pre-defined category hubs with dedicated sub-menu tabs
const DEFAULT_CATEGORY_TABS: Record<
  string,
  {
    parentLabel: string;
    parentHref: string;
    parentIcon: React.ComponentType<{ className?: string }>;
    tabs: NavTabItem[];
  }
> = {
  'jm-center': {
    parentLabel: 'JM Center',
    parentHref: '/jm-center/sambutan',
    parentIcon: Landmark,
    tabs: [
      { id: 'sambutan', label: 'Sambutan', shortLabel: 'Sambutan', href: '/jm-center/sambutan', icon: Compass },
      { id: 'sejarah', label: 'Sejarah', shortLabel: 'Sejarah', href: '/jm-center/sejarah', icon: Landmark },
      { id: 'visi-misi', label: 'Visi Misi', shortLabel: 'Visi Misi', href: '/jm-center/visi-misi', icon: HeartHandshake },
      { id: 'fasilitas-pondok', label: 'Fasilitas Pondok', shortLabel: 'Fas. Pondok', href: '/jm-center/fasilitas/pondok', icon: Building2 },
      { id: 'fasilitas-sekolah', label: 'Fasilitas Sekolah', shortLabel: 'Fas. Sekolah', href: '/jm-center/fasilitas/sekolah', icon: School },
      { id: 'lembaga-pondok', label: 'Lembaga Pondok', shortLabel: 'Lemb. Pondok', href: '/jm-center/lembaga/pondok', icon: Layers },
      { id: 'lembaga-sekolah', label: 'Lembaga Sekolah', shortLabel: 'Lemb. Sekolah', href: '/jm-center/lembaga/sekolah', icon: GraduationCap },
    ],
  },
  'program-unggulan': {
    parentLabel: 'Program',
    parentHref: '/program-unggulan/amaliyah-pondok',
    parentIcon: GraduationCap,
    tabs: [
      { id: 'amaliyah-pondok', label: 'Amaliyah Pondok', shortLabel: 'Amaliyah', href: '/program-unggulan/amaliyah-pondok', icon: Sparkles },
      { id: 'program-sekolah', label: 'Program Sekolah', shortLabel: 'Sekolah', href: '/program-unggulan/program-sekolah', icon: GraduationCap },
      { id: 'program-madin', label: 'Program Madin', shortLabel: 'Madin', href: '/program-unggulan/program-madin', icon: BookOpen },
    ],
  },
  'galeri': {
    parentLabel: 'Galeri',
    parentHref: '/galeri/foto',
    parentIcon: ImageIcon,
    tabs: [
      { id: 'foto', label: 'Foto', href: '/galeri/foto', icon: ImageIcon },
      { id: 'video', label: 'Video', href: '/galeri/video', icon: Video },
    ],
  },
  'prestasi-ekskul': {
    parentLabel: 'Aktivitas',
    parentHref: '/prestasi',
    parentIcon: Trophy,
    tabs: [
      { id: 'prestasi', label: 'Prestasi', href: '/prestasi', icon: Trophy },
      { id: 'ekskul', label: 'Ekskul', href: '/ekskul', icon: Activity },
    ],
  },
  'smart-jm-stem': {
    parentLabel: 'Smart JM: STEM',
    parentHref: '/smart-jm/stem/materi',
    parentIcon: Cpu,
    tabs: [
      { id: 'stem-materi', label: 'Materi dan Penugasan', shortLabel: 'Materi STEM', href: '/smart-jm/stem/materi', icon: Cpu },
      { id: 'stem-portofolio', label: 'Portofolio Siswa', shortLabel: 'Portofolio', href: '/smart-jm/stem/portofolio', icon: Sparkles },
    ],
  },
  'smart-jm-mandarin': {
    parentLabel: 'Smart JM: Mandarin',
    parentHref: '/smart-jm/mandarin/materi',
    parentIcon: Globe,
    tabs: [
      { id: 'mandarin-materi', label: 'Materi', shortLabel: 'Materi', href: '/smart-jm/mandarin/materi', icon: Globe },
      { id: 'mandarin-quiz', label: 'Quiz', shortLabel: 'Quiz', href: '/smart-jm/mandarin/quiz', icon: CheckCircle2 },
    ],
  },
  'smart-jm-hafidz': {
    parentLabel: 'Smart JM: Quran',
    parentHref: '/smart-jm/hafidz/read',
    parentIcon: BookOpen,
    tabs: [
      { id: 'read', label: 'Read Quran', shortLabel: 'Read Quran', href: '/smart-jm/hafidz/read', icon: BookOpen },
      { id: 'murojaah', label: 'Murojaah', shortLabel: 'Murojaah', href: '/smart-jm/hafidz/murojaah', icon: Volume2 },
    ],
  },
  'smart-jm': {
    parentLabel: 'Smart JM',
    parentHref: '/smart-jm/stem/materi',
    parentIcon: Cpu,
    tabs: [
      { id: 'stem', label: 'STEM Area', shortLabel: 'STEM Area', href: '/smart-jm/stem/materi', icon: Cpu },
      { id: 'mandarin', label: 'Mandarin Class', shortLabel: 'Mandarin Class', href: '/smart-jm/mandarin/materi', icon: Globe },
      { id: 'hafidz', label: "Hafidz Qur'an", shortLabel: "Hafidz Qur'an", href: '/smart-jm/hafidz/read', icon: BookOpen },
    ],
  },
  'agenda': {
    parentLabel: 'Karya Siswa',
    parentHref: '/karya-siswa',
    parentIcon: Sparkles,
    tabs: [
      { id: 'agenda-current', label: 'Bulan Ini', shortLabel: 'Current', href: '/karya-siswa', icon: CalendarDays },
      { id: 'agenda-future', label: 'Mendatang', shortLabel: 'Future', href: '/karya-siswa', icon: Clock3 },
      { id: 'agenda-historical', label: 'Arsip Program', shortLabel: 'Historical', href: '/karya-siswa', icon: CheckCircle2 },
    ],
  },
  'osis': {
    parentLabel: 'OSIS',
    parentHref: '/osis',
    parentIcon: OsisIcon,
    tabs: [
      { id: 'osis-kabinet', label: 'Bagan BPH', shortLabel: 'Kabinet', href: '/osis', icon: Users },
      { id: 'osis-divisi', label: '6 Divisi & Proker', shortLabel: 'Divisi', href: '/osis', icon: OsisIcon },
      { id: 'osis-aspirasi', label: 'Kotak Aspirasi', shortLabel: 'Aspirasi', href: '/osis', icon: HeartHandshake },
    ],
  },
  'jm-news': {
    parentLabel: 'JM News',
    parentHref: '/jm-news/agenda-bulanan',
    parentIcon: Newspaper,
    tabs: [
      { id: 'agenda-bulanan', label: 'Agenda Bulanan', shortLabel: 'Agenda Bulanan', href: '/jm-news/agenda-bulanan', icon: CalendarDays },
      { id: 'press-release', label: 'Press Release', shortLabel: 'Press Release', href: '/jm-news/press-release', icon: Newspaper },
    ],
  },
  'spmb': {
    parentLabel: 'SPMB',
    parentHref: '/spmb',
    parentIcon: GraduationCap,
    tabs: [
      { id: 'tentang-spmb', label: 'Tentang SPMB', shortLabel: 'Tentang', href: '/spmb', icon: Info },
      { id: 'formulir-spmb', label: 'Formulir SPMB', shortLabel: 'Formulir', href: '/spmb#formulir', icon: FileText },
    ],
  },
};

/**
 * NavBarTabs - Modern Android TabNavBar with Curved Cutout Notch & Floating Dot
 * Default tab hierarchy: [Beranda] -> [Sub Menu 1] .. [Sub Menu N]
 * Borderless emerald green container with left-aligned close-spacing text tabs
 */
export const NavBarTabs: React.FC<NavBarTabsProps> = ({
  tabs: propTabs,
  activeTabId: propActiveTabId,
  className = '',
  onChangeTab,
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  // Auto-detect hub category if tabs are not provided explicitly
  let detectedCategory = '';
  if (pathname.includes('/spmb') || pathname.includes('/ppdb')) detectedCategory = 'spmb';
  else if (pathname.includes('/jm-news') || pathname.includes('/berita')) detectedCategory = 'jm-news';
  else if (pathname.includes('/agenda') || pathname.includes('/karya-siswa')) detectedCategory = 'agenda';
  else if (pathname.includes('/osis')) detectedCategory = 'osis';
  else if (pathname.includes('/jm-center')) detectedCategory = 'jm-center';
  else if (pathname.includes('/program-unggulan')) detectedCategory = 'program-unggulan';
  else if (pathname.includes('/galeri')) detectedCategory = 'galeri';
  else if (pathname === '/prestasi' || pathname === '/ekskul') detectedCategory = 'prestasi-ekskul';
  else if (pathname.includes('/smart-jm')) detectedCategory = 'smart-jm';

  const defaultCategory = DEFAULT_CATEGORY_TABS[detectedCategory];

  // Construct default tab hierarchy: "Beranda", "Sub Menu 1", ..., "Sub Menu N"
  let tabs: NavTabItem[] = [];
  if (propTabs && propTabs.length > 0) {
    tabs = propTabs;
  } else if (defaultCategory) {
    const homeTab: NavTabItem = {
      id: 'beranda',
      label: 'Beranda',
      href: '/',
      icon: Home,
    };

    tabs = [homeTab, ...defaultCategory.tabs];
  }

  // Active Tab Detection: Prioritize specific sub-menu items, then Beranda
  let activeTab = tabs.find((t) => propActiveTabId && t.id === propActiveTabId);
  if (!activeTab) {
    if (pathname === '/') {
      activeTab = tabs.find((t) => t.id === 'beranda') || tabs[0];
    } else {
      // 1. Check specific sub-menu items first
      const subMenuTabs = tabs.filter((t) => t.id !== 'beranda');
      activeTab = subMenuTabs.find((t) => pathname === t.href);

      // 2. Specific SMART JM category matching
      if (!activeTab && pathname.includes('/smart-jm')) {
        if (pathname.includes('/smart-jm/stem')) {
          activeTab = subMenuTabs.find((t) => t.id === 'stem');
        } else if (pathname.includes('/smart-jm/mandarin')) {
          activeTab = subMenuTabs.find((t) => t.id === 'mandarin');
        } else if (pathname.includes('/smart-jm/hafidz')) {
          activeTab = subMenuTabs.find((t) => t.id === 'hafidz');
        }
      }

      // 3. Check sub-menu prefix
      if (!activeTab) {
        activeTab = subMenuTabs.find((t) => t.href !== '/' && pathname.startsWith(t.href));
      }

      // 4. Fallback to any matching tab or first
      if (!activeTab) {
        activeTab = tabs.find((t) => pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href))) || tabs[0];
      }
    }
  }

  // Auto-center active tab on mobile viewport
  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const container = tabListRef.current;
      const activeEl = activeTabRef.current;
      const scrollLeft =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [pathname, activeTab?.id]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <nav
      aria-label="Sub Menu Navigation"
      className={`curved-navbar-wrapper w-full ${className}`}
    >
      <div className="curved-navbar-bar w-full">
        {/* Horizontal Scrollable Track for Smaller Screens (Left Aligned with Close Spacing) */}
        <div
          ref={tabListRef}
          className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-2"
        >
          <ul className="curved-tab-list flex items-center justify-start">
            {tabs.map((tab) => {
              const isActive = activeTab?.id === tab.id;

              return (
                <li
                  key={tab.id}
                  className="curved-tab-col flex-none h-full flex items-center justify-center snap-start shrink-0"
                >
                  <Link
                    ref={isActive ? activeTabRef : null}
                    to={tab.href}
                    onClick={() => onChangeTab?.(tab)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`curved-tab-link ${isActive ? 'active' : ''}`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel */}
                    {isActive && (
                      <motion.div
                        layoutId="curvedCutoutPointer"
                        layout="position"
                        className="curved-pointer"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                          mass: 0.58,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 22"
                          className="curved-notch-svg"
                          width="74"
                          height="22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <defs>
                            <radialGradient id="topNotchDotGrad" cx="35%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#fffbeb" />
                              <stop offset="35%" stopColor="#fde047" />
                              <stop offset="75%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#92400e" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                            className="curved-notch-surface"
                            stroke="none"
                          />
                          {/* Radiant Jewel Gold Floating Indicator */}
                          <circle
                            cx="37"
                            cy="6"
                            r="4.8"
                            fill="url(#topNotchDotGrad)"
                            className="curved-notch-dot"
                            stroke="none"
                          />
                          {/* Specular Gem Reflection */}
                          <circle
                            cx="35.5"
                            cy="4.5"
                            r="1.4"
                            fill="#ffffff"
                            opacity="0.85"
                            stroke="none"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Tab Label (Zero-sliding responsive display) */}
                    <span className="curved-tab-text font-extrabold tracking-tight">
                      {tab.shortLabel ? (
                        <>
                          <span className="sm:hidden font-extrabold">{tab.shortLabel}</span>
                          <span className="hidden sm:inline font-bold">{tab.label}</span>
                        </>
                      ) : (
                        <span className="font-extrabold">{tab.label}</span>
                      )}
                    </span>

                    {/* Optional Badge */}
                    {tab.badge && (
                      <span className="curved-tab-badge">
                        {tab.badge}
                      </span>
                    )}
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

// Backward-compatible alias
export const FolderBreadcrumbTabs = NavBarTabs;
export type FolderBreadcrumbTabsProps = NavBarTabsProps;
export type FolderTabItem = NavTabItem;
