import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Bell,
  ChevronDown,
  User,
  Menu,
  ArrowRight
} from 'lucide-react';
import { SearchModal } from './SearchModal';
import { PUBLIC_NAV_TABS, NavTabItem } from '../../data/navigationData';
import { useAuth } from '../../context/AuthContext';

// Helper formatters for Profile Pill
const DEFAULT_VISITOR_AVATAR = '/avatars/guest-avatar.svg';

const getFormattedDisplayName = (fullName?: string, role?: string): string => {
  if (!fullName || role === 'visitor') return 'Guest';
  const trimmed = fullName.trim();
  if (trimmed.startsWith('KH.')) {
    const parts = trimmed.split(' ');
    return parts.slice(0, 2).join(' '); // "KH. Jauharul"
  }
  if (trimmed.startsWith('Ustadz')) {
    const parts = trimmed.replace('Ustadz ', '').split(' ');
    return `Ust. ${parts[parts.length - 1] || parts[0]}`; // "Ust. Ridlwan", "Ust. Riski"
  }
  const parts = trimmed.split(' ');
  if (parts.length > 1 && parts[0].length <= 5) {
    return `${parts[0]} ${parts[1]}`; // "Ahmad Zaki"
  }
  return parts[0] || 'Akun';
};

const getRoleDisplayBadge = (role?: string, statusBadge?: string): string => {
  if (!role || role === 'visitor') return 'Guest';
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'pengurus_konten') return 'Pengurus Konten';
  if (role === 'guru_akademik') return 'Guru Akademik';
  if (role === 'user') return 'Santri';
  return statusBadge || 'Pengurus';
};


interface NavbarProps {

