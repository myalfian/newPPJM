import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { MandarinQuiz } from '../../../components/smart-jm/MandarinQuiz';
import { NavBarTabs } from '../../../components/common/NavBarTabs';

export const MandarinQuizPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

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
