import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  X, 
  Share2, 
  Sparkles,
  Settings,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Check
} from 'lucide-react';
import { HeroSlide, initialHeroSlides } from '../data/heroSlides';
import { 
  SliderSettings, 
  getSliderSettings, 
  saveSliderSettings, 
  DEFAULT_SLIDER_SETTINGS 
} from '../lib/sliderSettings';

interface HeroSliderProps {
  slides?: HeroSlide[];
  settings?: SliderSettings;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ 
  slides: propSlides,
  settings: propSettings
}) => {
  const slides = useMemo(() => {
    return propSlides && propSlides.length > 0 ? propSlides : initialHeroSlides;
  }, [propSlides]);

  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFlyer, setSelectedFlyer] = useState<HeroSlide | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Dynamic Slider Settings (Adjustable by Admin)
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>(() => {
    return propSettings || getSliderSettings();
  });
  const [showAdminSpeedModal, setShowAdminSpeedModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Check if admin is currently logged in or dev
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('ppjm_admin_logged_in') === 'true';
      setIsAdmin(loggedIn);
    }
  }, []);

  // Sync settings when external changes occur (custom event or prop)
  useEffect(() => {
    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<SliderSettings>;
      if (customEvent.detail) {
        setSliderSettings(customEvent.detail);
      } else {
        setSliderSettings(getSliderSettings());
      }
    };

    window.addEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
    window.addEventListener('storage', handleSettingsChanged);
    return () => {
      window.removeEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
      window.removeEventListener('storage', handleSettingsChanged);
    };
  }, []);
  
  // Touch & Mouse Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const isInteractingRef = useRef<boolean>(false);

  // Responsive Viewport Width
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  // Track prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track Viewport Resize (Passive)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers with circular wrap
  const next = useCallback(() => {
    if (total <= 1) return;
    setCurrent(prev => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    setCurrent(prev => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    if (total <= 1) return;
    setCurrent((index + total) % total);
    setProgress(0);
  }, [total]);

  // Autoplay Loop with Admin-defined speed (duration in ms)
  useEffect(() => {
    if (
      total <= 1 || 
      prefersReducedMotion || 
      isPaused || 
      isInteractingRef.current ||
      !sliderSettings.isAutoplayEnabled ||
      sliderSettings.autoplayInterval <= 0
    ) {
      return;
    }

    const duration = Math.max(sliderSettings.autoplayInterval * 1000, 1500); // minimal 1.5s
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

    autoplayTimerRef.current = timer;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [total, prefersReducedMotion, isPaused, next, current, sliderSettings]);

  // Auto-pause when Tab is inactive
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Touch and Mouse Drag Gestures with Inertia
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    isInteractingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    dragStartTimeRef.current = Date.now();
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartXRef.current;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || dragStartXRef.current === null) return;
    const elapsed = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(dragOffset) / Math.max(elapsed, 1);
    const threshold = velocity > 0.4 ? 30 : 60;

    if (dragOffset < -threshold) {
      next();
    } else if (dragOffset > threshold) {
      prev();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    dragStartXRef.current = null;
    isInteractingRef.current = false;
  };

  // Mouse drag support for desktop/trackpads
  const handleMouseDown = (e: React.MouseEvent) => {
    if (total <= 1) return;
    isInteractingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = Date.now();
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartXRef.current === null) return;
    const elapsed = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(dragOffset) / Math.max(elapsed, 1);
    const threshold = velocity > 0.4 ? 35 : 70;

    if (dragOffset < -threshold) {
      next();
    } else if (dragOffset > threshold) {
      prev();
    }

    setIsDragging(false);
    setDragOffset(0);
    dragStartXRef.current = null;
    isInteractingRef.current = false;
  };

  // Keyboard Navigation: ArrowLeft, ArrowRight, Home, End
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (total <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(total - 1);
    }
  };

  // Trigger modal preview or custom link
  const handleCardAction = (slide: HeroSlide) => {
    if (slide.link) {
      window.open(slide.link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedFlyer(slide);
    }
  };

  // Share flyer link
  const handleShareFlyer = (slide: HeroSlide) => {
    if (navigator.share) {
      navigator.share({
        title: slide.title,
        text: slide.desc,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Tautan informasi flyer berhasil disalin!');
    }
  };

  // Admin: Update & Save slider settings
  const handleUpdateSettings = (partial: Partial<SliderSettings>) => {
    const updated = { ...sliderSettings, ...partial };
    setSliderSettings(updated);
    saveSliderSettings(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2000);
  };

  // Calculate Layout Dimensions by Breakpoint
  const isDesktop = viewportWidth >= 1024;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  // Max visible cards count based on breakpoint and total available
  const visibleSlots = isDesktop ? 5 : isTablet ? 3 : 1;
  const maxOffset = Math.min(Math.floor(visibleSlots / 2), Math.floor((total - 1) / 2));

  // Determine transforms & 3D styling for each offset relative to current active
  const getCardStyle = (offset: number) => {
    const absOffset = Math.abs(offset);
    const transSpeed = sliderSettings.transitionSpeed || 600;

    // If reduced motion is preferred, use flat 2D layout without perspective
    if (prefersReducedMotion) {
      const isVisible = absOffset <= maxOffset;
      return {
        transform: `translate(-50%, -50%) scale(${offset === 0 ? 1 : 0.85})`,
        opacity: offset === 0 ? 1 : isVisible ? 0.6 : 0,
        zIndex: offset === 0 ? 30 : 20 - absOffset,
        pointerEvents: offset === 0 ? ('auto' as const) : isVisible ? ('auto' as const) : ('none' as const),
        visibility: isVisible ? ('visible' as const) : ('hidden' as const),
        transition: `opacity ${transSpeed}ms ease, transform ${transSpeed}ms ease`
      };
    }

    // In desktop view (>= 1024px): 5 cards visible (offset -2, -1, 0, 1, 2)
    if (isDesktop) {
      if (absOffset > 2 || absOffset > maxOffset) {
        return {
          transform: `translate(-50%, -50%) translateX(${offset > 0 ? 880 : -880}px) scale(0.6) translateZ(-200px)`,
          opacity: 0,
          zIndex: 0,
          pointerEvents: 'none' as const,
          visibility: 'hidden' as const
        };
      }

      let translateX = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 30;
      let rotateY = 0;
      let translateZ = 0;

      if (offset === 0) {
        translateX = dragOffset;
        scale = 1;
        opacity = 1;
        zIndex = 30;
        rotateY = dragOffset * 0.03;
        translateZ = 0;
      } else if (absOffset === 1) {
        translateX = (offset > 0 ? 380 : -380) + dragOffset * 0.75;
        scale = 0.85;
        opacity = 0.82;
        zIndex = 20;
        rotateY = offset > 0 ? -9 : 9;
        translateZ = -60;
      } else if (absOffset === 2) {
        translateX = (offset > 0 ? 660 : -660) + dragOffset * 0.5;
        scale = 0.72;
        opacity = 0.55;
        zIndex = 10;
        rotateY = offset > 0 ? -16 : 16;
        translateZ = -130;
      }

      return {
        transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        pointerEvents: 'auto' as const,
        visibility: 'visible' as const,
        transition: isDragging ? 'none' : `transform ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1)`
      };
    }

    // In tablet view (640 - 1023px): 3 cards visible (offset -1, 0, 1)
    if (isTablet) {
      if (absOffset > 1 || absOffset > maxOffset) {
        return {
          transform: `translate(-50%, -50%) translateX(${offset > 0 ? 460 : -460}px) scale(0.65) translateZ(-120px)`,
          opacity: 0,
          zIndex: 0,
          pointerEvents: 'none' as const,
          visibility: 'hidden' as const
        };
      }

      let translateX = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 30;
      let rotateY = 0;
      let translateZ = 0;

      if (offset === 0) {
        translateX = dragOffset;
        scale = 1;
        opacity = 1;
        zIndex = 30;
        rotateY = dragOffset * 0.04;
      } else {
        translateX = (offset > 0 ? 250 : -250) + dragOffset * 0.75;
        scale = 0.84;
        opacity = 0.75;
        zIndex = 20;
        rotateY = offset > 0 ? -7 : 7;
        translateZ = -45;
      }

      return {
        transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        pointerEvents: 'auto' as const,
        visibility: 'visible' as const,
        transition: isDragging ? 'none' : `transform ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1)`
      };
    }

    // In mobile view (< 640px): 1 card fit to screen
    const slideOffset = viewportWidth;
    if (absOffset > 1) {
      return {
        transform: `translate(-50%, -50%) translateX(${offset > 0 ? slideOffset * 1.5 : -slideOffset * 1.5}px)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        visibility: 'hidden' as const
      };
    }

    let translateX = 0;
    let opacity = 1;
    let zIndex = 30;

    if (offset === 0) {
      translateX = dragOffset;
      opacity = 1;
      zIndex = 30;
    } else {
      translateX = (offset > 0 ? slideOffset : -slideOffset) + dragOffset;
      opacity = 0.95;
      zIndex = 20;
    }

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}px)`,
      opacity,
      zIndex,
      pointerEvents: 'auto' as const,
      visibility: 'visible' as const,
      transition: isDragging ? 'none' : `transform ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${transSpeed}ms cubic-bezier(0.16, 1, 0.3, 1)`
    };
  };

  if (total === 0) return null;

  return (
    <section 
      id="home" 
      role="region"
      aria-roledescription="carousel"
      aria-label="Informasi Utama & Program Unggulan Pondok Pesantren Jauharul Maknuun"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full pt-2 pb-6 sm:pt-4 sm:pb-8 bg-[#071526] overflow-hidden select-none outline-none"
      onMouseEnter={() => {
        isInteractingRef.current = true;
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        isInteractingRef.current = false;
        setIsPaused(false);
      }}
    >
      {/* Background Ambience Pattern & Radial Glows */}
      <div className="absolute inset-0 dark-islamic-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Admin Quick Speed Control Badge (Discreet on top right) */}
      <div className="absolute top-3 right-3 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setShowAdminSpeedModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold backdrop-blur-md shadow-md transition-all cursor-pointer group"
          title="Atur Kecepatan Sliding (Pengaturan Admin)"
        >
          <Settings className="w-3.5 h-3.5 text-[#ffcc00] group-hover:rotate-45 transition-transform" />
          <span className="text-[11px] font-mono">
            {sliderSettings.isAutoplayEnabled ? `${sliderSettings.autoplayInterval}s` : 'Manual'}
          </span>
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 relative z-10">
        
        {/* Carousel Viewport Container with 3D Perspective */}
        <div 
          ref={containerRef}
          className="relative w-full h-[230px] xs:h-[270px] sm:h-[370px] md:h-[450px] lg:h-[530px] xl:h-[570px] overflow-x-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ 
            perspective: prefersReducedMotion ? 'none' : '1200px',
            WebkitTapHighlightColor: 'transparent'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {slides.map((slide, index) => {
            // Calculate circular offset
            let offset = index - current;
            while (offset > total / 2) offset -= total;
            while (offset < -total / 2) offset += total;

            const isActive = offset === 0;
            const style = getCardStyle(offset);
            const isImageLoaded = loadedImages[slide.id];
            const hasImageError = imageErrors[slide.id];

            return (
              <div
                key={slide.id || index}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} dari ${total}: ${slide.title}`}
                aria-hidden={!isActive}
                style={style}
                onClick={() => {
                  if (Math.abs(dragOffset) < 10) {
                    if (isActive) {
                      handleCardAction(slide);
                    } else {
                      goToSlide(index);
                    }
                  }
                }}
                className={`absolute top-1/2 left-1/2 w-full sm:w-[600px] md:w-[720px] lg:w-[860px] xl:w-[940px] max-w-full aspect-[16/9] rounded-none sm:rounded-3xl overflow-hidden transform-gpu will-change-transform ${
                  isActive 
                    ? 'ring-1 ring-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.3)]' 
                    : 'ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer hover:brightness-105'
                }`}
              >
                {/* 1. Skeleton Shimmer Placeholder while Loading */}
                {!isImageLoaded && !hasImageError && (
                  <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center z-0">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#d4af37] animate-spin" />
                  </div>
                )}

                {/* 2. Main Sharp Flyer Image Layer */}
                {!hasImageError ? (
                  <img
                    src={slide.image}
                    alt={slide.title || `Flyer ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [slide.id]: true }))}
                    onError={() => setImageErrors(prev => ({ ...prev, [slide.id]: true }))}
                    className="w-full h-full object-cover rounded-none sm:rounded-3xl select-none pointer-events-none transition-opacity duration-300"
                  />
                ) : (
                  /* Fallback Dark Islamic Background on Image Error */
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0b3d21] via-slate-900 to-black flex items-center justify-center p-6 text-center rounded-none sm:rounded-3xl">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-[#d4af37]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold uppercase text-[#d4af37] tracking-wider">Pondok Pesantren Jauharul Maknuun</p>
                    </div>
                  </div>
                )}

                {/* 3. Subtle Dimming on Inactive Cards */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/45 pointer-events-none rounded-none sm:rounded-3xl transition-opacity duration-300" />
                )}

                {/* 4. Title & Badge Overlay Layer (Tampil untuk masing-masing card slider) */}
                <div className={`absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-300 z-10 ${
                  isActive 
                    ? 'bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 sm:pt-20 pb-4 sm:pb-6 px-4 sm:px-7' 
                    : 'bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 sm:pt-14 pb-3 sm:pb-4 px-3 sm:px-5'
                }`}>
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                      isActive 
                        ? 'bg-[#1a6b3c]/90 text-emerald-200 border border-emerald-400/40 backdrop-blur-xs' 
                        : 'bg-black/70 text-amber-300 border border-white/20 backdrop-blur-xs'
                    }`}>
                      <Sparkles className="w-3 h-3 text-[#ffcc00]" />
                      <span className="truncate max-w-[180px] sm:max-w-none">{slide.badge}</span>
                    </span>
                    {isActive && slide.tag && (
                      <span className="hidden sm:inline-block text-[11px] text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        {slide.tag}
                      </span>
                    )}
                  </div>
                  <h4 className={`font-black text-white tracking-tight leading-tight drop-shadow-md truncate ${
                    isActive 
                      ? 'text-sm sm:text-lg md:text-xl lg:text-2xl' 
                      : 'text-xs sm:text-sm md:text-base text-gray-200'
                  }`}>
                    {slide.title}
                  </h4>
                  {isActive && slide.desc && (
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 font-normal line-clamp-1 sm:line-clamp-2 mt-1 drop-shadow-sm max-w-2xl hidden sm:block">
                      {slide.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Indicators (Centered & Minimalist) */}
        {total > 1 && (
          <div className="flex items-center justify-center pt-2 sm:pt-3 pb-1">
            <div className="flex items-center gap-1.5">
              {slides.map((slide, i) => {
                const isActiveDot = i === current;
                return (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    className="p-1 cursor-pointer flex items-center justify-center focus:outline-hidden group"
                    aria-label={`Pindah ke slide ${i + 1}: ${slide.title}`}
                    aria-current={isActiveDot ? 'true' : 'false'}
                  >
                    <span
                      className={`relative block h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300 ${
                        isActiveDot 
                          ? 'w-7 sm:w-9 bg-white/30 ring-1 ring-white/40' 
                          : 'w-2 sm:w-2.5 bg-white/30 group-hover:bg-white/60'
                      }`}
                    >
                      {isActiveDot && !isPaused && !prefersReducedMotion && sliderSettings.isAutoplayEnabled && (
                        <span 
                          className="absolute inset-y-0 left-0 bg-[#ffcc00] rounded-full transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                      {isActiveDot && (isPaused || prefersReducedMotion || !sliderSettings.isAutoplayEnabled) && (
                        <span className="absolute inset-0 bg-[#ffcc00] rounded-full" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= ADMIN QUICK SPEED CONTROLLER MODAL ================= */}
      {showAdminSpeedModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowAdminSpeedModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Kecepatan Slider Beranda
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Atur durasi pergantian & efek gerakan slide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminSpeedModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Preset Durasi Cepat */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Durasi Tampil per Slide:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                  {sliderSettings.autoplayInterval} Detik
                </span>
              </label>

              {/* Slider Range */}
              <input 
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={sliderSettings.autoplayInterval}
                onChange={(e) => handleUpdateSettings({ autoplayInterval: parseFloat(e.target.value) })}
                className="w-full accent-[#1a6b3c] cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: '3s (Cepat)', val: 3 },
                  { label: '5.5s (Standar)', val: 5.5 },
                  { label: '8s (Santai)', val: 8 },
                  { label: '12s (Lambat)', val: 12 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleUpdateSettings({ autoplayInterval: item.val })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      sliderSettings.autoplayInterval === item.val
                        ? 'bg-[#1a6b3c] text-white border-[#1a6b3c] shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Efek Kecepatan Transisi Animasi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Kecepatan Animasi Transisi:</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                  {sliderSettings.transitionSpeed} ms
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Cepat (350ms)', val: 350 },
                  { label: 'Halus (600ms)', val: 600 },
                  { label: 'Sinematik (1000ms)', val: 1000 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleUpdateSettings({ transitionSpeed: item.val })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      sliderSettings.transitionSpeed === item.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Saklar Autoplay Otomatis */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                {sliderSettings.isAutoplayEnabled ? (
                  <Play className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Pause className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-xs font-bold text-gray-800">
                  Putar Slide Otomatis (Autoplay)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateSettings({ isAutoplayEnabled: !sliderSettings.isAutoplayEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sliderSettings.isAutoplayEnabled ? 'bg-[#1a6b3c]' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sliderSettings.isAutoplayEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Success Feedback & Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setSliderSettings(DEFAULT_SLIDER_SETTINGS);
                  saveSliderSettings(DEFAULT_SLIDER_SETTINGS);
                }}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Standar</span>
              </button>

              <div className="flex items-center gap-2">
                {saveSuccessMsg && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Tersimpan!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowAdminSpeedModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= FULL-SIZE FLYER MODAL ================= */}
      {selectedFlyer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedFlyer(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img 
                src={selectedFlyer.image} 
                alt={selectedFlyer.title} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedFlyer(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-lg cursor-pointer"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-xs font-bold border border-emerald-500/30">
                {selectedFlyer.badge}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {selectedFlyer.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {selectedFlyer.desc}
              </p>

              {selectedFlyer.tagline && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-amber-900 font-medium">
                  💡 {selectedFlyer.tagline}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleShareFlyer(selectedFlyer)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Bagikan Informasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFlyer(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1a6b3c] text-white text-xs font-bold hover:bg-[#0d4a28] transition-colors cursor-pointer shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
