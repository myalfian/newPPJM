import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { StemShowcase } from '../../../components/smart-jm/StemShowcase';
import { NavBarTabs } from '../../../components/common/NavBarTabs';

export const StemPortofolio: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      <div className="flex items-center justify-between">
        <Link
          to="/smart-jm/stem/materi"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Buka Materi & Penugasan Silabus</span>
        </Link>
      </div>

      <StemShowcase mode="portofolio" />
    </div>
  );
};
