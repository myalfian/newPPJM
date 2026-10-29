import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Landmark
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';
import { FacilitiesSection } from './FacilitiesSection';
import { InstitutionsSection } from './InstitutionsSection';

export type JmCenterTab = 'sambutan' | 'sejarah' | 'visi-misi' | 'fasilitas' | 'lembaga';

export interface JmCenterProps {
  defaultTab?: JmCenterTab;
}

export const JmCenter: React.FC<JmCenterProps> = ({ defaultTab = 'sambutan' }) => {
  const location = useLocation();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<JmCenterTab>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'sejarah' || path.includes('/sejarah')) return 'sejarah';
    if (tabParam === 'visi-misi' || path.includes('/visi-misi')) return 'visi-misi';
    if (tabParam === 'fasilitas' || path.includes('/fasilitas')) return 'fasilitas';
    if (tabParam === 'lembaga' || path.includes('/lembaga')) return 'lembaga';
    if (tabParam === 'sambutan' || path.includes('/sambutan') || path.includes('/profil')) return 'sambutan';
    return defaultTab;
  });

  // Keep state synced with route or query param
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'sejarah' || path.includes('/sejarah')) {
      setActiveTab('sejarah');
    } else if (tabParam === 'visi-misi' || path.includes('/visi-misi')) {
      setActiveTab('visi-misi');
    } else if (tabParam === 'fasilitas' || path.includes('/fasilitas')) {
      setActiveTab('fasilitas');
    } else if (tabParam === 'lembaga' || path.includes('/lembaga')) {
      setActiveTab('lembaga');
    } else if (tabParam === 'sambutan' || path.includes('/sambutan') || path.includes('/profil')) {
      setActiveTab('sambutan');
    }
  }, [location.pathname, location.search]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 overflow-x-hidden select-none">
      {/* 1. Android-Style Folder Sub-Nav Tabs */}
      <NavBarTabs />

      {/* 2. Hero Header Banner (Modern Luxury Glassmorphism) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#042817] via-[#083e24] to-[#031d11] border border-emerald-800/40 shadow-xl p-5 sm:p-8 text-white">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Pusat Informasi &amp; Profil Kelembagaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              JM Center Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              Pusat informasi komprehensif Pondok Pesantren &amp; SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik. Mengenal lebih dekat kepengasuhan, rekam jejak sejarah, sarana prasarana modern, dan unit kelembagaan terpadu.
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white/10 dark:bg-zinc-900/60 border border-white/20 rounded-2xl p-4 backdrop-blur-md shrink-0 space-y-1.5 self-start md:self-center">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Akreditasi &amp; Legalitas
            </span>
            <div className="text-xs text-white font-extrabold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Terakreditasi &quot;A&quot; BAN-PDM (Unggul)</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              NPSN Resmi Kemenag &amp; Kemendikbudristek
            </p>
          </div>
        </div>
      </div>

      {/* 3. Active Section Content Render */}
      <main className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'sambutan' && (
            <motion.div
              key="jm-section-sambutan"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <SambutanSection />
            </motion.div>
          )}

          {activeTab === 'sejarah' && (
            <motion.div
              key="jm-section-sejarah"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <SejarahSection />
            </motion.div>
          )}

          {activeTab === 'visi-misi' && (
            <motion.div
              key="jm-section-visi-misi"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <VisiMisiSection />
            </motion.div>
          )}

          {activeTab === 'fasilitas' && (
            <motion.div
              key="jm-section-fasilitas"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <FacilitiesSection />
            </motion.div>
          )}

          {activeTab === 'lembaga' && (
            <motion.div
              key="jm-section-lembaga"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <InstitutionsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default JmCenter;

