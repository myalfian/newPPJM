import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

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
 * FolderBreadcrumbTabs
 * Skeuomorphic / Glossy Browser Folder-Tab & Breadcrumb Component
 * Features:
 * - Rounded top corners + smooth inverted bottom concave fillet wings (left & right)
 * - Active tab: rich glossy blue gradient (#0088cc / #007acc to #005b96) with crisp white text
 * - Inactive tab: soft vertical off-white/gray gradient with subtle border & baseline integration
 * - Seamless integration over the baseline divider line without visual glitch
 * - Full responsiveness with horizontal smooth drag/scroll on mobile
 */
export const FolderBreadcrumbTabs: React.FC<FolderBreadcrumbTabsProps> = ({
  homeLabel = 'Beranda',
  parentLabel: propParentLabel,
  parentHref: propParentHref,
  currentLabel: propCurrentLabel,
  tabs: propTabs,
  activeTabId: propActiveTabId,
  className = '',
}) => {
  const location = useLocation();
  const pathname = location.pathname;

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
    return pathname === t.href || pathname.startsWith(t.href);
  }) || tabs[0];

  const currentLabel = propCurrentLabel || activeTab?.label || '';

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* 1. Breadcrumb Trail (Top Layer) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#007acc] transition-colors py-0.5 group"
        >
          <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#007acc] transition-colors" />
          <span>{homeLabel}</span>
        </Link>

        {parentLabel && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <Link
              to={parentHref}
              className="text-slate-600 hover:text-[#007acc] transition-colors py-0.5"
            >
              {parentLabel}
            </Link>
          </>
        )}

        {currentLabel && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-[#007acc] font-bold py-0.5 truncate max-w-[240px] sm:max-w-none">
              {currentLabel}
            </span>
          </>
        )}
      </nav>

      {/* 2. Skeuomorphic Browser Folder-Tab Navigation Bar */}
      {tabs.length > 0 && (
        <div className="relative pt-1">
          {/* Scrollable Tabs Wrapper */}
          <div className="relative flex items-end overflow-x-auto no-scrollbar scroll-smooth pl-3 pr-4 -mb-[1.5px] z-10 gap-3 sm:gap-4">
            {tabs.map((tab) => {
              const isActive = activeTab?.id === tab.id;
              const TabIcon = tab.icon;

              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  className={`group relative inline-flex items-center justify-center select-none font-bold whitespace-nowrap text-xs sm:text-[13px] px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'z-20 text-white drop-shadow-xs'
                      : 'z-0 text-slate-700 hover:text-slate-900 hover:-translate-y-0.5'
                  }`}
                  style={{
                    borderRadius: '10px 10px 0 0',
                    background: isActive
                      ? 'linear-gradient(180deg, #0288d1 0%, #007acc 48%, #005b96 100%)'
                      : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #e9eef5 100%)',
                    boxShadow: isActive
                      ? '0 -3px 8px rgba(0, 122, 204, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 -1px 3px rgba(0, 0, 0, 0.04)',
                    borderTop: isActive ? '1px solid #0288d1' : '1px solid #cbd5e1',
                    borderLeft: isActive ? '1px solid #007acc' : '1px solid #cbd5e1',
                    borderRight: isActive ? '1px solid #007acc' : '1px solid #cbd5e1',
                    borderBottom: isActive ? 'none' : '1.5px solid #007acc',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Glossy Top Edge Highlight */}
                  <div
                    className={`absolute top-0.5 inset-x-2 h-[1px] rounded-t-full pointer-events-none ${
                      isActive
                        ? 'bg-gradient-to-r from-transparent via-white/60 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-white/90 to-transparent'
                    }`}
                  />

                  {/* Left Concave Fillet Wing (Bottom-Left Curve) */}
                  <span
                    className="absolute -bottom-[1px] -left-[10px] w-[10px] h-[10px] pointer-events-none block overflow-hidden"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 10 10" className="w-full h-full block">
                      <path
                        d="M10 0 C10 5.52285 5.52285 10 0 10 H10 V0 Z"
                        fill={isActive ? '#005b96' : '#e9eef5'}
                      />
                      <path
                        d="M10 0 C10 5.52285 5.52285 10 0 10"
                        fill="none"
                        stroke={isActive ? '#007acc' : '#cbd5e1'}
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>

                  {/* Right Concave Fillet Wing (Bottom-Right Curve) */}
                  <span
                    className="absolute -bottom-[1px] -right-[10px] w-[10px] h-[10px] pointer-events-none block overflow-hidden"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 10 10" className="w-full h-full block">
                      <path
                        d="M0 0 C0 5.52285 4.47715 10 10 10 H0 V0 Z"
                        fill={isActive ? '#005b96' : '#e9eef5'}
                      />
                      <path
                        d="M0 0 C0 5.52285 4.47715 10 10 10"
                        fill="none"
                        stroke={isActive ? '#007acc' : '#cbd5e1'}
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>

                  {/* Tab Content: Icon + Title */}
                  <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    {TabIcon && (
                      <TabIcon
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                      />
                    )}
                    <span className="tracking-tight">{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold leading-none ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 3. Baseline Divider Line (Seamlessly blends beneath active tab) */}
          <div className="w-full h-[1.5px] bg-[#007acc] shadow-2xs relative z-0" />
        </div>
      )}
    </div>
  );
};
