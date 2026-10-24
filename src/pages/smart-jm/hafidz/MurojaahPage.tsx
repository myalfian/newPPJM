import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { MurojaahEngine } from '../../../components/smart-jm/MurojaahEngine';
import { NavBarTabs } from '../../../components/common/NavBarTabs';

export const MurojaahPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      <div className="flex items-center justify-between">
        <Link
          to="/smart-jm/hafidz/read"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Buka Mushaf Lengkap 30 Juz</span>
        </Link>
      </div>

      <MurojaahEngine />
    </div>
  );
};
