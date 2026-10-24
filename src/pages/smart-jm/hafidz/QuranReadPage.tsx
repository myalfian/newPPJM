import React from 'react';
import { QuranReader } from '../../../components/smart-jm/QuranReader';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

export const QuranReadPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-800">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">Smart JM</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">Hafidz Quran</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Mushaf 30 Juz</span>
      </div>

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
