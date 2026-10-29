import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Globe,
  BookOpen,
  Sparkles
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

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 space-y-2.5 sm:space-y-3.5 overflow-x-hidden select-none">
      {/* Folder-style Navigation Breadcrumb */}
      <NavBarTabs />

      {/* ========================================================= */}
      {/* HEADER BANNER: MODERN LUXURY SMART JM */}
      {/* ========================================================= */}
      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 text-white p-3.5 sm:p-5 lg:p-6 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-3 max-w-3xl">
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

