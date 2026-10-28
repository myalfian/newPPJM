import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Sparkles,
  Calendar,
  ShieldCheck,
  Award,
  Crown,
  Layers
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { OsisStructureSection } from './OsisStructureSection';
import { OsisProgramsSection } from './OsisProgramsSection';
import { OsisEventsSection } from './OsisEventsSection';
import { OsisTab } from './types';

export interface OsisHubProps {
  defaultTab?: OsisTab;
}

export const OsisHub: React.FC<OsisHubProps> = ({ defaultTab = 'struktur' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<OsisTab>(() => {
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'program') return 'program';
    if (tabParam === 'event') return 'event';
    if (tabParam === 'struktur') return 'struktur';
    return defaultTab;
  });

  // Keep state synced with search param
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'program') {
      setActiveTab('program');
    } else if (tabParam === 'event') {
      setActiveTab('event');
    } else if (tabParam === 'struktur') {
      setActiveTab('struktur');
    }
  }, [location.search]);

  const handleTabChange = (tab: OsisTab) => {
    setActiveTab(tab);
    if (tab === 'struktur') {
      navigate('/osis', { replace: true });
    } else {
      navigate(`/osis?tab=${tab}`, { replace: true });
    }
  };

  const tabsConfig = [
    {
      id: 'struktur' as OsisTab,
      label: 'Struktur Pengurus',
      subtitle: 'Bagan & Hierarki Kabinet Santri',
      icon: Users,
      badge: 'Bagan Resmi'
    },
    {
      id: 'program' as OsisTab,
      label: 'Program Kerja',
      subtitle: '5 Departemen & Proker Terpadu',
      icon: Sparkles,
      badge: '5 Sekbid'
    },
    {
      id: 'event' as OsisTab,
      label: 'Event & Berita',
      subtitle: 'Press Release & Warta Kegiatan',
      icon: Calendar,
      badge: 'Warta Terkini'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY OSIS PPJM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Portal Resmi Organisasi Siswa Intra Sekolah</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              OSIS SMP Plus Jauharul Maknuun
            </h1>
            <p className="mt-2.5 text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Kawah candradimuka kepemimpinan santri muda: mengasah integritas kepribadian, tanggung jawab sosial, kecakapan diplomasi bahasa internasional, serta penegakan kedisiplinan dan keasrian pesantren.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Masa Bakti 2026/2027</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Layers className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>5 Departemen Khidmah</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span>Kepemimpinan Berakhlak</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SEGMENTED TAB NAVIGATION (Sticky Modern Lux Pill Switcher) */}
      {/* ========================================================= */}
      <nav
        aria-label="Navigasi Submenu OSIS"
        className="sticky top-14 sm:top-18 z-30 -mx-3 px-3 sm:mx-0 sm:px-0 py-2.5 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-y sm:border sm:rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x p-1">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`group relative flex-1 min-w-[200px] sm:min-w-0 min-h-[48px] px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                  isActive
                    ? 'text-emerald-950 dark:text-emerald-100 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Active Indicator Sliding Pill (Framer Motion) */}
                {isActive && (
                  <motion.div
                    layoutId="osis-hub-active-indicator"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-700/60 rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm leading-tight tracking-tight">
                      {tab.label}
                    </span>
                    <span className="block text-[11px] font-normal text-zinc-400 dark:text-zinc-400 truncate max-w-[150px] sm:max-w-none">
                      {tab.subtitle}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 hidden sm:block">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* TAB CONTENT SECTIONS (Animated Switcher) */}
      {/* ========================================================= */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'struktur' && (
            <motion.div
              key="tab-osis-struktur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <OsisStructureSection />
            </motion.div>
          )}

          {activeTab === 'program' && (
            <motion.div
              key="tab-osis-program"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <OsisProgramsSection />
            </motion.div>
          )}

          {activeTab === 'event' && (
            <motion.div
              key="tab-osis-event"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <OsisEventsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OsisHub;

