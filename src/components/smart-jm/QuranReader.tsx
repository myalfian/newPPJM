import React, { useState, useEffect, useRef } from 'react';
import {
  QURAN_SURAHS,
  fetchSurahAyahs,
  SurahMeta,
  AyahItem
} from '../../lib/quranData';
import {
  Play,
  Pause,
  Bookmark,
  Share2,
  Search,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const QuranReader: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(QURAN_SURAHS[0]);
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAyahNum, setActiveAyahNum] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ppjm_quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Ayahs when Surah changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveAyahNum(null);
    }

    fetchSurahAyahs(selectedSurah.number).then((data) => {
      if (isMounted) {
        setAyahs(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  const togglePlayAyah = (ayah: AyahItem) => {
    if (activeAyahNum === ayah.numberInSurah && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(ayah.audioUrl);
    } else {
      audioRef.current.src = ayah.audioUrl;
    }

    audioRef.current.onended = () => {
      // Auto-play next ayah if exists
      const nextIndex = ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah) + 1;
      if (nextIndex < ayahs.length) {
        togglePlayAyah(ayahs[nextIndex]);
      } else {
        setIsPlaying(false);
        setActiveAyahNum(null);
      }
    };

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setActiveAyahNum(ayah.numberInSurah);
    }).catch((err) => {
      console.warn('Playback error:', err);
      setIsPlaying(false);
    });
  };

  const toggleBookmark = (ayahNum: number) => {
    const key = selectedSurah.number * 1000 + ayahNum;
    let updated: number[];
    if (bookmarkedAyahs.includes(key)) {
      updated = bookmarkedAyahs.filter((k) => k !== key);
    } else {
      updated = [...bookmarkedAyahs, key];
    }
    setBookmarkedAyahs(updated);
    try {
      localStorage.setItem('ppjm_quran_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredSurahs = QURAN_SURAHS.filter(
    (s) =>
      s.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameIndo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-m3-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-gold-300 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mushaf Online PPJM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Al-Qur’anul Karim 30 Juz
            </h2>
            <p className="text-sm text-emerald-200/90 max-w-xl">
              Dilengkapi teks resmi standar Kementerian Agama RI, terjemahan lengkap bahasa Indonesia, 
              dan lantunan audio tilawah murottal Syaikh Misyari Rasyid Al-Afasy.
            </p>
          </div>

          {/* Quick Stats of Current Surah */}
          <div className="bg-emerald-950/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-700/50 flex items-center justify-between gap-6">
            <div>
              <div className="text-xs text-emerald-300 font-semibold uppercase">Surat Aktif</div>
              <div className="text-lg font-bold text-gold-300">{selectedSurah.nameLatin}</div>
              <div className="text-xs text-emerald-400">{selectedSurah.nameIndo} • {selectedSurah.numberOfAyahs} Ayat</div>
            </div>
            <div className="font-quran text-3xl text-emerald-200 font-bold">
              {selectedSurah.nameArabic}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Surah Directory / Selector */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col max-h-[700px]">
          <div className="mb-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari surat / nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'hover:bg-emerald-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-gold-500 text-emerald-950'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {surah.number}
                    </span>
                    <div>
                      <div className="text-sm font-bold leading-tight">{surah.nameLatin}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {surah.nameIndo}
                      </div>
                    </div>
                  </div>
                  <div className={`font-quran text-base ${isSelected ? 'text-gold-300' : 'text-emerald-700'}`}>
                    {surah.nameArabic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ayah Reader */}
        <div className="lg:col-span-3 space-y-4">
          {/* Surah Header & Bismillah */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center space-y-3">
            <h3 className="text-xl font-extrabold text-emerald-900">
              Surat {selectedSurah.nameLatin} ({selectedSurah.nameArabic})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Surat ke-{selectedSurah.number} • {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} Ayat
            </p>

            {selectedSurah.number !== 9 && (
              <div className="pt-2 font-quran text-2xl sm:text-3xl text-emerald-800 py-3 border-t border-slate-100">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}
          </div>

          {/* Ayah List */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-3 shadow-sm border border-slate-200">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium">Memuat ayat-ayat suci Al-Qur'an...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ayahs.map((ayah) => {
                const isCurrentPlaying = activeAyahNum === ayah.numberInSurah && isPlaying;
                const isBookmarked = bookmarkedAyahs.includes(selectedSurah.number * 1000 + ayah.numberInSurah);

                return (
                  <div
                    key={ayah.numberInSurah}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                      isCurrentPlaying
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {/* Action Bar per Ayah */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center">
                        {ayah.numberInSurah}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => togglePlayAyah(ayah)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isCurrentPlaying
                              ? 'bg-emerald-800 text-white shadow-sm'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          aria-label={`Dengarkan Murottal Ayat ${ayah.numberInSurah}`}
                        >
                          {isCurrentPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Jeda</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Murottal</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleBookmark(ayah.numberInSurah)}
                          className={`p-1.5 rounded-full transition-colors ${
                            isBookmarked
                              ? 'text-gold-600 bg-gold-50'
                              : 'text-slate-400 hover:text-gold-600 hover:bg-slate-100'
                          }`}
                          title="Tandai Ayat"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-gold-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse Text */}
                    <div className="py-5 text-right font-quran text-2xl sm:text-3xl lg:text-4xl leading-[2.2] sm:leading-[2.2] text-slate-900 dir-rtl select-text">
                      {ayah.textArabic}
                      <span className="inline-block mr-2 text-gold-600 font-sans text-sm font-bold align-middle">
                        ۝{ayah.numberInSurah}
                      </span>
                    </div>

                    {/* Transliteration & Indonesian Translation */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                      {ayah.textLatin && (
                        <p className="text-xs sm:text-sm text-emerald-800 font-semibold italic">
                          {ayah.textLatin}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {ayah.translationIndo}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
