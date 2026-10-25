import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  Menu,
  ChevronDown,
  User
} from 'lucide-react';
import { SearchModal } from './SearchModal';
import { PUBLIC_NAV_TABS, NavTabItem } from '../../data/navigationData';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, userName }) => {
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Items with Android App-style Colorful Badges (Single Source of Truth)
  const navTabs = PUBLIC_NAV_TABS;

  const isTabActive = (tab: NavTabItem) => {
    if (tab.id === 'jm-center') return location.pathname.startsWith('/jm-center');
    if (tab.id === 'programs') return location.pathname.startsWith('/program-unggulan');
    if (tab.id === 'smart-jm') return location.pathname.startsWith('/smart-jm') || location.pathname.startsWith('/stem');
    if (tab.id === 'prestasi') return location.pathname === '/prestasi';
    if (tab.id === 'ekskul') return location.pathname === '/ekskul';
    if (tab.id === 'galeri') return location.pathname.startsWith('/galeri');
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
            <span>✨ Pendaftaran PPDB Santri Baru Pondok Pesantren Jauharul Maknuun TP 2026/2027 telah dibuka!</span>
            <span>|</span>
            <span>🏆 Pondok Pesantren Jauharul Maknuun Resmi Meraih Akreditasi &quot;A&quot; BAN-PDM</span>
            <span>|</span>
            <span>📖 Program Unggulan: Tahfidz 30 Juz Bersanad, Madrasah Diniyah Salafiyah, &amp; Pendidikan Terpadu</span>
            <span>|</span>
            <span>🔬 Laboratorium Komputer Modern &amp; Kurikulum Riset STEM Santri Terpadu</span>
            <span>|</span>
            <span>📲 Narahubung Sekretariat &amp; Konsultasi Asrama: 0812-3456-7890</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Dribbble Modern Floating Pill Animation Bar) - Hidden on Mobile Viewport (< md) */}
      <header
        id="mainHeader"
        className="hidden md:block sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300"
      >
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-3.5 lg:gap-5 xl:gap-7 2xl:gap-9 py-2 sm:py-2.5 min-h-[4rem] sm:min-h-[4.5rem]">

            {/* Brand Logo & Title */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-none"
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              {/* Google Gemini Animated Border Glow Logo Wrapper */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shrink-0">
                {/* 1. Soft Ambient Halo Aura */}
                <div className="gemini-ambient-aura rounded-full" aria-hidden="true">
                  <div className="gemini-beam-sweep" />
                </div>

                {/* 2. Sharp 2px Animated Glowing Border Frame */}
                <div className="gemini-border-glow-frame rounded-full" aria-hidden="true">
                  <div className="gemini-beam-sweep" />
                </div>

                {/* 3. Solid White Inner Container with Logo Image */}
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-white shadow-xs flex items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="Logo Pondok Pesantren Jauharul Maknuun"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[9px] sm:text-[10px] tracking-widest text-[#0d4a28] uppercase leading-tight">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-xs sm:text-base lg:text-lg tracking-tight text-[#d4af37] leading-tight">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium hidden sm:block">
                  Lasem Sidayu Gresik - Jawa Timur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation: Equal Width & Uniform Horizontal Distribution (h-[58px]) */}
            <nav
              className="hidden lg:grid grid-cols-6 items-center h-[58px] p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-1 shrink-0 w-[540px] xl:w-[660px] 2xl:w-[720px]"
              onMouseLeave={() => setHoveredTab(null)}
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
                    {/* Direct Page Navigation Link (Icon on top with Android color badge, Name below) - Equal Width & Centered */}
                    <Link
                      to={tab.href}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="relative z-10 w-full h-full px-1 py-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer group"
                    >
                      {/* Android-style Rounded Colorful Icon Badge */}
                      <div className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5 ${isActive
                          ? tab.color.activeBadgeBg
                          : tab.color.badgeBg
                        }`}>
                        <TabIcon className="w-4 h-4 transition-transform duration-200" />
                      </div>

                      {/* Menu Label: Equal Width Distribution, Bold & Centered */}
                      <div className="w-full text-center px-0.5 mt-0.5">
                        <span className={`block text-[10px] xl:text-[11.5px] 2xl:text-[12px] font-black tracking-tight truncate leading-none transition-colors duration-200 ${isActive
                            ? tab.color.activeText
                            : 'text-slate-700 group-hover:text-slate-950'
                          }`}>
                          {tab.label}
                        </span>
                      </div>
                    </Link>

                    {/* Fluid Sliding Pill Indicator (Active or Hovered) */}
                    {isHovered && (
                      <motion.div
                        layoutId="nav-capsule-indicator"
                        className="absolute inset-0 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/90 z-0 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}

                    {isActive && !isHovered && !hoveredTab && (
                      <motion.div
                        layoutId="nav-capsule-indicator"
                        className="absolute inset-0 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200/80 z-0 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Responsive & Adaptive Search Field (Matching Height: h-[58px], Fills space between Menu and Profile) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center h-[58px] flex-1 min-w-[120px] xl:min-w-[140px] max-w-[420px] px-3 xl:px-3.5 rounded-2xl bg-slate-100/90 hover:bg-white text-left border border-slate-200/90 hover:border-emerald-500/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:shadow-emerald-900/5 transition-all duration-200 cursor-pointer group select-none relative"
              title="Cari Berita, Tahfidz, STEM, Galeri (Ctrl+K)"
              aria-label="Cari Informasi Portal"
            >
              {/* Android-style Search Icon Squircle */}
              <div className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-[#1a6b3c] text-[#1a6b3c] group-hover:text-white border border-emerald-200/60 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs group-hover:scale-105">
                <Search className="w-4 h-4 transition-transform duration-200" />
              </div>

              {/* Adaptive Placeholder & Label */}
              <div className="flex-1 min-w-0 mx-2.5">
                <div className="text-[9.5px] uppercase tracking-wider font-extrabold text-slate-400 group-hover:text-[#1a6b3c] transition-colors leading-none">
                  Pencarian
                </div>
                <div className="text-xs xl:text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 truncate mt-0.5 leading-tight">
                  Ketik topik, berita, hafalan...
                </div>
              </div>
            </button>

            {/* Right Side: Profile Button (Matching Height: h-[58px], with User Name) & Mobile Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              {/* Profile Button with Matching Height (h-[58px]) & User Name (Default: "Guest") */}
              <Link
                to="/admin"
                className="hidden sm:flex items-center h-[58px] px-3.5 xl:px-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/80 hover:from-emerald-100 hover:to-emerald-100/90 border border-emerald-300/80 hover:border-emerald-400/90 shadow-[0_2px_10px_rgba(26,107,60,0.08)] transition-all duration-200 group active:scale-95 shrink-0 select-none gap-2.5"
                title={`Profil Pengguna: ${currentUserName}`}
              >
                {/* User Avatar / Squircle with Status Pulse */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#0f5132] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-white"></span>
                  </span>
                </div>

                {/* Profile Label & User Name */}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700/90 leading-tight">
                    Profile
                  </span>
                  <span className="text-xs xl:text-sm font-black text-slate-900 leading-tight truncate max-w-[85px] xl:max-w-[130px]">
                    {currentUserName}
                  </span>
                </div>

                {/* Arrow indicator */}
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600/70 group-hover:text-emerald-800 transition-colors shrink-0" />
              </Link>

              {/* Mobile Search Button (Visible only on < lg) */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex lg:hidden items-center justify-center w-10 h-10 rounded-2xl text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-[#1a6b3c] border border-slate-200 transition-all cursor-pointer active:scale-95"
                aria-label="Cari Informasi Portal"
                title="Cari"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Profile Icon (Visible only on mobile xs < sm) */}
              <Link
                to="/admin"
                className="flex sm:hidden items-center justify-center w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 transition-all active:scale-95"
                title={`Profil: ${currentUserName}`}
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Hamburger Button */}
              <div className="flex lg:hidden items-center">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-[#1a6b3c] border border-slate-200 transition-all cursor-pointer active:scale-95"
                  aria-label="Buka Menu Navigasi"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* 3. SEARCH MODAL */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
