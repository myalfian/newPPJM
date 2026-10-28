import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Building2,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Landmark,
  Share2
} from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { ProfileSection } from './ProfileSection';
import { FacilitiesSection } from './FacilitiesSection';
import { InstitutionsSection } from './InstitutionsSection';

export type JmCenterTab = 'profil' | 'fasilitas' | 'lembaga';

export interface JmCenterProps {
  defaultTab?: JmCenterTab;
}

export const JmCenter: React.FC<JmCenterProps> = ({ defaultTab = 'profil' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State determination from URL or props
  const [activeTab, setActiveTab] = useState<JmCenterTab>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'fasilitas' || path.includes('/fasilitas')) return 'fasilitas';
    if (tabParam === 'lembaga' || path.includes('/lembaga')) return 'lembaga';
    if (tabParam === 'profil' || path.includes('/sambutan') || path.includes('/sejarah') || path.includes('/visi-misi')) {
      return 'profil';
    }
    return defaultTab;
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
    } else if (
      tabParam === 'profil' ||
      path.includes('/sambutan') ||
      path.includes('/sejarah') ||
      path.includes('/visi-misi')
    ) {
      setActiveTab('profil');
    }
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: JmCenterTab) => {
    setActiveTab(tab);
    // Smooth replace URL so users can share specific tabs
    if (tab === 'profil') {
      navigate('/jm-center/sambutan', { replace: true });
    } else if (tab === 'fasilitas') {
      navigate('/jm-center/fasilitas/pondok', { replace: true });
    } else if (tab === 'lembaga') {
      navigate('/jm-center/lembaga/pondok', { replace: true });
    }
  };

  const tabsConfig = [
    {
      id: 'profil' as JmCenterTab,
      label: 'Profil',
      subtitle: 'Sambutan, Sejarah & Visi Misi',
      icon: Compass,
      badge: '3 Bahasan',
    },
    {
      id: 'fasilitas' as JmCenterTab,
      label: 'Fasilitas',
      subtitle: 'Sarana Asrama, Lab & Kelas',
      icon: Building2,
      badge: '8 Sarana',
    },
    {
      id: 'lembaga' as JmCenterTab,
      label: 'Lembaga',
      subtitle: 'Pondok, SMP Plus & Madin',
      icon: Layers,
      badge: '3 Entitas',
    },
  ];

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

      {/* 3. Sticky Sub-Navigation (Segmented Pill Controller) */}
      <div className="sticky top-14 sm:top-18 z-30 py-2 sm:py-3 -mx-3 px-3 sm:mx-0 sm:px-0 bg-background/85 dark:bg-background/85 backdrop-blur-md transition-all">
        <div className="flex items-center justify-center sm:justify-start">
          <nav
            aria-label="Pilihan Seksi JM Center"
            className="inline-flex p-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/70 dark:border-zinc-700/70 backdrop-blur-md shadow-inner overflow-x-auto no-scrollbar snap-x touch-pan-x w-full sm:w-auto"
          >
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] shrink-0 snap-start select-none ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="jmCenterTabPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-md shadow-emerald-950/20"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10 shrink-0" />
                  <span className="relative z-10">{tab.label}</span>
                  <span
                    className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/30'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Active Section Content Render */}
      <main className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'profil' && (
            <motion.div
              key="jm-section-profil"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <ProfileSection />
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

