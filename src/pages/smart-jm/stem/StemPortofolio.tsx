import React from 'react';
import { StemShowcase } from '../../../components/smart-jm/StemShowcase';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

export const StemPortofolio: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-800">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">Smart JM</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">STEM Area</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Portofolio Siswa</span>
      </div>

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
