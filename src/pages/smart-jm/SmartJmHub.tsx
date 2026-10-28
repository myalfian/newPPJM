import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Globe,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Flame,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { StemAreaSection } from './StemAreaSection';
import { MandarinClassSection } from './MandarinClassSection';
import { HafidzQuranSection } from './HafidzQuranSection';
import { SmartJmPillarTab } from './types';

export interface SmartJmHubProps {
  defaultTab?: SmartJmPillarTab;
}

export const SmartJmHub: React.FC<SmartJmHubProps> = ({ defaultTab = 'stem' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<SmartJmPillarTab>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'mandarin' || path.includes('/mandarin')) return 'mandarin';
    if (tabParam === 'hafidz' || path.includes('/hafidz')) return 'hafidz';
    if (tabParam === 'stem' || path.includes('/stem')) return 'stem';
    return defaultTab;
  });

  // Keep state synced with route or query param
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'mandarin' || path.includes('/mandarin')) {
      setActiveTab('mandarin');
    } else if (tabParam === 'hafidz' || path.includes('/hafidz')) {
      setActiveTab('hafidz');
    } else if (tabParam === 'stem' || path.includes('/stem')) {
      setActiveTab('stem');
    }
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: SmartJmPillarTab) => {
    setActiveTab(tab);
    // Smooth replace URL so users can share specific tabs
    if (tab === 'stem') {
      navigate('/smart-jm/stem/materi', { replace: true });
    } else if (tab === 'mandarin') {
      navigate('/smart-jm/mandarin/materi', { replace: true });
    } else if (tab === 'hafidz') {
      navigate('/smart-jm/hafidz/read', { replace: true });
    }
  };

  const tabsConfig = [
    {
      id: 'stem' as SmartJmPillarTab,
      label: 'STEM Area',
      subtitle: 'Worksheet Proyek & Portofolio Siswa',
      icon: Cpu,
      badge: 'Sains & Robotik'
    },
    {
      id: 'mandarin' as SmartJmPillarTab,
      label: 'Mandarin Class',
      subtitle: 'Materi Belajar & Quiz Interaktif',
      icon: Globe,
      badge: 'Bahasa Asing'
    },
    {
      id: 'hafidz' as SmartJmPillarTab,
      label: 'Hafidz Quran',
      subtitle: 'Read Quran Digital & Latihan Murojaah',
      icon: BookOpen,
      badge: '30 Juz Bersanad'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY SMART JM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Pusat Pembelajaran Digital Santri Masa Depan</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              SMART JM Learning Center
            </h1>
            <p className="mt-2.5 text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Platform pembelajaran digital interaktif Pondok Pesantren Jauharul Maknuun: memadukan riset sains & robotika STEM, keahlian bahasa Mandarin internasional, serta mushaf Al-Qur’an digital dan latihan hafalan murojaah mandiri.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Lab IoT & Robotika</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Globe className="w-4 h-4 text-red-400 shrink-0" />
              <span>Mandarin Bersertifikasi</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Murojaah Audio Al-Afasy</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SEGMENTED TAB NAVIGATION (Sticky Modern Lux Pill Switcher) */}
      {/* ========================================================= */}
      <nav
        aria-label="Navigasi Pilar Smart JM"
        className="sticky top-14 sm:top-18 z-30 -mx-3 px-3 sm:mx-0 sm:px-0 py-2.5 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-y sm:border sm:rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x p-1">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            const activeColorClass =
              tab.id === 'stem'
                ? 'text-blue-950 dark:text-blue-100'
                : tab.id === 'mandarin'
                ? 'text-red-950 dark:text-red-100'
                : 'text-emerald-950 dark:text-emerald-100';

            const activeBgClass =
              tab.id === 'stem'
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-300/80 dark:border-blue-700/60'
                : tab.id === 'mandarin'
                ? 'bg-red-50 dark:bg-red-950/70 border-red-300/80 dark:border-red-700/60'
                : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300/80 dark:border-emerald-700/60';

            const iconBgClass =
              tab.id === 'stem'
                ? 'bg-blue-600 text-white'
                : tab.id === 'mandarin'
                ? 'bg-red-600 text-white'
                : 'bg-emerald-600 text-white';

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`group relative flex-1 min-w-[200px] sm:min-w-0 min-h-[48px] px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                  isActive
                    ? `${activeColorClass} font-bold`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Active Indicator Sliding Pill (Framer Motion) */}
                {isActive && (
                  <motion.div
                    layoutId="smartjm-active-indicator"
                    className={`absolute inset-0 border rounded-xl shadow-xs ${activeBgClass}`}
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? `${iconBgClass} shadow-xs`
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
                        ? 'bg-black/10 dark:bg-white/10 text-current'
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
          {activeTab === 'stem' && (
            <motion.div
              key="tab-smartjm-stem"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StemAreaSection />
            </motion.div>
          )}

          {activeTab === 'mandarin' && (
            <motion.div
              key="tab-smartjm-mandarin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <MandarinClassSection />
            </motion.div>
          )}

          {activeTab === 'hafidz' && (
            <motion.div
              key="tab-smartjm-hafidz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <HafidzQuranSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

