import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  UserCheck,
  MapPin,
  Target,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Images,
  Sparkles
} from 'lucide-react';
import { DetailedEkskulItem, EkskulPhoto } from './types';

interface EkskulDetailModalProps {
  item: DetailedEkskulItem | null;
  onClose: () => void;
}

export const EkskulDetailModal: React.FC<EkskulDetailModalProps> = ({ item, onClose }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Scroll lock effect on body
  useEffect(() => {
    if (item) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [item]);

  if (!item) return null;

  const photos = item.gallery;
  const isLightboxOpen = activePhotoIndex !== null;
  const currentPhoto = isLightboxOpen ? photos[activePhotoIndex] : null;

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* ADAPTIVE MODAL: BOTTOM SHEET (MOBILE) / CENTER DIALOG (DESKTOP) */}
      {/* ========================================================= */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain select-none"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-250"
        >
          {/* Mobile Drag Bar Handle */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  {item.category}
                </span>
                <span className="text-xs text-zinc-400">• Santri PPJM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                {item.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
            {/* Metadata Card: Jadwal, Pembina, Tempat, Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Jadwal Latihan:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {item.schedule}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Pelatih / Pembina:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {item.coach}
                  </span>
                </div>
              </div>

              {item.tempatLatihan && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Lokasi Latihan:
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {item.tempatLatihan}
                    </span>
                  </div>
                </div>
              )}

              {item.targetCapaian && (
                <div className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Target Capaian:
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {item.targetCapaian}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Narasi Profil Ekskul */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Visi & Fokus Pembinaan
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Poin Capaian & Keunggulan */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Fokus Keahlian Santri:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/50 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Galeri Multi-Foto Kegiatan (Grid 2-3 Kolom, aspect-[4/3]) */}
            <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Images className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    Galeri Dokumentasi Kegiatan ({photos.length} Foto)
                  </h3>
                </div>
                <span className="text-xs text-zinc-400">Klik foto untuk perbesar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                    {photo.timeTag && (
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {photo.timeTag}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-full bg-white/90 text-zinc-800 flex items-center justify-center shadow-xs">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-[11px] font-medium leading-tight line-clamp-2 drop-shadow-sm">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULLSCREEN LIGHTBOX PHOTO VIEWER */}
      {/* ========================================================= */}
      {isLightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold text-emerald-400">
                Foto {activePhotoIndex! + 1} dari {photos.length} • {item.name}
              </span>

              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next Nav Buttons */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer active:scale-95"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer active:scale-95"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Caption Bar */}
            <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 text-white">
              {currentPhoto.timeTag && (
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 inline-block mb-1">
                  {currentPhoto.timeTag}
                </span>
              )}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

