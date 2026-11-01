import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleSelectTab = (tabId: string) => {
    const validId = tabId as SubNavId;
    setActiveSubTab(validId);

    // Update query param softly without page reload
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('section', validId);
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    scrollToContent();
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSection;
