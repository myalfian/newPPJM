import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap } from 'lucide-react';
import { PUBLIC_NAV_TABS, NavTabItem } from '../../data/navigationData';
import { UserMenu } from './UserMenu';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useCachedQuery } from '../../lib/queryCache';

export interface TickerItem {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  slug?: string;
  is_featured?: boolean;
}

const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  {
    id: 'default-spmb',
    title: '✨ Pendaftaran SPMB (Sistem Penerimaan Murid Baru) TP 2026/2027 telah dibuka!',
    excerpt: '/spmb',
    category: 'Pengumuman',
    is_featured: true,
  },
  {
    id: 'default-akreditasi',
    title: '🏆 Pondok Pesantren Jauharul Maknuun Resmi Meraih Akreditasi "A" BAN-PDM',
    excerpt: '/jm-center',
    category: 'Prestasi',
    is_featured: true,
  },
  {
    id: 'default-program',
    title: '📖 Program Unggulan: Tahfidz 30 Juz Bersanad, Madrasah Diniyah Salafiyah, & Pendidikan Terpadu',
    excerpt: '/program',
    category: 'Akademik',
  },
  {
    id: 'default-stem',
    title: '🔬 Laboratorium Komputer Modern & Kurikulum Riset STEM Santri Terpadu',
    excerpt: '/stem',
    category: 'Akademik',
  },
  {
    id: 'default-kontak',
    title: '📲 WhatsApp Admin & Medsos Resmi: +62 856-4619-9273',
    excerpt: 'medsos-modal',
    category: 'Kontak',
  },
];

interface NavbarProps {

