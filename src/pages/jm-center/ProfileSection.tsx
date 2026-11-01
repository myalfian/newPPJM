import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';
import { InstitutionsSection } from './InstitutionsSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'profile' | 'all';
}

export type SubNavId = 'sambutan' | 'sejarah' | 'visi-misi' | 'profile';

interface SubNavItem {
  id: SubNavId;
  label: string;
  shortLabel: string;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { id: 'sambutan', label: 'Sambutan', shortLabel: 'Sambutan' },
  { id: 'sejarah', label: 'Sejarah', shortLabel: 'Sejarah' },
  { id: 'visi-misi', label: 'Visi Misi', shortLabel: 'Visi Misi' },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile' },
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'sambutan' }) => {
  const location = useLocation();

  const [activeSubTab, setActiveSubTab] = useState<SubNavId>(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') return 'sejarah';
    if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') return 'visi-misi';
    if (hash.includes('profile') || hash.includes('lembaga') || path.includes('lembaga') || secParam === 'profile' || defaultSection === 'profile') return 'profile';
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
    } else if (hash.includes('profile') || hash.includes('lembaga') || path.includes('lembaga') || secParam === 'profile') {
      setActiveSubTab('profile');
    } else {
      setActiveSubTab('sambutan');
    }
  }, [location.pathname, location.hash, location.search, defaultSection]);

  const scrollToContent = () => {
    if (typeof window !== 'undefined') {
      const containerEl = document.getElementById('profile-content-area');
      if (containerEl) {
        const yOffset = -80;
        const y = containerEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  const handleSelectTab = (tabId: SubNavId) => {
    setActiveSubTab(tabId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', tabId);
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    scrollToContent();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Curved Emerald Notch TabBar: Height & Typography Matched to NavBarTabs */}
      <nav
        aria-label="Navigasi Menu Bagian Profil JM Center"
        className="w-full sticky top-14 sm:top-16 z-20 py-1"
      >
        <div className="relative w-full h-[46px] sm:h-[48px] min-h-[46px] sm:min-h-[48px] rounded-[18px] bg-gradient-to-r from-[#064e3b] via-[#0a6847] to-[#064e3b] dark:from-[#022c22] dark:via-[#064e3b] dark:to-[#022c22] shadow-[0_10px_28px_-6px_rgba(15,81,50,0.42),0_4px_12px_-2px_rgba(15,23,42,0.1)] border border-emerald-500/20 px-1 sm:px-1.5 flex items-center overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />

          {/* Equal 4-Column Balanced Grid: Sambutan, Sejarah, Visi Misi, Profile */}
          <ul className="grid grid-cols-4 gap-1 sm:gap-2 w-full h-full m-0 p-0 list-none items-center relative z-10">
            {SUB_NAV_ITEMS.map((item) => {
              const isActive = activeSubTab === item.id;

              return (
                <li
                  key={item.id}
                  className="relative flex items-center justify-center min-w-0 h-full"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    aria-pressed={isActive}
                    className={`group relative flex items-center justify-center w-full h-full min-h-[44px] sm:min-h-[46px] px-1 sm:px-2 rounded-[14px] transition-all duration-200 cursor-pointer select-none outline-none ${
                      isActive
                        ? 'text-white font-black [text-shadow:0_0_14px_rgba(255,255,255,0.7),0_1px_3px_rgba(0,0,0,0.4)]'
                        : 'text-white/80 hover:text-white hover:bg-white/12 active:scale-95 font-bold'
                    }`}
                  >
                    {/* Active Tab Background Pill Animation */}
                    {isActive && (
                      <motion.div
                        layoutId="profileActiveBackgroundPill"
                        className="absolute inset-0.5 rounded-[12px] bg-white/15 dark:bg-white/10 backdrop-blur-xs pointer-events-none -z-1"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="profileCurvedCutoutPointer"
                        className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-[76px] h-[22px] pointer-events-none z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 28,
                          mass: 0.5,
                        }}
                      >
                        <svg
                          viewBox="0 0 76 22"
                          className="w-full h-full overflow-visible drop-shadow-[0_-3px_6px_rgba(0,0,0,0.12)]"
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
                            d="M 0 22 C 16 22, 22 4, 38 4 C 54 4, 60 22, 76 22 Z"
                            className="fill-[#FBFBFA] dark:fill-[#09090b]"
                            stroke="none"
                          />
                          {/* Radiant Floating Gold Jewel Indicator */}
                          <circle
                            cx="38"
                            cy="15"
                            r="5"
                            fill="url(#profileNotchDotGrad)"
                            className="drop-shadow-[0_-2px_4px_rgba(217,119,6,0.6)]"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Harmonious Typography: White and Bold */}
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[14px] font-extrabold sm:font-bold tracking-[-0.2px] sm:tracking-[0.1px] leading-[1.15] sm:leading-normal text-center select-none truncate text-white transition-transform duration-150 group-active:scale-97">
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
          {/* DEDICATED SECTION 1: SAMBUTAN */}
          {activeSubTab === 'sambutan' && (
            <motion.div
              key="dedicated-section-sambutan"
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sambutan" className="scroll-mt-24">
                <SambutanSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 2: SEJARAH */}
          {activeSubTab === 'sejarah' && (
            <motion.div
              key="dedicated-section-sejarah"
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sejarah" className="scroll-mt-24">
                <SejarahSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 3: VISI MISI */}
          {activeSubTab === 'visi-misi' && (
            <motion.div
              key="dedicated-section-visi-misi"
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="visi-misi" className="scroll-mt-24">
                <VisiMisiSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 4: PROFILE */}
          {activeSubTab === 'profile' && (
            <motion.div
              key="dedicated-section-profile"
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="profile-institutions" className="scroll-mt-24">
                <InstitutionsSection initialFilter="all" />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSection;
