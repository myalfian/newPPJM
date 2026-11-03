import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PUBLIC_NAV_TABS, NavTabItem } from '../../data/navigationData';
import { GuestButton } from '../auth/GuestButton';

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
    if (tab.id === 'agenda' || tab.id === 'karya-siswa') return location.pathname.startsWith('/karya-siswa') || location.pathname.startsWith('/agenda');
    return false;
  };

  return (
    <>
      {/* 1. TOP NEWS TICKER (Light Matcha/Gold Tone matching screenshot) */}
      <div id="topNewsTicker" className="bg-[#d4af37]/15 border-b border-[#d4af37]/30 py-1.5 px-4 overflow-hidden hidden md:flex items-center text-xs">
        <div className="bg-[#1a6b3c] text-white font-bold px-3 py-1 rounded-md text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>INFO TERKINI</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-ticker text-[#0d4a28] font-medium inline-block space-x-6">
            <Link to="/spmb" className="hover:underline font-bold">✨ Pendaftaran SPMB (Sistem Penerimaan Murid Baru) TP 2026/2027 telah dibuka!</Link>
            <span>|</span>
            <span>🏆 Pondok Pesantren Jauharul Maknuun Resmi Meraih Akreditasi &quot;A&quot; BAN-PDM</span>
            <span>|</span>
            <span>📖 Program Unggulan: Tahfidz 30 Juz Bersanad, Madrasah Diniyah Salafiyah, &amp; Pendidikan Terpadu</span>
            <span>|</span>
            <span>🔬 Laboratorium Komputer Modern &amp; Kurikulum Riset STEM Santri Terpadu</span>
            <span>|</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-medsos-modal'))}
              className="hover:underline cursor-pointer font-bold text-emerald-800 inline-flex items-center gap-1"
            >
              <span>📲 WhatsApp Admin &amp; Medsos Resmi: +62 856-4619-9273</span>
            </button>
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


            {/* Desktop Navigation: 9 Pillars Equal Width & Uniform Horizontal Distribution */}
            <div className="relative hidden lg:block" onMouseLeave={() => setHoveredTab(null)}>
              <nav
                className="grid grid-cols-9 items-center h-[56px] xl:h-[60px] p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-1 shrink-0 w-[720px] xl:w-[850px] 2xl:w-[940px]"
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

            {/* Right Side: Guest / Account pill (always visible, all viewports) */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 shrink-0">
              <GuestButton />
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
