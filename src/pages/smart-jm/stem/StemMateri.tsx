import React from 'react';
import { StemShowcase } from '../../../components/smart-jm/StemShowcase';
import { SmartJmSubNav } from '../../../components/smart-jm/SmartJmSubNav';

export const StemMateri: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2 space-y-2.5 sm:space-y-3">
      {/* Navigasi Submenu SMART JM */}
      <SmartJmSubNav />

      {/* Showcase Mode Materi dan Penugasan */}
      <StemShowcase mode="materi" />
    </div>
  );
};
