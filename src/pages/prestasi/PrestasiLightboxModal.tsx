import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Award,
  Calendar,
  User,
  Share2,
  Check,
  Maximize2,
  ExternalLink,
  Building,
  Sparkles
} from 'lucide-react';
import { PrestasiItem } from './types';

interface PrestasiLightboxModalProps {
  item: PrestasiItem | null;
  onClose: () => void;
}

export const PrestasiLightboxModal: React.FC<PrestasiLightboxModalProps> = ({ item, onClose }) => {
  const [activeView, setActiveView] = useState<'certificate' | 'photo'>('certificate');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      setActiveView(item.certificate_url ? 'certificate' : 'photo');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [item]);

  if (!item) return null;

  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: `${item.title} diraih oleh ${item.winner_name} (${item.medal_type} Tingkat ${item.tingkat}) di PP Jauharul Maknuun.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${item.title} - ${item.winner_name} (${item.medal_type})\n${window.location.href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  const currentDisplayImage =
    activeView === 'certificate'
      ? item.certificate_url || item.photo_url
      : item.photo_url || item.certificate_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 select-none overscroll-contain"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl lg:max-w-3xl bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" />
                {item.medal_type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[10.5px]">
                Tingkat {item.tingkat}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                • {item.year}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
              {item.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">
          {/* Image Viewer Container with Switcher */}
          <div className="space-y-2">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group">
              <img
                src={currentDisplayImage}
                alt={item.title}
                className="w-full h-full object-contain sm:object-cover"
              />

              {/* View Switcher Pills (If both photo and certificate exist) */}
              {item.photo_url && item.certificate_url && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
                  <button
                    type="button"
                    onClick={() => setActiveView('certificate')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'certificate'
                        ? 'bg-amber-500 text-zinc-950'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Sertifikat Resmi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('photo')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'photo'
                        ? 'bg-amber-500 text-zinc-950'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Foto Kejuaraan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Winner & Event Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Peraih Prestasi
              </span>
              <p className="font-black text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                {item.winner_name}
              </p>
              {item.winner_class && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.winner_class}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Penyelenggara / Ajang
              </span>
              <p className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-500" />
                {item.event_name}
              </p>
              {item.organizer && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Oleh: {item.organizer}
                </p>
              )}
            </div>
          </div>

          {/* Full Narrative */}
          <div className="space-y-1.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-zinc-400">
              Ulasan &amp; Deskripsi Keberhasilan
            </h4>
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-black">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Bagikan Prestasi</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

