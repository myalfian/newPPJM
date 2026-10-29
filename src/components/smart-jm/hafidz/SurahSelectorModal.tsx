import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Filter
} from 'lucide-react';
import { QURAN_SURAHS, QURAN_JUZ_LIST, SurahMeta, JuzMeta } from '../../../lib/quranData';

interface SurahSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurahNumber: number;
  onSelectSurah: (surah: SurahMeta, targetAyahNumber?: number) => void;
}

export const SurahSelectorModal: React.FC<SurahSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedSurahNumber,
  onSelectSurah,
}) => {
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Filtered surah list
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return QURAN_SURAHS;

    return QURAN_SURAHS.filter(
      (s) =>
        s.number.toString() === q ||
        s.nameLatin.toLowerCase().includes(q) ||
        s.nameIndo.toLowerCase().includes(q) ||
        s.nameArabic.includes(q) ||
        `juz ${s.juzStart}`.includes(q)
    );
  }, [searchQuery]);

  // Filtered juz list
  const filteredJuzs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return QURAN_JUZ_LIST;

    return QURAN_JUZ_LIST.filter(
      (j) =>
        j.juzNumber.toString() === q ||
        j.name.toLowerCase().includes(q) ||
        j.startSurahName.toLowerCase().includes(q) ||
        j.endSurahName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen || typeof document === 'undefined') return null;

  const popularSurahNumbers = [1, 18, 36, 55, 56, 67, 112, 114];

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 select-none overscroll-contain"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                Daftar 114 Surat &amp; 30 Juz
              </h2>
              <p className="text-[11px] text-zinc-400 font-medium mt-1">
                Mushaf Standar Kemenag RI • Audio Murottal Misyari Rasyid
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95"
            aria-label="Tutup Selektor Surat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200/70 dark:border-zinc-800 space-y-3">
          {/* Segmented Pill Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex-1">
              <button
                type="button"
                onClick={() => setActiveTab('surah')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'surah'
                    ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-white shadow-xs font-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Berdasarkan Surat (114)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('juz')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'juz'
                    ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-white shadow-xs font-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Berdasarkan Juz (30)</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'surah'
                  ? 'Cari nama surat (Al-Kahf, Yasin), nomor surat (36), atau arti...'
                  : 'Cari juz (1-30) atau surat di dalam juz...'
              }
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-2.5 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Popular Surah Chips */}
          {activeTab === 'surah' && !searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Pilihan:
              </span>
              {popularSurahNumbers.map((sNum) => {
                const s = QURAN_SURAHS.find((item) => item.number === sNum);
                if (!s) return null;
                const isCurrent = s.number === selectedSurahNumber;

                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => {
                      onSelectSurah(s);
                      onClose();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                      isCurrent
                        ? 'bg-emerald-800 text-white font-black'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {s.nameLatin}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'surah' ? (
            /* TAB 1: DAFTAR 114 SURAT */
            filteredSurahs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredSurahs.map((surah) => {
                  const isSelected = surah.number === selectedSurahNumber;

                  return (
                    <button
                      key={surah.number}
                      type="button"
                      onClick={() => {
                        onSelectSurah(surah);
                        onClose();
                      }}
                      className={`group relative p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/70 dark:from-emerald-950/70 dark:to-emerald-900/40 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/40'
                          : 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200/80 dark:border-zinc-700/80 hover:border-emerald-300'
                      }`}
                    >
                      {/* Left: Number Pill + Latin Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number Octagon / Circle Pill */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                          }`}
                        >
                          {surah.number}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                              {surah.nameLatin}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10.5px] text-zinc-400 truncate">
                            {surah.nameIndo} • {surah.numberOfAyahs} Ayat
                          </p>
                        </div>
                      </div>

                      {/* Right: Arabic Calligraphy */}
                      <div className="text-right shrink-0">
                        <span
                          className="font-quran text-lg sm:text-xl text-emerald-800 dark:text-emerald-300 block leading-tight"
                          dir="rtl"
                        >
                          {surah.nameArabic}
                        </span>
                        <span className="text-[9.5px] font-semibold text-zinc-400 block mt-0.5">
                          Juz {surah.juzStart} • {surah.revelationType === 'Makkiyyah' ? 'Makkah' : 'Madinah'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-xs">Tidak ditemukan surat dengan kata kunci tersebut.</p>
              </div>
            )
          ) : (
            /* TAB 2: DAFTAR 30 JUZ */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredJuzs.map((juz) => (
                <button
                  key={juz.juzNumber}
                  type="button"
                  onClick={() => {
                    const startSurah = QURAN_SURAHS.find(
                      (s) => s.number === juz.startSurahNumber
                    );
                    if (startSurah) {
                      onSelectSurah(startSurah, juz.startAyahNumber);
                      onClose();
                    }
                  }}
                  className="group p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 hover:bg-emerald-50/60 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-emerald-400 text-left transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-[#d4af37] font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-[9px] uppercase tracking-widest text-emerald-200">JUZ</span>
                      <span className="text-sm leading-none">{juz.juzNumber}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                        {juz.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5">
                        Mulai: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{juz.startSurahName} : {juz.startAyahNumber}</span>
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        Hingga: {juz.endSurahName} : {juz.endAyahNumber}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

