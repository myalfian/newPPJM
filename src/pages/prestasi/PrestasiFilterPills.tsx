import React from 'react';
import {
  Trophy,
  Award,
  Activity,
  Palette,
  BookOpen,
  Sparkles,
  Search,
  X,
  Filter,
  Calendar
} from 'lucide-react';
import { PrestasiCategory, PrestasiTingkat } from './types';

interface PrestasiFilterPillsProps {
  categories: { id: PrestasiCategory; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[];
  selectedCategory: PrestasiCategory;
  onSelectCategory: (cat: PrestasiCategory) => void;
  selectedTingkat: PrestasiTingkat;
  onSelectTingkat: (tingkat: PrestasiTingkat) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availableYears: string[];
}

export const PrestasiFilterPills: React.FC<PrestasiFilterPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedTingkat,
  onSelectTingkat,
  selectedYear,
  onSelectYear,
  searchQuery,
  onSearchChange,
  availableYears
}) => {
  const tingkats: PrestasiTingkat[] = ['Semua Tingkat', 'Nasional', 'Provinsi', 'Kabupaten'];

  return (
    <div className="space-y-4">
      {/* 1. Category Segmented Pills (Horizontal Scroll on Mobile, Flex Wrap on Desktop) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 snap-x">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 snap-start active:scale-[0.98] select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-md shadow-emerald-950/20 ring-2 ring-emerald-500/50'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isSelected ? 'text-[#d4af37]' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                />
                <span>{cat.label}</span>
                <span
                  className={`ml-1 text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-emerald-700/80 text-emerald-100 border border-emerald-500/40'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Secondary Bar: Level Filter + Year Selector + Search Bar */}
      <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Tingkat Sub-filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline-flex items-center gap-1">
            <Filter className="w-3 h-3 text-zinc-400" />
            Tingkat:
          </span>
          {tingkats.map((tingkat) => {
            const isActive = selectedTingkat === tingkat;
            return (
              <button
                key={tingkat}
                type="button"
                onClick={() => onSelectTingkat(tingkat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-xs ring-1 ring-amber-400 font-black'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {tingkat}
              </button>
            );
          })}
        </div>

        {/* Right Side: Year Dropdown & Search Input */}
        <div className="flex items-center gap-2">
          {/* Year Select */}
          <div className="relative shrink-0">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(e.target.value)}
              aria-label="Filter berdasarkan tahun"
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 cursor-pointer appearance-none"
            >
              <option value="Semua">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-60">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari prestasi, nama juara..."
              className="w-full pl-8 pr-8 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Bersihkan pencarian"
                className="absolute inset-y-0 right-2.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

