import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Quote,
  Landmark,
  Star,
  Sparkles
} from 'lucide-react';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'all';
}

interface SubNavItem {
  id: 'all' | 'sambutan' | 'sejarah' | 'visi-misi';
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { id: 'all', label: 'Semua Profil', shortLabel: 'Semua', icon: Sparkles },
  { id: 'sambutan', label: 'Sambutan Pimpinan', shortLabel: 'Sambutan', icon: Quote },
  { id: 'sejarah', label: 'Sejarah & Linimasa', shortLabel: 'Sejarah', icon: Landmark },
  { id: 'visi-misi', label: 'Visi & Misi Lembaga', shortLabel: 'Visi Misi', icon: Star },
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'all' }) => {
  const location = useLocation();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'sambutan' | 'sejarah' | 'visi-misi'>(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') return 'sejarah';
    if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') return 'visi-misi';
    if (hash.includes('sambutan') || path.includes('sambutan') || secParam === 'sambutan' || defaultSection === 'sambutan') return 'sambutan';
    return 'all';
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
    } else if (hash.includes('sambutan') || path.includes('sambutan') || secParam === 'sambutan') {
      setActiveSubTab('sambutan');
    } else if (secParam === 'all' || defaultSection === 'all') {
      setActiveSubTab('all');
    }
  }, [location.pathname, location.hash, location.search, defaultSection]);

  const handleSelectTab = (tabId: 'all' | 'sambutan' | 'sejarah' | 'visi-misi') => {
    setActiveSubTab(tabId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    if (tabId === 'all') {
      currentParams.delete('section');
    } else {
      currentParams.set('section', tabId);
    }
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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Curved Emerald Notch TabBar: Balanced 4-Column Grid Across All Screen Sizes */}
      <nav
        aria-label="Navigasi Menu Bagian Profil JM Center"
        className="w-full sticky top-14 sm:top-16 z-20 py-1"
      >
        <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0a6847] via-[#0f5132] to-[#073a23] dark:from-[#064e3b] dark:via-[#022c22] dark:to-[#042018] shadow-[0_10px_28px_-8px_rgba(15,81,50,0.45),0_4px_14px_-2px_rgba(15,23,42,0.12)] border border-emerald-600/30 dark:border-emerald-700/40 p-1 sm:p-1.5 backdrop-blur-md">
          {/* Equal 4-Column Balanced Grid */}
          <ul className="grid grid-cols-4 gap-1 sm:gap-2 w-full m-0 p-0 list-none">
            {SUB_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <li key={item.id} className="relative flex items-center justify-center min-w-0">
                  <button
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    aria-pressed={isActive}
                    className={`group relative flex items-center justify-center gap-1.5 sm:gap-2.5 w-full h-12 sm:h-14 px-1.5 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer select-none outline-none ${
                      isActive
                        ? 'text-[#facc15] font-extrabold'
                        : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-98 font-bold'
                    }`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="profileCurvedCutoutPointer"
                        className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-[74px] h-[22px] pointer-events-none z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                          mass: 0.58,
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
                            r="4.8"
                            fill="url(#profileNotchDotGrad)"
                            className="drop-shadow-[0_-2px_4px_rgba(217,119,6,0.5)]"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Icon with Gold Accent on Active */}
                    <Icon
                      className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform duration-200 ${
                        isActive
                          ? 'text-[#facc15] scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.65)]'
                          : 'text-emerald-200/90 group-hover:text-white'
                      }`}
                    />

                    {/* Adaptive Label with Clearance above bottom notch */}
                    <span className="text-[12px] sm:text-[14px] tracking-tight truncate leading-none pb-1 sm:pb-1.5">
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
      <div id="profile-content-area" className="w-full pt-1">
        <AnimatePresence mode="wait">
          {/* DEDICATED SECTION 1: SAMBUTAN PIMPINAN */}
          {activeSubTab === 'sambutan' && (
            <motion.div
              key="dedicated-section-sambutan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sambutan" className="scroll-mt-28">
                <SambutanSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 2: SEJARAH & LINIMASA */}
          {activeSubTab === 'sejarah' && (
            <motion.div
              key="dedicated-section-sejarah"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="sejarah" className="scroll-mt-28">
                <SejarahSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 3: VISI & MISI LEMBAGA */}
          {activeSubTab === 'visi-misi' && (
            <motion.div
              key="dedicated-section-visi-misi"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="visi-misi" className="scroll-mt-28">
                <VisiMisiSection />
              </section>
            </motion.div>
          )}

          {/* DEDICATED SECTION 4: SEMUA PROFIL (PANORAMIC INTEGRATED VIEW) */}
          {activeSubTab === 'all' && (
            <motion.div
              key="dedicated-section-all"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 sm:space-y-8 w-full"
            >
              {/* Seksi Sambutan */}
              <section id="sambutan" className="scroll-mt-28">
                <SambutanSection />
              </section>

              {/* Separator Accent */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-emerald-300/50 dark:border-emerald-800/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#FBFBFA] dark:bg-zinc-900 px-4 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-1 shadow-xs">
                    <Landmark className="w-3.5 h-3.5 text-amber-500" />
                    Napak Tilas Dakwah
                  </span>
                </div>
              </div>

              {/* Seksi Sejarah */}
              <section id="sejarah" className="scroll-mt-28">
                <SejarahSection />
              </section>

              {/* Separator Accent */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-emerald-300/50 dark:border-emerald-800/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#FBFBFA] dark:bg-zinc-900 px-4 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Visi, Misi &amp; Nilai Karakter
                  </span>
                </div>
              </div>

              {/* Seksi Visi Misi */}
              <section id="visi-misi" className="scroll-mt-28">
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