  onOpenMobileMenu?: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, userName }) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const location = useLocation();

  // Active User Name with Default "Guest"
  const [currentUserName, setCurrentUserName] = useState<string>(() => {
    if (userName && userName.trim()) return userName;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ppjm_user_name');
      if (stored && stored.trim()) return stored;
    }
    return 'Guest';
  });

  useEffect(() => {
    if (userName && userName.trim()) {
      setCurrentUserName(userName);
    }
  }, [userName]);

  // Navigation Items with Android App-style Colorful Badges (Single Source of Truth)
  const navTabs = PUBLIC_NAV_TABS;

  const isTabActive = (tab: NavTabItem) => {
    if (tab.id === 'jm-center') return location.pathname.startsWith('/jm-center');
    if (tab.id === 'programs') return location.pathname.startsWith('/program');
    if (tab.id === 'smart-jm') return location.pathname.startsWith('/smart-jm') || location.pathname.startsWith('/stem');
    if (tab.id === 'prestasi') return location.pathname.startsWith('/prestasi');
    if (tab.id === 'ekskul') return location.pathname.startsWith('/ekstrakurikuler') || location.pathname.startsWith('/ekskul');
    if (tab.id === 'osis') return location.pathname === '/osis';
    if (tab.id === 'jm-news') {
      return (
        location.pathname.startsWith('/jm-news') ||
        location.pathname.startsWith('/berita') ||
        location.hash === '#warta-berita'
      );
    }
    if (tab.id === 'galeri') return location.pathname.startsWith('/galeri');
    if (tab.id === 'karya-siswa') return location.pathname.startsWith('/karya-siswa');
    if (tab.id === 'agenda') return location.pathname.startsWith('/agenda');
    return false;
  };

  // Fetch dynamic Info Terkini Ticker from Supabase with instant SWR cache
  const { data: rawTickerItems, refetch: refetchTicker } = useCachedQuery<TickerItem[]>(
    'navbar-info-terkini-ticker',
    async () => {
      if (!isSupabaseConfigured()) return DEFAULT_TICKER_ITEMS;
      const { data, error } = await (supabase as any)
        .from('info_terkini')
        .select('id, title, category, excerpt, slug, is_featured')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(15);

      if (error || !data || data.length === 0) {
        return DEFAULT_TICKER_ITEMS;
      }
      return data as unknown as TickerItem[];
    },
    DEFAULT_TICKER_ITEMS,
    60 * 1000
  );

  const tickerItems = rawTickerItems && rawTickerItems.length > 0 ? rawTickerItems : DEFAULT_TICKER_ITEMS;

  // Real-time synchronization when editor updates Info Terkini in CMS
  useEffect(() => {
    const handleTickerRefresh = () => {
      refetchTicker();
    };
    window.addEventListener('ppjm-ticker-refresh', handleTickerRefresh);
    return () => window.removeEventListener('ppjm-ticker-refresh', handleTickerRefresh);
  }, [refetchTicker]);

  const renderTickerEntry = (item: TickerItem, keySuffix: string) => {
    const target = item.excerpt?.trim();
    const isMedsosModal = target === 'medsos-modal' || item.title.includes('WhatsApp Admin');
    const isInternalLink = target?.startsWith('/');
    const isExternalLink = target?.startsWith('http://') || target?.startsWith('https://');
    const isSlugLink = !target && item.slug && item.slug.trim().length > 0;

    const labelBadge = item.is_featured ? (
      <span className="bg-amber-500/25 text-amber-900 border border-amber-500/40 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider mr-1.5 shrink-0">
        Utama
      </span>
    ) : item.category && item.category !== 'Umum' ? (
      <span className="bg-[#1a6b3c]/20 text-[#073b22] px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider mr-1.5 shrink-0">
        {item.category}
      </span>
    ) : null;

    const textContent = (
      <span className="inline-flex items-center">
        {labelBadge}
        <span className={item.is_featured ? 'font-bold text-[#073b22]' : 'font-medium'}>
          {item.title}
        </span>
      </span>
    );

    if (isMedsosModal) {
      return (
        <button
          key={`${item.id}-${keySuffix}`}
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-medsos-modal'))}
          className="hover:underline cursor-pointer font-bold text-emerald-800 inline-flex items-center hover:text-emerald-950 transition-colors"
          title="Buka Kontak & Media Sosial Resmi"
        >
          {textContent}
        </button>
      );
    }

    if (isInternalLink && target) {
      return (
        <Link
          key={`${item.id}-${keySuffix}`}
          to={target}
          className="hover:underline font-bold text-[#0d4a28] hover:text-[#073b22] inline-flex items-center transition-colors"
        >
          {textContent}
        </Link>
      );
    }

    if (isExternalLink) {
      return (
        <a
          key={`${item.id}-${keySuffix}`}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-bold text-[#0d4a28] hover:text-[#073b22] inline-flex items-center transition-colors"
        >
          {textContent}
        </a>
      );
    }

    if (isSlugLink) {
      return (
        <Link
          key={`${item.id}-${keySuffix}`}
          to={`/jm-news?detail=${encodeURIComponent(item.slug!)}`}
          className="hover:underline font-medium text-[#0d4a28] hover:text-[#073b22] inline-flex items-center transition-colors"
        >
          {textContent}
        </Link>
      );
    }

    return (
      <span key={`${item.id}-${keySuffix}`} className="inline-flex items-center">
        {textContent}
      </span>
    );
  };

  return (
    <>
      {/* 1. TOP NEWS TICKER (Dynamic CMS Running Ticker with Smooth Hover Pause) */}
      <div
        id="topNewsTicker"
        className="bg-[#d4af37]/15 border-b border-[#d4af37]/30 py-1.5 px-3 sm:px-4 overflow-hidden flex items-center text-xs select-none"
        aria-label="Warta Berjalan Info Terkini"
      >
        <div className="bg-[#1a6b3c] text-white font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-2 sm:mr-3 shadow-xs">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#d4af37] animate-pulse" />
          <span className="font-extrabold tracking-wider">INFO TERKINI</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full group">
          <div className="animate-ticker text-[#0d4a28] font-medium inline-flex items-center space-x-6 group-hover:[animation-play-state:paused]">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={`ticker-1-${item.id}-${idx}`}>
                {renderTickerEntry(item, `t1-${idx}`)}
                <span className="text-[#1a6b3c]/40 select-none">|</span>
              </React.Fragment>
            ))}
            {/* Seamless loop duplication */}
            {tickerItems.map((item, idx) => (
              <React.Fragment key={`ticker-2-${item.id}-${idx}`}>
                {renderTickerEntry(item, `t2-${idx}`)}
                <span className="text-[#1a6b3c]/40 select-none">|</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Dribbble Modern Floating Pill Animation Bar) */}
      <header
        id="mainHeader"
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300"
      >
        <div className="w-full max-w-[1536px] mx-auto px-2 xs:px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 lg:gap-5 xl:gap-7 2xl:gap-9 py-1 xs:py-1.5 sm:py-2 min-h-[56px] xs:min-h-[62px] sm:min-h-[72px] lg:min-h-[80px]">

            {/* Brand Logo & Title */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 group shrink-0 select-none"
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              {/* Google Gemini Animated Border Glow Logo Wrapper - Height Matched with Text Block */}
              <div className="relative w-[38px] h-[38px] min-w-[38px] min-h-[38px] max-w-[38px] max-h-[38px] xs:w-[42px] xs:h-[42px] xs:min-w-[42px] xs:min-h-[42px] xs:max-w-[42px] xs:max-h-[42px] sm:w-[48px] sm:h-[48px] sm:min-w-[48px] sm:min-h-[48px] sm:max-w-[48px] sm:max-h-[48px] lg:w-[52px] lg:h-[52px] lg:min-w-[52px] lg:min-h-[52px] lg:max-w-[52px] lg:max-h-[52px] rounded-full p-[1.5px] xs:p-[2px] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shrink-0 flex-none aspect-square">
                {/* 1. Soft Ambient Halo Aura */}
                <div className="gemini-ambient-aura rounded-full" aria-hidden="true">
                  <div className="gemini-beam-sweep" />
                </div>

                {/* 2. Sharp 2px Animated Glowing Border Frame */}
                <div className="gemini-border-glow-frame rounded-full" aria-hidden="true">
                  <div className="gemini-beam-sweep" />
                </div>

                {/* 3. Solid White Inner Container with Logo Image */}
                <div className="relative z-10 w-full h-full min-w-full min-h-full max-w-full max-h-full aspect-square rounded-full overflow-hidden bg-white shadow-xs flex items-center justify-center shrink-0 flex-none">
                  <img
                    src="/logo.jpg"
                    alt="Logo Pondok Pesantren Jauharul Maknuun"
                    width="52"
                    height="52"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full min-w-full min-h-full max-w-full max-h-full object-cover rounded-full block shrink-0 flex-none select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                    }}
                  />
                </div>
              </div>

              {/* Text Block: Exact Height Lock with Logo (h-[38px] xs:h-[42px] sm:h-[48px] lg:h-[52px]) */}
              <div className="h-[38px] xs:h-[42px] sm:h-[48px] lg:h-[52px] flex flex-col justify-between py-[0.5px] sm:py-[1px] select-none leading-none">
                <span className="font-extrabold text-[9.5px] xs:text-[10px] sm:text-[11px] lg:text-[11.5px] tracking-wider text-[#0d4a28] uppercase leading-none block">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-[14.5px] xs:text-[16px] sm:text-[18.5px] lg:text-[20.5px] tracking-tight text-[#d4af37] leading-none whitespace-nowrap block">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9.5px] xs:text-[10px] sm:text-[10.5px] lg:text-[11px] text-slate-500 font-semibold leading-none hidden sm:block">
                  Lasem Sidayu Gresik - Jawa Timur
                </span>
              </div>
            </Link>


            {/* Desktop Navigation: Synchronized with Mobile Viewport (10 Pillars Equal Width) */}
            <div className="relative hidden lg:block" onMouseLeave={() => setHoveredTab(null)}>
              <nav
                style={{ gridTemplateColumns: `repeat(${navTabs.length}, minmax(0, 1fr))` }}
                className="grid items-center h-[56px] xl:h-[60px] p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-1 shrink-0 w-[790px] xl:w-[930px] 2xl:w-[1040px]"
              >
                {navTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = isTabActive(tab);
                  const isHovered = hoveredTab === tab.id;

                  return (
                    <div
                      key={tab.id}
                      className="relative h-full w-full flex items-center justify-center"
                      onMouseEnter={() => setHoveredTab(tab.id)}
                    >
                      {/* Direct Page Navigation Link: Both Icon Badge and Menu Label Fit Comfortably Inside Container */}
                      <Link
                        to={tab.href}
                        onClick={(e) => {
                          if (tab.href.startsWith('/#')) {
                            if (location.pathname === '/') {
                              e.preventDefault();
                              const targetId = tab.href.replace('/#', '');
                              const el = document.getElementById(targetId);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState(null, '', tab.href);
                              }
                            }
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                          setHoveredTab(null);
                        }}
                        className="relative z-10 w-full h-full px-1 py-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer group"
                      >
                        {/* Compact Android-style Colorful Icon Badge */}
                        <div
                          className={`w-6 h-6 xl:w-6.5 xl:h-6.5 rounded-lg flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shrink-0 ${
                            isActive
                              ? tab.color.activeBadgeBg
                              : tab.color.badgeBg
                          }`}
                        >
                          <TabIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 shrink-0" />
                        </div>

                        {/* Menu Label: Centered, Bold & Crisp Inside the Capsule Card */}
                        <div className="w-full text-center px-0.5 mt-1 leading-none">
                          <span
                            className={`block text-[10.5px] xl:text-[11.5px] 2xl:text-[12.5px] font-black tracking-tight truncate leading-none transition-colors duration-200 ${
                              isActive
                                ? tab.color.activeText
                                : 'text-slate-700 group-hover:text-slate-950'
                            }`}
                          >
                            {tab.label}
                          </span>
                        </div>
                      </Link>

                      {/* Fluid Sliding Pill Indicator (Active or Hovered) */}
                      {isHovered && (
                        <motion.div
                          layoutId="nav-capsule-indicator"
                          className="absolute inset-0.5 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/90 z-0 pointer-events-none"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}

                      {isActive && !isHovered && !hoveredTab && (
                        <motion.div
                          layoutId="nav-capsule-indicator"
                          className="absolute inset-0.5 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200/80 z-0 pointer-events-none"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right Side: SPMB Button & User Menu / Account pill */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 shrink-0">
              <Link
                to="/spmb"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#0f5132] to-[#126b3c] hover:from-[#0d452b] hover:to-[#0f5132] shadow-xs border border-emerald-600/40 transition-all hover:scale-105 select-none"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>SPMB 2026</span>
              </Link>
              <UserMenu variant="pill" />
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
