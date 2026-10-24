import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  BookOpenCheck,
  Images,
  Sparkles,
  Search,
  Atom,
  Trophy,
  Menu,
  ChevronDown,
  User,
  ArrowRight,
  Compass,
  GraduationCap,
  Layers,
  HeartHandshake,
  BookOpen,
  Cpu,
  Video,
  Camera
} from 'lucide-react';
import { SearchModal } from './SearchModal';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
  userName?: string;
}

interface NavSubItem {
  title: string;
  href: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabColorConfig {
  badgeBg: string;
  activeBadgeBg: string;
  activeText: string;
  activeDot: string;
}

interface NavTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isDropdown: boolean;
  color: TabColorConfig;
  items?: NavSubItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, userName }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Graceful dropdown dismiss timeout
  const clearDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const closeDropdownWithDelay = () => {
    clearDropdownTimeout();
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => clearDropdownTimeout();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mainHeader')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation Items with Android App-style Colorful Badges & Submenus
  const navTabs: NavTabItem[] = [
    {
      id: 'jm-center',
      label: 'JM Center',
      icon: Landmark,
      href: '/jm-center',
      isDropdown: false,
      color: {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100 group-hover:text-emerald-800',
        activeBadgeBg: 'bg-[#0f5132] text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/60',
        activeText: 'text-[#073b22]',
        activeDot: 'bg-[#0f5132]',
      },
      items: [
        { title: 'Sambutan Pengasuh', href: '/jm-center/sambutan', desc: 'Pesan & Arahan Pimpinan Pondok', icon: Compass },
        { title: 'Visi & Misi', href: '/jm-center/visi-misi', desc: 'Arah & Nilai Luhur Lembaga', icon: HeartHandshake },
        { title: 'Sejarah Pesantren', href: '/jm-center/sejarah', desc: 'Napak tilas dakwah di Lasem Sidayu', icon: Landmark },
        { title: 'Badan Otonom & Lembaga', href: '/jm-center/lembaga', desc: 'Struktur kepengurusan & asrama', icon: Layers },
      ]
    },
    {
      id: 'programs',
      label: 'Program Unggulan',
      icon: BookOpenCheck,
      href: '/program-unggulan',
      isDropdown: false,
      color: {
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80 group-hover:bg-blue-100 group-hover:text-blue-800',
        activeBadgeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/60',
        activeText: 'text-blue-800',
        activeDot: 'bg-blue-600',
      },
      items: [
        { title: 'Tahfidz 30 Juz Bersanad', href: '/smart-jm/hafidz/read', desc: "Mutaba'ah harian & sanad mutqin", icon: BookOpen },
        { title: 'Kurikulum Terpadu & Terakreditasi "A"', href: '/program-unggulan/program-sekolah', desc: 'Pendidikan formal unggulan', icon: GraduationCap },
        { title: 'Madrasah Diniyah Salafiyah', href: '/program-unggulan/program-madin', desc: 'Metode maknani gandul kitab turats', icon: BookOpenCheck },
        { title: 'Amaliyah Pondok', href: '/program-unggulan/amaliyah-pondok', desc: 'Wirid, ratib & sholat berjamaah', icon: HeartHandshake },
      ]
    },
    {
      id: 'ekskul',
      label: 'Ekstrakurikuler',
      icon: Sparkles,
      href: '/ekskul',
      isDropdown: false,
      color: {
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80 group-hover:bg-purple-100 group-hover:text-purple-800',
        activeBadgeBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/60',
        activeText: 'text-purple-800',
        activeDot: 'bg-purple-600',
      },
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      icon: Trophy,
      href: '/prestasi',
      isDropdown: false,
      color: {
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80 group-hover:bg-amber-100 group-hover:text-amber-800',
        activeBadgeBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300/60',
        activeText: 'text-amber-900',
        activeDot: 'bg-amber-500',
      },
    },
    {
      id: 'stem',
      label: 'STEM',
      icon: Atom,
      href: '/stem',
      isDropdown: false,
      color: {
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/80 group-hover:bg-teal-100 group-hover:text-teal-800',
        activeBadgeBg: 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400/60',
        activeText: 'text-teal-900',
        activeDot: 'bg-teal-600',
      },
      items: [
        { title: 'Silabus STEM Santri', href: '/smart-jm/stem/materi', desc: 'Modul robotika, IoT & sains digital', icon: Cpu },
        { title: 'Portofolio Riset Santri', href: '/smart-jm/stem/portofolio', desc: 'Karya teknologi dan otomasi praktis', icon: Sparkles },
        { title: 'Murojaah AI Santri', href: '/smart-jm/hafidz/murojaah', desc: 'Evaluasi lafadz suara AI', icon: BookOpen },
        { title: 'Mandarin Class', href: '/smart-jm/mandarin/materi', desc: 'Pinyin audio & percakapan interaktif', icon: GraduationCap },
      ]
    },
    {
      id: 'galeri',
      label: 'Galeri',
      icon: Images,
      href: '/galeri',
      isDropdown: false,
      color: {
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80 group-hover:bg-rose-100 group-hover:text-rose-800',
        activeBadgeBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/60',
        activeText: 'text-rose-900',
        activeDot: 'bg-rose-600',
      },
      items: [
        { title: 'Galeri Foto Kegiatan', href: '/galeri/foto', desc: 'Dokumentasi asrama & halaqah santri', icon: Camera },
        { title: 'Galeri Video Profil', href: '/galeri/video', desc: 'Dokumenter resmi & kegiatan hadrah', icon: Video },
      ]
    },
  ];

  const isTabActive = (tab: NavTabItem) => {
    if (tab.id === 'jm-center') return location.pathname.startsWith('/jm-center');
    if (tab.id === 'programs') return location.pathname.startsWith('/program-unggulan') || location.pathname.startsWith('/smart-jm/hafidz/read');
    if (tab.id === 'ekskul') return location.pathname === '/ekskul';
    if (tab.id === 'prestasi') return location.pathname === '/prestasi';
    if (tab.id === 'stem') return location.pathname.includes('/stem') || location.pathname.includes('/mandarin') || location.pathname.includes('/hafidz/murojaah');
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-2.5 min-h-[4rem] sm:min-h-[4.5rem]">

            {/* Brand Logo & Title */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
              aria-label="Beranda Pondok Pesantren Jauharul Maknuun"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-[#d4af37]/40 group-hover:ring-[#d4af37] group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Logo Pondok Pesantren Jauharul Maknuun"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-ppjm.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[9px] sm:text-[10px] tracking-widest text-[#0d4a28] uppercase leading-tight">
                  PONDOK PESANTREN
                </span>
                <span className="font-black text-xs sm:text-base lg:text-lg tracking-tight text-[#d4af37] leading-tight">
                  JAUHARUL MAKNUUN
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  Lasem Sidayu Gresik - Jawa Timur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation: Single Horizontal Line with Icon on Top & Label on Bottom (h-[58px]) */}
            <nav
              className="hidden lg:flex items-center h-[58px] p-1 rounded-2xl bg-slate-100/90 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.03)] relative gap-0.5 shrink-0"
              onMouseLeave={() => {
                setHoveredTab(null);
                closeDropdownWithDelay();
              }}
            >
              {navTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = isTabActive(tab);
                const isHovered = hoveredTab === tab.id;
                const isOpen = activeDropdown === tab.id;

                return (
                  <div
                    key={tab.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => {
                      setHoveredTab(tab.id);
                      if (tab.isDropdown) {
                        clearDropdownTimeout();
                        setActiveDropdown(tab.id);
                      } else {
                        setActiveDropdown(null);
                      }
                    }}
                  >
                    {/* Trigger Button / Link (Icon on top with Android color badge, Name below) */}
                    {tab.isDropdown ? (
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(isOpen ? null : tab.id)}
                        className="relative z-10 h-full px-2.5 sm:px-3 py-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer group min-w-[66px] sm:min-w-[72px]"
                      >
                        {/* Android-style Rounded Colorful Icon Badge */}
                        <div className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5 ${
                          isActive 
                            ? tab.color.activeBadgeBg 
                            : tab.color.badgeBg
                        }`}>
                          <TabIcon className="w-4 h-4 transition-transform duration-200" />
                        </div>

                        {/* Menu Label: Bigger, Bold & Vibrant */}
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <span className={`text-[11px] sm:text-xs xl:text-[12.5px] font-black tracking-tight whitespace-nowrap leading-none transition-colors duration-200 ${
                            isActive 
                              ? tab.color.activeText 
                              : 'text-slate-700 group-hover:text-slate-950'
                          }`}>
                            {tab.label}
                          </span>
                          <ChevronDown className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-700' : 'group-hover:text-slate-600'
                          }`} />
                        </div>

                        {/* Active Micro Indicator Dot */}
                        {isActive && (
                          <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${tab.color.activeDot} shadow-xs`} />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={tab.href}
                        className="relative z-10 h-full px-2.5 sm:px-3 py-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer group min-w-[66px] sm:min-w-[72px]"
                      >
                        {/* Android-style Rounded Colorful Icon Badge */}
                        <div className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5 ${
                          isActive 
                            ? tab.color.activeBadgeBg 
                            : tab.color.badgeBg
                        }`}>
                          <TabIcon className="w-4 h-4 transition-transform duration-200" />
                        </div>

                        {/* Menu Label: Bigger, Bold & Vibrant */}
                        <span className={`text-[11px] sm:text-xs xl:text-[12.5px] font-black tracking-tight whitespace-nowrap leading-none mt-0.5 transition-colors duration-200 ${
                          isActive 
                            ? tab.color.activeText 
                            : 'text-slate-700 group-hover:text-slate-950'
                        }`}>
                          {tab.label}
                        </span>

                        {/* Active Micro Indicator Dot */}
                        {isActive && (
                          <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${tab.color.activeDot} shadow-xs`} />
                        )}
                      </Link>
                    )}

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

                    {/* Interactive Dropdown Menu Card */}
                    <AnimatePresence>
                      {isOpen && tab.items && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute top-full mt-2.5 z-50 bg-white/95 backdrop-blur-2xl rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.14),0_0_0_1px_rgba(26,107,60,0.08)] border border-emerald-100/90 overflow-hidden ${tab.id === 'galeri' ? 'right-0 w-72' : 'left-0 w-80'
                            }`}
                          onMouseEnter={() => {
                            clearDropdownTimeout();
                            setActiveDropdown(tab.id);
                          }}
                          onMouseLeave={() => {
                            closeDropdownWithDelay();
                          }}
                        >
                          {/* Top Golden Accent Trim */}
                          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

                          <div className="space-y-1">
                            {tab.items.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.href}
                                  to={subItem.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-emerald-50/80 transition-all duration-180 group relative overflow-hidden"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-emerald-50/90 group-hover:bg-[#1a6b3c] text-[#1a6b3c] group-hover:text-white border border-emerald-200/60 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs group-hover:scale-105">
                                    <SubIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-6" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0d4a28] flex items-center justify-between">
                                      <span>{subItem.title}</span>
                                      <ArrowRight className="w-3 h-3 text-[#d4af37] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                    </div>
                                    <div className="text-[10px] text-slate-500 group-hover:text-slate-600 truncate">
                                      {subItem.desc}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Desktop Responsive & Adaptive Search Field (Matching Height: h-[58px], Fills space between Menu and Profile) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center h-[58px] flex-1 min-w-[140px] max-w-[420px] px-3.5 rounded-2xl bg-slate-100/90 hover:bg-white text-left border border-slate-200/90 hover:border-emerald-500/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:shadow-emerald-900/5 transition-all duration-200 cursor-pointer group select-none relative"
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

              {/* Keyboard Shortcut Badge */}
              <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] bg-white border border-slate-300/80 rounded-lg px-2 py-1 text-slate-500 font-mono shadow-xs font-bold group-hover:border-emerald-300 group-hover:text-emerald-700 shrink-0">
                ⌘K
              </kbd>
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
