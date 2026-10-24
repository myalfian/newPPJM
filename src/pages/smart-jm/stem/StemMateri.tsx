import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { StemShowcase } from '../../../components/smart-jm/StemShowcase';
import { NavBarTabs } from '../../../components/common/NavBarTabs';

export const StemMateri: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 space-y-3 sm:space-y-4">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      <div className="flex items-center justify-between">
        <Link
          to="/smart-jm/stem/portofolio"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <Cpu className="w-4 h-4 text-emerald-700" />
          <span>Lihat Portofolio Karya Santri</span>
        </Link>
      </div>

      <StemShowcase mode="materi" />
    </div>
  );
};
