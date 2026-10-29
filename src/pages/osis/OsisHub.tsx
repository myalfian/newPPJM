import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
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

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs
        activeTabId={activeTab}
        onChangeTab={(tab) => handleTabChange(tab.id as OsisTab)}
      />

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

