import React from 'react';
import {
  Search,
  X,
  Filter,
  Calendar
} from 'lucide-react';
import { PrestasiCategory, PrestasiTingkat } from './types';

interface PrestasiFilterPillsProps {
  categories?: { id: PrestasiCategory; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[];
  selectedCategory?: PrestasiCategory;
  onSelectCategory?: (cat: PrestasiCategory) => void;
  selectedTingkat: PrestasiTingkat;
  onSelectTingkat: (tingkat: PrestasiTingkat) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availableYears: string[];
}

export const PrestasiFilterPills: React.FC<PrestasiFilterPillsProps> = ({
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
  );
};
