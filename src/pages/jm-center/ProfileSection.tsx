import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Star
} from 'lucide-react';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'all';
}

interface SubNavItem {
  id: 'sambutan' | 'sejarah' | 'visi-misi';
  label: string;
  shortLabel: string;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { id: 'sambutan', label: 'Sambutan Pimpinan', shortLabel: 'Sambutan Pimpinan' },
  { id: 'sejarah', label: 'Sejarah & Linimasa', shortLabel: 'Sejarah & Linimasa' },
  { id: 'visi-misi', label: 'Visi & Misi Lembaga', shortLabel: 'Visi & Misi' },
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'sambutan' }) => {
  const location = useLocation();

  const [activeSubTab, setActiveSubTab] = useState<'sambutan' | 'sejarah' | 'visi-misi'>(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') return 'sejarah';
    if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') return 'visi-misi';
    return 'sambutan';
  });

  // Sync state with URL hash or query params
  useEffect(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah') {
      setActiveSubTab('sejarah');
    } else if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi') {
      setActiveSubTab('visi-misi');
    } else {
      setActiveSubTab('sambutan');
    }
  }, [location.pathname, location.hash, location.search, defaultSection]);

  const handleSelectTab = (tabId: 'sambutan' | 'sejarah' | 'visi-misi') => {
    setActiveSubTab(tabId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', tabId);
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    // Scroll softly to content container if below hero banner
    if (typeof window !== 'undefined') {
      const containerEl = document.getElementById('profile-content-area');
      if (containerEl) {
        const yOffset = -80;
        const y = containerEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* 1. Curved Emerald Notch TabBar: Harmonious & Enlarged 3-Column Grid */}
      <nav
        aria-label="Navigasi Menu Bagian Profil JM Center"
        className="w-full sticky top-14 sm:top-16 z-20 py-1"
      >
        <div className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0a6847] via-[#0f5132] to-[#073a23] dark:from-[#064e3b] dark:via-[#022c22] dark:to-[#042018] shadow-[0_8px_24px_-6px_rgba(15,81,50,0.4),0_3px_10px_-2px_rgba(15,23,42,0.1)] border border-emerald-600/30 dark:border-emerald-700/40 p-1 sm:p-1.5 backdrop-blur-md">
          {/* Equal 3-Column Balanced Grid */}
          <ul className="grid grid-cols-3 gap-1 sm:gap-2 w-full m-0 p-0 list-none">
            {SUB_NAV_ITEMS.map((item) => {
              const isActive = activeSubTab === item.id;
              return (
                <li key={item.id} className="relative flex items-center justify-center min-w-0">
                  <button
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    aria-pressed={isActive}
                    className={`group relative flex items-center justify-center w-full h-10 sm:h-11 md:h-12 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all duration-250 cursor-pointer select-none outline-none ${
                      isActive
                        ? 'text-[#facc15] font-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-98 font-bold'
                    }`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="profileCurvedCutoutPointer"
                        className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-[76px] h-[22px] pointer-events-none z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 26,
                          mass: 0.5,
                        }}
                      >
                        <svg
                          viewBox="0 0 74 22"
                          className="w-full h-full overflow-visible drop-shadow-[0_-3px_5px_rgba(0,0,0,0.08)]"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <defs>
                            <radialGradient id="profileNotchDotGrad" cx="35%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#fffbeb" />
                              <stop offset="35%" stopColor="#fde047" />
                              <stop offset="75%" stopColor="#d97706" />
                              <stop offset="100%" stopColor="#92400e" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M 0 22 C 16 22, 22 4, 37 4 C 52 4, 58 22, 74 22 Z"
                            className="fill-[#FBFBFA] dark:fill-[#09090b]"
                            stroke="none"
                          />
                          {/* Radiant Floating Gold Jewel Indicator */}
                          <circle
                            cx="37"
                            cy="16"
                            r="5"
                            fill="url(#profileNotchDotGrad)"
                            className="drop-shadow-[0_-2px_4px_rgba(217,119,6,0.5)]"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Harmonious & Enlarged Typography */}
                    <span className="text-xs sm:text-[13px] md:text-sm tracking-tight truncate leading-tight pb-0.5 sm:pb-1 text-center font-bold sm:font-extrabold">
                      <span className="sm:hidden">{item.shortLabel}</span>
                      <span className="hidden sm:inline">{item.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 2. Dedicated Section Content Area with Smooth Animation */}
      <div id="profile-content-area" className="w-full">
        <AnimatePresence mode="wait">
          {/* DEDICATED SECTION 1: SAMBUTAN PIMPINAN */}
          {activeSubTab === 'sambutan' && (
            <motion.div
              key="dedicated-section-sambutan"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sambutan" className="scroll-mt-24">
                <SambutanSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 2: SEJARAH & LINIMASA */}
          {activeSubTab === 'sejarah' && (
            <motion.div
              key="dedicated-section-sejarah"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sejarah" className="scroll-mt-24">
                <SejarahSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 3: VISI & MISI LEMBAGA */}
          {activeSubTab === 'visi-misi' && (
            <motion.div
              key="dedicated-section-visi-misi"
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="visi-misi" className="scroll-mt-24">
                <VisiMisiSection />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSection;