  onOpenMobileMenu?: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, userName }) => {

  const { profile, role, isAuthenticated } = useAuth();
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
    if (tab.id === 'osis') return location.pathname === '/osis';
    if (tab.id === 'jm-news') return location.hash === '#warta-berita';
    if (tab.id === 'galeri') return location.pathname.startsWith('/galeri');
    if (tab.id === 'agenda') return location.pathname.startsWith('/agenda');
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


            {/* Desktop Navigation: 9 Pillars Equal Width & Uniform Horizontal Distribution (h-[58px]) */}
            <div className="relative hidden lg:block" onMouseLeave={() => setHoveredTab(null)}>
              <nav
                className="grid grid-cols-9 items-center h-[56px] xl:h-[58px] p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-0.5 xl:gap-1 shrink-0 w-[690px] xl:w-[810px] 2xl:w-[890px]"
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
                        className="relative z-10 w-full h-full px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer group"
                      >
                        {/* Compact Android-style Colorful Icon Badge */}
                        <div
                          className={`w-5.5 h-5.5 xl:w-6 xl:h-6 rounded-lg flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shrink-0 ${
                            isActive
                              ? tab.color.activeBadgeBg
                              : tab.color.badgeBg
                          }`}
                        >
                          <TabIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-200 shrink-0" />
                        </div>

                        {/* Menu Label: Centered, Bold & Crisp Inside the Capsule Card */}
                        <div className="w-full text-center px-0.5 mt-1 leading-none">
                          <span
                            className={`block text-[10px] xl:text-[11px] 2xl:text-[12px] font-black tracking-tight truncate leading-none transition-colors duration-200 ${
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

              {/* Desktop Megamenu Popover Dropdown on Hover */}
              <AnimatePresence>
                {hoveredTab && (() => {
                  const activeHoverTab = navTabs.find((t) => t.id === hoveredTab);
                  if (!activeHoverTab || (!activeHoverTab.items && !activeHoverTab.sections)) return null;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.12),0_4px_16px_rgba(15,81,50,0.06)] border border-slate-200/90 p-3.5 z-50 text-left select-none min-w-[340px] max-w-[560px]"
                      onMouseEnter={() => setHoveredTab(hoveredTab)}
                      onMouseLeave={() => setHoveredTab(null)}
                    >
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center border text-xs ${activeHoverTab.color.badgeBg}`}>
                            {React.createElement(activeHoverTab.icon, { className: 'w-3.5 h-3.5' })}
                          </div>
                          <span className="text-xs font-black text-slate-800 tracking-tight">
                            Eksplorasi {activeHoverTab.label}
                          </span>
                        </div>
                        <Link
                          to={activeHoverTab.href}
                          onClick={() => setHoveredTab(null)}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                        >
                          <span>Buka Halaman</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      {/* Sections Layout (SMART JM) */}
                      {activeHoverTab.sections && (
                        <div className="grid grid-cols-3 gap-2.5">
                          {activeHoverTab.sections.map((sec) => {
                            const SecIcon = sec.icon;
                            return (
                              <div key={sec.title} className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/60">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <SecIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  <span className="text-[11px] font-black text-slate-800 truncate">{sec.title}</span>
                                </div>
                                <div className="space-y-1">
                                  {sec.items.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      to={sub.href}
                                      onClick={() => setHoveredTab(null)}
                                      className="block p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs"
                                    >
                                      <span className="block truncate">{sub.title}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Items Grid Layout */}
                      {activeHoverTab.items && (
                        <div className="grid grid-cols-2 gap-2">
                          {activeHoverTab.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setHoveredTab(null)}
                                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/70 hover:bg-emerald-50/80 border border-slate-200/50 hover:border-emerald-300 transition-all group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 shrink-0 mt-0.5">
                                  <ItemIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11.5px] font-black text-slate-800 group-hover:text-emerald-900 truncate">
                                    {item.title}
                                  </p>
                                  {item.desc && (
                                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                                      {item.desc}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>


            {/* Mobile Viewport: Hamburger Drawer Trigger + Rounded Pill Search Bar */}
            <div className="flex lg:hidden items-center gap-1.5 xs:gap-2 flex-1 min-w-0 max-w-[210px] xs:max-w-[270px] sm:max-w-[360px]">
              {/* Hamburger Button: Opens Full Mobile Drawer Menu */}
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="flex items-center justify-center w-8 h-8 xs:w-8.5 xs:h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 text-slate-700 hover:text-[#0d4a28] border border-slate-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                aria-label="Buka Menu Navigasi Lengkap"
                title="Buka Menu Lengkap"
              >
                <Menu className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 stroke-[2.3]" />
              </button>

              {/* Pill Search Bar */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center h-8 xs:h-8.5 sm:h-9.5 flex-1 min-w-0 px-2 xs:px-2.5 sm:px-3 rounded-full bg-slate-50/90 hover:bg-white text-left border border-slate-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] hover:border-emerald-500/70 transition-all duration-200 cursor-pointer group select-none gap-1.5 xs:gap-2 shrink"
                title="Search for anything... (Ctrl+K)"
                aria-label="Cari Informasi Portal"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 stroke-[2.2] shrink-0" />
                <span className="hidden xs:inline text-[11px] sm:text-xs text-slate-400 font-normal truncate tracking-tight">
                  Search...
                </span>
                <span className="inline xs:hidden text-[10px] text-slate-400 font-normal truncate tracking-tight">
                  Cari...
                </span>
              </button>
            </div>

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

              {/* 1. Notification Bell Button (Universal for All Viewports - Fixed Locked Dimensions) */}
              <div className="relative flex items-center shrink-0 flex-none">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] xs:w-8.5 xs:h-8.5 xs:min-w-[34px] xs:min-h-[34px] xs:max-w-[34px] xs:max-h-[34px] sm:w-9 sm:h-9 sm:min-w-[36px] sm:min-h-[36px] sm:max-w-[36px] sm:max-h-[36px] lg:w-10 lg:h-10 lg:min-w-[40px] lg:min-h-[40px] lg:max-w-[40px] lg:max-h-[40px] rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer relative shrink-0 flex-none aspect-square"
                  aria-label="Notifikasi & Informasi"
                  title="Warta & Informasi Terkini"
                >
                  <Bell className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 text-slate-700 stroke-[2.2] shrink-0" />
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

              {/* 2. Profile Pill Capsule (Universal for All Viewports - Fixed Locked Dimensions) */}
              <Link
                to="/profil"
                className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 pl-0.5 xs:pl-1 pr-1.5 xs:pr-2.5 sm:pr-3 py-0.5 xs:py-1 lg:py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer select-none shrink-0 flex-none h-8 xs:h-8.5 sm:h-9 lg:h-10 max-h-10 group"
                title={`Profil Pengguna: ${profile?.full_name || 'Tamu / Pengunjung'} (${getRoleDisplayBadge(role, profile?.status_badge)})`}
              >
                {/* User Portrait Avatar - Strictly Dimension Locked */}
                <div className="relative w-[26px] h-[26px] min-w-[26px] min-h-[26px] max-w-[26px] max-h-[26px] xs:w-[28px] xs:h-[28px] xs:min-w-[28px] xs:min-h-[28px] xs:max-w-[28px] xs:max-h-[28px] sm:w-[30px] sm:h-[30px] sm:min-w-[30px] sm:min-h-[30px] sm:max-w-[30px] sm:max-h-[30px] lg:w-[32px] lg:h-[32px] lg:min-w-[32px] lg:min-h-[32px] lg:max-w-[32px] lg:max-h-[32px] rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex-none aspect-square">
                  <img
                    src={profile?.avatar_url || DEFAULT_VISITOR_AVATAR}
                    alt={profile?.full_name || 'Avatar Profil'}
                    width="32"
                    height="32"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full min-w-full min-h-full max-w-full max-h-full object-cover rounded-full block shrink-0 flex-none select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VISITOR_AVATAR;
                    }}
                  />
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ring-1 ${
                      isAuthenticated
                        ? 'bg-emerald-500 ring-emerald-300'
                        : 'bg-slate-400 ring-slate-200'
                    }`}
                  />
                </div>

                {/* Name & Role Text Stack */}
                <div className="flex flex-col text-left leading-tight shrink-0">
                  <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-[13px] font-bold text-slate-800 tracking-tight leading-tight truncate max-w-[42px] xs:max-w-[65px] sm:max-w-[90px] lg:max-w-[125px]">
                    {getFormattedDisplayName(profile?.full_name, role)}
                  </span>
                  <span
                    className={`text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-medium leading-none capitalize ${
                      isAuthenticated ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {getRoleDisplayBadge(role, profile?.status_badge)}
                  </span>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-slate-400 shrink-0 ml-0.2 xs:ml-0.5 group-hover:text-slate-600 transition-colors" />
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
