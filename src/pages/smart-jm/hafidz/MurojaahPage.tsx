import React from 'react';
import { MurojaahEngine } from '../../../components/smart-jm/MurojaahEngine';
import { SmartJmSubNav } from '../../../components/smart-jm/SmartJmSubNav';

export const MurojaahPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-2.5 sm:px-4 lg:px-6 py-2 space-y-2.5 sm:space-y-3">
      {/* Navigasi Submenu SMART JM */}
      <SmartJmSubNav />

      {/* Murojaah AI Engine: Suara AI Checker & Audio Recorder */}
      <MurojaahEngine />
    </div>
  );
};
