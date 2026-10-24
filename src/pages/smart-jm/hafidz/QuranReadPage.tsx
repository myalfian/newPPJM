import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { QuranReader } from '../../../components/smart-jm/QuranReader';
import { NavBarTabs } from '../../../components/common/NavBarTabs';

export const QuranReadPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/smart-jm/hafidz/murojaah"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-emerald-900 bg-gold-100 hover:bg-gold-200 border border-gold-300 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <span>Coba Fitur Murojaah AI Suara</span>
          </Link>
        </div>
      </div>

      <QuranReader />
    </div>
  );
};
