import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSliderSettings, SliderSettings, TransitionEffect } from '../../lib/sliderSettings';

export interface SlideImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

export interface CardImageSliderProps {
  /**
   * Array of image URLs or image objects.
   * Accepts: string[], SlideImageItem[], or mixed.
   */
  images: Array<string | SlideImageItem | null | undefined>;
  /** CSS Aspect Ratio class, e.g. 'aspect-[16/10]' (default), 'aspect-[4/3]', 'aspect-video' */
  aspectRatio?: string;
  /** Outer container class */
  className?: string;
  /** Outer container class alias */
  containerClassName?: string;
  /** Image styling class */
  imgClassName?: string;
  /** Fallback alt text */
  alt?: string;
  /** Optional click handler for image/lightbox */
  onImageClick?: (index: number) => void;
  /** Whether to show indicator dots on multi-image cards (default: true) */
  showIndicators?: boolean;
  /** Whether to show previous/next arrow buttons (default: true) */
  showArrows?: boolean;
  /** Optional overlay badge rendered in top left */
  badgeTopLeft?: React.ReactNode;
  /** Optional overlay badge rendered in top right */
  badgeTopRight?: React.ReactNode;
  /** Optional overlay caption/badge rendered in bottom */
  badgeBottom?: React.ReactNode;
  /** Custom settings override if needed (otherwise uses global super_admin settings) */
  customSettings?: Partial<SliderSettings>;
}

