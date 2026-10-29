import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Share2, 
  Sparkles,
  Settings,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Check,
  Layers,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link as LinkIcon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { HeroSlide } from '../data/heroSlides';
import { 
  SliderSettings, 
  getSliderSettings, 
  saveSliderSettings, 
  DEFAULT_SLIDER_SETTINGS,
  getHeroSlides,
  fetchHeroSlidesFromSupabase,
  saveHeroSlides,
  resetHeroSlidesToDefault
} from '../lib/sliderSettings';
import { compressImageToWebP } from '../lib/imageCompressor';
import { useAuth } from '../context/AuthContext';

interface HeroSliderProps {
  slides?: HeroSlide[];
  settings?: SliderSettings;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ 
  slides: propSlides,
  settings: propSettings
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Dynamic Slider Settings (Adjustable by Admin)
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>(() => {
    return propSettings || getSliderSettings();
  });
  const [showAdminSpeedModal, setShowAdminSpeedModal] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState<'slides' | 'speed'>('slides');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Quick Slide Editor State inside HeroSlider Modal
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [quickForm, setQuickForm] = useState({
    id: '',
    badge: '',
    title: '',
    desc: '',
    image: '',
    link: '',
  });
  const [quickImageMode, setQuickImageMode] = useState<'upload' | 'url'>('upload');
  const [quickCompressing, setQuickCompressing] = useState(false);
  const quickFileInputRef = useRef<HTMLInputElement | null>(null);

  // Check if admin is currently logged in via RBAC profile
  const { profile, role, isAuthenticated, hasRole } = useAuth();
  const isAdmin = Boolean(
    isAuthenticated && 
    (hasRole(['super_admin', 'pengurus_konten']) || role === 'super_admin' || role === 'pengurus_konten' || profile?.role === 'super_admin' || profile?.role === 'pengurus_konten')
  );

