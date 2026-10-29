import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  Repeat,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Headphones,
  Sliders
} from 'lucide-react';
import {
  QURAN_SURAHS,
  fetchSurahAyahs,
  SurahMeta,
  AyahItem
} from '../../lib/quranData';
import { RepeatMode } from './types';
import { ReadQuran } from '../../components/smart-jm/hafidz/ReadQuran';

export const HafidzQuranSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'read' | 'murojaah'>('read');

  // Surah & Ayah state for Murojaah
  const [surahs] = useState<SurahMeta[]>(QURAN_SURAHS);
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(QURAN_SURAHS[0]);
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Murojaah Mode state
  const [murojaahAyahIndex, setMurojaahAyahIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [isClozeHidden, setIsClozeHidden] = useState<boolean>(false);
  const [revealedWords, setRevealedWords] = useState<Record<number, boolean>>({});
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(1);
  const [currentRepeatCount, setCurrentRepeatCount] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Audio element ref for Murojaah
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch ayahs when surah changes in Murojaah mode
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    fetchSurahAyahs(selectedSurah.number).then((data) => {
      if (isMounted) {
        setAyahs(data);
        setLoading(false);
        setMurojaahAyahIndex(0);
        setIsClozeHidden(false);
        setRevealedWords({});
      }
    });

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedSurah]);

  // Audio Playback handler for Murojaah with Multi-CDN Failover
  const playAyahAudio = (ayah: AyahItem) => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    const candidateUrls = [
      ayah.audioUrl,
      ayah.fallbackAudioUrl,
      ayah.tertiaryAudioUrl,
      ayah.quaternaryAudioUrl
    ].filter((u): u is string => typeof u === 'string' && u.trim().length > 0);

    const tryPlayIndex = (idx: number) => {
      if (!audioRef.current || idx >= candidateUrls.length) {
        setIsPlayingAudio(false);
        return;
      }

      audioRef.current.src = candidateUrls[idx];
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          setCurrentRepeatCount(1);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.warn(`Murojaah CDN #${idx + 1} (${candidateUrls[idx]}) gagal:`, err.message);
          if (idx + 1 < candidateUrls.length) {
            tryPlayIndex(idx + 1);
          } else {
            setIsPlayingAudio(false);
          }
        });
    };

    tryPlayIndex(0);
  };

  const handleAudioEnded = () => {
    if (!audioRef.current) return;

    const currentAyah = ayahs[murojaahAyahIndex];

    if (currentAyah) {
      if (repeatMode === 'loop' || currentRepeatCount < (repeatMode as number)) {
        setCurrentRepeatCount((prev) => prev + 1);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      }
    }

    setIsPlayingAudio(false);
    setCurrentRepeatCount(0);
  };

  const activeMurojaahAyah = ayahs[murojaahAyahIndex];

  // Helper cloze test: break arabic into words and mask some words
  const renderClozeArabic = (arabicText: string) => {
    if (!isClozeHidden) return arabicText;

    const words = arabicText.split(' ');
    return words.map((word, idx) => {
      const shouldMask = idx % 2 === 1;
      const isRevealed = revealedWords[idx];

      if (shouldMask && !isRevealed) {
        return (
          <button
            key={idx}
            type="button"
            onClick={() => setRevealedWords((prev) => ({ ...prev, [idx]: true }))}
            className="inline-block mx-1.5 px-3 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-dashed border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold text-sm cursor-pointer hover:bg-emerald-200"
            title="Klik untuk membuka kata yang disembunyikan"
          >
            [...?]
          </button>
        );
      }

      return (
        <span key={idx} className={shouldMask && isRevealed ? 'text-emerald-600 underline' : ''}>
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* Hidden Audio Element for Murojaah */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => setIsPlayingAudio(false)}
      />

      {/* ========================================================= */}
      {/* SUB-SECTION TOGGLER: READ QURAN vs MUROJAAH HAFALAN */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-2 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mushaf 30 Juz &amp; Murojaah Santri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Hafidz Quran Digital
          </h2>
        </div>

        {/* Pill Sub-Navigation Switcher */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlayingAudio(false);
              setActiveSubTab('read');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 active:scale-[0.98] ${
              activeSubTab === 'read'
                ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Read Quran (114 Surat)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('murojaah')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 active:scale-[0.98] ${
              activeSubTab === 'murojaah'
                ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-zinc-200/70 dark:border-zinc-700/70 font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Headphones className="w-4 h-4 text-[#d4af37]" />
            <span>Latihan Murojaah</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: READ QURAN (Mushaf Digital Elegan Lengkap 114 Surat) */}
      {/* ========================================================= */}
      {activeSubTab === 'read' && <ReadQuran />}

      {/* ========================================================= */}
      {/* MODE 2: LATIHAN MUROJAAH (Cloze Test & Audio Repeat) */}
      {/* ========================================================= */}
      {activeSubTab === 'murojaah' && (
        <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
          {/* Murojaah Surah Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2.5 sm:p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari surat murojaah (Yasin, Al-Mulk, 36)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Picks */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <span className="text-xs text-zinc-400 whitespace-nowrap font-medium hidden sm:inline">
                  Pilihan:
                </span>
                {[
                  { num: 1, name: 'Al-Fatihah' },
                  { num: 36, name: 'Yasin' },
                  { num: 55, name: 'Ar-Rahman' },
                  { num: 67, name: 'Al-Mulk' },
                  { num: 112, name: 'Al-Ikhlas' },
                  { num: 114, name: 'An-Nas' }
                ].map((fav) => {
                  const matched = surahs.find((s) => s.number === fav.num);
                  if (!matched) return null;
                  const isCurrent = selectedSurah.number === fav.num;
                  return (
                    <button
                      key={fav.num}
                      type="button"
                      onClick={() => setSelectedSurah(matched)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                        isCurrent
                          ? 'bg-emerald-800 text-white shadow-xs font-black'
                          : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {fav.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Surah Info */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-800 text-[#d4af37] font-black text-xs flex items-center justify-center shrink-0">
                  {selectedSurah.number}
                </span>
                <div>
                  <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                    Surat {selectedSurah.nameLatin} ({selectedSurah.nameArabic})
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {selectedSurah.nameIndo} • {selectedSurah.numberOfAyahs} Ayat • Juz {selectedSurah.juzStart} • {selectedSurah.revelationType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Murojaah Card */}
          {activeMurojaahAyah ? (
            <div className="max-w-3xl mx-auto bg-white/95 dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 sm:p-8 lg:p-10 shadow-lg space-y-8">
              {/* Header Murojaah Control */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                    {activeMurojaahAyah.numberInSurah}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                      Murojaah: {selectedSurah.nameLatin} (Ayat {activeMurojaahAyah.numberInSurah} dari {ayahs.length})
                    </h3>
                  </div>
                </div>

                {/* Cloze & Translation Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsClozeHidden(!isClozeHidden);
                      setRevealedWords({});
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[38px] active:scale-95 ${
                      isClozeHidden
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                    }`}
                    title="Uji hafalan dengan menyembunyikan sebagian lafadz"
                  >
                    {isClozeHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isClozeHidden ? 'Buka Lafadz Penuh' : 'Tutup Sebagian Lafadz'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-all cursor-pointer min-h-[38px]"
                    title="Tampilkan/Sembunyikan Terjemahan"
                  >
                    {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tampilan Lafadz Arab Murojaah */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center space-y-4">
                <div
                  className="font-quran text-zinc-900 dark:text-white leading-[2.8] select-text text-2xl sm:text-4xl"
                  dir="rtl"
                >
                  {renderClozeArabic(activeMurojaahAyah.textArabic)}
                </div>

                {isClozeHidden && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    💡 Klik tombol <strong>[...?]</strong> di atas untuk memverifikasi lafadz hafalan yang tersembunyi.
                  </p>
                )}
              </div>

              {/* Transliterasi & Terjemahan */}
              {showTranslation && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1 text-center animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm font-mono text-emerald-800 dark:text-emerald-400 italic">
                    {activeMurojaahAyah.textLatin}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    &quot;{activeMurojaahAyah.translationIndo}&quot;
                  </p>
                </div>
              )}

              {/* Player Kontrol Murottal & Repeat Mode */}
              <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => playAyahAudio(activeMurojaahAyah)}
                      className="w-12 h-12 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer ring-2 ring-emerald-400/40"
                      title={isPlayingAudio ? 'Jeda Audio' : 'Dengarkan Ayat'}
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                        Murottal Syaikh Misyari Rasyid Al-Afasy
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {isPlayingAudio
                          ? `Sedang memutar (Pengulangan: ${currentRepeatCount}/${repeatMode === 'loop' ? '∞' : repeatMode})`
                          : 'Siap diputar'}
                      </span>
                    </div>
                  </div>

                  {/* Repeat Mode Switcher */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium mr-1 hidden sm:inline">
                      Pengulangan:
                    </span>
                    {([1, 3, 5, 'loop'] as RepeatMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setRepeatMode(mode);
                          setCurrentRepeatCount(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                          repeatMode === mode
                            ? 'bg-emerald-800 text-white shadow-xs font-black'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {mode === 'loop' ? 'Loop ∞' : `${mode}x`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigasi Ayat */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={murojaahAyahIndex === 0}
                  onClick={() => {
                    setMurojaahAyahIndex((prev) => Math.max(0, prev - 1));
                    setIsClozeHidden(false);
                    setRevealedWords({});
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Ayat Sebelumnya</span>
                </button>

                <button
                  type="button"
                  disabled={murojaahAyahIndex === ayahs.length - 1}
                  onClick={() => {
                    setMurojaahAyahIndex((prev) => Math.min(ayahs.length - 1, prev + 1));
                    setIsClozeHidden(false);
                    setRevealedWords({});
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all min-h-[44px] cursor-pointer"
                >
                  <span>Ayat Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400">
              Tidak ada ayat yang dapat ditampilkan untuk surat ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
