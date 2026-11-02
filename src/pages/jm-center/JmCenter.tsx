import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';
import '../../components/common/NavBarTabs.css';
import { ProfileSection } from './ProfileSection';
import { FacilitiesSection } from './FacilitiesSection';
import { InstitutionsSection } from './InstitutionsSection';

export type JmCenterTab = 'profil' | 'fasilitas' | 'lembaga' | 'sambutan' | 'sejarah' | 'visi-misi';

export interface JmCenterProps {
  defaultTab?: JmCenterTab;
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi';
}

const JM_CENTER_TABS: {
  id: 'profil' | 'fasilitas' | 'lembaga';
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'profil', label: 'Profil Utama', shortLabel: 'Profil', icon: Landmark },
  { id: 'fasilitas', label: 'Fasilitas Kampus', shortLabel: 'Fasilitas', icon: Building2 },
  { id: 'lembaga', label: 'Unit Kelembagaan', shortLabel: 'Lembaga', icon: Layers },
];

export const JmCenter: React.FC<JmCenterProps> = ({ defaultTab = 'profil', defaultSection = 'sambutan' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State determination from URL or props: 'profil' | 'fasilitas' | 'lembaga'
  const [activeTab, setActiveTab] = useState<'profil' | 'fasilitas' | 'lembaga'>(() => {
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const tabParam = search.get('tab');

    if (tabParam === 'fasilitas' || path.includes('/fasilitas')) return 'fasilitas';
    if (tabParam === 'lembaga' || path.includes('/lembaga')) return 'lembaga';
    return 'profil';
  });

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

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
  }, [activeTab]);

  const handleTabChange = (tab: 'profil' | 'fasilitas' | 'lembaga') => {
    setActiveTab(tab);
    if (tab === 'profil') {
      navigate('/jm-center', { replace: true });
    } else {
      navigate(`/jm-center?tab=${tab}`, { replace: true });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-4">
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0E7A4C] via-[#095736] to-[#042818] text-white py-3.5 sm:py-5 px-3 sm:px-4 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8A951]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A951] text-[10.5px] font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#C8A951]" />
            <span>Pusat Informasi &amp; Profil Kelembagaan PPJM</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xs">
            JM Center Terpadu
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Pusat informasi komprehensif Pondok Pesantren &amp; SMP Plus Jauharul Maknuun Lasem, Sidayu, Gresik: mengenal lebih dekat dewan masyayikh, rekam jejak sejarah, sarana prasarana modern, dan unit kelembagaan terpadu.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CHIP TABS - 25% OVERLAP WITH HERO CONTAINER ABOVE */}
      <section className="max-w-6xl mx-auto px-2.5 sm:px-4 -mt-[11px] sm:-mt-[11.5px] relative z-20 select-none">
        <nav aria-label="Kategori JM Center" className="curved-navbar-wrapper w-full">
          <div className="curved-navbar-bar w-full">
            <div
              ref={tabListRef}
              className="curved-scroll-track w-full flex items-center justify-start overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth h-full px-1 sm:px-2"
            >
              <ul className="curved-tab-list flex items-center justify-between w-full gap-1 sm:gap-1.5">
                {JM_CENTER_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <li
                      key={tab.id}
                      className="curved-tab-col flex-1 h-full flex items-center justify-center min-w-[125px] sm:min-w-0 snap-start"
                    >
                      <button
                        ref={isActive ? activeTabRef : null}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={`curved-tab-link w-full bg-transparent border-0 relative flex items-center justify-center cursor-pointer px-1.5 sm:px-2 ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Animated Sliding Notch Pointer with Pristine White Cutout Notch & Radiant Gold Jewel */}
                        {isActive && (
                          <motion.div
                            layoutId="jmCenterCurvedPointer"
                            className="curved-pointer"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 28,
                              mass: 0.58,
                            }}
                          >
                            <svg
                              viewBox="0 0 74 22"
                              className="curved-notch-svg"
                              width="74"
                              height="22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <defs>
                                <radialGradient id="jmCenterNotchDotGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#fffbeb" />
                                  <stop offset="35%" stopColor="#fde047" />
                                  <stop offset="75%" stopColor="#d97706" />
                                  <stop offset="100%" stopColor="#92400e" />
                                </radialGradient>
                              </defs>
                              {/* Pristine White Cutout Notch Surface matching page background tone */}
                              <path
                                d="M 0 0 C 16 0, 22 18, 37 18 C 52 18, 58 0, 74 0 Z"
                                className="curved-notch-surface"
                                style={{ fill: '#ffffff' }}
                                stroke="none"
                              />
                              {/* Radiant Jewel Gold Floating Indicator */}
                              <circle
                                cx="37"
                                cy="6"
                                r="4.8"
                                fill="url(#jmCenterNotchDotGrad)"
                                className="curved-notch-dot"
                                stroke="none"
                              />
                              {/* Specular Gem Reflection */}
                              <circle
                                cx="35.5"
                                cy="4.5"
                                r="1.4"
                                fill="#ffffff"
                                opacity="0.85"
                                stroke="none"
                              />
                            </svg>
                          </motion.div>
                        )}

                        <span className="curved-tab-text !flex-row items-center gap-1.5 whitespace-nowrap font-bold tracking-tight">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive ? 'text-[#facc15]' : 'text-emerald-200/80'
                            }`}
                          />
                          <span className="sm:hidden font-extrabold">{tab.shortLabel || tab.label}</span>
                          <span className="hidden sm:inline font-bold">{tab.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </section>

      {/* 3. TAB CONTENT SECTIONS */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 pt-2.5 sm:pt-3 min-h-[500px]">
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
