import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Search,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  Sparkles,
  Layers,
  ArrowUp,
  AlertCircle
} from 'lucide-react';
import {
  QURAN_SURAHS,
  fetchSurahAyahs,
  SurahMeta,
  AyahItem
} from '../../../lib/quranData';
import { useQuranAudio, AudioRepeatMode } from '../../../hooks/useQuranAudio';
import { SurahSelectorModal } from './SurahSelectorModal';
import { FloatingAudioDock } from './FloatingAudioDock';

export const ReadQuran: React.FC = () => {
  // Surah & Ayah state
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(QURAN_SURAHS[0]);
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

  // Display customization
  const [arabicFontSize, setArabicFontSize] = useState<number>(28); // px
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [isDockVisible, setIsDockVisible] = useState<boolean>(false);

  // Bookmarks saved in localStorage
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ppjm_quran_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Audio Hook integration
  const handleAutoNext = useCallback(() => {
    if (!audioState.currentAyahNumber || ayahs.length === 0) return;
    const nextAyahNum = audioState.currentAyahNumber + 1;
    const nextAyah = ayahs.find((a) => a.numberInSurah === nextAyahNum);

    if (nextAyah) {
      audioState.playAyah(
        selectedSurah.number,
        nextAyah.numberInSurah,
        nextAyah.audioUrl,
        nextAyah.fallbackAudioUrl,
        nextAyah.tertiaryAudioUrl
      );
    } else {
      // End of surah: auto transition to next surah if available
      const nextSurahIndex = QURAN_SURAHS.findIndex((s) => s.number === selectedSurah.number) + 1;
      if (nextSurahIndex < QURAN_SURAHS.length) {
        setSelectedSurah(QURAN_SURAHS[nextSurahIndex]);
      }
    }
  }, [ayahs, selectedSurah]);

  const handleAutoPrev = useCallback(() => {
    if (!audioState.currentAyahNumber || ayahs.length === 0) return;
    const prevAyahNum = audioState.currentAyahNumber - 1;
    const prevAyah = ayahs.find((a) => a.numberInSurah === prevAyahNum);

    if (prevAyah) {
      audioState.playAyah(
        selectedSurah.number,
        prevAyah.numberInSurah,
        prevAyah.audioUrl,
        prevAyah.fallbackAudioUrl,
        prevAyah.tertiaryAudioUrl
      );
    }
  }, [ayahs, selectedSurah]);

  const audioState = useQuranAudio({
    onAutoNext: handleAutoNext,
    onAutoPrev: handleAutoPrev,
  });

  // Fetch Ayahs when Surah changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

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

  // Smooth Auto-scroll to active playing ayah
  useEffect(() => {
    if (audioState.currentAyahNumber && ayahRefs.current[audioState.currentAyahNumber]) {
      const el = ayahRefs.current[audioState.currentAyahNumber];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [audioState.currentAyahNumber]);

  // Cycle repeat modes
  const cycleRepeatMode = () => {
    const modes: AudioRepeatMode[] = ['continuous', '3x', 'loop', '1x'];
    const currentIdx = modes.indexOf(audioState.repeatMode);
    const nextMode = modes[(currentIdx + 1) % modes.length];
    audioState.setRepeatMode(nextMode);
  };

  // Toggle play ayah
  const handlePlayAyah = (ayah: AyahItem) => {
    setIsDockVisible(true);
    if (
      audioState.currentSurahNumber === selectedSurah.number &&
      audioState.currentAyahNumber === ayah.numberInSurah &&
      audioState.status !== 'ERROR'
    ) {
      audioState.togglePlay();
    } else {
      audioState.playAyah(
        selectedSurah.number,
        ayah.numberInSurah,
        ayah.audioUrl,
        ayah.fallbackAudioUrl,
        ayah.tertiaryAudioUrl
      );
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = (ayahNumber: number) => {
    const key = `${selectedSurah.number}:${ayahNumber}`;
    const updated = { ...bookmarks, [key]: !bookmarks[key] };
    setBookmarks(updated);
    try {
      localStorage.setItem('ppjm_quran_bookmarks', JSON.stringify(updated));
    } catch {
      // Ignored
    }
  };

  // Copy Ayah text & translation
  const handleCopyAyah = async (ayah: AyahItem) => {
    const textToCopy = `${ayah.textArabic}\n\n"${ayah.translationIndo}"\n(QS. ${selectedSurah.nameLatin}: ${ayah.numberInSurah})\n— PP Jauharul Maknuun`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAyahNumber(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
    } catch {
      // Ignored
    }
  };

  const handleSurahSelect = (surah: SurahMeta, targetAyahNumber?: number) => {
    setSelectedSurah(surah);
    audioState.stop();
    setIsDockVisible(false);

    if (targetAyahNumber) {
      setTimeout(() => {
        if (ayahRefs.current[targetAyahNumber]) {
          ayahRefs.current[targetAyahNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  };

  // Surah Navigation
  const currentIndex = QURAN_SURAHS.findIndex((s) => s.number === selectedSurah.number);
  const prevSurah = currentIndex > 0 ? QURAN_SURAHS[currentIndex - 1] : null;
  const nextSurah = currentIndex < QURAN_SURAHS.length - 1 ? QURAN_SURAHS[currentIndex + 1] : null;

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* ========================================================= */}
      {/* 1. TOP SURAH BAR & QUICK SELECTOR */}
      {/* ========================================================= */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Surah Name & Trigger Button */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-[#d4af37] font-black text-sm flex flex-col items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
            <span className="text-[8.5px] uppercase tracking-wider text-emerald-200">NO</span>
            <span className="text-base leading-none">{selectedSurah.number}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                QS. {selectedSurah.nameLatin}
              </h2>
              <span className="text-xs text-zinc-400 font-semibold">
                ({selectedSurah.nameArabic})
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              {selectedSurah.nameIndo} • {selectedSurah.numberOfAyahs} Ayat • Juz {selectedSurah.juzStart} •{' '}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedSurah.revelationType}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Selector Modal Trigger & Font Customizer */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Selector Button */}
          <button
            type="button"
            onClick={() => setIsSelectorOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Pilih Surat / Juz (114)</span>
          </button>

          {/* Font Resizer Controls */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setArabicFontSize((prev) => Math.max(22, prev - 2))}
              disabled={arabicFontSize <= 22}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Perkecil Ukuran Teks Arab"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 px-2">
              {arabicFontSize}px
            </span>
            <button
              type="button"
              onClick={() => setArabicFontSize((prev) => Math.min(42, prev + 2))}
              disabled={arabicFontSize >= 42}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Perbesar Ukuran Teks Arab"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Latin & Translation Buttons */}
          <button
            type="button"
            onClick={() => setShowLatin(!showLatin)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showLatin
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
            }`}
            title="Tampilkan / Sembunyikan Teks Latin"
          >
            Latin
          </button>

          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showTranslation
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
            }`}
            title="Tampilkan / Sembunyikan Terjemahan Bahasa Indonesia"
          >
            Arti
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BISMILLAH BANNER (Except At-Taubah 9 & Al-Fatihah 1) */}
      {/* ========================================================= */}
      {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 border border-emerald-200/60 dark:border-zinc-800 text-center shadow-xs">
          <p
            className="font-quran text-2xl sm:text-3xl text-emerald-950 dark:text-emerald-100 leading-relaxed font-normal"
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. AYAH READING STREAM */}
      {/* ========================================================= */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-500 font-bold">
            Memuat ayat-ayat Surat {selectedSurah.nameLatin}...
          </p>
        </div>
      ) : ayahs.length > 0 ? (
        <div className="space-y-4">
          {ayahs.map((ayah) => {
            const isPlayingThisAyah =
              audioState.status === 'PLAYING' &&
              audioState.currentSurahNumber === selectedSurah.number &&
              audioState.currentAyahNumber === ayah.numberInSurah;

            const isLoadingThisAyah =
              audioState.status === 'LOADING' &&
              audioState.currentSurahNumber === selectedSurah.number &&
              audioState.currentAyahNumber === ayah.numberInSurah;

            const isBookmarked = !!bookmarks[`${selectedSurah.number}:${ayah.numberInSurah}`];
            const isCopied = copiedAyahNumber === ayah.numberInSurah;

            return (
              <div
                key={ayah.numberInSurah}
                ref={(el) => {
                  ayahRefs.current[ayah.numberInSurah] = el;
                }}
                className={`group relative p-4 sm:p-6 rounded-3xl transition-all duration-300 border ${
                  isPlayingThisAyah
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-500 border-t-amber-200/60 border-r-amber-200/60 border-b-amber-200/60 dark:border-amber-700/60 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50/90 dark:hover:bg-zinc-850/70 border-zinc-200/80 dark:border-zinc-800 shadow-2xs'
                }`}
              >
                {/* Ayah Header Bar: Ayah Number Badge + Interactive Actions */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  {/* Ornate Ayah Counter Badge */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-xs">
                      {ayah.numberInSurah}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400 hidden sm:inline">
                      Ayat {ayah.numberInSurah}
                    </span>
                  </div>

                  {/* Actions: Play, Bookmark, Copy */}
                  <div className="flex items-center gap-1.5">
                    {/* Play Audio Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayAyah(ayah)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isPlayingThisAyah
                          ? 'bg-amber-500 text-zinc-950 shadow-xs font-black'
                          : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                      title={isPlayingThisAyah ? 'Jeda Audio Ayat Ini' : 'Putar Murottal Ayat Ini'}
                    >
                      {isLoadingThisAyah ? (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : isPlayingThisAyah ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                      )}
                      <span>{isPlayingThisAyah ? 'Memutar' : 'Audio'}</span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(ayah.numberInSurah)}
                      className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                        isBookmarked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600'
                      }`}
                      title={isBookmarked ? 'Hapus Tanda Bookmark' : 'Tandai Ayat Ini'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-all cursor-pointer active:scale-95"
                      title="Salin Ayat & Terjemah"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text (Naskh Font Amiri) */}
                <div className="pt-2 pb-4 text-right" dir="rtl">
                  <p
                    className="font-quran text-zinc-900 dark:text-zinc-100 font-normal select-text tracking-wide"
                    style={{
                      fontSize: `${arabicFontSize}px`,
                      lineHeight: `${arabicFontSize * 2.3}px`
                    }}
                  >
                    {ayah.textArabic}
                    <span className="inline-block mx-2 text-emerald-700 dark:text-emerald-400 font-quran text-lg">
                      ۝
                    </span>
                  </p>
                </div>

                {/* Transliterasi Latin */}
                {showLatin && ayah.textLatin && (
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-medium italic leading-relaxed pt-1 select-text">
                    {ayah.textLatin}
                  </p>
                )}

                {/* Terjemahan Bahasa Indonesia */}
                {showTranslation && ayah.translationIndo && (
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2 select-text border-t border-zinc-100/80 dark:border-zinc-800/80 mt-2">
                    {ayah.translationIndo}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
            Ayat Tidak Dapat Dimuat
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Terjadi kendala saat mengambil data ayat dari server. Silakan muat ulang atau pilih surat lainnya.
          </p>
          <button
            type="button"
            onClick={() => handleSurahSelect(selectedSurah)}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PREV / NEXT SURAH NAVIGATION FOOTER */}
      {/* ========================================================= */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
        {prevSurah ? (
          <button
            type="button"
            onClick={() => handleSurahSelect(prevSurah)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Surat Sebelumnya: {prevSurah.nameLatin}</span>
          </button>
        ) : (
          <div />
        )}

        {nextSurah && (
          <button
            type="button"
            onClick={() => handleSurahSelect(nextSurah)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer transition-all ml-auto"
          >
            <span>Surat Selanjutnya: {nextSurah.nameLatin}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. FLOATING AUDIO CONTROLLER DOCK (BOTTOM DOCK) */}
      {/* ========================================================= */}
      {isDockVisible && audioState.currentAyahNumber && (
        <FloatingAudioDock
          surah={selectedSurah}
          activeAyahNumber={audioState.currentAyahNumber}
          totalAyahs={ayahs.length || selectedSurah.numberOfAyahs}
          status={audioState.status}
          currentTime={audioState.currentTime}
          duration={audioState.duration}
          progress={audioState.progress}
          repeatMode={audioState.repeatMode}
          repeatCount={audioState.repeatCount}
          errorMessage={audioState.errorMessage}
          onTogglePlay={audioState.togglePlay}
          onPrevAyah={handleAutoPrev}
          onNextAyah={handleAutoNext}
          onSeek={audioState.seek}
          onCycleRepeatMode={cycleRepeatMode}
          onCloseDock={() => {
            audioState.stop();
            setIsDockVisible(false);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 6. SURAH SELECTOR MODAL / BOTTOM SHEET */}
      {/* ========================================================= */}
      <SurahSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        selectedSurahNumber={selectedSurah.number}
        onSelectSurah={handleSurahSelect}
      />
    </div>
  );
};

