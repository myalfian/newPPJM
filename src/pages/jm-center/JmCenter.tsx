import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Landmark
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { ProfileSection } from './ProfileSection';
import { FacilitiesSection } from './FacilitiesSection';
import { InstitutionsSection } from './InstitutionsSection';

export type JmCenterTab = 'profil' | 'fasilitas' | 'lembaga' | 'sambutan' | 'sejarah' | 'visi-misi';

export interface JmCenterProps {
  defaultTab?: JmCenterTab;
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'profile';
}

export const JmCenter: React.FC<JmCenterProps> = ({ defaultTab = 'profil', defaultSection = 'sambutan' }) => {
  const location = useLocation();

  // Tab State determination from URL or props: 'profil' | 'fasilitas' | 'lembaga'
  const [activeTab, setActiveTab] = useState<'profil' | 'fasilitas' | 'lembaga'>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'fasilitas' || path.includes('/fasilitas')) return 'fasilitas';
    if (tabParam === 'lembaga' || path.includes('/lembaga')) return 'lembaga';
    return 'profil';
  });

  // Keep state synced with route or query param
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'fasilitas' || path.includes('/fasilitas')) {
      setActiveTab('fasilitas');
    } else if (tabParam === 'lembaga' || path.includes('/lembaga')) {
      setActiveTab('lembaga');
    } else {
      setActiveTab('profil');
    }
  }, [location.pathname, location.search]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 space-y-2 sm:space-y-2.5 overflow-x-hidden select-none">
      {/* 1. Android-Style Folder Sub-Nav Tabs */}
      <NavBarTabs activeTabId={activeTab} />

      {/* 2. Hero Header Banner (Modern Luxury Glassmorphism) */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#042817] via-[#083e24] to-[#031d11] border border-emerald-800/40 shadow-lg p-2.5 sm:p-4 text-white">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Pusat Informasi &amp; Profil Kelembagaan</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
              JM Center Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              Pusat informasi komprehensif Pondok Pesantren &amp; SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik. Mengenal lebih dekat kepengasuhan, rekam jejak sejarah, sarana prasarana modern, dan unit kelembagaan terpadu.
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white/10 dark:bg-zinc-900/60 border border-white/20 rounded-xl p-2.5 sm:p-3 backdrop-blur-md shrink-0 space-y-1 self-start md:self-center">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Akreditasi &amp; Legalitas
            </span>
            <div className="text-xs text-white font-extrabold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terakreditasi &quot;A&quot; BAN-PDM (Unggul)</span>
            </div>
            <p className="text-[10.5px] text-emerald-200/80">
              NPSN Resmi Kemenag &amp; Kemendikbudristek
            </p>
          </div>
        </div>
      </div>

      {/* 3. Active Section Content Render */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'profil' && (
            <motion.div
              key="jm-section-profil"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileSection defaultSection={defaultSection} />
            </motion.div>
          )}

          {activeTab === 'fasilitas' && (
            <motion.div
              key="jm-section-fasilitas"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <FacilitiesSection />
            </motion.div>
          )}

          {activeTab === 'lembaga' && (
            <motion.div
              key="jm-section-lembaga"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