export const CardImageSlider: React.FC<CardImageSliderProps> = ({
  images: rawImages,
  aspectRatio = 'aspect-[16/10]',
  className = '',
  containerClassName = '',
  imgClassName = '',
  alt = 'Dokumentasi',
  onImageClick,
  showIndicators = true,
  showArrows = true,
  badgeTopLeft,
  badgeTopRight,
  badgeBottom,
  customSettings,
}) => {
  const outerClass = `${className} ${containerClassName}`.trim();
  const globalSettings = useSliderSettings();
  const settings: SliderSettings = useMemo(
    () => ({
      ...globalSettings,
      ...customSettings,
    }),
    [globalSettings, customSettings]
  );

  // Normalize image items
  const items: SlideImageItem[] = useMemo(() => {
    if (!Array.isArray(rawImages)) return [];
    return rawImages
      .filter((img): img is string | SlideImageItem => Boolean(img))
      .map((img) => {
        if (typeof img === 'string') {
          return { url: img.trim() };
        }
        return {
          url: (img.url || '').trim(),
          alt: img.alt,
          caption: img.caption,
        };
      })
      .filter((img) => Boolean(img.url));
  }, [rawImages]);

  const total = items.length;
  const [[current, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // IntersectionObserver: Pause timer if slider is offscreen to save battery & CPU
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return;
      setSlide(([curr]) => {
        let next = curr + newDirection;
        if (next < 0) next = total - 1;
        if (next >= total) next = 0;
        return [next, newDirection];
      });
    },
    [total]
  );

  const jumpTo = (targetIdx: number) => {
    if (targetIdx === current || total <= 1) return;
    setSlide(([curr]) => [targetIdx, targetIdx > curr ? 1 : -1]);
  };

  // Autoplay interval loop
  useEffect(() => {
    if (
      total <= 1 ||
      !settings.isAutoplayEnabled ||
      prefersReducedMotion ||
      !isInView ||
      (settings.pauseOnHover && isHovered)
    ) {
      return;
    }

    const intervalMs = Math.max(2000, settings.autoplayInterval * 1000);
    const timer = window.setInterval(() => {
      paginate(1);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [total, settings.isAutoplayEnabled, settings.autoplayInterval, settings.pauseOnHover, isHovered, isInView, prefersReducedMotion, paginate]);

  // If no valid images, render blank placeholder
  if (total === 0) {
    return (
      <div
        className={`relative ${aspectRatio} w-full overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 select-none ${className}`}
      >
        <span className="text-xs font-semibold">Tidak ada gambar</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SINGLE IMAGE: Pure static rendering without controls or timer overhead
  // ─────────────────────────────────────────────────────────────────────────────
  if (total === 1) {
    const single = items[0];
    return (
      <div
        ref={containerRef}
        onClick={() => onImageClick?.(0)}
        className={`relative ${aspectRatio} w-full overflow-hidden rounded-2xl bg-zinc-900 select-none ${
          onImageClick ? 'cursor-pointer' : ''
        } ${outerClass}`}
      >
        <img
          src={single.url}
          alt={single.alt || single.caption || alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover ${imgClassName}`}
        />
        {badgeTopLeft && <div className="absolute top-2.5 left-2.5 z-10">{badgeTopLeft}</div>}
        {badgeTopRight && <div className="absolute top-2.5 right-2.5 z-10">{badgeTopRight}</div>}
        {badgeBottom && <div className="absolute inset-x-0 bottom-0 z-10">{badgeBottom}</div>}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MULTI-IMAGE: Animated slider with swipe, keyboard ARIA, and global settings
  // ─────────────────────────────────────────────────────────────────────────────
  const activeItem = items[current] || items[0];
  const durationSec = prefersReducedMotion ? 0 : Math.max(0.15, settings.transitionSpeed / 1000);

  // Animation variants based on transition effect
  const effect: TransitionEffect = settings.transitionEffect || 'slide';
  const variants = {
    enter: (dir: number) => {
      if (effect === 'fade') {
        return { opacity: 0 };
      }
      if (effect === 'zoom') {
        return { opacity: 0, scale: 0.94 };
      }
      // default 'slide'
      return {
        x: dir > 0 ? '100%' : '-100%',
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => {
      if (effect === 'fade') {
        return { opacity: 0 };
      }
      if (effect === 'zoom') {
        return { opacity: 0, scale: 1.04 };
      }
      // default 'slide'
      return {
        x: dir > 0 ? '-100%' : '100%',
        opacity: 0,
      };
    },
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} (Slider ${current + 1} dari ${total})`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onTouchStart={(e) => {
        setIsHovered(true);
        setTouchStart(e.touches[0].clientX);
      }}
      onTouchEnd={(e) => {
        if (touchStart !== null) {
          const diff = touchStart - e.changedTouches[0].clientX;
          if (diff > 40) paginate(1);
          else if (diff < -40) paginate(-1);
        }
        setTouchStart(null);
        setIsHovered(false);
      }}
      className={`group/cardslider relative ${aspectRatio} w-full overflow-hidden rounded-2xl bg-zinc-900 select-none shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${outerClass}`}
    >
      {/* Animated Slides Viewport */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`${activeItem.url}-${current}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 320, damping: 32, mass: 0.7 },
            opacity: { duration: durationSec, ease: 'easeOut' },
            scale: { duration: durationSec, ease: 'easeOut' },
          }}
          onClick={() => onImageClick?.(current)}
          className={`absolute inset-0 w-full h-full ${onImageClick ? 'cursor-pointer' : ''}`}
        >
          <img
            src={activeItem.url}
            alt={activeItem.alt || activeItem.caption || `${alt} - Slide ${current + 1}`}
            loading={current === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full object-cover ${imgClassName}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Badges Overlays */}
      {badgeTopLeft && <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">{badgeTopLeft}</div>}
      
      {/* Top Right Counter Pill */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
        {badgeTopRight}
        <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[10px] font-black text-amber-300 shadow-xs">
          {current + 1} / {total}
        </span>
      </div>

      {badgeBottom && <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">{badgeBottom}</div>}

      {/* Prev / Next Navigation Arrows (Touch target >= 44x44px) */}
      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Foto Sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              paginate(-1);
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/90 hover:text-white transition-opacity duration-200 opacity-0 group-hover/cardslider:opacity-100 focus:opacity-100 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#115E59] border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md transition-colors">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </span>
          </button>

          <button
            type="button"
            aria-label="Foto Selanjutnya"
            onClick={(e) => {
              e.stopPropagation();
              paginate(1);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/90 hover:text-white transition-opacity duration-200 opacity-0 group-hover/cardslider:opacity-100 focus:opacity-100 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#115E59] border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md transition-colors">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </button>
        </>
      )}

      {/* Bottom Indicator Dots */}
      {showIndicators && (
        <div className="absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
          {items.map((_, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={`indicator-${idx}`}
                type="button"
                aria-label={`Beralih ke foto ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpTo(idx);
                }}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 shadow-xs ${
                    isActive
                      ? 'w-5 h-1.5 bg-amber-400 ring-1 ring-white/50'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

