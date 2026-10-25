import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Bell,
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mainHeader')) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

      {/* 2. MAIN HEADER (Dribbble Modern Floating Pill Animation Bar) */}
      <header
        id="mainHeader"
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300"
      >
        <div className="w-full max-w-[1536px] mx-auto px-2 xs:px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 lg:gap-5 xl:gap-7 2xl:gap-9 py-1.5 xs:py-2 sm:py-2.5 min-h-[3.5rem] xs:min-h-[3.75rem] sm:min-h-[4.25rem] lg:min-h-[4.5rem]">

            {/* Brand Logo & Title */}
            <Link
              to="/"
              className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 group shrink-0 select-none"
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              {/* Google Gemini Animated Border Glow Logo Wrapper - Fixed Dimensions Locked */}
              <div className="relative w-[34px] h-[34px] min-w-[34px] min-h-[34px] max-w-[34px] max-h-[34px] xs:w-[36px] xs:h-[36px] xs:min-w-[36px] xs:min-h-[36px] xs:max-w-[36px] xs:max-h-[36px] sm:w-[40px] sm:h-[40px] sm:min-w-[40px] sm:min-h-[40px] sm:max-w-[40px] sm:max-h-[40px] lg:w-[44px] lg:h-[44px] lg:min-w-[44px] lg:min-h-[44px] lg:max-w-[44px] lg:max-h-[44px] rounded-full p-[1.5px] xs:p-[2px] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shrink-0 flex-none aspect-square">
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
                    width="44"
                    height="44"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full min-w-full min-h-full max-w-full max-h-full object-cover rounded-full block shrink-0 flex-none select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] tracking-wider text-[#0d4a28] uppercase leading-tight">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-[12px] xs:text-[13px] sm:text-base lg:text-lg tracking-tight text-[#d4af37] leading-tight whitespace-nowrap">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9.5px] sm:text-[10.5px] text-slate-500 font-medium hidden sm:block">
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

                      {/* Menu Label: Equal Width Distribution, Bold & Centered (Larger font size) */}
                      <div className="w-full text-center px-0.5 mt-0.5">
                        <span className={`block text-[11.5px] xl:text-[13px] 2xl:text-[13.5px] font-black tracking-tight truncate leading-none transition-colors duration-200 ${isActive
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

            {/* Mobile Viewport: Rounded Pill Search Bar (1:1 with reference image: 🔍 Search for anything...) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex lg:hidden items-center h-8.5 xs:h-9 sm:h-9.5 flex-1 min-w-0 max-w-[170px] xs:max-w-[220px] sm:max-w-[320px] px-2 xs:px-2.5 sm:px-3 rounded-full bg-slate-50/90 hover:bg-white text-left border border-slate-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] hover:border-emerald-500/70 transition-all duration-200 cursor-pointer group select-none gap-1.5 xs:gap-2 shrink"
              title="Search for anything... (Ctrl+K)"
              aria-label="Cari Informasi Portal"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 stroke-[2.2] shrink-0" />
              <span className="hidden xs:inline text-[11px] sm:text-xs text-slate-400 font-normal truncate tracking-tight">
                Search for anything...
              </span>
              <span className="inline xs:hidden text-[10px] text-slate-400 font-normal truncate tracking-tight">
                Search...
              </span>
            </button>

            {/* Desktop Responsive Search Field */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center h-10 xl:h-11 flex-1 min-w-[140px] xl:min-w-[160px] max-w-[360px] px-3.5 rounded-full bg-slate-50 hover:bg-white text-left border border-slate-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] hover:border-emerald-500/80 transition-all duration-200 cursor-pointer group select-none relative gap-2 shrink mx-2"
              title="Search for anything... (Ctrl+K)"
              aria-label="Cari Informasi Portal"
            >
              <Search className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 transition-colors shrink-0" />
              <span className="text-xs xl:text-[13px] text-slate-400 font-normal truncate flex-1">
                Search for anything...
              </span>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded-md border border-slate-200/80 shrink-0">
                Ctrl K
              </kbd>
            </button>

            {/* Right Side: Fixed Min-Width Container to prevent CLS when Auth is empty/loading */}
            <div className="flex items-center justify-between gap-1 xs:gap-1.5 sm:gap-2 lg:gap-3 shrink-0 min-w-[105px] xs:min-w-[120px] sm:min-w-[145px] lg:min-w-[170px]">

              {/* 1. Notification Bell Button (Universal for All Viewports) */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="w-8 h-8 xs:w-8.5 xs:h-8.5 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer relative"
                  aria-label="Notifikasi & Informasi"
                  title="Warta & Informasi Terkini"
                >
                  <Bell className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 text-slate-700 stroke-[2.2]" />
                  <span className="absolute top-1 xs:top-1.5 right-1 xs:right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                </button>

                {/* Notifications Dropdown Popover */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-64 sm:w-72 lg:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 text-left select-none"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Warta Terkini</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">Aktif</span>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <div className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors">
                          <p className="font-bold text-slate-800 text-[11px] leading-tight">PPDB TP 2026/2027 Dibuka</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Pendaftaran santri baru jalur reguler & tahfidz resmi dibuka.</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors">
                          <p className="font-bold text-slate-800 text-[11px] leading-tight">Akreditasi "A" BAN-PDM</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Raihan predikat Unggul untuk kurikulum terpadu.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Profile Pill Capsule (Universal for All Viewports: (Avatar) Michael Admin ⌄) */}
              <Link
                to="/admin"
                className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 pl-0.5 xs:pl-1 pr-1.5 xs:pr-2.5 sm:pr-3 py-0.5 xs:py-1 lg:py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer select-none shrink-0"
                title={`Profil Pengguna: ${currentUserName}`}
              >
                {/* User Portrait Avatar */}
                <div className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-7.5 sm:h-7.5 lg:w-8 lg:h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Michael Admin"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Role Text Stack */}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-[13px] font-bold text-slate-800 tracking-tight leading-tight truncate max-w-[38px] xs:max-w-[60px] sm:max-w-[85px] lg:max-w-[120px]">
                    Michael
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-medium text-slate-400 leading-none">
                    Admin
                  </span>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-slate-400 shrink-0 ml-0.2 xs:ml-0.5" />
              </Link>

            </div>

          </div>
        </div>
      </header>

      {/* 3. SEARCH MODAL */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
