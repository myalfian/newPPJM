import React from 'react';
import { MandarinQuiz } from '../../../components/smart-jm/MandarinQuiz';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';

export const MandarinQuizPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-800">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">Smart JM</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-800">Mandarin Class</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Kuis Interaktif</span>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/smart-jm/mandarin/materi"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Kembali ke Materi Pelajaran</span>
        </Link>
      </div>

      <MandarinQuiz />
    </div>
  );
};
