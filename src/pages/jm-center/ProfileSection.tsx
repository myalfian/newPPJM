import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { BottomNavBarTabs, BottomNavTabItem } from '../../components/common/BottomNavBarTabs';
import { SambutanSection } from './SambutanSection';
import { SejarahSection } from './SejarahSection';
import { VisiMisiSection } from './VisiMisiSection';

interface ProfileSectionProps {
  defaultSection?: 'sambutan' | 'sejarah' | 'visi-misi' | 'all';
}

export type SubNavId = 'sambutan' | 'sejarah' | 'visi-misi';

const SUB_NAV_ITEMS: BottomNavTabItem[] = [
  { id: 'sambutan', label: 'Sambutan', shortLabel: 'Sambutan' },
  { id: 'sejarah', label: 'Sejarah', shortLabel: 'Sejarah' },
  { id: 'visi-misi', label: 'Visi Misi', shortLabel: 'Visi Misi' },
];

const TAB_INDEX_MAP: Record<SubNavId, number> = {
  'sambutan': 0,
  'sejarah': 1,
  'visi-misi': 2,
};

// Buttery smooth, directional slide & blur transition variants
const tabContentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : direction < 0 ? -32 : 0,
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.995,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 340, damping: 32, mass: 0.55 },
      opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      filter: { duration: 0.28 },
      scale: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 28 : -28,
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.995,
    transition: {
      x: { type: 'spring' as const, stiffness: 340, damping: 32, mass: 0.55 },
      opacity: { duration: 0.22, ease: 'easeIn' },
      filter: { duration: 0.2 },
    },
  }),
};

export const ProfileSection: React.FC<ProfileSectionProps> = ({ defaultSection = 'sambutan' }) => {
  const location = useLocation();

  const [activeSubTab, setActiveSubTab] = useState<SubNavId>(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah' || defaultSection === 'sejarah') return 'sejarah';
    if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi' || defaultSection === 'visi-misi') return 'visi-misi';
    return 'sambutan';
  });

  const [direction, setDirection] = useState<number>(0);

  // Sync state with URL hash or query params
  useEffect(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
    const path = location.pathname.toLowerCase();
    const search = new URLSearchParams(location.search);
    const secParam = search.get('section');

    let targetTab: SubNavId | null = null;
    if (hash.includes('sejarah') || path.includes('sejarah') || secParam === 'sejarah') {
      targetTab = 'sejarah';
    } else if (hash.includes('visi') || path.includes('visi') || secParam === 'visi-misi') {
      targetTab = 'visi-misi';
    } else if (hash.includes('sambutan') || path.includes('sambutan') || secParam === 'sambutan') {
      targetTab = 'sambutan';
    }

    if (targetTab && targetTab !== activeSubTab) {
      const prevIdx = TAB_INDEX_MAP[activeSubTab];
      const nextIdx = TAB_INDEX_MAP[targetTab];
      setDirection(nextIdx > prevIdx ? 1 : -1);
      setActiveSubTab(targetTab);
    }
  }, [location.pathname, location.hash, location.search, defaultSection, activeSubTab]);

  // Gentle, non-disruptive scroll: only adjusts if tabs have scrolled past the viewport top
  const smartScrollToContent = () => {
    if (typeof window !== 'undefined') {
      const barEl = document.getElementById('profile-content-area');
      if (barEl) {
        const rect = barEl.getBoundingClientRect();
        // Only scroll if the content top is above the sticky header threshold
        if (rect.top < 60) {
          const targetY = window.pageYOffset + rect.top - 80;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }
    }
  };

  const handleSelectTab = (tabId: string) => {
    const validId = tabId as SubNavId;
    if (validId === activeSubTab) return;

    const prevIdx = TAB_INDEX_MAP[activeSubTab];
    const nextIdx = TAB_INDEX_MAP[validId];
    setDirection(nextIdx > prevIdx ? 1 : -1);
    setActiveSubTab(validId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', validId);
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    smartScrollToContent();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Curved Emerald Notch BottomNavBarTabs: Size, Typography & Physics Matched to NavBarTabs */}
      <div className="w-full sticky top-14 sm:top-16 z-20 py-1">
        <BottomNavBarTabs
          tabs={SUB_NAV_ITEMS}
          activeTabId={activeSubTab}
          onSelectTab={handleSelectTab}
          layoutId="jmCenterBottomNavBarTabsPointer"
        />
      </div>

      {/* 2. Dedicated Section Content Area with Silky Smooth Directional Transitions */}
      <div id="profile-content-area" className="w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`profile-section-${activeSubTab}`}
            custom={direction}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full will-change-transform"
          >
            {activeSubTab === 'sambutan' && (
              <section id="sambutan" className="scroll-mt-24 w-full">
                <SambutanSection />
              </section>
            )}

            {activeSubTab === 'sejarah' && (
              <section id="sejarah" className="scroll-mt-24 w-full">
                <SejarahSection />
              </section>
            )}

            {activeSubTab === 'visi-misi' && (
              <section id="visi-misi" className="scroll-mt-24 w-full">
                <VisiMisiSection />
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSection;
