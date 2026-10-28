import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  X,
  Play,
  Pause,
  ArrowRight,
  Settings,
  ExternalLink
} from 'lucide-react';
import { HeroSlide, initialHeroSlides } from '../data/heroSlides';
import {
  SliderSettings,
  getSliderSettings,
  getHeroSlides,
  fetchHeroSlidesFromSupabase
} from '../lib/sliderSettings';
import { useAuth } from '../context/AuthContext';

export interface HeroSliderProps {
  slides?: HeroSlide[];
  settings?: SliderSettings;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides: propSlides,
  settings: propSettings,
}) => {
  const [storedSlides, setStoredSlides] = useState<HeroSlide[]>(getHeroSlides);

  const slides = useMemo(() => {
    return propSlides && propSlides.length > 0 ? propSlides : storedSlides;
  }, [propSlides, storedSlides]);

  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFlyer, setSelectedFlyer] = useState<HeroSlide | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Dynamic Slider Settings
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>(() => {
    return propSettings || getSliderSettings();
  });

  // Check Admin RBAC
  const { profile, role, isAuthenticated, hasRole } = useAuth();
  const isAdmin = Boolean(
    isAuthenticated &&
      (hasRole(['super_admin', 'pengurus_konten']) ||
        role === 'super_admin' ||
        role === 'pengurus_konten' ||
        profile?.role === 'super_admin' ||
        profile?.role === 'pengurus_konten')
  );

  // Sync slides and settings from remote Supabase / CustomEvent
  useEffect(() => {
    fetchHeroSlidesFromSupabase().then((remote) => {
      if (remote && remote.length > 0) {
        setStoredSlides(remote);
      }
    });

    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<SliderSettings>;
      if (customEvent.detail) {
        setSliderSettings(customEvent.detail);
      }
    };

    const handleSlidesChanged = (e: Event) => {
      const customEvent = e as CustomEvent<HeroSlide[]>;
      if (customEvent.detail) {
        setStoredSlides(customEvent.detail);
      }
    };

    window.addEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
    window.addEventListener('ppjm-hero-slides-changed', handleSlidesChanged);

    return () => {
      window.removeEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
      window.removeEventListener('ppjm-hero-slides-changed', handleSlidesChanged);
    };
  }, []);

  // Navigation handlers with circular wrap
  const next = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = useCallback(
    (index: number) => {
      if (total <= 1) return;
      setCurrent((index + total) % total);
      setProgress(0);
    },
    [total]
  );

  // Autoplay Loop with Smooth Progress Bar
  useEffect(() => {
    if (
      total <= 1 ||
      isPaused ||
      !sliderSettings.isAutoplayEnabled ||
      sliderSettings.autoplayInterval <= 0
    ) {
      return;
    }

    const duration = Math.max(sliderSettings.autoplayInterval * 1000, 2000);
    const intervalStep = 50;
    let elapsed = 0;

    const timer = window.setInterval(() => {
      elapsed += intervalStep;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        next();
        elapsed = 0;
      }
    }, intervalStep);

    return () => {
      clearInterval(timer);
    };
  }, [total, isPaused, next, current, sliderSettings]);

  // Touch Swipe Gesture for Native Mobile Ergonomics
  const touchStartXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    const diffTime = Date.now() - touchStartTimeRef.current;

    // Detect fast flick or meaningful drag
    const velocity = Math.abs(diffX) / Math.max(diffTime, 1);
    const threshold = velocity > 0.35 ? 35 : 60;

    if (diffX > threshold) {
      next();
    } else if (diffX < -threshold) {
      prev();
    }

    touchStartXRef.current = null;
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  // Current Active Slide Object
  const activeSlide = slides[current] || initialHeroSlides[0];

  // Helper to determine image source with fallback support
  const getImageSource = (slide: HeroSlide) => {
    if (failedImages[slide.id] && slide.fallbackImage) {
      return slide.fallbackImage;
    }
    return slide.image || slide.fallbackImage || initialHeroSlides[0].fallbackImage!;
  };

  return (
    <section
      aria-label="Carousel Banner Utama PPJM"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden focus:outline-none select-none"
    >
      {/* ===================================================================== */}
      {/* MAIN CAROUSEL STAGE                                                   */}
      {/* Mobile: min-h-[500px] or aspect-[4/5]                                 */}
      {/* Tablet & Desktop: aspect-[16/7] to aspect-[21/9]                      */}
      {/* ===================================================================== */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[500px] xs:min-h-[520px] sm:min-h-[460px] md:min-h-[480px] lg:h-[480px] xl:h-[520px] 2xl:h-[560px] overflow-hidden bg-zinc-950 flex items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* 1. Backdrop Background Image with Ken Burns Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={getImageSource(activeSlide)}
                alt={activeSlide.title || 'Flyer Banner PPJM'}
                loading={current === 0 ? 'eager' : 'lazy'}
                fetchPriority={current === 0 ? 'high' : 'auto'}
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }));
                }}
                className="w-full h-full object-cover object-center scale-100 animate-ken-burns transition-transform duration-[7000ms] ease-out pointer-events-none"
                style={{
                  transform: 'scale(1.05)',
                  animation: 'kenBurns 7s ease-out infinite alternate',
                }}
              />

              {/* 2. Modern Lux Multi-Layer Gradients for Superior Legibility */}
              {/* Deep Emerald / Dark Theme Scrim Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/95 via-black/75 sm:via-black/60 to-black/35 sm:to-black/20`}
              />
              {/* Bottom Scrim specifically for mobile text contrast */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 sm:h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
              {/* Radial Ambient Glow */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            </div>

            {/* 3. Hero Content Layout (Split Layout on Desktop, Vertical Stack on Mobile) */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-end sm:items-center justify-between pb-16 sm:pb-0 gap-6 sm:gap-8">
              {/* Left Column: Typography & CTAs */}
              <div className="w-full sm:max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
                {/* Category Badge Pill */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/20 text-white shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase">
                    {activeSlide.badge}
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                  className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]"
                >
                  {activeSlide.title}
                </motion.h1>

                {/* Short Description */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                  className="text-xs sm:text-sm lg:text-base text-zinc-200/90 max-w-xl font-normal leading-relaxed line-clamp-2 sm:line-clamp-3"
                >
                  {activeSlide.desc}
                </motion.p>

                {/* CTA Buttons & Lightbox Trigger */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.45 }}
                  className="flex items-center gap-3 pt-1 sm:pt-2 flex-wrap"
                >
                  {/* Primary Action Button */}
                  <Link
                    to={activeSlide.link || '/jm-center/sambutan'}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/40 active:scale-95 transition-all duration-150 cursor-pointer border border-emerald-400/30"
                  >
                    <span>{activeSlide.btnText || 'Jelajahi Profil'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* View Full Flyer Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedFlyer(activeSlide)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer shadow-md"
                    title="Lihat Flyer Lengkap"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Flyer Resmi</span>
                  </button>
                </motion.div>
              </div>

              {/* Right Column (Tablet & Desktop): Floating Visual Showcase Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden sm:block shrink-0"
              >
                <div
                  onClick={() => setSelectedFlyer(activeSlide)}
                  className="relative w-56 md:w-64 lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/80 bg-zinc-900 group cursor-pointer hover:border-emerald-400/60 hover:scale-102 transition-all duration-300"
                >
                  <img
                    src={getImageSource(activeSlide)}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold tracking-tight truncate">Klik untuk Perbesar</span>
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ===================================================================== */}
        {/* DESKTOP FLOATING ARROW CONTROLS                                       */}
        {/* ===================================================================== */}
        <div className="hidden sm:flex absolute inset-y-0 inset-x-4 items-center justify-between pointer-events-none z-20">
          <button
            type="button"
            onClick={prev}
            aria-label="Slide Sebelumnya"
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Slide Selanjutnya"
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* ===================================================================== */}
        {/* NATIVE MOBILE-FIRST BOTTOM NAVIGATION CONTROLS                        */}
        {/* Modern Pill Indicator Bar + Autoplay Pause Toggle                     */}
        {/* ===================================================================== */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-3 px-4 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-md">
            {slides.map((slide, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Buka slide ${idx + 1}: ${slide.title}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-8 bg-gradient-to-r from-emerald-400 to-amber-300 shadow-xs'
                      : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              );
            })}

            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Lanjutkan Rotasi Slide' : 'Hentikan Sementara Slide'}
              className="ml-1 p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
            </button>
          </div>
        </div>

        {/* Thin Animated Top/Bottom Edge Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FULLSCREEN FLYER MODAL LIGHTBOX                                       */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedFlyer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFlyer(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[92vh] bg-zinc-950 text-white rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-zinc-800"
            >
              {/* Modal Header */}
              <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    {selectedFlyer.badge}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">
                    {selectedFlyer.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFlyer(null)}
                  aria-label="Tutup Flyer"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full Image Box */}
              <div className="flex-1 bg-black overflow-y-auto p-2 flex items-center justify-center">
                <img
                  src={getImageSource(selectedFlyer)}
                  alt={selectedFlyer.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="text-xs text-zinc-400 text-center sm:text-left">
                  {selectedFlyer.desc}
                </p>

                <Link
                  to={selectedFlyer.link || '/jm-center/sambutan'}
                  onClick={() => setSelectedFlyer(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shrink-0"
                >
                  <span>{selectedFlyer.btnText || 'Buka Halaman'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSlider;

