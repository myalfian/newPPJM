import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  GraduationCap,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';
import { InstitutionsSection } from './InstitutionsSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'profile' | 'all';
}

export type SubNavId = 'sambutan' | 'sejarah' | 'visi-misi' | 'profile';
export type ProfileSubUnit = 'all' | 'pesantren' | 'formal' | 'madin';

interface SubNavItem {
  id: SubNavId;
  label: string;
  shortLabel: string;
  hasDropdown?: boolean;
}

const SUB_NAV_ITEMS: SubNavItem[] = [
  { id: 'sambutan', label: 'Sambutan', shortLabel: 'Sambutan' },
  { id: 'sejarah', label: 'Sejarah', shortLabel: 'Sejarah' },
  { id: 'visi-misi', label: 'Visi Misi', shortLabel: 'Visi Misi' },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', hasDropdown: true },
];

interface DropdownOption {
  id: ProfileSubUnit;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROFILE_DROPDOWN_OPTIONS: DropdownOption[] = [
  {
    id: 'pesantren',
    label: 'Pondok Pesantren',
    sublabel: 'Pondok Pesantren Jauharul Maknuun',
    icon: Landmark,
  },
  {
    id: 'formal',
    label: 'Sekolah',
    sublabel: 'SMP Plus Jauharul Maknuun',
    icon: GraduationCap,
  },
  {
    id: 'madin',
    label: 'Madrasah Diniyah',
    sublabel: 'Madin Salafiyah Jauharul Maknuun',
    icon: BookOpen,
  },
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'sambutan' }) => {
  const location = useLocation();
  const dropdownRef = useRef<HTMLLIElement>(null);

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

  const [selectedProfileUnit, setSelectedProfileUnit] = useState<ProfileSubUnit>(() => {
    const search = new URLSearchParams(location.search);
    const unitParam = search.get('unit');
    if (unitParam === 'pesantren' || unitParam === 'pondok') return 'pesantren';
    if (unitParam === 'formal' || unitParam === 'sekolah') return 'formal';
    if (unitParam === 'madin') return 'madin';
    return 'pesantren';
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state with URL hash or query params
  useEffect(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');
    const unitParam = search.get('unit');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah') {
      setActiveSubTab('sejarah');
    } else if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi') {
      setActiveSubTab('visi-misi');
    } else if (hash.includes('profile') || hash.includes('lembaga') || path.includes('lembaga') || secParam === 'profile') {
      setActiveSubTab('profile');
      if (unitParam === 'pesantren' || unitParam === 'pondok') setSelectedProfileUnit('pesantren');
      else if (unitParam === 'formal' || unitParam === 'sekolah') setSelectedProfileUnit('formal');
      else if (unitParam === 'madin') setSelectedProfileUnit('madin');
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
    if (tabId === 'profile') {
      // Toggle dropdown when Profile tab button is clicked
      setIsDropdownOpen((prev) => !prev);
      setActiveSubTab('profile');

      const currentParams = new URLSearchParams(location.search);
      currentParams.set('section', 'profile');
      if (!currentParams.get('unit')) {
        currentParams.set('unit', selectedProfileUnit);
      }
      const newUrl = `${location.pathname}?${currentParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
      scrollToContent();
      return;
    }

    setIsDropdownOpen(false);
    setActiveSubTab(tabId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', tabId);
    currentParams.delete('unit');
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    scrollToContent();
  };

  const handleSelectProfileUnit = (unitId: ProfileSubUnit) => {
    setSelectedProfileUnit(unitId);
    setActiveSubTab('profile');
    setIsDropdownOpen(false);

    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', 'profile');
    currentParams.set('unit', unitId);
    const newUrl = `${location.pathname}?${currentParams.toString()}`;
    window.history.replaceState(null, '', newUrl);

    scrollToContent();
  };

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* 1. Curved Emerald Notch TabBar: Height & Typography Matched to NavBarTabs */}
      <nav
        aria-label="Navigasi Menu Bagian Profil JM Center"
        className="w-full sticky top-14 sm:top-16 z-30 py-1"
      >
        <div className="w-full h-[44px] sm:h-[46px] min-h-[44px] sm:min-h-[46px] rounded-[16px] bg-gradient-to-r from-[#0a6847] via-[#0f5132] to-[#0a6847] dark:from-[#064e3b] dark:via-[#022c22] dark:to-[#064e3b] shadow-[0_8px_24px_-6px_rgba(15,81,50,0.38),0_3px_10px_-2px_rgba(15,23,42,0.08)] border-0 px-1 sm:px-1.5 flex items-center">
          {/* Equal 4-Column Balanced Grid: Sambutan, Sejarah, Visi Misi, Profile */}
          <ul className="grid grid-cols-4 gap-1 sm:gap-2 w-full h-full m-0 p-0 list-none items-center">
            {SUB_NAV_ITEMS.map((item) => {
              const isActive = activeSubTab === item.id;
              const isProfileDropdown = item.id === 'profile';

              return (
                <li
                  key={item.id}
                  ref={isProfileDropdown ? dropdownRef : undefined}
                  className="relative flex items-center justify-center min-w-0 h-full"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    aria-pressed={isActive}
                    aria-expanded={isProfileDropdown ? isDropdownOpen : undefined}
                    className={`group relative flex items-center justify-center w-full h-full min-h-[44px] sm:min-h-[46px] px-1 sm:px-2 rounded-[12px] transition-all duration-200 cursor-pointer select-none outline-none ${
                      isActive
                        ? 'text-white font-black [text-shadow:0_0_12px_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.35)]'
                        : 'text-white/85 hover:text-white hover:bg-white/15 active:scale-96 font-bold'
                    }`}
                  >
                    {/* Animated Sliding Notch Pointer & Radiant Floating Gold Jewel at the BOTTOM */}
                    {isActive && (
                      <motion.div
                        layoutId="profileCurvedCutoutPointer"
                        className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-[74px] h-[20px] pointer-events-none z-10"
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

                    {/* Harmonious Typography: White and Bold */}
                    <div className="flex items-center justify-center gap-1 min-w-0">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] sm:text-[13.5px] font-extrabold sm:font-bold tracking-[-0.2px] sm:tracking-[0.1px] leading-[1.15] sm:leading-normal text-center select-none truncate text-white">
                        <span className="sm:hidden">{item.shortLabel}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </span>
                      {isProfileDropdown && (
                        <ChevronDown
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90 shrink-0 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown Menu: Pondok Pesantren, Sekolah, Madrasah Diniyah */}
                  {isProfileDropdown && isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-emerald-950/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-emerald-600/40 rounded-2xl shadow-2xl p-1.5 z-50 text-white"
                    >
                      <div className="px-2.5 py-1.5 text-[10.5px] font-black uppercase tracking-wider text-amber-300/90 border-b border-emerald-800/60 flex items-center justify-between">
                        <span>Pilih Unit Lembaga</span>
                        <span className="text-[9px] text-emerald-300 font-semibold lowercase">3 Unit Terpadu</span>
                      </div>

                      <div className="py-1 space-y-1">
                        {PROFILE_DROPDOWN_OPTIONS.map((opt) => {
                          const isOptionActive = activeSubTab === 'profile' && selectedProfileUnit === opt.id;
                          const IconComp = opt.icon;

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectProfileUnit(opt.id)}
                              className={`w-full text-left px-2.5 py-2 rounded-xl transition flex items-center gap-2.5 cursor-pointer ${
                                isOptionActive
                                  ? 'bg-emerald-600/60 text-white font-black shadow-inner border border-emerald-400/40'
                                  : 'hover:bg-white/10 text-emerald-100/90 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isOptionActive
                                    ? 'bg-amber-400 text-emerald-950 font-bold'
                                    : 'bg-emerald-800/80 text-amber-300'
                                }`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs font-bold leading-tight truncate">
                                  {opt.label}
                                </span>
                                <span className="block text-[10px] text-emerald-200/70 truncate">
                                  {opt.sublabel}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
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

          {/* DEDICATED SECTION 2: SEJARAH */}
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

          {/* DEDICATED SECTION 3: VISI MISI */}
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

          {/* DEDICATED SECTION 4: PROFILE (DROPDOWN: PONDOK PESANTREN, SEKOLAH, MADRASAH DINIYAH) */}
          {activeSubTab === 'profile' && (
            <motion.div
              key={`dedicated-section-profile-${selectedProfileUnit}`}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <section id="profile-institutions" className="scroll-mt-24">
                <InstitutionsSection initialFilter={selectedProfileUnit} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSection;
