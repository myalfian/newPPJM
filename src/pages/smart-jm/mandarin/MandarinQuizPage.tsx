import React from 'react';
import { NavBarTabs } from '../../../components/common/NavBarTabs';
import { MandarinQuiz } from '../../../components/smart-jm/MandarinQuiz';
import { SmartJmSubNav } from '../../../components/smart-jm/SmartJmSubNav';

export const MandarinQuizPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Navigation identical to Prestasi */}
      <NavBarTabs />

      {/* Navigasi Sub-Section SMART JM */}
      <SmartJmSubNav />

      {/* Mandarin Quiz Engine with Topics & Questions */}
      <MandarinQuiz />
    </div>
  );
};
