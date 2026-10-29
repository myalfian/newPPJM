import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  Layers,
  Clock
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { PondokProgramSection } from './PondokProgramSection';
import { SekolahProgramSection } from './SekolahProgramSection';
import { MadinFlyerSection } from './MadinFlyerSection';
import { ProgramPillarTab } from './types';

export interface ProgramHubProps {
  defaultTab?: ProgramPillarTab;
}

export const ProgramHub: React.FC<ProgramHubProps> = ({ defaultTab = 'pondok' }) => {
  const location = useLocation();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<ProgramPillarTab>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'sekolah' || path.includes('/program-sekolah') || path.includes('/sekolah')) {
      return 'sekolah';
    }
    if (tabParam === 'madin' || path.includes('/program-madin') || path.includes('/madin')) {
      return 'madin';
    }
    if (tabParam === 'pondok' || path.includes('/amaliyah-pondok') || path.includes('/pondok')) {
      return 'pondok';
    }
    return defaultTab;
  });

  // Keep state synced with route or query param
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'sekolah' || path.includes('/program-sekolah') || path.includes('/sekolah')) {
      setActiveTab('sekolah');
    } else if (tabParam === 'madin' || path.includes('/program-madin') || path.includes('/madin')) {
      setActiveTab('madin');
    } else if (
      tabParam === 'pondok' ||
      path.includes('/amaliyah-pondok') ||
      path.includes('/pondok')
    ) {
      setActiveTab('pondok');
    }
  }, [location.pathname, location.search]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY PPJM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-emerald-800/40">
        {/* Glow & Pattern Accents */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Pusat Kurikulum & Aktivitas Unggulan</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Program Pendidikan & Aktivitas Santri
            </h1>
            <p className="mt-2.5 text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Integrasi harmonis antara keilmuan Islam salafiyah, tahfidzul Qur’an 30 juz bersanad, sekolah formal terakreditasi A berbasis sains STEM, dan penempaan akhlaqul karimah.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Akreditasi &quot;A&quot; BAN-PDM</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Bimbingan Asatidz 24 Jam</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
              <Layers className="w-4 h-4 text-blue-300 shrink-0" />
              <span>3 Pilar Terintegrasi</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TAB CONTENT SECTIONS (Animated Switcher) */}
      {/* ========================================================= */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'pondok' && (
            <motion.div
              key="tab-pondok"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <PondokProgramSection />
            </motion.div>
          )}

          {activeTab === 'sekolah' && (
            <motion.div
              key="tab-sekolah"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SekolahProgramSection />
            </motion.div>
          )}

          {activeTab === 'madin' && (
            <motion.div
              key="tab-madin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <MadinFlyerSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

