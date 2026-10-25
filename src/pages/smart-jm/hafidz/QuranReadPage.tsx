import React from 'react';
import { NavBarTabs } from '../../../components/common/NavBarTabs';
import { QuranReader } from '../../../components/smart-jm/QuranReader';
import { SmartJmSubNav } from '../../../components/smart-jm/SmartJmSubNav';

export const QuranReadPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Navigation identical to Prestasi */}
      <NavBarTabs />

      {/* Navigasi Sub-Section SMART JM */}
      <SmartJmSubNav />

      {/* Online Quran Reader with Play, Pause, and Stop Audio Controls */}
      <QuranReader />
    </div>
  );
};
