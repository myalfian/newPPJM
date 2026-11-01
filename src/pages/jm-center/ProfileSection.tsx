import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import '../../components/common/BottomNavBarTabs.css';

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
  const navigate = useNavigate();

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
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Curved Emerald Notch TabBar (Styled 1:1 like BottomNavBarTabs) */}
      <nav
        aria-label="Navigasi Menu Bagian Profil JM Center"
        className="bottom-curved-navbar-wrapper w-full sticky top-14 sm:top-16 z-20"
      >
        <div className="bottom-curved-navbar-bar w-full shadow-lg">
          <div className="bottom-curved-scroll-track flex-1 min-w-0 flex items-center justify-start h-full">
            <ul className="bottom-curved-tab-list flex items-center w-full justify-between md:justify-start">
              {SUB_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSubTab === item.id;
                return (
                  <li
                    key={item.id}
                    className="bottom-curved-tab-col flex-1 md:flex-none h-full flex items-center justify-center min-w-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      aria-pressed={isActive}
                      className={`bottom-curved-tab-btn w-full md:w-auto ${isActive ? 'active' : ''}`}
                    >
                      {/* Animated Sliding Notch Pointer & Floating Gold Jewel */}
                      {isActive && (
                        <motion.div
                          layoutId="profileCurvedCutoutPointer"
                          className="bottom-curved-pointer"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 28,
                            mass: 0.58,
                          }}
                        >
                          <svg
                            viewBox="0 0 74 22"
                            className="bottom-curved-notch-svg"
                            width="74"
                            height="22"
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
                              className="bottom-curved-notch-surface fill-[#fbfbfa] dark:fill-[#09090b]"
                              stroke="none"
                            />
                            {/* Radiant Jewel Gold Floating Indicator */}
                            <circle
                              cx="37"
                              cy="16"
                              r="4.8"
                              fill="url(#profileNotchDotGrad)"
                              className="bottom-curved-notch-dot"
                            />
                          </svg>
                        </motion.div>
                      )}

                      <div className="bottom-curved-tab-text flex items-center gap-1.5 md:gap-2 px-1">
                        <Icon
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 ${
                            isActive ? 'text-amber-300 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-white/80'
                          }`}
                        />
                        <span className="truncate sm:hidden">{item.shortLabel}</span>
                        <span className="hidden sm:inline truncate">{item.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* 2. Dedicated Section Content Area with Smooth Animation */}
      <div id="profile-content-area" className="w-full">
        <AnimatePresence mode="wait">
          {/* DEDICATED SECTION 1: SAMBUTAN PIMPINAN */}
          {activeSubTab === 'sambutan' && (
            <motion.div
              key="dedicated-section-sambutan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
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
              transition={{ duration: 0.24, ease: 'easeOut' }}
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
              transition={{ duration: 0.24, ease: 'easeOut' }}
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
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="space-y-6 w-full"
            >
              {/* Seksi Sambutan */}
              <section id="sambutan" className="scroll-mt-28">
                <SambutanSection />
              </section>

              {/* Separator Accent */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-emerald-300/40 dark:border-emerald-800/40" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-zinc-900 px-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-0.5 shadow-2xs">
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
                  <div className="w-full border-t border-dashed border-emerald-300/40 dark:border-emerald-800/40" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-zinc-900 px-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 py-0.5 shadow-2xs">
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
