import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  RotateCcw,
  Volume2,
  X,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { AudioPlaybackStatus, AudioRepeatMode } from '../../../hooks/useQuranAudio';
import { SurahMeta } from '../../../lib/quranData';

interface FloatingAudioDockProps {
  surah: SurahMeta;
  activeAyahNumber: number;
  totalAyahs: number;
  status: AudioPlaybackStatus;
  currentTime: number;
  duration: number;
  progress: number;
  repeatMode: AudioRepeatMode;
  repeatCount: number;
  errorMessage: string | null;
  onTogglePlay: () => void;
  onPrevAyah: () => void;
  onNextAyah: () => void;
  onSeek: (seconds: number) => void;
  onCycleRepeatMode: () => void;
  onCloseDock: () => void;
}

export const FloatingAudioDock: React.FC<FloatingAudioDockProps> = ({
  surah,
  activeAyahNumber,
  totalAyahs,
  status,
  currentTime,
  duration,
  progress,
  repeatMode,
  repeatCount,
  errorMessage,
  onTogglePlay,
  onPrevAyah,
  onNextAyah,
  onSeek,
  onCycleRepeatMode,
  onCloseDock,
}) => {
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getRepeatModeLabel = () => {
    switch (repeatMode) {
      case '1x':
        return 'Putar 1x';
      case '3x':
        return `Ulang 3x (${repeatCount + 1}/3)`;
      case 'loop':
        return 'Ulang Terus';
      case 'continuous':
      default:
        return 'Lanjut Otomatis';
    }
  };

  const isPlaying = status === 'PLAYING';
  const isLoading = status === 'LOADING';

  return (
    <aside
      aria-label="Pemutar Audio Al-Qur'an"
      className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-auto sm:w-[560px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-zinc-950/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.45)] rounded-2xl p-3 sm:p-3.5 text-white select-none animate-in slide-in-from-bottom duration-250"
    >
      {/* Upper Info Row: Surah & Ayah Badge + Close */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-800 text-[#d4af37] flex items-center justify-center font-black text-[10px] shrink-0">
            {surah.number}
          </div>
          <span className="font-bold text-white text-xs truncate">
            QS. {surah.nameLatin}
          </span>
          <span className="text-zinc-400 text-xs shrink-0">
            Ayat <span className="text-[#d4af37] font-black">{activeAyahNumber}</span> / {totalAyahs}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Repeat Mode Pill Button */}
          <button
            type="button"
            onClick={onCycleRepeatMode}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 border active:scale-95 ${
              repeatMode !== '1x'
                ? 'bg-amber-500/20 text-[#d4af37] border-amber-500/40'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
            }`}
            title="Ubah Mode Pengulangan Audio"
          >
            {repeatMode === '1x' && <Repeat1 className="w-3 h-3" />}
            {repeatMode === '3x' && <RotateCcw className="w-3 h-3 text-amber-400" />}
            {repeatMode === 'loop' && <Repeat className="w-3 h-3 text-amber-400" />}
            {repeatMode === 'continuous' && <Volume2 className="w-3 h-3 text-emerald-400" />}
            <span>{getRepeatModeLabel()}</span>
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onCloseDock}
            className="w-6 h-6 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Sembunyikan Pemutar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Track & Seek Scrubber */}
      <div className="space-y-1 mb-2.5">
        <div className="relative w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Progress pemutaran audio"
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Error notification if audio fails */}
      {errorMessage && (
        <div className="mb-2 p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-200 text-[10.5px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}

      {/* Main Playback Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Ayah */}
        <button
          type="button"
          onClick={onPrevAyah}
          disabled={activeAyahNumber <= 1}
          className="w-10 h-10 rounded-full hover:bg-zinc-800/80 disabled:opacity-40 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:pointer-events-none"
          title="Ayat Sebelumnya"
        >
          <SkipBack className="w-4.5 h-4.5" />
        </button>

        {/* Primary Play / Pause Button (Large Touch Target 48x48px) */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="relative w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-emerald-400/40"
          title={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}

          {/* Pulse ring when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
          )}
        </button>

        {/* Next Ayah */}
        <button
          type="button"
          onClick={onNextAyah}
          disabled={activeAyahNumber >= totalAyahs}
          className="w-10 h-10 rounded-full hover:bg-zinc-800/80 disabled:opacity-40 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:pointer-events-none"
          title="Ayat Selanjutnya"
        >
          <SkipForward className="w-4.5 h-4.5" />
        </button>
      </div>
    </aside>
  );
};

