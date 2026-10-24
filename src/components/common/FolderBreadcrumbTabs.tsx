import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import './FolderBreadcrumbTabs.css';

export interface FolderTabItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface FolderBreadcrumbTabsProps {
  // Breadcrumb Trail (Top row)
  homeLabel?: string;
  parentLabel?: string;
  parentHref?: string;
  currentLabel?: string;

  // Folder Tabs
  tabs?: FolderTabItem[];
  activeTabId?: string;
  className?: string;
  onChangeTab?: (tab: FolderTabItem) => void;
}

// Pre-defined category tabs corresponding to the portal's navigation hubs
const DEFAULT_CATEGORY_TABS: Record<string, { parentLabel: string; parentHref: string; tabs: FolderTabItem[] }> = {
  'jm-center': {
    parentLabel: 'JM Center',
    parentHref: '/jm-center/sambutan',
    tabs: [
      { id: 'sambutan', label: 'Sambutan Pengasuh', href: '/jm-center/sambutan' },
      { id: 'visi-misi', label: 'Visi & Misi', href: '/jm-center/visi-misi' },
      { id: 'sejarah', label: 'Sejarah Pesantren', href: '/jm-center/sejarah' },
      { id: 'lembaga', label: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga' },
    ],
  },
  'program-unggulan': {
    parentLabel: 'Program Unggulan',
    parentHref: '/program-unggulan/program-sekolah',
    tabs: [
      { id: 'program-sekolah', label: 'Pendidikan Formal', href: '/program-unggulan/program-sekolah' },
      { id: 'program-madin', label: 'Madrasah Diniyah', href: '/program-unggulan/program-madin' },
      { id: 'amaliyah-pondok', label: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok' },
    ],
  },
  'galeri': {
    parentLabel: 'Galeri',
    parentHref: '/galeri/foto',
    tabs: [
      { id: 'foto', label: 'Galeri Foto Kegiatan', href: '/galeri/foto' },
      { id: 'video', label: 'Galeri Video Profil', href: '/galeri/video' },
    ],
  },
  'prestasi-ekskul': {
    parentLabel: 'Aktivitas Santri',
    parentHref: '/prestasi',
    tabs: [
      { id: 'prestasi', label: 'Prestasi Santri', href: '/prestasi' },
      { id: 'ekskul', label: 'Ekstrakurikuler', href: '/ekskul' },
    ],
  },
  'smart-jm-hafidz': {
    parentLabel: 'Smart JM',
    parentHref: '/smart-jm/hafidz/read',
    tabs: [
      { id: 'read', label: 'Al-Qur’an 30 Juz', href: '/smart-jm/hafidz/read' },
      { id: 'murojaah', label: 'Murojaah AI Suara', href: '/smart-jm/hafidz/murojaah' },
    ],
  },
  'smart-jm-stem': {
    parentLabel: 'Smart JM',
    parentHref: '/smart-jm/stem/materi',
    tabs: [
      { id: 'stem-materi', label: 'Modul Materi STEM', href: '/smart-jm/stem/materi' },
      { id: 'stem-portofolio', label: 'Portofolio Robotika', href: '/smart-jm/stem/portofolio' },
    ],
  },
  'smart-jm-mandarin': {
    parentLabel: 'Smart JM',
    parentHref: '/smart-jm/mandarin/materi',
    tabs: [
      { id: 'mandarin-materi', label: 'Materi & Kosakata Mandarin', href: '/smart-jm/mandarin/materi' },
      { id: 'mandarin-quiz', label: 'Kuis Interaktif Pinyin', href: '/smart-jm/mandarin/quiz' },
    ],
  },
  'smart-jm': {
    parentLabel: 'Smart JM',
    parentHref: '/smart-jm/hafidz/read',
    tabs: [
      { id: 'read', label: 'Al-Qur’an 30 Juz', href: '/smart-jm/hafidz/read' },
      { id: 'murojaah', label: 'Murojaah AI', href: '/smart-jm/hafidz/murojaah' },
      { id: 'stem-materi', label: 'STEM Materi', href: '/smart-jm/stem/materi' },
      { id: 'stem-portofolio', label: 'STEM Portofolio', href: '/smart-jm/stem/portofolio' },
      { id: 'mandarin-materi', label: 'Mandarin Class', href: '/smart-jm/mandarin/materi' },
      { id: 'mandarin-quiz', label: 'Kuis Interaktif', href: '/smart-jm/mandarin/quiz' },
    ],
  },
};

/**
 * Animated Fluid Tab Bar with Carved / Inverted Curve Cutout
 * Inspired by CodePen (mario_999/pen/rNYZxNy)
 * Features:
 * - Floating pill navigation bar with neutral solid / glassmorphic surface
 * - Physics-based sliding active indicator with smooth X-axis translation
 * - Inverted curve / concave cutout fillets on left & right of active indicator
 * - Automatic centering on mobile viewport with zero CLS
 * - Accessible touch targets (>= 44x44px) & snappy tactile micro-press feedback
 */
export const FolderBreadcrumbTabs: React.FC<FolderBreadcrumbTabsProps> = ({
  homeLabel = 'Beranda',
  parentLabel: propParentLabel,
  parentHref: propParentHref,
  currentLabel: propCurrentLabel,
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
  if (pathname.includes('/jm-center')) detectedCategory = 'jm-center';
  else if (pathname.includes('/program-unggulan')) detectedCategory = 'program-unggulan';
  else if (pathname.includes('/galeri')) detectedCategory = 'galeri';
  else if (pathname === '/prestasi' || pathname === '/ekskul') detectedCategory = 'prestasi-ekskul';
  else if (pathname.includes('/smart-jm/hafidz')) detectedCategory = 'smart-jm-hafidz';
  else if (pathname.includes('/smart-jm/stem')) detectedCategory = 'smart-jm-stem';
  else if (pathname.includes('/smart-jm/mandarin')) detectedCategory = 'smart-jm-mandarin';
  else if (pathname.includes('/smart-jm')) detectedCategory = 'smart-jm';

  const defaultCategory = DEFAULT_CATEGORY_TABS[detectedCategory];
  const tabs = propTabs || defaultCategory?.tabs || [];
  const parentLabel = propParentLabel || defaultCategory?.parentLabel || 'Informasi';
  const parentHref = propParentHref || defaultCategory?.parentHref || '/';

  // Find active tab item
  const activeTab = tabs.find((t) => {
    if (propActiveTabId) return t.id === propActiveTabId;
    return pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href));
  }) || tabs[0];

  const currentLabel = propCurrentLabel || activeTab?.label || '';

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

  return (
    <div className={`w-full space-y-3.5 ${className}`}>
      
      {/* 1. Breadcrumb Trail (Top Layer) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-300 hover:text-[#007acc] dark:hover:text-[#38bdf8] transition-colors py-0.5 group"
        >
          <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#007acc] dark:group-hover:text-[#38bdf8] transition-colors" />
          <span>{homeLabel}</span>
        </Link>

        {parentLabel && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600 shrink-0" />
            <Link
              to={parentHref}
              className="text-slate-600 dark:text-zinc-300 hover:text-[#007acc] dark:hover:text-[#38bdf8] transition-colors py-0.5"
            >
              {parentLabel}
            </Link>
          </>
        )}

        {currentLabel && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600 shrink-0" />
            <span className="text-[#007acc] dark:text-[#38bdf8] font-bold py-0.5 truncate max-w-[240px] sm:max-w-none">
              {currentLabel}
            </span>
          </>
        )}
      </nav>

      {/* 2. Fluid Sliding Tab Bar with Carved Cutout Inverted Curves */}
      {tabs.length > 0 && (
        <div className="w-full flex items-center justify-start">
          <div className="fluid-tab-container max-w-full inline-flex">
            {/* Horizontal Snap Scroll Track for Mobile Viewports */}
            <div
              ref={tabListRef}
              className="flex items-center gap-1 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full p-0.5"
            >
              {tabs.map((tab) => {
                const isActive = activeTab?.id === tab.id;
                const TabIcon = tab.icon;

                return (
                  <Link
                    key={tab.id}
                    ref={isActive ? activeTabRef : null}
                    to={tab.href}
                    onClick={() => onChangeTab?.(tab)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`fluid-tab-item snap-start shrink-0 relative ${
                      isActive
                        ? 'text-[#007acc] dark:text-[#38bdf8] font-black'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {/* Animated Sliding Active Indicator with Inverted Curve Cutout */}
                    {isActive && (
                      <motion.div
                        layoutId="fluidCutoutIndicator"
                        className="fluid-cutout-indicator"
                        transition={{
                          type: 'spring',
                          stiffness: 480,
                          damping: 34,
                          mass: 0.8,
                        }}
                      >
                        {/* Left Inverted Concave Curve (CodePen Cutout Effect) */}
                        <span className="cutout-wing-left" aria-hidden="true">
                          <svg viewBox="0 0 10 10" className="w-full h-full block">
                            <path
                              d="M10 0 C10 5.523 5.523 10 0 10 H10 V0 Z"
                              className="fill-white dark:fill-zinc-900"
                            />
                            <path
                              d="M10 0 C10 5.523 5.523 10 0 10"
                              fill="none"
                              stroke="currentColor"
                              className="text-slate-200 dark:text-zinc-700"
                              strokeWidth="1.2"
                            />
                          </svg>
                        </span>

                        {/* Right Inverted Concave Curve (CodePen Cutout Effect) */}
                        <span className="cutout-wing-right" aria-hidden="true">
                          <svg viewBox="0 0 10 10" className="w-full h-full block">
                            <path
                              d="M0 0 C0 5.523 4.477 10 10 10 H0 V0 Z"
                              className="fill-white dark:fill-zinc-900"
                            />
                            <path
                              d="M0 0 C0 5.523 4.477 10 10 10"
                              fill="none"
                              stroke="currentColor"
                              className="text-slate-200 dark:text-zinc-700"
                              strokeWidth="1.2"
                            />
                          </svg>
                        </span>
                      </motion.div>
                    )}

                    {/* Tab Content: Icon + Label + Badge */}
                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                      {TabIcon && (
                        <TabIcon
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                            isActive ? 'scale-110 text-[#007acc] dark:text-[#38bdf8]' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      )}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold leading-none ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
                              : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