  // Sync settings & slides when external changes occur (custom event, storage, or Supabase)
  useEffect(() => {
    fetchHeroSlidesFromSupabase().then((remote) => {
      setStoredSlides(remote);
    });

    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<SliderSettings>;
      if (customEvent.detail) {
        setSliderSettings(customEvent.detail);
      } else {
        setSliderSettings(getSliderSettings());
      }
    };

    const handleSlidesChanged = (e: Event) => {
      const customEvent = e as CustomEvent<HeroSlide[]>;
      if (customEvent.detail) {
        setStoredSlides(customEvent.detail);
      } else {
        setStoredSlides(getHeroSlides());
      }
    };

    const handleStorageEvent = () => {
      setSliderSettings(getSliderSettings());
      setStoredSlides(getHeroSlides());
    };

    window.addEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
    window.addEventListener('ppjm-hero-slides-changed', handleSlidesChanged);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('ppjm-slider-settings-changed', handleSettingsChanged);
      window.removeEventListener('ppjm-hero-slides-changed', handleSlidesChanged);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Ensure current slide index stays within bounds when slides are deleted
  useEffect(() => {
    if (current >= total && total > 0) {
      setCurrent(0);
    }
  }, [total, current]);
  
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

  // Dynamic Responsive Height for Desktop (from Navbar bottom to Footer top)
  const [desktopHeroHeight, setDesktopHeroHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateResponsiveDimensions = () => {
      setViewportWidth(window.innerWidth);

      if (window.innerWidth >= 1024) {
        // Measure real-time DOM heights of top navbar (ticker + header) and footer
        const tickerEl = document.getElementById('topNewsTicker');
        const headerEl = document.getElementById('mainHeader') || document.querySelector('header');
        const footerEl = document.getElementById('kontak-ppdb') || document.querySelector('footer');

        const tickerHeight = tickerEl ? tickerEl.getBoundingClientRect().height : 0;
        const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 68;
        const topBarHeight = tickerHeight + headerHeight;
        const footerHeight = footerEl ? footerEl.getBoundingClientRect().height : 80;

        // Exact responsive height available between top navbar and footer
        const available = Math.max(window.innerHeight - topBarHeight - footerHeight, 440);
        setDesktopHeroHeight(available);
      } else {
        setDesktopHeroHeight(null);
      }
    };

    calculateResponsiveDimensions();

    window.addEventListener('resize', calculateResponsiveDimensions, { passive: true });
    const timer = setTimeout(calculateResponsiveDimensions, 150);

    return () => {
      window.removeEventListener('resize', calculateResponsiveDimensions);
      clearTimeout(timer);
    };
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

  // Admin Quick Slide Content Handlers
  const handleQuickStartAdd = () => {
    setEditingSlideId(null);
    setQuickForm({
      id: `slide-${Date.now()}`,
      badge: '',
      title: '',
      desc: '',
      image: '',
      link: '',
    });
    setQuickImageMode('upload');
    setIsAddingSlide(true);
  };

  const handleQuickStartEdit = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setQuickForm({
      id: slide.id,
      badge: slide.badge || '',
      title: slide.title || '',
      desc: slide.desc || '',
      image: slide.image || '',
      link: slide.link || '',
    });
    setQuickImageMode(slide.image.startsWith('data:image/') ? 'upload' : 'url');
    setIsAddingSlide(true);
  };

  const handleQuickFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }
    setQuickCompressing(true);
    try {
      const res = await compressImageToWebP(file, 1400, 900, 0.82);
      setQuickForm(prev => ({ ...prev, image: res.dataUrl }));
    } catch (err: any) {
      alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setQuickCompressing(false);
    }
  };

  const handleQuickSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.badge.trim() || !quickForm.image.trim()) {
      alert('Mohon isi Badge/Kategori dan Gambar Flyer terlebih dahulu.');
      return;
    }
    const newSlide: HeroSlide = {
      id: quickForm.id || `slide-${Date.now()}`,
      badge: quickForm.badge.trim(),
      title: quickForm.title.trim(),
      desc: quickForm.desc.trim(),
      image: quickForm.image.trim(),
      link: quickForm.link.trim(),
      website: 'https://ppjauharulmaknuun.sch.id/',
    };

    const updated = editingSlideId
      ? slides.map(s => (s.id === editingSlideId ? { ...s, ...newSlide } : s))
      : [...slides, newSlide];

    setStoredSlides(updated);
    setIsAddingSlide(false);
    setEditingSlideId(null);
    await saveHeroSlides(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2000);
  };

  const handleQuickDeleteSlide = async (id: string) => {
    if (slides.length <= 1) {
      alert('Minimal harus ada 1 slide yang tampil.');
      return;
    }
    const updated = slides.filter(s => s.id !== id);
    setStoredSlides(updated);
    await saveHeroSlides(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2000);
  };

  const handleQuickMoveSlide = async (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setStoredSlides(updated);
    await saveHeroSlides(updated);
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
      const step1 = Math.min(Math.max(viewportWidth * 0.32, 420), 620);
      const step2 = Math.min(Math.max(viewportWidth * 0.58, 760), 1140);
      const stepHidden = Math.min(Math.max(viewportWidth * 0.80, 1000), 1500);

      if (absOffset > 2 || absOffset > maxOffset) {
        return {
          transform: `translate(-50%, -50%) translateX(${offset > 0 ? stepHidden : -stepHidden}px) scale(0.6) translateZ(-200px)`,
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
        translateX = (offset > 0 ? step1 : -step1) + dragOffset * 0.75;
        scale = 0.86;
        opacity = 0.82;
        zIndex = 20;
        rotateY = offset > 0 ? -9 : 9;
        translateZ = -60;
      } else if (absOffset === 2) {
        translateX = (offset > 0 ? step2 : -step2) + dragOffset * 0.5;
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
    const slideOffset = containerRef.current ? containerRef.current.clientWidth : viewportWidth;
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
      style={
        isDesktop && desktopHeroHeight 
          ? { height: `${desktopHeroHeight}px` } 
          : undefined
      }
      className="relative w-full pt-1 pb-1.5 xs:pb-2 sm:pt-2 sm:pb-3 lg:py-0 lg:h-[calc(100dvh-175px)] bg-[#071526] overflow-hidden select-none outline-none lg:flex lg:flex-col lg:justify-center transition-[height] duration-150"
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

      {/* Admin Quick Control Badge (Discreet on top right - Only visible to Admin) */}
      {isAdmin && (
        <div className="absolute top-2 right-2 xs:top-2.5 xs:right-3 sm:top-3 sm:right-6 z-40 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setAdminModalTab('slides');
              setShowAdminSpeedModal(true);
            }}
            className="inline-flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-500/40 text-[10px] xs:text-xs font-bold backdrop-blur-md shadow-md transition-all cursor-pointer"
            title="Kelola Konten Slide & Kecepatan HeroSlider"
          >
            <Layers className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#ffcc00]" />
            <span>Kelola Slide ({total})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAdminModalTab('speed');
              setShowAdminSpeedModal(true);
            }}
            className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[10px] xs:text-xs font-semibold backdrop-blur-md shadow-md transition-all cursor-pointer group"
            title="Atur Kecepatan Sliding (Pengaturan Admin)"
          >
            <Settings className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#ffcc00] group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] xs:text-[11px] font-mono">
              {sliderSettings.isAutoplayEnabled ? `${sliderSettings.autoplayInterval}s` : 'Manual'}
            </span>
          </button>
        </div>
      )}

      <div className="w-full max-w-full lg:max-w-[1700px] mx-auto px-2 xs:px-2.5 sm:px-4 relative z-10 lg:h-full lg:flex lg:flex-col lg:justify-between lg:py-2">
        
        {/* Carousel Viewport Container with 3D Perspective */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-[16/9] sm:aspect-auto sm:h-[370px] md:h-[450px] lg:h-[calc(100%-36px)] overflow-x-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ 
            perspective: prefersReducedMotion ? 'none' : '1400px',
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
                aria-label={`Slide ${index + 1} dari ${total}: ${slide.title || slide.badge}`}
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
                className={`absolute top-1/2 left-1/2 w-full h-full sm:w-[600px] sm:h-auto md:w-[720px] lg:w-auto lg:h-[94%] max-w-full lg:max-w-[92vw] aspect-[16/9] rounded-2xl xs:rounded-3xl transform-gpu will-change-transform ${
                  isActive 
                    ? 'z-30 cursor-pointer' 
                    : 'cursor-pointer hover:brightness-105'
                }`}
              >
                {/* 0. Ambient Google Gemini Aura Glow (Behind Active Card) */}
                {isActive && !prefersReducedMotion && (
                  <div 
                    className="gemini-ambient-aura-card rounded-2xl xs:rounded-3xl pointer-events-none" 
                    aria-hidden="true"
                  >
                    <div className="gemini-beam-sweep-slow" />
                  </div>
                )}

                {/* Inner Card Clip Container */}
                <div className={`relative w-full h-full rounded-2xl xs:rounded-3xl overflow-hidden ${
                  isActive 
                    ? 'shadow-[0_20px_50px_rgba(0,0,0,0.85)]' 
                    : 'ring-1 ring-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
                }`}>
                  {/* Google Gemini 2px Sharp Animated Border Glow Frame */}
                  {isActive && !prefersReducedMotion && (
                    <div 
                      className="gemini-border-glow-frame rounded-2xl xs:rounded-3xl pointer-events-none" 
                      aria-hidden="true"
                    >
                      <div className="gemini-beam-sweep-slow" />
                    </div>
                  )}

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
                      className="w-full h-full object-cover rounded-2xl xs:rounded-3xl select-none pointer-events-none transition-opacity duration-300"
                    />
                  ) : (
                    /* Fallback Dark Islamic Background on Image Error */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b3d21] via-slate-900 to-black flex items-center justify-center p-6 text-center rounded-2xl xs:rounded-3xl">
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
                    <div className="absolute inset-0 bg-black/45 pointer-events-none rounded-2xl xs:rounded-3xl transition-opacity duration-300" />
                  )}

                  {/* 4. Badge Floating Pill (Pojok Kiri Atas - Bersih Tanpa Title & Desc) */}
                  {slide.badge && (
                    <div className="absolute top-2.5 xs:top-3 sm:top-4 left-2.5 xs:left-3 sm:left-4 pointer-events-none transition-all duration-300 z-10">
                      <div className="flex items-center gap-1 xs:gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
                          isActive 
                            ? 'bg-[#0d4a28]/90 text-emerald-200 border border-emerald-400/40' 
                            : 'bg-black/75 text-amber-300 border border-white/20'
                        }`}>
                          <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-[#ffcc00]" />
                          <span className="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none">{slide.badge}</span>
                        </span>
                        {isActive && slide.tag && (
                          <span className="hidden sm:inline-block text-[11px] text-amber-300 font-bold bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md shadow-md">
                            {slide.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Indicators (Centered & Minimalist) */}
        {total > 1 && (
          <div className="flex items-center justify-center pt-1.5 xs:pt-2 sm:pt-3 pb-0.5 sm:pb-1 lg:py-0">
            <div className="flex items-center gap-1.5">
              {slides.map((slide, i) => {
                const isActiveDot = i === current;
                return (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    className="p-1 cursor-pointer flex items-center justify-center focus:outline-hidden group"
                    aria-label={`Pindah ke slide ${i + 1}: ${slide.title || slide.badge}`}
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

      {/* ================= ADMIN QUICK SLIDER & SPEED CONTROLLER MODAL ================= */}
      {isAdmin && showAdminSpeedModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowAdminSpeedModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-4 text-gray-900 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Kelola Hero Slider Beranda
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Isi konten flyer slide atau atur kecepatan putar otomatis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  to="/admin/slider"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                  title="Buka Halaman Editor Lengkap di Panel Admin"
                >
                  <span>Panel Penuh</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAdminSpeedModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Switcher: Konten Slide vs Kecepatan */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setAdminModalTab('slides')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  adminModalTab === 'slides'
                    ? 'bg-[#1a6b3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Konten Slide ({slides.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminModalTab('speed')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  adminModalTab === 'speed'
                    ? 'bg-[#1a6b3c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Kecepatan ({sliderSettings.autoplayInterval}s)</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {adminModalTab === 'slides' ? (
                <div className="space-y-3">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">
                      Daftar Kartu Flyer Aktif
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickStartAdd}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1a6b3c] hover:bg-[#0d4a28] text-white text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>

                  {/* Quick Add / Edit Form */}
                  {isAddingSlide && (
                    <form
                      onSubmit={handleQuickSaveSlide}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-emerald-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-950">
                          {editingSlideId ? 'Edit Slide' : 'Tambah Slide Baru'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSlide(false);
                            setEditingSlideId(null);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Pilih Mode Gambar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQuickImageMode('upload')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                              quickImageMode === 'upload'
                                ? 'bg-emerald-800 text-white'
                                : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Gambar (WebP)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickImageMode('url')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                              quickImageMode === 'url'
                                ? 'bg-emerald-800 text-white'
                                : 'bg-white border border-slate-200 text-slate-600'
                            }`}
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span>Link URL</span>
                          </button>
                        </div>

                        {quickImageMode === 'upload' ? (
                          <div>
                            <input
                              ref={quickFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleQuickFileUpload(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => quickFileInputRef.current?.click()}
                              disabled={quickCompressing}
                              className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-400 bg-white hover:bg-emerald-50/50 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {quickCompressing ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Mengompres WebP...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{quickForm.image ? 'Ganti File Gambar' : 'Pilih Gambar Flyer dari Perangkat'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <input
                            type="url"
                            value={quickForm.image.startsWith('data:image/') ? '' : quickForm.image}
                            onChange={(e) => setQuickForm({ ...quickForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Badge / Kategori <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={quickForm.badge}
                            onChange={(e) => setQuickForm({ ...quickForm, badge: e.target.value })}
                            placeholder="Misal: PSB 2025 / Program Unggulan"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Judul Slide (Opsional)
                          </label>
                          <input
                            type="text"
                            value={quickForm.title}
                            onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                            placeholder="Judul utama slide..."
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          Deskripsi Popup / Link Tujuan (Opsional)
                        </label>
                        <textarea
                          rows={2}
                          value={quickForm.desc}
                          onChange={(e) => setQuickForm({ ...quickForm, desc: e.target.value })}
                          placeholder="Deskripsi saat slide diklik..."
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs mb-1.5"
                        />
                        <input
                          type="text"
                          value={quickForm.link}
                          onChange={(e) => setQuickForm({ ...quickForm, link: e.target.value })}
                          placeholder="Link tujuan (opsional, misal https://wa.me/628...)"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSlide(false);
                            setEditingSlideId(null);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-600 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-[#1a6b3c] text-white text-xs font-bold cursor-pointer"
                        >
                          Simpan Slide
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Slide Items List */}
                  <div className="space-y-2">
                    {slides.map((s, idx) => (
                      <div
                        key={s.id || idx}
                        className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img
                            src={s.image}
                            alt={s.badge}
                            className="w-16 aspect-video rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block truncate">
                              #{idx + 1} • {s.badge}
                            </span>
                            <p className="text-xs font-extrabold text-slate-900 truncate">
                              {s.title || '(Tanpa judul teks)'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleQuickMoveSlide(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Geser Atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickMoveSlide(idx, 'down')}
                            disabled={idx === slides.length - 1}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Geser Bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStartEdit(s)}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                            title="Edit Slide"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDeleteSlide(s.id)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            title="Hapus Slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 1. Preset Durasi Cepat */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>Durasi Tampil per Slide:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                        {sliderSettings.autoplayInterval} Detik
                      </span>
                    </label>

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
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
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
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
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
                </div>
              )}
            </div>

            {/* Success Feedback & Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 shrink-0">
              {adminModalTab === 'slides' ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Kembalikan ke 5 Slide Standar PPJM?')) {
                      const defaults = await resetHeroSlidesToDefault();
                      setStoredSlides(defaults);
                      setSaveSuccessMsg(true);
                      setTimeout(() => setSaveSuccessMsg(false), 2000);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset 5 Slide Standar</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSliderSettings(DEFAULT_SLIDER_SETTINGS);
                    saveSliderSettings(DEFAULT_SLIDER_SETTINGS);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Kecepatan Standar</span>
                </button>
              )}

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

            {/* Modal Content & Action Buttons */}
            <div className="p-4 sm:p-5 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-3">
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
