import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Check,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

export interface LightboxImage {
  url: string;
  alt?: string;
  caption?: string;
  title?: string;
}

export interface UniversalLightboxDetail {
  images: Array<string | LightboxImage>;
  initialIndex?: number;
  title?: string;
}

/**
 * Global helper to trigger the Universal Lightbox Modal from anywhere in the app
 * (cards, sliders, galleries, admin preview, portal pages).
 */
export function openUniversalLightbox(
  images: Array<string | LightboxImage | null | undefined>,
  initialIndex = 0,
  title?: string
) {
  if (typeof window === 'undefined') return;
  const filtered = images
    .filter((img): img is string | LightboxImage => Boolean(img))
    .map((img) => (typeof img === 'string' ? { url: img } : img));

  if (filtered.length === 0) return;

  window.dispatchEvent(
    new CustomEvent<UniversalLightboxDetail>('open-universal-lightbox', {
      detail: {
        images: filtered,
        initialIndex: Math.max(0, Math.min(initialIndex, filtered.length - 1)),
        title,
      },
    })
  );
}

export const UniversalLightboxModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageList, setImageList] = useState<LightboxImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [copied, setCopied] = useState(false);

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartRef = useRef<number | null>(null);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<UniversalLightboxDetail>;
      const detail = customEvent.detail;
      if (!detail || !Array.isArray(detail.images) || detail.images.length === 0) return;

      // Remember triggering active element for focus restoration
      if (document.activeElement instanceof HTMLElement) {
        triggerElementRef.current = document.activeElement;
      }

      const formatted: LightboxImage[] = detail.images.map((img) =>
        typeof img === 'string' ? { url: img } : img
      );

      setImageList(formatted);
      setCurrentIndex(detail.initialIndex ?? 0);
      setModalTitle(detail.title);
      setZoomLevel(1);
      setIsOpen(true);
    };

    window.addEventListener('open-universal-lightbox', handleOpen);
    return () => window.removeEventListener('open-universal-lightbox', handleOpen);
  }, []);

  // Close handler with focus restoration & scroll unlock
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setZoomLevel(1);
    // Restore focus to triggering card/element
    setTimeout(() => {
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    }, 50);
  }, []);

  const total = imageList.length;
  const currentImage = imageList[currentIndex] || imageList[0];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
    setZoomLevel(1);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    setZoomLevel(1);
  }, [total]);

  // Keyboard navigation & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Scroll Lock on body
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Auto-focus the close button upon opening
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Tab') {
        // Focus trap inside modal
        if (!modalContainerRef.current) return;
        const focusable = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartRef.current = null;
  };

  const handleShare = async () => {
    if (!currentImage?.url) return;
    const shareData = {
      title: currentImage.title || modalTitle || 'Dokumentasi PP. Jauharul Maknuun',
      text: currentImage.caption || currentImage.alt || 'Dokumentasi resmi Pondok Pesantren Jauharul Maknuun',
      url: currentImage.url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user dismissed
      }
    }

    try {
      await navigator.clipboard.writeText(currentImage.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <div
          ref={modalContainerRef}
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle || 'Penampil Gambar Resolusi Penuh'}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none"
          onClick={handleClose}
        >
          {/* Main Modal Shell: Full view without cropping */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white"
          >
            {/* Top Bar Header */}
            <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md z-30 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/70 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="min-w-0 leading-tight">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {currentImage.title || modalTitle || 'Foto Dokumentasi PPJM'}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                    Pondok Pesantren Jauharul Maknuun
                  </p>
                </div>
              </div>

              {/* Action Buttons: Zoom, Share, Counter, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {total > 1 && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800/90 text-amber-300 text-[10.5px] font-black border border-slate-700/80">
                    {currentIndex + 1} / {total}
                  </span>
                )}

                <button
                  type="button"
                  onClick={toggleZoom}
                  title={`Perbesar Gambar (${zoomLevel}x)`}
                  aria-label={`Ubah Skala Zoom ${zoomLevel}x`}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                >
                  {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  title="Bagikan Tautan Gambar"
                  aria-label="Bagikan Tautan Gambar"
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleClose}
                  title="Tutup (Esc)"
                  aria-label="Tutup Dialog (Esc)"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-950/70 hover:border-rose-800 border border-transparent transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Central Viewport: Zero Cropping (object-contain with neutral letterbox) */}
            <div className="relative flex-1 min-h-[280px] xs:min-h-[340px] sm:min-h-[460px] max-h-[72vh] flex items-center justify-center bg-black/60 overflow-hidden p-2 sm:p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentImage.url}-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: zoomLevel }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center transition-transform duration-200"
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt || currentImage.caption || modalTitle || 'Foto PPJM'}
                    loading="eager"
                    decoding="async"
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg select-none"
                    onError={(e) => {
                      // Fallback placeholder
                      (e.target as HTMLImageElement).src = '/logo.jpg';
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Navigation Arrows */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Foto Sebelumnya"
                    title="Foto Sebelumnya (Panah Kiri)"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Foto Selanjutnya"
                    title="Foto Selanjutnya (Panah Kanan)"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption & Thumbnail Strip */}
            <footer className="px-3.5 sm:px-5 py-2 sm:py-2.5 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md shrink-0 space-y-2">
              {/* Caption text */}
              {(currentImage.caption || currentImage.alt) && (
                <p className="text-xs sm:text-sm font-medium text-slate-200 text-center line-clamp-2">
                  {currentImage.caption || currentImage.alt}
                </p>
              )}

              {/* Multi-Photo Thumbnails */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1">
                  {imageList.map((thumb, idx) => (
                    <button
                      key={`${thumb.url}-${idx}`}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setZoomLevel(1);
                      }}
                      aria-label={`Pilih Foto ${idx + 1}`}
                      className={`relative w-11 h-8 sm:w-14 sm:h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        idx === currentIndex
                          ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105'
                          : 'border-slate-700/80 opacity-60 hover:opacity-100 hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={thumb.url}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

